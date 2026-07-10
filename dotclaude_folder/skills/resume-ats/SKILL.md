---
name: resume-ats
description: >
  Score, review, and optimize a resume for Applicant Tracking Systems (ATS)
  using the canonical ResumeJson format. Use this when the user wants an ATS
  score, an ATS compliance review, ATS screening questions, or a rewritten
  resume optimized for ATS. Triggers on: "ATS score", "score my resume",
  "ATS review", "is my resume ATS-friendly", "optimize my resume for ATS",
  "improve my resume", "ATS questions", "screening questions". All AI steps run
  on the current Claude session — no OpenAI, no API key. Produce a ResumeJson
  first with the resume-convert skill if you only have a PDF/Markdown.
---

# resume-ats

Run the **AI-powered ATS pipeline** over a `ResumeJson`. **You, Claude, perform
every step in this session** — there is no external model and no API key. Each
step writes a JSON file, which you then gate through the toolbelt's `validate`
command and self-correct until it passes.

## The toolbelt CLI

Deterministic operations (fetch a contract, validate output) run through the
bundled CLI. In this repo (development):

```bash
npm run resumejson_claude -- <command> [args]
```

| Command | Purpose |
|---|---|
| `schema <name>` | Print the JSON Schema for the contract you must produce |
| `validate -i <file> --schema <name>` | Zod-validate; exits non-zero and lists `path: message` problems |

Schema names used here: `ats-score`, `ats-review`, `ats-question`, and `resume`
(for the enriched/optimized resume outputs).

## The loop for every step

1. Fetch the contract: `schema <name>`.
2. Read the input JSON (resume, and where noted questions/review).
3. Produce the output object per the rubric below — **never fabricate** facts,
   skills, employers, dates, or credentials.
4. Write it to a file.
5. `validate -i <file> --schema <name>`; fix reported problems; re-validate.
6. Present a short human summary.

## Capabilities

Inputs/outputs are `ResumeJson` unless a schema is named.

| Step | In | Out (schema) |
|---|---|---|
| `ats_score` | resume | `ats-score` |
| `ats_review` | resume | `ats-review` |
| `ats_question` | resume | `ats-question` (answers empty) |
| `ats_answering` | resume + `ats-question` | `ats-question` (answers filled) |
| `ats_answered` | resume + answered `ats-question` | `resume` (enriched) |
| `ats_optimize` | resume + `ats-review` | `resume` (optimized) |

### `ats_score` → `ats-score`

Numerical ATS readiness audit; use it as a before/after gauge. Score sections and
the overall resume 0–100 as parsed by Workday, Greenhouse, Lever, Taleo, iCIMS:

- **Structure (30%)** — standard headings, contact info in metadata, clean
  hierarchy, no content hidden in unusual fields.
- **Content (40%)** — bullets start with action verbs; quantified achievements;
  no vague language ("responsible for", "helped with"); keywords spelled out AND
  abbreviated ("Amazon Web Services (AWS)"); a comprehensive Skills section.
- **Formatting (15%)** — no parser-breaking unicode (smart quotes, em dashes);
  no excessive nesting; consistent, parseable dates.
- **Completeness (15%)** — summary, contact info, education, skills, and
  work entries with company/title/dates/description.

70+ ≈ likely to pass most filters; below 50 ≈ likely filtered out. Flag every
concrete issue with a specific fix. Fill `topStrengths` / `topImprovements`
(max 5 each) and `keywordDensity`.

### `ats_review` → `ats-review`

Not a score — an actionable report: what exactly must change to pass ATS filters.
For every issue give the exact problem, the exact action, and a before/after
example. Focus on parsing compatibility (headings, structured contact info,
machine-parseable dates, no parser-breaking unicode), keyword optimization
(skills in a Skills section AND in context; acronyms expanded on first use),
content structure (action verbs, quantified metrics, no vague language), and
completeness. Order `actions` by impact (deal breakers → high → nice-to-have),
populate `quickWins` (max 5) and `dealBreakers`, and set `complianceLevel`.
Be specific — never "add more keywords"; say which keywords, where.

### `ats_question` → `ats-question` (answers empty)

Identify information that is **absent** and that only the user can supply — data
you cannot infer or fabricate. Do NOT flag formatting/verbs/keyword density
(the review handles those). Look for: target role (critical if absent); each
missing contact field (email, phone, LinkedIn, city — one question each); top-3
unquantified achievements (quote the bullet, ask for a number); employment gaps
> 3 months; missing work-experience fields (title, company, dates, location);
incomplete education; certifications missing issuer/date; skills named in
experience but absent from the Skills section. **Rules:** ask about missing data
only; max 7 questions; each cites its section in `context`; one thing per
question; critical first. Leave every `answer` empty.

### `ats_answering` → `ats-question` (answers filled)

Given the resume and an unanswered `ats-question` file, fill each `answer` as if
you were the candidate: one short sentence (< 15 words), concrete values where
relevant, consistent with the question's context. Answer every question. Output
the same `ats-question` shape with answers populated. (This simulates the user
for a full dry run; a real user would answer instead.)

### `ats_answered` → `resume` (enriched)

Given the original resume and an **answered** `ats-question` file, fold each
answer into the correct section (the `context` field says where) and return an
enriched `ResumeJson`. Insert metrics into the relevant `highlights`; put missing
contact data into `basics`. Preserve all existing content unless an answer
directly supersedes it; skip empty answers — never invent. Validate against
`resume`.

### `ats_optimize` → `resume` (optimized)

Given the resume and an `ats-review`, apply the review's actions and return an
optimized `ResumeJson` (same schema, same field names — do not rename or invent
fields; keep every top-level key, using `null`/`[]` for empty). Fix deal breakers
first, then high-priority actions and quick wins. Preserve accuracy: never
fabricate experience/skills/dates/credentials; you may rephrase and restructure,
not add new entries. Ensure contact info lives in `basics`; expand acronyms on
first use; start `highlights` with action verbs; add metrics only where the
original content implies them; keep dates ISO-8601. Validate against `resume`.

## Full pipeline

When the user asks to "optimize / improve my resume for ATS", run the whole
pipeline (a real user answers `ats_question` themselves instead of `ats_answering`):

```text
ats_score     resume.json                          -> resume.ats_score.json          (baseline)
ats_question  resume.json                          -> questions.unanswered.json
ats_answering resume.json + questions.unanswered   -> questions.answered.json         (or user answers)
ats_answered  resume.json + questions.answered     -> resume.answered.json
ats_review    resume.answered.json                 -> resume.ats_review.json
ats_optimize  resume.answered.json + ats_review    -> resume.optimized.json
ats_score     resume.optimized.json                -> resume.optimized.ats_score.json (confirm improvement)
```

Validate every output against its schema before moving to the next step. Finish
with a short before/after summary (overall score delta, deal breakers resolved).

## Notes

- Format conversion (PDF/Markdown ↔ JSON) lives in the sibling `resume-convert`
  skill. Produce a `ResumeJson` there first if you only have a PDF or Markdown.
- No credentials are ever needed — the reasoning is you; the validation is local
  TypeScript.
