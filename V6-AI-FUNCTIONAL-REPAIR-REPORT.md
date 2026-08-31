# UtilityDesk V6 — AI Functional Repair

## Issue identified
The V6 package contained two generations of AI frontend code:

- newer HR AI pages read OpenRouter responses from `choices[0].message.content`;
- older document-generator AI pages expected Anthropic-style `content[0].text`;
- `api/ai.js` was proxying OpenRouter but was not forwarding a separately supplied `system` prompt;
- the static package is also commonly opened through Windows `file://`, where `/api/ai` cannot execute because it is a server endpoint.

This caused the AI output area to remain empty or report an empty response after generation on affected pages.

## Repairs

1. Hardened `api/ai.js`.
2. Added support for the `system` field supplied by older generators.
3. Added explicit API-key configuration error handling.
4. Added upstream HTTP error propagation.
5. Normalized the response with both OpenRouter `choices` and a compatible `content` array.
6. Updated all 8 legacy document-generator AI pages to read either response format.
7. Added a V6 local-file diagnostic so the offline package does not silently fail when an AI button is used from Windows File Explorer.
8. Kept the API key server-side; no key is embedded in the HTML or JavaScript.

## Deployment requirement
For live AI generation, deploy the package to the web runtime and configure:

`OPENROUTER_API_KEY`

in the deployment environment. Do not put this key into frontend files.

## Validation

- AI-enabled HTML pages detected: 17
- Legacy AI response parsers remaining: 0
- `api/ai.js`: Node syntax check passed
- `shared/functional-repair-v6.js`: Node syntax check passed
- Existing PDF/browser functionality was not replaced by the AI repair.
