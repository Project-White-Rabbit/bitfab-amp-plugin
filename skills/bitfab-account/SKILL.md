---
name: bitfab-account
description: "Manage the Bitfab account and connection from this terminal: sign in, sign out, switch organization, check whether tracing is healthy, and read or change session log collection. Use when the user says log in to Bitfab, log out, switch org, check my Bitfab setup, why are my traces not showing up, or asks about session logs."
---

# Bitfab account and connection (Amp, Alpha)

Account and connection management through `bitfab-cli`. Everything here runs in
the terminal.

## Sign in and out

Editor-independent, so these work on Amp directly.

```bash
npx bitfab-cli login
npx bitfab-cli login --force    # re-auth, and clear a stale Studio session
npx bitfab-cli logout
```

`login` opens a browser and returns to the terminal. It short-circuits when
already authenticated, so `--force` is the way to deliberately re-authenticate.

## Session logs

```bash
npx bitfab-cli session-logs status
npx bitfab-cli session-logs enable
npx bitfab-cli session-logs disable
```

Session log collection is off unless enabled. Do not enable it on the user's
behalf. Ask first, and say it uploads session transcripts to Bitfab for
diagnostics.

## Is my setup healthy

```bash
npx bitfab-cli setup --v2 inspect
```

Diagnoses authentication, what is instrumented, SDK freshness, replay coverage,
and whether traces are actually arriving. It offers a fix per finding rather
than applying anything unprompted.

This is the first thing to run for "why are my traces not showing up". Do not
start reading instrumentation code before it has reported.

## Switch organization

```bash
npx bitfab-cli setup --v2 switch-org
```

Needs `ANTHROPIC_API_KEY` or another Claude Agent SDK cloud provider, because it
runs through the setup flow.

## Not available on Amp in Alpha

`bitfab-cli update` launches an editor and has no Amp path, so do not run it
here. To check whether the SDK is behind, use `setup --v2 inspect`, which
reports SDK freshness, then upgrade the SDK with the project's own package
manager.
