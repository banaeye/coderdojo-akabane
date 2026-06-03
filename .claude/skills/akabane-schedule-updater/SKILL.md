---
name: akabane-schedule-updater
description: Check connpass for new CoderDojo Akabane events and update data/reports.json and data/updates.json accordingly.
---

# CoderDojo Akabane Schedule Updater

Use this skill when the user says connpass に新しいイベントが公開された、日程が更新された、または次回の開催情報を反映したい、など。

## Goal

connpass のイベント一覧を確認し、`data/reports.json` に未登録のイベントを追加し、`data/updates.json` に更新エントリを追加する。

## Repository Context

- `data/reports.json` — 開催履歴。最新順（降順）で並んでいる。トップページが上位3件を表示する。
- `data/updates.json` — サイト更新履歴。最新順（降順）で並んでいる。トップページが上位5件を表示する。
- connpass グループページ: `https://coderdojo-akabane.connpass.com/event/`

## Implementation Workflow

1. `data/reports.json` を読み込み、登録済みイベントの connpassUrl とタイトルを把握する。

2. connpass のイベント一覧ページを WebFetch で取得する。

   ```
   URL: https://coderdojo-akabane.connpass.com/event/
   Prompt: 最新のイベント一覧を全件取得してください。各イベントのタイトル、日時（YYYY/MM/DD HH:MM）、URL を教えてください。
   ```

3. 一覧と `data/reports.json` を突き合わせ、未登録のイベントを特定する。

4. 未登録イベントごとに `data/reports.json` の先頭に追加する:

   ```json
   {
     "date": "YYYY-MM-DD",
     "dateLabel": "YYYY年M月D日 HH:MM",
     "title": "CoderDojo 赤羽 #NN",
     "summary": "参加者募集中です。connpass からお申し込みください。",
     "reportUrl": null,
     "connpassUrl": "https://coderdojo-akabane.connpass.com/event/XXXXXX/"
   }
   ```

   - 中止イベントは title を `"中止: CoderDojo 赤羽 #NN"` とし、summary を `"中止になった回です。詳細は connpass のイベントページで確認できます。"` とする。
   - 日付の降順を維持すること。

5. `data/updates.json` の先頭に更新エントリを追加する:

   ```json
   {
     "date": "YYYY-MM-DD",
     "dateLabel": "YYYY年M月D日",
     "title": "第NN回の開催日程を追加しました",
     "summary": "YYYY年M月D日開催の CoderDojo 赤羽 #NN の募集が始まりました。connpass からお申し込みください。",
     "url": "https://coderdojo-akabane.connpass.com/event/XXXXXX/",
     "linkLabel": "connpass を見る",
     "external": true
   }
   ```

   - `date` は今日の日付（作業日）を使う。
   - 未登録イベントが複数ある場合は、最新のイベント1件分のエントリのみ追加する（古いものは履歴としてレポート追加時に記録する）。

6. `main.js` の `reportCard` 関数が `report.summary` を `${report.summary ? \`<p>${report.summary}</p>\` : ""}` のように null ガードしているか確認する。なければ修正する。

7. JSON が valid であることを確認する:

   ```bash
   python3 -c "import json; json.load(open('data/reports.json'))" && echo OK
   python3 -c "import json; json.load(open('data/updates.json'))" && echo OK
   ```

## Notes

- 既に登録済みのイベントは変更しない。
- レポート作成（HTML ページの生成）は このスキルのスコープ外。レポートを書く場合は `akabane-report-writer` スキルを使う。
- connpass がアクセスを拒否した場合は、ユーザーにイベントの URL や情報を確認する。
