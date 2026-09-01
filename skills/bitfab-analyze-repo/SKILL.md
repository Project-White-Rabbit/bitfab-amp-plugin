---
name: bitfab-analyze-repo
description: "Scan this repository for AI workflows worth tracing and upload draft Bitfab trace plans, without prompts or code edits. Use when the user asks what should be instrumented, wants a survey of the AI surface area before committing to tracing, or says analyze-repo, scan the codebase for AI workflows, or find the top places to trace."
---

# Bitfab analyze-repo (Amp, Alpha)

Ranks the AI workflows in this repository by how much replay value they carry,
then uploads a draft trace plan for each. It changes no code and asks no
questions. The output is a report plus drafts waiting in Bitfab.

Use it as reconnaissance before instrumenting. The drafts it leaves are picked
up later by `bitfab-setup` in `instrument` mode, which reconciles each one
against current code rather than re-scanning.

## Before running

`ANTHROPIC_API_KEY` (or another Claude Agent SDK cloud provider) and a Bitfab
login. Node 18 or newer.

## Running it

```bash
npx bitfab-cli setup --v2 analyze-repo
```

Steer what it prioritizes:

```bash
npx bitfab-cli setup --v2 analyze-repo --prompt "focus on the retrieval pipeline"
```

`--prompt` is the only knob on this path. **Do not pass `--limit`.** It belongs
to the top-level `bitfab analyze-repo` command, and `setup --v2` ignores it
silently rather than erroring, so it would look like it applied when it did not.
The terminal-native path uses the default cap of about 5 drafts. To ask for
fewer, say so in `--prompt`.

## What it reports

Selected workflows, the frameworks each uses, instrumentation effort, which
methods to capture, which calls to mock on replay, real-data value, and the
candidates it skipped with reasons.

Relay the report as printed. It is the deliverable, so do not compress it into
a one-line summary.

## Notes

Prefer this over reading the codebase yourself when the user asks what to
instrument. It applies Bitfab's own replayability and serializability rules and
drops refactor-only candidates, which a manual read will not do consistently.

It never edits code. If the user wants instrumentation actually applied, hand
off to `bitfab-setup` in `instrument` mode afterward.
