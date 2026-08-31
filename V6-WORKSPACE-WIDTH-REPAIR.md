# UtilityDesk V6 — Workspace Width Repair

## Issue
The sitewide V4 CSS contained a generic `.generator-grid` rule intended for three-column tool/card listings. Because the same class is used by HR/document-generator workspaces, that rule overrode the page-level two-column form/preview layout.

Result: input forms and output/preview panels appeared narrow, compressed, and visually shrinked on desktop.

## Repair
Added a final V6 workspace normalization layer to `shared/sitewide-v4.css`:

- Generator workspaces are explicitly two-column on desktop.
- Each column uses `minmax(0, 1fr)` so content can expand correctly.
- Workspace width is increased to a responsive maximum of 1440px.
- Panels and AI output are forced to use the available column width.
- At <=1024px the workspace collapses to one column.
- Mobile spacing remains responsive.
- The three-column listing/grid behavior is not changed outside `.generator-section` workspaces.

This repair applies centrally to the HR and document-generator workspace pages without changing their JavaScript/functionality.
