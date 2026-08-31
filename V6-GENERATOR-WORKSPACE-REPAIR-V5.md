# UtilityDesk V6 — Generator Workspace Repair V5

## Problem addressed
The HR and Document Generator tools could still appear visually compressed on wide displays because the generator workspace retained a 1200px maximum width and nested controls/output areas were allowed to inherit restrictive sizing.

## V5 repair
A shared `shared/generator-v6.css` layer was added and loaded after `sitewide-v4.css` on all 53 generator pages.

### Desktop
- Workspace uses up to 1560px of available width.
- Input and output columns use equal flexible widths.
- 32px inter-column gap.
- `minmax(0, 1fr)` prevents grid children from collapsing or overflowing.
- Inputs, textareas, selects, AI output and document preview use the full column width.
- AI output has a 360px minimum working area.
- Document preview has a 640px minimum working area.

### Responsive
- At <=900px the workspace becomes a single column.
- Preview loses sticky/internal-height constraints at mobile/tablet widths.
- Nested form rows collapse at <=600px.

## Scope
Only `.generator-*`, `.panel`, `.ai-output`, `.doc-preview` elements inside generator workspaces are targeted. Calculator and PDF tool layouts are not modified by this layer.
