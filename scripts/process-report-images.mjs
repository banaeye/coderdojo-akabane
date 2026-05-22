#!/usr/bin/env node

import { promises as fs } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const require = createRequire(import.meta.url);
const heicConvert = require("heic-convert");

const sections = ["intro", "activity", "presentation", "next"];
const heicExtensions = new Set([".heic", ".heif"]);
const inputExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ...heicExtensions]);
const outputWidth = 800;
const webpQuality = 78;

const rootDir = process.cwd();
const targetDate = process.argv[2];

function usage() {
  console.error("Usage: npx akabane-report-images YYYY-MM-DD");
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function resolveReportDirectory(reportUrl) {
  const normalizedUrl = reportUrl.replace(/^\/+/, "");

  if (normalizedUrl.endsWith("/")) {
    return normalizedUrl.slice(0, -1);
  }

  if (normalizedUrl.endsWith("/index.html")) {
    return normalizedUrl.slice(0, -"/index.html".length);
  }

  if (normalizedUrl.endsWith(".html")) {
    return path.dirname(normalizedUrl);
  }

  return normalizedUrl;
}

async function readTargetReport() {
  const reportsPath = path.join(rootDir, "data", "reports.json");
  const rawReports = await fs.readFile(reportsPath, "utf8");
  const reports = JSON.parse(rawReports);
  const report = reports.find((item) => item.date === targetDate);

  if (!report) {
    throw new Error(`data/reports.json に date "${targetDate}" のレポートが見つかりません。`);
  }

  if (!report.reportUrl) {
    throw new Error(`date "${targetDate}" の reportUrl が未設定です。`);
  }

  return report;
}

async function listSourceImages(rawDir) {
  await fs.mkdir(rawDir, { recursive: true });

  const entries = await fs.readdir(rawDir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => inputExtensions.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, "ja"))
    .map((name) => path.join(rawDir, name));
}

async function removeGeneratedImages(outputDir, section) {
  await fs.mkdir(outputDir, { recursive: true });

  const entries = await fs.readdir(outputDir, { withFileTypes: true });
  const pattern = new RegExp(`^${section}-\\d+\\.(jpg|webp)$`);

  await Promise.all(
    entries
      .filter((entry) => entry.isFile() && pattern.test(entry.name))
      .map((entry) => fs.rm(path.join(outputDir, entry.name))),
  );
}

async function processImage(sourcePath, outputPath) {
  const extension = path.extname(sourcePath).toLowerCase();
  const input = heicExtensions.has(extension) ? await convertHeicToJpeg(sourcePath) : sourcePath;

  await sharp(input)
    .rotate()
    .resize({
      width: outputWidth,
      withoutEnlargement: true,
    })
    .webp({
      quality: webpQuality,
    })
    .toFile(outputPath);
}

async function convertHeicToJpeg(sourcePath) {
  const inputBuffer = await fs.readFile(sourcePath);

  return heicConvert({
    buffer: inputBuffer,
    format: "JPEG",
    quality: 0.92,
  });
}

async function main() {
  if (!targetDate) {
    usage();
    process.exitCode = 1;
    return;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(targetDate)) {
    usage();
    throw new Error(`日付は YYYY-MM-DD 形式で指定してください: ${targetDate}`);
  }

  const report = await readTargetReport();
  const reportDir = resolveReportDirectory(report.reportUrl);
  const reportPath = path.join(rootDir, reportDir);

  if (!(await pathExists(path.join(reportPath, "index.html")))) {
    throw new Error(`レポートページが見つかりません: ${path.join(reportDir, "index.html")}`);
  }

  const workReportPath = path.join(rootDir, "work", "reports", targetDate);
  const outputDir = path.join(reportPath, "images");
  const skipped = [];
  let processedCount = 0;

  for (const section of sections) {
    const sourceDir = path.join(workReportPath, section);
    const sourceImages = await listSourceImages(sourceDir);

    await removeGeneratedImages(outputDir, section);

    for (const [index, sourcePath] of sourceImages.entries()) {
      const outputPath = path.join(outputDir, `${section}-${index + 1}.webp`);

      try {
        await processImage(sourcePath, outputPath);
        processedCount += 1;
      } catch (error) {
        skipped.push({
          file: path.relative(rootDir, sourcePath),
          reason: error.message,
        });
      }
    }
  }

  console.log(`Report: ${report.title}`);
  console.log(`Input: ${path.relative(rootDir, workReportPath)}`);
  console.log(`Output: ${path.relative(rootDir, outputDir)}`);
  console.log(`Processed: ${processedCount}`);

  if (skipped.length > 0) {
    console.warn(`Skipped: ${skipped.length}`);
    for (const item of skipped) {
      console.warn(`- ${item.file}: ${item.reason}`);
    }
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
