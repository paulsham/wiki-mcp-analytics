# Wiki Analytics Specification MCP Server

A system that maintains analytics event specifications in a Wiki, then transforms them into formats that AI coding tools to query efficiently via Model Context Protocol (MCP).

## Overview

Analytics specs often live in scattered documentation that's hard for developers to consume, or in technical formats that PMs and data scientists can't easily maintain. This project bridges that gap: non-technical stakeholders author specs in familiar Wiki markdown tables, while developers get structured, queryable data through AI coding tools.

This project enables a Wiki-based workflow for managing analytics specifications:

1. **Author in Wiki** - Define events, properties, and property groups using markdown tables
2. **Transform automatically** - Convert Wiki markdown → CSV → JavaScript modules
3. **Query with Claude** - MCP server provides tools for Claude to search and validate specs

**Note:** This project uses GitHub/GitLab wiki conventions, where wikis are stored as markdown files in a separate git repository (e.g., `repo.wiki.git`). This allows the wiki content to be cloned and processed programmatically.

## Features

- **Wiki-based authoring** - Human-friendly markdown tables with version control
- **Property reuse** - Define properties once, reference everywhere via property groups
- **Compact responses** - MCP tools return structured JSON, reducing token usage by ~66%
- **Validation support** - Validate tracking implementations against specs
- **Local execution** - Runs locally with Claude Desktop, no cloud hosting required

## Installation

```bash
# Clone the repository
git clone https://github.com/username/wiki-mcp-analytics.git
cd wiki-mcp-analytics

# Install dependencies
npm install
```

**Requirements:**
- Node.js 20+

## Usage

### Transform Wiki to Queryable Formats

```bash
# Run full transformation pipeline
npm run transform

# Run individual steps
npm run transform:csv   # Wiki markdown → CSV only
npm run transform:js    # CSV → JavaScript only
```

### Start the MCP Server

```bash
npm start
```

### Configure with Claude Desktop

Add to your Claude Desktop configuration (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "analytics": {
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
│   ├── transform/           # Transformation pipeline
│   │   ├── index.js         # Pipeline orchestration
│   │   ├── wiki-to-csv.js   # Parse markdown → CSV
│   │   └── csv-to-javascript.js  # Generate JS modules
│   └── mcp-server/          # MCP server implementation
│       └── index.js
├── specs/
│   ├── json/                # CSV output for MCP tools
│   │   ├── properties.csv
│   │   ├── property-groups.csv
│   │   └── events.csv
│   └── javascript/          # Generated JS modules
│       ├── events/
│       ├── property-groups/
│       └── properties/
├── wiki-examples/           # Example Wiki markdown files
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
    ↓ (transformation pipeline)
specs/csv/ + specs/javascript/
    ↓ (read by)
MCP Server (runs locally)
    ↓ (stdio)
Claude Desktop / Claude Code
```

**Note:** GitHub/GitLab wikis are separate repositories with a `.wiki` suffix. This project syncs from the wiki repo and transforms its contents.

## Development

### Running Tests

```bash
# Verify transformation output
npm run transform
ls -la specs/json/
ls -la specs/javascript/
```

## License

MIT License - see [LICENSE](LICENSE) for details.

## Related

- [Model Context Protocol](https://modelcontextprotocol.io/) - The protocol this server implements
- [Claude Desktop](https://claude.ai/download) - AI assistant that connects to MCP servers
