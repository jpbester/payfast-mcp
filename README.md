# payfast-mcp

A [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) server for [PayFast](https://www.payfast.co.za/), South Africa's leading payment gateway. Enables AI assistants like Claude to securely interact with your PayFast merchant account.

## Features

- **Transaction management** — fetch transaction details, query history, process tokenized charges
- **Subscription management** — fetch, pause, unpause, cancel, update, and ad-hoc charge subscriptions
- **Refund processing** — create refunds (full or partial) and query refund status
- **Credit card queries** — look up credit card transaction details
- **Sandbox support** — defaults to sandbox mode for safe testing
- **Secure by design** — credentials via environment variables only, sensitive data never logged

## Available Tools

| Tool | Description | Risk |
|------|-------------|------|
| `ping` | Test API connectivity | Low |
| `transaction_fetch` | Get transaction by ID | Low |
| `transaction_history` | Query transaction history | Low |
| `transaction_charge` | Charge a stored token | Medium |
| `subscription_fetch` | Get subscription details | Low |
| `subscription_pause` | Pause a subscription | High |
| `subscription_unpause` | Resume a subscription | Medium |
| `subscription_cancel` | Cancel a subscription | High |
| `subscription_update` | Update subscription terms | High |
| `subscription_adhoc` | Ad-hoc subscription charge | High |
| `refund_create` | Process a refund | High |
| `refund_fetch` | Get refund details | Low |
| `creditcard_fetch` | Query card transaction | Low |

High-risk operations require human approval before execution.

## Quick Start

### Prerequisites

- Node.js 18+
- A [PayFast merchant account](https://www.payfast.co.za/) (sandbox or production)

### Installation

```bash
npm install -g payfast-mcp
```

Or run directly with npx:

```bash
npx payfast-mcp
```

### Configuration

Set the following environment variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `PAYFAST_MERCHANT_ID` | Yes | Your PayFast Merchant ID |
| `PAYFAST_MERCHANT_KEY` | Yes | Your PayFast Merchant Key |
| `PAYFAST_PASSPHRASE` | Yes | Your PayFast API Passphrase |
| `PAYFAST_ENVIRONMENT` | No | `sandbox` (default) or `production` |

You can also create a `.env` file in your working directory.

### Claude Desktop

Add to your Claude Desktop config (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "payfast": {
      "command": "npx",
      "args": ["-y", "payfast-mcp"],
      "env": {
        "PAYFAST_MERCHANT_ID": "your-merchant-id",
        "PAYFAST_MERCHANT_KEY": "your-merchant-key",
        "PAYFAST_PASSPHRASE": "your-passphrase",
        "PAYFAST_ENVIRONMENT": "sandbox"
      }
    }
  }
}
```

### Claude Code

Add to your Claude Code settings:

```bash
claude mcp add payfast \
  -e PAYFAST_MERCHANT_ID=your-merchant-id \
  -e PAYFAST_MERCHANT_KEY=your-merchant-key \
  -e PAYFAST_PASSPHRASE=your-passphrase \
  -e PAYFAST_ENVIRONMENT=sandbox \
  -- npx -y payfast-mcp
```

### Cursor

Add to your Cursor MCP config (`.cursor/mcp.json` for project-level, or `~/.cursor/mcp.json` for global):

```json
{
  "mcpServers": {
    "payfast": {
      "command": "npx",
      "args": ["-y", "payfast-mcp"],
      "env": {
        "PAYFAST_MERCHANT_ID": "your-merchant-id",
        "PAYFAST_MERCHANT_KEY": "your-merchant-key",
        "PAYFAST_PASSPHRASE": "your-passphrase",
        "PAYFAST_ENVIRONMENT": "sandbox"
      }
    }
  }
}
```

### Codex

Add via the Codex CLI:

```bash
codex mcp add payfast \
  --env PAYFAST_MERCHANT_ID=your-merchant-id \
  --env PAYFAST_MERCHANT_KEY=your-merchant-key \
  --env PAYFAST_PASSPHRASE=your-passphrase \
  --env PAYFAST_ENVIRONMENT=sandbox \
  -- npx -y payfast-mcp
```

Or add directly to `~/.codex/config.toml`:

```toml
[mcp_servers.payfast]
command = "npx"
args = ["-y", "payfast-mcp"]

[mcp_servers.payfast.env]
PAYFAST_MERCHANT_ID = "your-merchant-id"
PAYFAST_MERCHANT_KEY = "your-merchant-key"
PAYFAST_PASSPHRASE = "your-passphrase"
PAYFAST_ENVIRONMENT = "sandbox"
```

## Development

```bash
# Clone the repo
git clone https://github.com/jpbester/payfast-mcp.git
cd payfast-mcp

# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run with MCP Inspector
npm run inspect
```

## License

MIT
