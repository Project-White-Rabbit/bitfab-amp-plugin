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
- Bitfab MCP tools in Amp itself, so you cannot ask Amp to query traces directly.
  The setup flow still has the full tool set, because `bitfab-cli setup --v2`
  runs its own Bitfab MCP server for the agent inside it
- SDK updates from the CLI, since that flow launches an editor agent

Run those in Claude Code, Cursor, or Codex. The native Amp plugin is planned and
will replace this pack in place.

## Install

```bash
npx bitfab-cli init --editor amp
```

That installs all three skills globally, signs you in to Bitfab, and runs setup
in the same terminal. Use `npx bitfab-cli plugin-install --editor amp` to install
the skills alone.

By hand, which is what the CLI runs:

```bash
amp skill add Project-White-Rabbit/bitfab-amp-plugin/skills --global --overwrite
```

Drop `--global` to install into the current project's `.agents/skills/` instead.
`--overwrite` is what makes a reinstall work. Without it Amp refuses every skill
that already exists, and `amp skill add` exits 0 either way, so a failed
reinstall looks like a successful one.

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
