---
name: job-search
description: >
  Find job ads on the web and match them against a resume (ResumeJson). Use this
  when the user wants to search for jobs that fit their resume, capture a specific
  job posting from a URL into structured data, or check how well their resume
  matches a role. Triggers on: "find jobs for my resume", "search for jobs",
  "job postings for me", "does my resume fit this job", "match my resume to this
  posting", "grab this job listing", or any reference to job ads / job search /
  job matching. All steps run on the current Claude session using your WebSearch /
  WebFetch tools — no OpenAI, no API key.
---

# job-search

Find relevant job ads on the web and match them against a `ResumeJson`. **You,
Claude, do the searching and reading in this session** with your `WebSearch` and
`WebFetch` tools — there is no external model and no API key. A small TypeScript
toolbelt CLI validates the structured output you produce.

## The toolbelt CLI

```bash
npm run resumejson_claude -- <command> [args]
```

| Command | Purpose |
|---|---|
| `schema <name>` | Print the JSON Schema for the contract you must produce |
| `validate -i <file> --schema <name>` | Zod-validate; exits non-zero and lists `path: message` problems |

Schema names: `job-posting`, `job-match`. A resume is a `ResumeJson` (produced by
the `resume-convert` skill — run that first if the user only has a PDF/Markdown).

## Ground rules (important)

- **Never fabricate a posting.** Record only what the page actually states. If you
  cannot fetch or read a page, say so — do not invent a listing.
- **Always keep the `source` and `url`.** Every `job-posting` must be traceable to
  the page you read.
- **Web access is best-effort.** Many boards (LinkedIn feeds, Indeed apply-walls)
  require login or run JavaScript and won't be fetchable. Prefer web-search
  results and publicly readable postings (company career pages, public listings);
  degrade gracefully and tell the user what you couldn't read.
- **Match honestly.** In `job-match`, base `matchedRequirements` on evidence in the
  resume; put unevidenced items in `missingRequirements`. `tailoringTips` must be
  truthful reframings, never invented experience.

## The loop for every structured step

1. Fetch the contract: `schema job-posting` (or `schema job-match`).
2. Produce the object from what you read.
3. Write it to a file.
4. `validate -i <file> --schema <name>`; fix reported problems; re-validate.
5. Summarize for the user.

## Capabilities

### `find_jobs` — resume (or criteria) → many `job-posting`

1. Derive search terms from the `ResumeJson` (target `basics.label`, top skills,
   seniority) or from criteria the user gives (role, location, remote).
2. `WebSearch` for current openings; pick the most relevant, publicly readable
   results.
3. `WebFetch` each and extract it into a `job-posting` (one file per posting,
   e.g. `jobs/<company>-<slug>.job.json`), validating each.
4. Present a short ranked list (title · company · location · why it fits).

### `from_url` — a job URL → `job-posting`

`WebFetch` the URL, extract into a `job-posting`, validate. If the page is
login/JS-gated and unreadable, tell the user rather than guessing.

### `match` — resume + `job-posting` → `job-match`

Compare a `ResumeJson` against a `job-posting`: which requirements/keywords the
resume satisfies vs. misses, overall fit (0–100) and a `verdict`, plus concrete
`tailoringTips`. Write a `job-match` file and validate it, then summarize
(verdict, fit, top 2–3 gaps).

## Shortlist workflow

When the user asks to "find jobs that fit my resume":

```text
find_jobs  resume.json                      -> jobs/*.job.json        (validated)
match      resume.json + each job.json       -> jobs/*.match.json      (validated)
rank by overallFit and present a shortlist   (verdict, fit, gaps, source URL)
```

## Notes

- Reuses the `ResumeJson` contract from the `resume-convert` skill; ATS scoring /
  rewriting lives in `resume-ats`. A natural chain: `match` reveals gaps →
  `resume-ats` `ats_optimize` tailors the resume for the target posting.
- No credentials are ever needed — the reasoning and web reads are you; the
  validation is local TypeScript.
