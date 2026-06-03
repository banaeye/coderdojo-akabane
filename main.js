const reportList = document.querySelector("#report-list");
const updateList = document.querySelector("#update-list");

function reportCard(report) {
  const reportLink = report.reportUrl
    ? `<a class="history-link" href="${report.reportUrl}" rel="noopener">レポート</a>`
    : `<span class="history-link disabled" aria-disabled="true">レポート</span>`;
  const connpassLink = report.connpassUrl
    ? `<a class="history-link" href="${report.connpassUrl}" rel="noopener">connpass</a>`
    : "";

  return `
    <article class="report-card">
      <time datetime="${report.date}">${report.dateLabel}</time>
      <h3>${report.title}</h3>
      ${report.summary ? `<p>${report.summary}</p>` : ""}
      <div class="history-actions">${reportLink}${connpassLink}</div>
    </article>
  `;
}

async function renderReports() {
  if (!reportList) return;

  try {
    const response = await fetch("data/reports.json", { cache: "no-store" });
    if (!response.ok) throw new Error("reports not found");
    const reports = await response.json();
    reportList.innerHTML = reports.slice(0, 3).map(reportCard).join("");
  } catch {
    reportList.innerHTML = `
      <article class="report-card">
        <h3>活動履歴を準備中です</h3>
        <p>開催回の情報は GitHub の data/reports.json に追加して公開します。</p>
        <div class="history-actions">
          <span class="history-link disabled" aria-disabled="true">レポート</span>
        </div>
      </article>
    `;
  }
}

renderReports();

function updateItem(update) {
  const link = update.url
    ? `<a class="update-link" href="${update.url}"${update.external ? ' rel="noopener"' : ""}>${update.linkLabel || "詳しく見る"}</a>`
    : "";

  return `
    <article class="update-item">
      <time datetime="${update.date}">${update.dateLabel}</time>
      <div>
        <h3>${update.title}</h3>
        <p>${update.summary}</p>
        ${link}
      </div>
    </article>
  `;
}

async function renderUpdates() {
  if (!updateList) return;

  try {
    const response = await fetch("data/updates.json", { cache: "no-store" });
    if (!response.ok) throw new Error("updates not found");
    const updates = await response.json();
    updateList.innerHTML = updates.slice(0, 5).map(updateItem).join("");
  } catch {
    updateList.innerHTML = `
      <article class="update-item">
        <time datetime="2026-05-22">2026年5月22日</time>
        <div>
          <h3>更新履歴を準備中です</h3>
          <p>サイトの更新内容を GitHub の data/updates.json に追加して公開します。</p>
        </div>
      </article>
    `;
  }
}

renderUpdates();
