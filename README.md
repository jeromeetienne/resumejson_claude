# resumejson_claude

Convert resumes between **PDF / Markdown / JSON** and (soon) run an **AI-powered
ATS pipeline** — delivered as **Claude Code skills** that run on your Claude
subscription. No OpenAI, no metered API key: the reasoning is Claude itself, in
your session; a small TypeScript toolbelt CLI does the deterministic work.

This is a Claude-subscription port of
[resumejson_cli](https://github.com/jeromeetienne/resumejson_cli).

## Architecture

- **Interface** — Claude skills in `dotclaude_folder/skills/`, mirrored into
  `.claude/` (and installable into any project).
- **Reasoning** — performed by Claude in-session, guided by each skill's
  `SKILL.md` (extraction, ATS scoring, …).
- **Deterministic work** — a Commander CLI (`src/cli.ts`): schema validation,
  Markdown rendering, skill install.

The canonical format is `ResumeJson` (JSON Resume), validated by a Zod schema.
After every AI step the agent runs `validate` and self-corrects — schema-checked
output without a structured-output API.

## Skills

| Skill | Capabilities | Status |
|---|---|---|
| `resume-convert` | `from_pdf`, `from_markdown` (Claude), `to_markdown` (CLI) | Phase 1 |
| `resume-ats` | `ats_score` / `review` / `question` / `answering` / `answered` / `optimize` | Phase 2 |

`to_pdf` is deferred (Phase 3).

## Toolbelt CLI

```bash
npm install

npm run resumejson_claude -- schema resume                  # print the ResumeJson JSON Schema
npm run resumejson_claude -- validate -i resume.json         # Zod-validate (exits non-zero on failure)
npm run resumejson_claude -- to_markdown -i resume.json -o -  # render Markdown to stdout
npm run resumejson_claude -- install .claude --mode symlink   # mirror the skills into .claude/
```

## Development

```bash
npm run typecheck     # tsc --noEmit
npm test              # node --test on tests/**/*.test.ts
npm run build         # tsc -p tsconfig.build.json  ->  dist/
npm run install:dotclaude   # symlink dotclaude_folder/ skills into this repo's .claude/
```

## License

MIT
