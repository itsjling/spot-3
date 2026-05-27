# Issue tracker: Linear (via MCP)

Issues and PRDs for this repo live as Linear issues. Use the Linear MCP server tools (`mcp__linear__*`) for all operations.

Configure the Linear MCP server in your agent harness before relying on this workflow. If the MCP tools aren't available in a session, fall back to drafting the issue body in chat and asking the user to paste it into Linear.

## Conventions

- **Create an issue**: call the Linear MCP create-issue tool with `team`, `title`, `description`, and `labels`. Use the team/project the user names; if neither is set in this doc and the user hasn't named one, ask.
- **Read an issue**: fetch by Linear identifier (e.g. `ENG-123`), including comments and labels.
- **List / search issues**: filter by team, state, label, or assignee via the MCP search tool.
- **Comment on an issue**: use the MCP comment tool with the issue identifier and body.
- **Apply / remove labels**: update the issue's labels via the MCP update tool, passing label strings from `docs/agents/triage-labels.md`.
- **Close**: transition to the workspace's "Done" or "Cancelled" state — not via deletion.

## Workspace details

Fill these in once they're settled (editing this doc directly is fine):

- **Default team**: _(unset — ask the user before creating)_
- **Default project**: _(unset)_
- **Default assignee on AFK-ready issues**: _(unset)_

## When a skill says "publish to the issue tracker"

Create a Linear issue in the default team.

## When a skill says "fetch the relevant ticket"

Resolve the Linear identifier the user gave (e.g. `ENG-123`) via the MCP get-issue tool, including comments.
