# bitfab-amp-plugin

Bitfab plugin for [Amp](https://ampcode.com): capture real runs of your AI
features as traces, replay them against your current code, and verify the
change helped, all from Amp.

The plugin registers three skills, the Bitfab tools, and the local commands the
skills call. It is the same workflow the Claude Code, Cursor, and Codex plugins
ship, built on Amp's plugin API.

## Install

```bash
npx bitfab-cli init --editor amp
```

That clones this repository into Amp's plugin directory
(`~/.config/amp/plugins/bitfab`), signs you in to Bitfab, and starts Amp.

To install without signing in:

```bash
npx bitfab-cli plugin-install --editor amp
```

By hand:

```bash
git clone --depth 1 https://github.com/Project-White-Rabbit/bitfab-amp-plugin.git ~/.config/amp/plugins/bitfab
```

Then run `plugins: reload` from Amp's command palette (Ctrl-O), or restart Amp.
Confirm it loaded:

```bash
amp plugins list
```

## Skills

| Skill | What it does |
|---|---|
| `bitfab:setup` | Instrument workflows, modify existing traces, inspect, replay, database snapshots, templates, analyze the repo |
| `bitfab:assistant` | Improve a traced function: datasets, labeling, graders, experiments, replay, cost optimization |
| `bitfab:update` | Update the plugin and the Bitfab SDK |

Ask Amp for a skill by name, e.g. `bitfab:setup instrument the checkout agent`,
or invoke one from the command palette with `skill: invoke`.

## Tools

Every Bitfab tool the other plugins expose over MCP is registered directly with
Amp under its bare name (`search_traces`, `get_traces`, `save_dataset`, ...),
so you can ask Amp to query your traces without invoking a skill.

## Update

```bash
npx bitfab-cli update --editor amp plugin
```

Or `git -C ~/.config/amp/plugins/bitfab pull`, then `plugins: reload`.

## Requirements

- Node 18 or newer (the plugin's local commands run under node)
- A Bitfab account. The setup skill signs you in when it needs to.
