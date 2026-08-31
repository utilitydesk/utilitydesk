# UtilityDesk.in — Sitewide UI Fix v5

This package preserves the v4 visual baseline shown in the local-browser validation screenshots and performs a production cleanup pass.

## v5 changes
- Preserved the v4 visual design and tool functionality.
- Consolidated `sitewide-fixes.css`, `sitewide-consistency.css`, and `sitewide-v4.css` into one canonical `shared/sitewide-v4.css`.
- Removed the two redundant sitewide CSS files.
- Removed the generated `_sitewide_backup/` tree from the deployment package.
- Repaired the confirmed mojibake in the shared sitewide CSS/JS comments.
- Normalized edited HTML/CSS/JS files to UTF-8.
- Kept the separate sitewide cleanup JS because it performs DOM cleanup rather than styling.
- No calculator, HR, PDF, document-generator or content logic was intentionally changed.

## Deployment
Use this package as the production-clean v5 build.
Do not run the older v3/v4 sitewide PowerShell patch over this package.
After deployment, hard-refresh the browser (Ctrl+F5) and smoke-test representative homepage, calculator, HR, PDF and document-generator pages.
