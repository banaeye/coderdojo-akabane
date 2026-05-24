---
name: akabane-report-writer
description: Create and update CoderDojo Akabane event reports for this repository using connpass event data, user-provided activity notes, photo safety checks, and data/reports.json updates.
---

# CoderDojo Akabane Report Writer

Use this skill when creating, drafting, or updating a CoderDojo Akabane event report in this repository.

## Goal

Produce a warm, concise public report for a past CoderDojo Akabane event, then update the site data so the report appears from the activity history.

## Repository Context

- Activity history lives in `data/reports.json`.
- The top page renders the latest 3 reports from `data/reports.json`.
- Static pages should follow the existing style in `index.html`, `works.html`, and `styles.css`.
- Report pages should live at `reports/YYYY-MM-DD-coderdojo-akabane-NN/index.html`.
- Put report images under the same report directory in `images/`.

## Source Priority

1. User-provided memories, notes, photos, and corrections.
2. The matching connpass event page, usually from `data/reports.json` `connpassUrl`.
3. Existing repository conventions.

From connpass, collect only factual event metadata:

- event title and event number
- date and time
- venue
- public participant counts by slot
- public connpass display names, only when needed

If connpass blocks direct access, use search results or cached snippets cautiously and say when a fact could not be verified.

## Privacy And Names

- Do not publish real names of children or families unless the user explicitly provides and approves them for publication.
- Public connpass display names may be used when the user asks for them, but default to group wording such as "参加者", "Ninja", "メンター", "初参加の方".
- Avoid linking a specific child to a specific work unless the user clearly approves it.
- Do not describe private details, attendance issues, contact details, or anything visible in photos that should not be public.

## Photo Handling

Ask whether usable photos exist, but do not block report drafting on photos.

Before using photos:

- Confirm publication permission.
- Check for visible faces, name tags, school names, login names, addresses, and private screen contents.
- Prefer photos of hands, screens with safe content, room atmosphere, work in progress, or finished works.
- Use short captions that describe the activity without identifying children.
- If safety is unclear, recommend cropping, blurring, or omitting the photo.

Report pages can auto-detect images by naming convention. Place files under the report page's `images/` directory:

- `intro-1.webp`, `intro-2.webp`, ... for the opening block
- `activity-1.webp`, `activity-2.webp`, ... for the activity block
- `presentation-1.webp`, `presentation-2.webp`, ... for the presentation block
- `next-1.webp`, `next-2.webp`, ... for the closing block

Supported input extensions are `.jpg`, `.jpeg`, `.png`, `.webp`, `.heic`, and `.heif`. Public output images are generated as lightweight `.webp`. The current template checks up to 6 images per block. Normal use is 1 to 3 images per block.

When raw photos are available, place originals under `work/reports/YYYY-MM-DD/<section>/`, then run:

```bash
npx akabane-report-images YYYY-MM-DD
```

The command writes public WebP images to the matching report page's `images/` directory. `work/` is gitignored and should keep the originals.

When creating or updating report HTML, include gallery placeholders for all image groups that may be generated:

- `data-report-gallery="intro"` near the opening block
- `data-report-gallery="activity"` in the Event/activity section
- `data-report-gallery="presentation"` in the presentation section
- `data-report-gallery="next"` in the closing/next section

Do not omit the `activity` gallery placeholder when the page has an Event section; otherwise `activity-*.webp` images will be generated but not displayed.

Gallery layout should use the available content width on desktop. Avoid fixed gallery caps such as `max-width: 760px` unless the current site design explicitly requires them. On mobile, horizontal scrolling is acceptable; on wider screens, prefer a wrapping grid so photos are visible without scrolling when there is enough space. If a gallery sits inside a text-width wrapper such as the report Presentation section, make the wrapper or the gallery itself expand to the section width so images are not clipped by the text column.

## Conversation Workflow

When details are missing, ask for only the next useful facts. Good questions:

- "当日の参加者の雰囲気や人数感はどうでしたか?"
- "発表や作品で印象に残っているものはありますか?"
- "初参加の方や見学の方の様子で書いてよいことはありますか?"
- "写真は使える候補がありますか?"

Do not ask for information that can be read from connpass or the repository.

## Report Shape

Write in Japanese unless the user asks otherwise. Keep the tone:

- friendly
- concrete
- community-centered
- not over-polished
- respectful of children and beginners

Default structure:

1. Opening: event number, date, venue.
2. Attendance and atmosphere: regulars, first-time participants, mentors, visitors.
3. Activity: what people worked on and how support happened.
4. Presentation: works shown and how the room reacted.
5. Closing: next event or a gentle forward-looking note.

Avoid exaggerating beyond the user's notes. It is fine to say "それぞれのペースで" or "試行錯誤しながら" when supported by the context.

## Implementation Workflow

1. Read `data/reports.json` and locate the target event.
2. Read the relevant site files to match layout and style.
3. Fetch or search the connpass event page for factual metadata when needed.
4. Draft the report from user notes and verified metadata.
5. If creating a page, add a static HTML page that follows existing styles.
   - Create the report page directory and allow `npx akabane-report-images YYYY-MM-DD` to create `work/reports/YYYY-MM-DD/<section>/` directories.
6. Update the target `data/reports.json` item:
   - set `reportUrl` to the report page path
   - replace placeholder summaries such as "レポートは未作成です。"
   - keep the JSON valid and preserve chronological ordering
7. Run a lightweight validation:
   - parse `data/reports.json`
   - check links/paths referenced by the updated entry
   - if practical, open the page locally or inspect rendered markup

## Summary Style

For `data/reports.json`, use 1 to 2 Japanese sentences. Mention:

- who joined, at a high level
- what they made or tried
- what made the presentation or event memorable

Example:

```json
"summary": "常連メンバーに加えて初参加・見学の方も参加し、Scratchでの制作に挑戦しました。発表ではハエたたき、バトルゲーム、トロッコ問題を題材にした作品で盛り上がりました。"
```
