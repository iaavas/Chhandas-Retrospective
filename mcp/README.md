# Chhandas MCP Server

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) server that exposes
Nepali / Sanskrit **poetic-meter analysis** as tools for Claude Desktop, Claude.ai, and
any other MCP-compatible AI client.

---

## Tools

| Tool | What it does |
|---|---|
| `analyze_meter` | Analyse a full stanza – detect meter per line, overall meter, and run Anustubh check |
| `detect_syllables` | Break a single line into aksharas with S (Guru) / I (Laghu) weights |
| `list_meters` | List all 21 supported meters with patterns and syllable counts |
| `get_meter_info` | Detailed info for one meter by Devanagari or romanised name |

### Example prompts for Claude

> "Use analyze_meter to check whether this verse is Vasantatilaka:
> वसन्ततिलका…"

> "List all Vṛtta meters supported by Chhandas."

> "What is the gana pattern for शार्दूलविक्रीडित?"

---

## Quick start

### 1 – Build

```bash
cd mcp
npm install
npm run build
```

The compiled server lands in `mcp/dist/index.js`.

### 2 – Add to Claude Desktop

Open (or create) `~/Library/Application Support/Claude/claude_desktop_config.json`
and add the `chhandas` entry under `mcpServers`:

```json
{
  "mcpServers": {
    "chhandas": {
      "command": "node",
      "args": [
        "/Users/aavashbaral/Documents/Developer/Chhandas-Retrospective/mcp/dist/index.js"
      ]
    }
  }
}
```

Restart Claude Desktop. You should see **chhandas** listed in the MCP tools panel.

> **Tip:** Replace the path above with the actual absolute path on your machine if you
> cloned the repo elsewhere.

### 3 – Add to VS Code (Copilot / GitHub Copilot)

In `.vscode/mcp.json` (workspace) or `settings.json` (user):

```json
{
  "mcp": {
    "servers": {
      "chhandas": {
        "type": "stdio",
        "command": "node",
        "args": [
          "/Users/aavashbaral/Documents/Developer/Chhandas-Retrospective/mcp/dist/index.js"
        ]
      }
    }
  }
}
```

### 4 – Use with any MCP client (generic stdio)

The server speaks JSON-RPC 2.0 over stdin/stdout. Run it directly:

```bash
node /path/to/Chhandas-Retrospective/mcp/dist/index.js
```

Then pipe `tools/list` and `tools/call` requests to it per the MCP spec.

---

## Project structure

```
mcp/
├── src/
│   ├── index.ts       # MCP server + tool handlers
│   ├── chhandas.ts    # Core syllable & meter analysis engine
│   └── constant.ts    # Meter definitions, gana table, descriptions
├── dist/              # Compiled output (after npm run build)
├── package.json
└── tsconfig.json
```

---

## Supported meters

| Meter | Pattern | Classification |
|---|---|---|
| भुजङ्गप्रयात | ISS ISS ISS ISS | Vṛtta |
| शार्दूलविक्रीडित | SSS IIS ISI IIS SSI SSI S | Vṛtta |
| तोटक | IIS IIS IIS IIS | Vṛtta |
| मन्दाक्रान्ता | SSS SII III SSI SSI S S | Vṛtta |
| इन्द्रवज्र | SSI SSI ISI SS | Vṛtta |
| उपेन्द्रवज्र | ISI SSI ISI SS | Vṛtta |
| वंशस्थ | ISI SSI ISI SIS | Vṛtta |
| इन्द्रवंश | SSI SSI ISI SIS | Vṛtta |
| वसन्ततिलका | SSI SII ISI ISI SS | Vṛtta |
| मालिनी | III III SSS ISS ISS | Vṛtta |
| शिखरिणी | ISS SSS III IIS SII I S | Vṛtta |
| स्रग्विणी | SIS SIS SIS SIS | Vṛtta |
| स्रग्धरा | SSS SIS SII III ISS ISS ISS | Vṛtta |
| पृथ्वी | III III SSS ISS ISS × 2 | Vṛtta |
| द्रुतविलम्बित | III SII SII SIS | Vṛtta |
| पञ्चचामर | ISI SIS ISI SIS ISI S | Vṛtta |
| हरिणी | III IIS SSS SIS IIS IS | Vṛtta |
| श्रवणाभरणम् | III ISI×6 IS | Vṛtta |
| अनुष्टुप् | Special positional rules | Vṛtta |
| मात्रिक१४ | 14 matras | Mātrā-vṛtta |
| आर्या | Special matra rules | Mātrā-vṛtta |

**S** = Guru (heavy/long)  **I** = Laghu (light/short)

---

## Requirements

- Node.js ≥ 18
- npm ≥ 7
