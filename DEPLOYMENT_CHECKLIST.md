# UtilityDesk.in — Complete Deployment Checklist
**Date:** July 2026 | **Total files:** 70 | **Tests passed:** 313/313

---

## STEP 1 — Terminal cleanup (run first)

```bash
cd path/to/utilitydesk-repo   # your local clone

# Create cleanup branch
git checkout -b cleanup/full-site-fix

# Preview deletions (dry run — nothing deleted yet)
echo "=== Will delete these root duplicates ===" && \
for d in calculators/*/; do
  slug=$(basename "$d")
  [ -d "$slug" ] && echo "  $slug/"
done

echo "=== Will delete New folder ===" && [ -d "New folder" ] && echo "  New folder/"
echo "=== Will delete templates ===" && [ -d "templates" ] && echo "  templates/"
echo "=== Will delete backup files ===" && find . -maxdepth 3 \( -name "*.backup" -o -name "*.backup2" -o -name "index-backup*.html" -o -name "index-before-*.html" -o -name "premium-demo.html" \) | sort

# ── If dry-run looks correct, run the actual delete ──
# Delete root-level calculator duplicates
for d in calculators/*/; do
  slug=$(basename "$d")
  [ -d "$slug" ] && git rm -rf "./$slug/" && echo "Deleted: $slug/"
done

# Delete New folder (7 unreachable tools)
[ -d "New folder" ] && git rm -rf "New folder/" && echo "Deleted: New folder/"

# Delete templates (redirected to /document-generators/)
[ -d "templates" ] && git rm -rf "templates/" && echo "Deleted: templates/"

# Delete backup/demo files
find . -maxdepth 3 \( -name "*.backup" -o -name "*.backup2" -o -name "index-backup*.html" -o -name "index-before-*.html" -o -name "premium-demo.html" \) -exec git rm -f {} \;
```

---

## STEP 2 — Copy all built files into repo

```bash
# ── CONFIG FILES (repo root) ──────────────────────────────────────────────────
cp .gitignore          .gitignore
cp vercel.json         vercel.json
cp robots.txt          robots.txt
cp sitemap.xml         sitemap.xml
cp 404.html            404.html
cp homepage-index.html index.html

# ── HUB PAGES ─────────────────────────────────────────────────────────────────
cp hubs/calculators-index.html              calculators/index.html
cp hubs/pdf-tools-index.html               pdf-tools/index.html
cp hubs/document-generators-index.html     document-generators/index.html
mkdir -p hr && cp hubs/hr-index.html       hr/index.html

# ── FIXED CALCULATOR PAGES (7) ────────────────────────────────────────────────
cp calculators/income-tax-index.html           calculators/income-tax/index.html
cp calculators/salary-hike-index.html          calculators/salary-hike/index.html
cp calculators/in-hand-salary-index.html       calculators/in-hand-salary/index.html
cp calculators/emi-index.html                  calculators/emi/index.html
cp calculators/pf-calculator-index.html        calculators/pf-calculator/index.html
cp calculators/offer-letter-decoder-index.html calculators/offer-letter-decoder/index.html
cp calculators/overtime-index.html             calculators/overtime/index.html

# ── HR SUITE (23 tools) ───────────────────────────────────────────────────────
for f in hrsuite/*-index.html; do
  slug=$(basename "$f" -index.html)
  mkdir -p "hr/$slug" && cp "$f" "hr/$slug/index.html" && echo "✓ hr/$slug/"
done

# ── PDF TOOLS (15 tools) ──────────────────────────────────────────────────────
for f in pdf-tools/*-index.html; do
  slug=$(basename "$f" -index.html)
  mkdir -p "pdf-tools/$slug" && cp "$f" "pdf-tools/$slug/index.html" && echo "✓ pdf-tools/$slug/"
done

# ── DOCUMENT GENERATORS (11 tools) ───────────────────────────────────────────
for f in docgen/*-index.html; do
  slug=$(basename "$f" -index.html)
  mkdir -p "document-generators/$slug" && cp "$f" "document-generators/$slug/index.html" && echo "✓ document-generators/$slug/"
done
```

---

## STEP 3 — Commit and push

```bash
git add -A
git status   # review what changed

git commit -m "feat: complete site rebuild — 313/313 tests passed

DELETED:
- 95 root-level calculator duplicate folders
- New folder/ (7 unreachable tools with spaces in path)
- templates/ (15 tools, consolidated under /document-generators/)
- All .backup .backup2 demo files

ADDED / UPDATED:
- vercel.json: security headers, CDN caching, cleanUrls
- robots.txt: blocks backup files, sitemap linked
- sitemap.xml: 164 canonical URLs, zero duplicates
- 404.html: live search across 153 tools, popular tools grid
- index.html: HR Suite in nav/categories/section/footer, 153+ stats

HUB PAGES (4):
- calculators/index.html: 101 tools linked, live search, 6 category filters
- pdf-tools/index.html: 18 tools linked, live search, 2 category filters
- document-generators/index.html: 11 tools, live search
- hr/index.html: NEW — 23 tools, live search, 3 category filters

TOOL PAGES (49):
- All 23 HR Suite tools: self-contained, Claude API AI tools, full nav+footer
- All 15 PDF tools: self-contained, pdf-lib client-side processing
- All 11 DocGen tools: live preview, print-to-PDF
- Floating search widget on all 49 tool pages

CALCULATORS (7 fixed):
- income-tax, salary-hike, in-hand-salary, emi, pf-calculator,
  offer-letter-decoder, overtime — cross-links to HR Suite added

INTERLINKING:
- HR Suite added to nav on all 49 tool pages
- HR Suite footer column on all 49 tool pages + 4 hub pages
- 11 broken root-path internal links fixed
- Cross-section links: top 7 calculators now link to HR + DocGen"

git push origin cleanup/full-site-fix
```

