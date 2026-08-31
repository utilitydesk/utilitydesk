# UtilityDesk V6 Functional Repair — Follow-up QA

## Issue found during local V6 verification

The sitewide shell/header was loading correctly, but several document/HR generators displayed their sample values only as HTML `placeholder` attributes while their live-preview JavaScript read only `.value`.

Result: the form appeared populated in the browser, but the preview continued to show tokens such as `[Full Name]`, `[Employee]`, `[Position]`, and empty salary values.

## Repair

Updated the non-AI document/HR generator forms so their shared `gv(id)` helper reads:

1. the user's entered value when present;
2. otherwise the field's example placeholder value.

This preserves real user input while making the shipped examples functional and immediately visible in the preview.

The repair covers 23 non-AI HR/document generator pages, including the affected:

- Resume Builder
- Increment Letter
- Joining Letter
- Offer Letter
- Cover Letter
- Promotion Letter
- Exit Checklist
- Payslip
- Warning Letter
- Experience Letter
- Leave Letter
- Relieving Letter
- Appointment Letter
- Salary Slip

Increment Letter calculation was also aligned with the example fields so the sample current salary/increment values can drive the preview without requiring the user to type them first.

## AI tools

AI pages were intentionally excluded from the placeholder fallback. They must not submit example placeholder text as if it were user input.

## QA performed

- Confirmed the affected pages use the repaired value/placeholder resolver.
- Confirmed target inline JavaScript syntax with Node.js.
- Confirmed the existing V6 sitewide header/footer architecture remains in place.
- Confirmed the API/AI repair from the previous V6 repair remains in the package.

## Important deployment note

AI generation still requires the deployed `/api/ai` endpoint and a server-side `OPENROUTER_API_KEY`. Opening the static package with `file://` is sufficient for browser-local calculators and document/PDF operations, but not for server-backed AI calls.
