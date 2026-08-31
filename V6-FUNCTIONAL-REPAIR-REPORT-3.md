# UtilityDesk V6 Functional Repair — V6.2

## Repairs in this build

- Synchronized the duplicate AI tools under `document-generators/` with the repaired `hr/` implementations.
- Repaired the broken `document-generators/resume-analyzer/` implementation, which previously contained server-side code (`process.env`, `Response`) inside browser JavaScript and did not call `/api/ai` correctly.
- Repaired the Job Description demo placeholders so the examples display `4–7 years` and `₹18–25 LPA`.
- Strengthened local `file://` AI-mode handling so users receive a clear deployment/API message instead of a silent or ambiguous failure.
- Preserved the V6 sitewide shell, logo, navigation, footer and existing local-browser PDF/calculator/document functionality.

## Deployment requirement for AI

AI generation intentionally uses `/api/ai/` and therefore requires a deployed web/server runtime. Configure `OPENROUTER_API_KEY` in the Vercel project environment. Never place the provider API key in client-side HTML/JavaScript.
