# bitfab-amp-plugin (Alpha)

Bitfab skills for [Amp](https://ampcode.com). **Alpha.** This is a skill pack,
not yet a native Amp plugin.

## What Alpha means

The skills here dispatch into `bitfab-cli`'s terminal-native flow
(`bitfab setup --v2`), which runs the full setup and maintenance workflow in the
terminal with no editor handoff. That gives Amp users instrumentation, replay
setup, diagnostics, database snapshots, and templates today.

What is **not** here yet, because it needs the native plugin:

- The improvement loop (datasets, graders, experiments, trace labeling)
- Studio review surfaces (trace plan review in the browser, Edit-with-agent)
- Session log capture, which is keyed to a fixed set of hosts server-side
- A bundled MCP server, so Bitfab MCP tools are not registered in Amp

Run those in Claude Code, Cursor, or Codex. The native Amp plugin is planned and
will replace this pack in place.

## Install

```bash
amp skill add ./skills/bitfab-setup
amp skill add ./skills/bitfab-analyze-repo
amp skill add ./skills/bitfab-account
```

Each lands in the current project's `.agents/skills/`. Add `--global` to install
for every project instead, which writes to `~/.config/agents/skills/`.

Confirm they registered:

```bash
amp skill list | grep bitfab-
```

Amp discovers skills by their `name` and `description` and loads one when it is
relevant. You can also invoke a skill directly through the command palette
(`Ctrl-O` in the Amp CLI, `Cmd/Alt-Shift-A` in the editor extensions) with
`skill: invoke`.

## Requirements

- Node 18 or newer
- `ANTHROPIC_API_KEY`, or another cloud provider the Claude Agent SDK supports.
  This is the credential the setup flow itself runs on
- A Bitfab account. The flow opens a browser to sign in when it needs to, and
  this is separate from the credential above

## Skills

| Skill | What it does |
|---|---|
| `bitfab-setup` | Instrument workflows, modify existing traces, inspect, replay, database snapshots, templates |
| `bitfab-analyze-repo` | Scan the repo and upload draft trace plans, no prompts, no edits |
| `bitfab-account` | Sign in and out, switch organization, health check, session logs |

## Feedback

Amp support is early and we want the rough edges. File them at
[bitfab.ai](https://bitfab.ai) or tell us directly.
