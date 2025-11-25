# Wiki Analytics Specification MCP Server

A system that maintains analytics event specifications in a Wiki, then transforms them into formats that AI coding tools to query efficiently via Model Context Protocol (MCP).

## Overview

Analytics specs often live in scattered documentation that's hard for developers to consume, or in technical formats that PMs and data scientists can't easily maintain. This project bridges that gap: non-technical stakeholders author specs in familiar Wiki markdown tables, while developers get structured, queryable data through AI coding tools.

This project enables a Wiki-based workflow for managing analytics specifications:

1. **Author in Wiki** - Define events, properties, and property groups using markdown tables
2. **Build automatically** - Convert Wiki markdown → CSV → JavaScript modules
3. **Query with Claude** - MCP server provides tools for Claude to search and validate specs

**Note:** This project uses GitHub/GitLab wiki conventions, where wikis are stored as markdown files in a separate git repository (e.g., `repo.wiki.git`). This allows the wiki content to be cloned and processed programmatically.

## Features

- **Wiki-based authoring** - Human-friendly markdown tables with version control
- **Property reuse** - Define properties once, reference everywhere via property groups
- **Compact responses** - MCP tools return structured JSON, reducing token usage by ~66%
- **Validation support** - Validate tracking implementations against specs
- **Local execution** - Runs locally with Claude Desktop, no cloud hosting required

## Installation

### Quick Start (Using as-is)

```bash
# Clone the repository
git clone https://github.com/username/wiki-mcp-analytics.git
cd wiki-mcp-analytics

# Install dependencies
npm install

# Start the MCP server
npm start
```

### Fork & Customize (Recommended)

This project is designed as a template for your own analytics specifications:

1. **Fork this repository** to your account
2. **Set up your wiki** - Copy content from the example wiki to your fork's wiki
3. **Install dependencies** - Run `npm install` (automatically sets up git hooks)
4. **Trigger the workflow** - Go to Actions tab, manually run "Transform Wiki to Specs"
5. **Pull the generated specs** - Run `git pull` to get CI-generated specs
6. **Configure MCP** - Add to your AI tool's MCP configuration (see below)

**Optional:** Enable automated sync by uncommenting the cron job in `.github/workflows/transform-wiki.yml`

**Optional:** Add branch protection rules to restrict `specs/` commits to CI/CD only

**Requirements:**
- Node.js 20+
- Git

## Usage

### Build Specs from Wiki

```bash
# Run full build pipeline (Wiki markdown → CSV → JavaScript)
npm run build

# Run individual steps
npm run build:csv      # Wiki markdown → CSV only
npm run build:js       # CSV → JavaScript only
npm run build:example  # Use wiki-examples/ for testing
```

**Note:** Developers typically don't need to run build commands. The CI/CD workflow automatically generates and commits specs when the wiki changes. Just `git pull` to get the latest.

### Start the MCP Server

```bash
npm start
```

### Configure with AI Coding Tools

#### Claude Code

```bash
claude mcp add wiki-analytics node /path/to/wiki-mcp-analytics/src/mcp-server/index.js
```

#### Other MCP-compatible tools

Add to your MCP configuration file:

```json
{
  "mcpServers": {
    "wiki-analytics": {
      "command": "node",
      "args": ["/path/to/wiki-mcp-analytics/src/mcp-server/index.js"]
    }
  }
}
```

## Wiki Format

The Wiki uses three markdown pages with tables where each row represents one item.

### Events.md

| Event Name | Event Table | Event Description | Property Groups | Additional Properties | Notes |
|------------|-------------|-------------------|-----------------|----------------------|-------|
| user_registered | Registration | User completed registration | user_context<br>device_info | registration_method<br>referral_code | Fire after successful registration |

### Property-Groups.md

| Group Name | Description | Properties |
|------------|-------------|------------|
| user_context | Common user identification properties | user_id<br>email<br>account_created_at |

### Properties.md

| Property Name | Type | Constraints | Description | Usage |
|---------------|------|-------------|-------------|-------|
| user_id | string | regex: ^[0-9a-f-]{36}$ | Unique user identifier | Include in all authenticated events |

**Key conventions:**
- Use `<br>` for line breaks in multi-value cells
- All properties must be defined in Properties.md
- Events and property groups reference properties by name only

## Project Structure

```
wiki-mcp-analytics/
├── src/
│   ├── builder/             # Build pipeline (Wiki → CSV → JS)
│   │   ├── index.js         # Pipeline orchestration
│   │   ├── wiki-to-csv.js   # Parse markdown → CSV
│   │   └── csv-to-javascript.js  # Generate JS modules
│   └── mcp-server/          # MCP server implementation
│       └── index.js
├── specs/                   # Generated specs (committed by CI/CD)
│   ├── csv/                 # CSV format for tools
│   │   ├── .gitkeep
│   │   └── *.csv (generated)
│   └── javascript/          # JS modules for runtime
│       ├── .gitkeep
│       └── */ (generated)
├── .husky/                  # Git hooks (pre-commit protection)
│   └── pre-commit
├── wiki-examples/           # Example wiki content for testing
│   ├── Events.md
│   ├── Property-Groups.md
│   └── Properties.md
└── package.json
```

## MCP Tools

The server provides developer-focused tools for implementation and validation:

### get_event_implementation

Get complete event specification with all properties expanded.

```javascript
// Returns structured JSON with property groups, constraints, and notes
get_event_implementation("user_registered")
```

### validate_event_payload

Validate a tracking implementation against the spec.

```javascript
// Returns errors, warnings, and valid fields
validate_event_payload("user_registered", { user_id: "123", ... })
```

### search_events

Find events by criteria.

```javascript
// Search by name, table, or property usage
search_events({ query: "registration", has_property: "user_id" })
```

### get_property_details

Get property definition and usage across events.

```javascript
// Returns type, constraints, description, and where it's used
get_property_details("user_id")
```

### get_related_events

Find events in the same flow/table.

```javascript
// Returns related events for funnel analysis
get_related_events("user_registered")
```

## Architecture

```
Wiki Repo (separate git repository)
    ↓ (sync via CI/CD)
Main Repo: wiki-mcp-analytics
    ↓ (build pipeline)
specs/csv/ + specs/javascript/
    ↓ (read by)
MCP Server (runs locally)
    ↓ (stdio)
Claude Desktop / Claude Code
```

**Note:** GitHub/GitLab wikis are separate repositories with a `.wiki` suffix. This project syncs from the wiki repo and builds the specs.

## Development

### Automated Workflow

When you update your wiki, the GitHub Action automatically:
1. Detects wiki changes
2. Builds fresh specs (CSV + JavaScript)
3. Commits to your repo as `github-actions[bot]`
4. Developers pull the updated specs

**Optional:** Enable daily sync by uncommenting the cron schedule in `.github/workflows/transform-wiki.yml`

### Local Development

```bash
# Test the builder with example data (no wiki setup needed)
npm run build:example

# Build from your wiki (requires wiki/ directory cloned locally)
git clone https://github.com/yourname/wiki-mcp-analytics.wiki.git wiki
npm run build

# Run the MCP server
npm start
```

### Protection Against Stale Commits

The project includes a pre-commit hook (via Husky) that blocks manual commits to `specs/`. This ensures only CI/CD commits generated specs.

To bypass (not recommended): `git commit --no-verify`

For additional protection, consider setting up branch protection rules to restrict `specs/` changes.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Related

- [Model Context Protocol](https://modelcontextprotocol.io/) - The protocol this server implements
- [Claude Desktop](https://claude.ai/download) - AI assistant that connects to MCP servers