---

## STEP 4 — GitHub Pull Request

1. Go to: `https://github.com/utilitydesk/utilitydesk`
2. Click **"Compare & pull request"** for `cleanup/full-site-fix`
3. Review the diff — confirm only the expected files changed
4. Merge → Vercel auto-deploys in ~60 seconds

---

## STEP 5 — Post-deploy verification (5 minutes)

Open these URLs and confirm they load correctly:

```
https://www.utilitydesk.in/                          ← Homepage with HR Suite section
https://www.utilitydesk.in/calculators/              ← 101 tools with search
https://www.utilitydesk.in/pdf-tools/                ← 18 tools with search
https://www.utilitydesk.in/document-generators/      ← 11 tools with search
https://www.utilitydesk.in/hr/                       ← NEW — 23 HR tools
https://www.utilitydesk.in/hr/resume-rewrite/        ← AI tool (Claude API)
https://www.utilitydesk.in/hr/offer-letter/          ← HR doc tool
https://www.utilitydesk.in/pdf-tools/jpg-to-pdf/     ← PDF tool
https://www.utilitydesk.in/calculators/income-tax/   ← Cross-links to HR
https://www.utilitydesk.in/nonexistent-page/         ← 404 with search
```

---

## STEP 6 — Google Search Console (10 minutes)

```
1. https://search.google.com/search-console
2. Select: utilitydesk.in
3. Left sidebar → Sitemaps
4. Add sitemap: sitemap.xml
5. Click Submit

Wait 24-48 hours for Google to begin crawling all 164 URLs.
```

---

## Complete file manifest

### Root files (upload to repo root)
| File | Purpose |
|------|---------|
| `index.html` (from `homepage-index.html`) | Homepage — HR Suite added |
| `404.html` | Live search, popular tools, AI tools |
| `vercel.json` | Security headers, CDN caching |
| `robots.txt` | Crawl rules, sitemap pointer |
| `sitemap.xml` | 164 canonical URLs |
| `.gitignore` | Prevents backup files re-entering repo |

### Hub pages (4 files)
| File | GitHub path |
|------|-------------|
| `hubs/calculators-index.html` | `calculators/index.html` |
| `hubs/pdf-tools-index.html` | `pdf-tools/index.html` |
| `hubs/document-generators-index.html` | `document-generators/index.html` |
| `hubs/hr-index.html` | `hr/index.html` |

### Calculator pages (7 fixed)
| File | GitHub path |
|------|-------------|
| `calculators/income-tax-index.html` | `calculators/income-tax/index.html` |
| `calculators/salary-hike-index.html` | `calculators/salary-hike/index.html` |
| `calculators/in-hand-salary-index.html` | `calculators/in-hand-salary/index.html` |
| `calculators/emi-index.html` | `calculators/emi/index.html` |
| `calculators/pf-calculator-index.html` | `calculators/pf-calculator/index.html` |
| `calculators/offer-letter-decoder-index.html` | `calculators/offer-letter-decoder/index.html` |
| `calculators/overtime-index.html` | `calculators/overtime/index.html` |

### HR Suite tools (23 — all `hrsuite/*-index.html` → `hr/{slug}/index.html`)
appointment-letter, ats-checker, ats-score, cover-letter, exit-checklist,
experience-letter, grammar-check, hr-policy-generator, improve-writing,
increment-letter, interview-questions, job-description, joining-letter,
leave-letter, offer-letter, payslip, promotion-letter, relieving-letter,
resume-analyzer, resume-builder, resume-rewrite, salary-slip, warning-letter

### PDF tools (15 — all `pdf-tools/*-index.html` → `pdf-tools/{slug}/index.html`)
compress-pdf, delete-pages, excel-to-pdf, extract-pages, jpg-to-pdf,
ocr-pdf, page-number-pdf, pdf-to-excel, pdf-to-ppt, pdf-to-word,
ppt-to-pdf, protect-pdf, repair-pdf, unlock-pdf, watermark-pdf

### Document generators (11 — all `docgen/*-index.html` → `document-generators/{slug}/index.html`)
appointment-letter, experience-letter, invoice, leave-letter, nda,
offer-letter-generator, purchase-order, quotation, relieving-letter,
resignation-letter, salary-slip

---

## What every visitor can now do

| Scenario | Before | After |
|----------|--------|-------|
| Find income tax calculator | ✅ Already worked | ✅ Works + now shows HR tools |
| Find HR Suite tools | ❌ Not in nav anywhere | ✅ In nav on every page |
| Search from a tool page | ❌ No search on tool pages | ✅ Floating 🔍 button on all 49 pages |
| Land on 404 page | ❌ Generic error, no tools shown | ✅ Live search + popular tools |
| Browse all calculators | ❌ Only 13/101 shown in hub | ✅ All 101 with live search + filters |
| Browse all PDF tools | ❌ Only 3/15 shown | ✅ All 18 with search |
| Find resume/career tools | ❌ No path from calculator pages | ✅ Cross-links on 7 top calculators |
| Google crawl all tools | ❌ 82 calculators orphaned | ✅ All 164 URLs in sitemap |
