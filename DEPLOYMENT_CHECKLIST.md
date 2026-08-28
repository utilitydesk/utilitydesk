# UtilityDesk.in â€” v5 Deployment / QA Checklist

## Package cleanup
- [x] Removed generated `_sitewide_backup/` directory.
- [x] Consolidated sitewide CSS into `shared/sitewide-v4.css`.
- [x] Removed redundant `shared/sitewide-fixes.css`.
- [x] Removed redundant `shared/sitewide-consistency.css`.
- [x] Preserved `shared/sitewide-cleanup.js`.
- [x] Repaired confirmed shared-file mojibake.
- [x] Preserved existing tool logic and content.

## Required browser smoke tests
- [ ] Homepage
- [ ] Calculators hub
- [ ] Representative calculator detail page
- [ ] HR Suite hub
- [ ] Representative HR tool
- [ ] PDF Tools hub
- [ ] Representative PDF tool
- [ ] Document Generators hub
- [ ] Representative document generator
- [ ] Mobile/responsive header
- [ ] Browse Tools dropdown
- [ ] Floating search/favorite controls

## Deployment
1. Deploy the contents of `utilitydesk_sitewide_fixed_v5/`.
2. Do not run older v3/v4 PowerShell sitewide patches afterward.
3. Hard-refresh with Ctrl+F5.
4. Verify the browser console for new errors.
5. Verify representative tool calculations/actions still execute.

## Package note
This checklist intentionally does not claim an obsolete historical test count. QA should be based on the actual v5 package and the browser smoke tests above.
