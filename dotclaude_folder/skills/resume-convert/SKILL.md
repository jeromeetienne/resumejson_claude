---
name: resume-convert
description: >
  Convert resumes between PDF, Markdown, and the canonical JSON Resume format
  (ResumeJson). Use this whenever the user wants to extract a resume from a PDF
  into structured JSON, turn a Markdown resume into JSON, or render a resume JSON
  back to Markdown. Triggers on: "extract resume from PDF", "parse my resume",
  "resume to JSON", "convert resume to markdown", "resume from markdown", or any
  reference to ResumeJson / JSON Resume. All AI steps run on the current Claude
  session — no OpenAI, no API key.
---

# resume-convert

Convert resumes between **PDF / Markdown / JSON**. The canonical format is
`ResumeJson` (JSON Resume). The **AI steps are performed by you, Claude, in this
session** — there is no external model and no API key. A small TypeScript toolbelt
CLI handles the deterministic, non-AI work (rendering, schema validation).

## The toolbelt CLI

Deterministic operations run through the bundled CLI. In this repo (development),
invoke it from the repo root as:

```bash
npm run resumejson_claude -- <command> [args]
```

Once the package is installed, `npx resumejson_claude <command>` works the same.

| Command | Purpose |
|---|---|
| `schema resume` | Print the JSON Schema for `ResumeJson` — the exact contract to produce |
| `validate -i <file> --schema resume` | Zod-validate a JSON file; exits non-zero and lists problems on failure |
| `to_markdown -i <resume.json> -o <out.md\|->` | Render `ResumeJson` → Markdown (deterministic) |
| `to_pdf -i <resume.json> -o <out.pdf>` | Render `ResumeJson` → PDF (deterministic; Mustache + headless Chrome) |

## The contract: `ResumeJson`

Every step reads or writes a `ResumeJson` document. **Never guess the shape** —
fetch it once at the start of a task:

```bash
npm run resumejson_claude -- schema resume
```

The canonical shape carries **all** section keys (`basics`, `work`, `education`,
`skills`, …); a section the person doesn't have is `null` or `[]`, never absent.

## Capabilities

### `from_pdf` — PDF → ResumeJson (AI, you)

1. Read the PDF with the Read tool (it renders pages as images; use your vision).
2. Fetch the contract: `schema resume`.
3. Produce a `ResumeJson` object with **every** key present (value, `null`, or `[]`).
   Do not invent facts — use `null` for anything the PDF doesn't state.
4. Write it to `<name>.resume.json`.
5. **Validate + self-correct** (see below).

### `from_markdown` — Markdown → ResumeJson (AI, you)

Same as `from_pdf`, but read the Markdown resume as text and structure it into
`ResumeJson`. Preserve wording; only reshape into the schema.

### `to_markdown` — ResumeJson → Markdown (deterministic, CLI)

No AI. Just run:

```bash
npm run resumejson_claude -- to_markdown -i <name>.resume.json -o <name>.resume.md
```

(Use `-o -` to stream to stdout.) It validates the input first, so a malformed
resume fails loudly rather than rendering garbage.

### `to_pdf` — ResumeJson → PDF (deterministic, CLI)

No AI. Renders the resume through a Mustache HTML template and prints it with
headless Chrome:

```bash
npm run resumejson_claude -- to_pdf -i <name>.resume.json -o <name>.resume.pdf
```

Pass `-t <template.mustache.html>` to use a custom template. Requires a headless
Chrome (installed with Puppeteer); the default template pulls Bootstrap from a
CDN, so PDF rendering needs network access.

## Validate + self-correct (required after every AI step)

This is how we get schema-guaranteed output without a structured-output API:

1. Write your JSON to a file.
2. Run `validate -i <file> --schema resume`.
3. If it exits non-zero, read each reported problem (they are `path: message`),
   fix the JSON, and re-validate.
4. Repeat until it passes. Only then present a short human summary of what you
   extracted (name, counts of work/education/skills entries, anything you left
   `null`).

## Notes

- This skill is deliberately narrow (conversion only). ATS scoring / review /
  optimization live in the sibling `resume-ats` skill.
- No credentials are ever needed — the reasoning is you, the deterministic work
  is local TypeScript.
