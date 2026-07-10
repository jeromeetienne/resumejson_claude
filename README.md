# resumejson_claude

Convert resumes between **PDF / Markdown / JSON** and run an **AI-powered ATS
pipeline** — delivered as **Claude Code skills** that run on your Claude
subscription. No OpenAI, no metered API key: the reasoning is Claude itself, in
your session; a small TypeScript toolbelt CLI does the deterministic work.

This is a Claude-subscription port of
[resumejson_cli](https://github.com/jeromeetienne/resumejson_cli).

## Architecture

- **Interface** — Claude skills in `dotclaude_folder/skills/`, mirrored into
  `.claude/` (and installable into any project). **This is what you use** — you
  talk to Claude, not to the CLI.
- **Reasoning** — performed by Claude in-session, guided by each skill's
  `SKILL.md` (PDF extraction, ATS scoring, rewriting, …).
- **Deterministic work** — a Commander CLI (`src/cli.ts`) the skills call for
  schema validation, Markdown/PDF rendering, and install.

The canonical format is `ResumeJson` (JSON Resume), validated by a Zod schema.
After every AI step the agent runs `validate` and self-corrects — schema-checked
output without a structured-output API.

## Skills

| Skill | Capabilities |
|---|---|
| `resume-convert` | `from_pdf`, `from_markdown` (Claude) · `to_markdown`, `to_pdf` (CLI) |
| `resume-ats` | `ats_score` · `ats_review` · `ats_question` · `ats_answering` · `ats_answered` · `ats_optimize` |

## Using it — the workflow

**You don't run the CLI.** You open a Claude Code session and ask in plain
English; the skills trigger on what you say, do the work on your subscription,
and write `.json` / `.md` / `.pdf` files into your folder as they go.

### 1. Enable the skills

```bash
# in this repo
npm install
npm run install:dotclaude     # symlinks both skills into ./.claude/
# …then open this repo in Claude Code — resume-convert and resume-ats load automatically
```

To add the skills to a different project instead:

```bash
npx resumejson_claude install /path/to/project/.claude --mode copy
```

### 2. Extract your resume → structured JSON

Drop `resume.pdf` in the folder and tell Claude:

> **Extract my resume from `resume.pdf`.**

`resume-convert` reads the PDF (Claude's vision), produces a `ResumeJson`, and
validates it. You get `resume.json`:

```jsonc
{
  "basics": {
    "name": "Ada Lovelace",
    "label": "Backend Engineer",
    "email": "ada@example.com",
    "phone": "+1 555 0100",
    "summary": "Backend engineer, 6 years on payments infrastructure.",
    "location": { "city": "London", "countryCode": "GB", "address": null, "postalCode": null, "region": null },
    "profiles": [{ "network": "GitHub", "username": "ada", "url": "https://github.com/ada" }]
  },
  "work": [
    {
      "name": "Acme Pay",
      "position": "Senior Backend Engineer",
      "startDate": "2021-03",
      "endDate": null,
      "highlights": ["Cut checkout latency 40% (320ms → 190ms) with a read-through cache"]
    }
  ],
  "skills": [{ "name": "Backend", "level": null, "keywords": ["Go", "PostgreSQL", "Kafka"] }]
  // …every other section is present too, as null or []
}
```

### 3. Get a baseline ATS score

> **Score `resume.json` for ATS.**

`resume-ats` writes `resume.ats_score.json` and summarizes it. Example:

```jsonc
{
  "overallScore": 58,
  "keywordDensity": "low",
  "missingCriticalSections": ["Professional Summary"],
  "topStrengths": ["Standard section headings", "Consistent date formats"],
  "topImprovements": [
    "Quantify more achievements",
    "Expand acronyms on first use (e.g. AWS)",
    "Add a one-line professional summary"
  ],
  "sectionScores": [
    {
      "section": "Work Experience",
      "score": 64,
      "issues": [
        {
          "severity": "major",
          "category": "missing_metrics",
          "message": "3 of 5 bullets state impact without a number.",
          "suggestion": "Add a %, count, or time saved to each."
        }
      ]
    }
  ]
}
```

(A score of 70+ is likely to clear most ATS filters; below 50 is likely filtered out.)

### 4. Optimize — the full pipeline

> **Optimize my resume for ATS.**

`resume-ats` runs the whole pipeline, validating every step:

```text
score → screening questions → answers → enrich → review → rewrite → re-score
```

and writes `resume.optimized.json`. A typical before/after:

```text
overallScore        58  →  84
keywordDensity      low →  moderate
deal breakers       resolved: missing summary, unexpanded acronyms (AWS, CI/CD)
```

Nothing is fabricated — Claude only rephrases, restructures, and folds in
answers you provide; it never invents employers, dates, or skills.

### 5. Render the result

> **Render `resume.optimized.json` to PDF and Markdown.**

`to_pdf` and `to_markdown` (deterministic) write `resume.optimized.pdf` and
`resume.optimized.md`.

### Single steps

You don't have to run the whole pipeline — ask for any step on its own:

> - *Convert `resume.md` into resume JSON.*
> - *Review `resume.json` for ATS compliance.*
> - *Generate ATS screening questions for `resume.json`.*
> - *Turn `resume.json` into a PDF.*

## Under the hood — the toolbelt CLI

The skills call this CLI for the deterministic, non-AI work. You rarely run it by
hand, but it's a normal Commander CLI:

```bash
npm run resumejson_claude -- schema resume                  # print a contract's JSON Schema (also: ats-score, ats-review, ats-question)
npm run resumejson_claude -- validate -i resume.json         # Zod-validate; exits non-zero and lists problems
npm run resumejson_claude -- to_markdown -i resume.json -o -  # ResumeJson -> Markdown (stdout)
npm run resumejson_claude -- to_pdf -i resume.json -o out.pdf # ResumeJson -> PDF (Mustache + headless Chrome)
npm run resumejson_claude -- install .claude --mode symlink   # mirror the skills into .claude/  (uninstall to remove)
```

`validate` is the gate the skills run after every AI step; `schema` is the single
source of truth for each contract, so the shapes never drift from the docs.

## Development

```bash
npm run typecheck     # tsc --noEmit
npm test              # node --test on tests/**/*.test.ts
npm run build         # tsc -p tsconfig.build.json  ->  dist/
```

## License

MIT
