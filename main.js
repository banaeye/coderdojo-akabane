const reportList = document.querySelector("#report-list");

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
      <p>${report.summary}</p>
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
