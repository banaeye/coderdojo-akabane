# CoderDojo 赤羽 website

CoderDojo 赤羽の静的サイトです。Cloudflare Pages でそのまま公開できます。

## 公開

Cloudflare Pages の設定例:

- Framework preset: `None`
- Build command: 空欄
- Build output directory: `/`
- Root directory: リポジトリ直下

## 更新

トップページの本文は `index.html`、作品ページは `works.html`、見た目は `styles.css`、活動履歴は `data/reports.json` を編集します。

活動履歴は最新 3 件を表示します。次回開催がある場合は先頭に置いてください。レポートが未作成の場合は `reportUrl` を `null` にします。

```json
{
  "date": "2026-05-24",
  "dateLabel": "2026年5月24日",
  "title": "CoderDojo 赤羽 #71",
  "summary": "開催内容の短い説明を入れます。",
  "reportUrl": null,
  "connpassUrl": "https://coderdojo-akabane.connpass.com/"
}
```

## 情報源

- CoderDojo 赤羽 connpass: https://coderdojo-akabane.connpass.com/
- CoderDojo 赤羽 公開統計: https://coderdojo.jp/dojos/130
- CoderDojo Japan: https://coderdojo.jp/

## 画像

`assets/akabane-symbol.png` と `assets/akabane-cover.png` は CoderDojo 赤羽の connpass 公開ページで使われている画像を保存したものです。

`assets/works-scratch.png` と `assets/works-dnovel.png` は作品紹介用のスクリーンショットです。
