# CoderDojo 赤羽 website

CoderDojo 赤羽の静的サイトです。Cloudflare Pages でそのまま公開できます。

## 公開

Cloudflare Pages の設定例:

- Framework preset: `None`
- Build command: 空欄
- Build output directory: `/`
- Root directory: リポジトリ直下

公開URLは `https://coderdojo-akabane.pages.dev/` を想定しています。独自ドメインに切り替える場合は、各HTMLの `canonical`、OGP URL、構造化データ、`robots.txt`、`sitemap.xml` のURLを新しいドメインに揃えてください。

## 更新

トップページの本文は `index.html`、作品ページは `works.html`、見た目は `styles.css`、活動履歴は `data/reports.json`、更新履歴は `data/updates.json` を編集します。

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

更新履歴を追加するときは、`data/updates.json` の先頭に次の形式で追加します。

```json
{
  "date": "2026-05-22",
  "dateLabel": "2026年5月22日",
  "title": "作品ページを更新しました",
  "summary": "更新内容の短い説明を入れます。",
  "url": "works.html",
  "linkLabel": "作品を見る",
  "external": false
}
```

新しい固定ページやレポートを追加したときは、検索エンジン向けに `sitemap.xml` にもURLと更新日を追加してください。

## 情報源

- CoderDojo 赤羽 connpass: https://coderdojo-akabane.connpass.com/
- CoderDojo 赤羽 公開統計: https://coderdojo.jp/dojos/130
- CoderDojo Japan: https://coderdojo.jp/

## 画像

`assets/akabane-symbol.png` と `assets/akabane-cover.png` は CoderDojo 赤羽の connpass 公開ページで使われている画像を保存したものです。

`assets/works-scratch.png` と `assets/works-dnovel.png` は作品紹介用のスクリーンショットです。

## レポート画像

レポート用の原本画像は `work/` 配下に置きます。`work/` は git 管理外です。

```text
work/reports/2026-04-26/activity/
```

公開用画像は次のコマンドでリサイズ・リネームします。

```bash
npx akabane-report-images 2026-04-26
```

`intro`, `activity`, `presentation`, `next` の各フォルダに入れた画像が、対応するレポートの `images/` 配下へ `activity-1.webp` のような名前で生成されます。
入力画像は `.jpg`, `.jpeg`, `.png`, `.webp`, `.heic`, `.heif` に対応しています。
