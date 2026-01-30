# PayFast MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)

**The first MCP server for the PayFast South African payment gateway**

A Model Context Protocol (MCP) server that enables AI assistants to interact with the PayFast payment gateway API. This server provides tools for managing transactions, subscriptions, refunds, and credit card operations with built-in safety through Human-in-the-Loop (HITL) confirmation for sensitive operations.

## Overview

This MCP server bridges AI assistants like Claude with [PayFast](https://www.payfast.co.za/), South Africa's leading payment gateway. It enables natural language interaction with PayFast's API while maintaining security and safety through validation and confirmation patterns.

### What is MCP?

The [Model Context Protocol](https://modelcontextprotocol.io) is an open standard that enables AI assistants to securely interact with external tools and data sources. MCP servers expose functionality as "tools" that AI models can discover and use.

### What is PayFast?

[PayFast](https://www.payfast.co.za/) is South Africa's most popular payment gateway, supporting multiple payment methods including credit cards, instant EFT, SnapScan, Zapper, and more. It's trusted by thousands of South African businesses for secure online payments.

### Who is this for?

- **Developers** building payment integrations with AI assistance
- **E-commerce businesses** managing PayFast transactions through AI workflows
- **Financial teams** needing AI-powered payment operations and reporting
- **Anyone** wanting to interact with PayFast using natural language through Claude or other MCP-compatible AI assistants

## Features

### Comprehensive Tool Suite

The server provides 13 tools organized by category:

#### Connectivity (1 tool)
- **ping**: Test API connectivity and validate credentials

#### Transactions (3 tools)
- **transaction.fetch**: Retrieve details of a specific transaction
- **transaction.history**: Get transaction history with date filtering and pagination
- **transaction.charge**: Process charges on tokenized credit cards

#### Subscriptions (6 tools)
- **subscription.fetch**: Retrieve subscription details
- **subscription.pause**: Temporarily pause a subscription for specified billing cycles
- **subscription.unpause**: Resume a paused subscription
- **subscription.cancel**: Permanently cancel a subscription
- **subscription.update**: Update subscription parameters (amount, cycles, frequency, run date)
- **subscription.adhoc**: Process one-time ad-hoc charges on subscriptions

#### Refunds (2 tools)
- **refund.create**: Create refunds for transactions
- **refund.fetch**: Retrieve refund details and status

#### Credit Cards (1 tool)
- **creditcard.fetch**: Query credit card transaction details

### Safety & Security Features

- **Human-in-the-Loop (HITL) Confirmation**: High-risk operations (charges, refunds, subscription changes) require explicit confirmation before execution
- **Input Validation**: All tool parameters validated using Zod schemas
- **Secure Credential Handling**: Credentials never logged or exposed in responses
- **Environment Support**: Separate sandbox and production environments
- **Comprehensive Logging**: Structured logging to stderr (never stdout) for debugging
- **Error Handling**: Graceful error handling with detailed error messages

### Technical Highlights

- Built with TypeScript for type safety
- Uses the official [@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk)
- Zod validation for all inputs
- Comprehensive test suite (unit and integration tests)
- Clean architecture with separation of concerns

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed ([download](https://nodejs.org/))
- **A PayFast merchant account** - Sign up at [payfast.co.za](https://www.payfast.co.za/)
- **PayFast sandbox credentials** for testing - Get them at [sandbox.payfast.co.za](https://sandbox.payfast.co.za/)
- **An MCP-compatible client** such as:
  - [Claude Desktop](https://claude.ai/download)
  - [Cursor IDE](https://cursor.sh/)
  - Any other MCP-compatible application

## Installation

### From Source

```bash
# Clone the repository
git clone https://github.com/yourusername/payfast-mcp.git
cd payfast-mcp

# Install dependencies
npm install

# Build the project
npm run build
```

### From npm (Coming Soon)

Once published to npm, you'll be able to run:

```bash
npx payfast-mcp
```

## Configuration

### 1. Get PayFast Credentials

#### Sandbox (for testing):
1. Create a sandbox account at [sandbox.payfast.co.za](https://sandbox.payfast.co.za/)
2. Navigate to **Settings > Integration**
3. Copy your Merchant ID and Merchant Key
4. Generate a passphrase in the security settings

#### Production:
1. Log in to your PayFast account at [payfast.co.za](https://www.payfast.co.za/)
2. Navigate to **Settings > Integration**
3. Copy your live Merchant ID and Merchant Key
4. Generate a passphrase in the security settings

**Warning**: Always test with sandbox credentials first. Never use production credentials during development.

### 2. Create Environment Configuration

Create a `.env` file in the project root (or configure environment variables in your MCP client):

```env
# PayFast Merchant Credentials
PAYFAST_MERCHANT_ID=your_merchant_id_here
PAYFAST_MERCHANT_KEY=your_merchant_key_here
PAYFAST_PASSPHRASE=your_passphrase_here

# Environment: "sandbox" for testing, "production" for live transactions
PAYFAST_ENVIRONMENT=sandbox

# Optional: Logging level (debug, info, warn, error)
LOG_LEVEL=info
```

**Important**: Add `.env` to your `.gitignore` to prevent committing credentials to version control.

## Usage with Claude Desktop

Add the PayFast MCP server to your Claude Desktop configuration:

### Configuration File Location

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

### Configuration

```json
{
  "mcpServers": {
    "payfast": {
      "command": "node",
      "args": [
        "C:/path/payfast-mcp/dist/index.js"
      ],
      "env": {
        "PAYFAST_MERCHANT_ID": "10000100",
        "PAYFAST_MERCHANT_KEY": "46f0cd694581a",
        "PAYFAST_PASSPHRASE": "jt7NOE43FZPn",
        "PAYFAST_ENVIRONMENT": "sandbox"
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

**Replace**:
- The `args` path with the absolute path to your built `index.js` file
- The credential values with your actual PayFast credentials
- Use `"sandbox"` for testing and `"production"` for live transactions

### Restart Claude Desktop

After saving the configuration, restart Claude Desktop for the changes to take effect.

### Verify Connection

In Claude Desktop, you can verify the server is working:

```
Can you test the PayFast connection?
```

Claude will use the `ping` tool to verify connectivity.

## Usage with Cursor IDE

Cursor IDE also supports MCP servers. Add the configuration to Cursor's settings:

### Configuration File Location

- **macOS**: `~/Library/Application Support/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
- **Windows**: `%APPDATA%\Cursor\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`
- **Linux**: `~/.config/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

### Configuration

```json
{
  "mcpServers": {
    "payfast": {
      "command": "node",
      "args": [
        "C:/Projects/PaulGit/payfast-mcp/dist/index.js"
      ],
      "env": {
        "PAYFAST_MERCHANT_ID": "10000100",
        "PAYFAST_MERCHANT_KEY": "46f0cd694581a",
        "PAYFAST_PASSPHRASE": "jt7NOE43FZPn",
        "PAYFAST_ENVIRONMENT": "sandbox"
      }
    }
  }
}
```

Update the paths and credentials as described above for Claude Desktop.

## Available Tools Reference

| Tool Name | Description | Risk Level | Confirmation Required |
|-----------|-------------|------------|----------------------|
| **ping** | Test API connectivity and validate credentials | Low | No |
| **transaction.fetch** | Retrieve details of a specific transaction | Low | No |
| **transaction.history** | Get transaction history with filtering | Low | No |
| **transaction.charge** | Process charge on tokenized card | **High** | **Yes** |
| **subscription.fetch** | Retrieve subscription details | Low | No |
| **subscription.pause** | Pause subscription for billing cycles | Medium | **Yes** |
| **subscription.unpause** | Resume paused subscription | Medium | **Yes** |
| **subscription.cancel** | Permanently cancel subscription | **High** | **Yes** |
| **subscription.update** | Update subscription parameters | Medium | **Yes** |
| **subscription.adhoc** | Process ad-hoc charge on subscription | **High** | **Yes** |
| **refund.create** | Create refund for transaction | **High** | **Yes** |
| **refund.fetch** | Retrieve refund details | Low | No |
| **creditcard.fetch** | Query credit card transaction details | Low | No |

## Human-in-the-Loop (HITL) Confirmation

High-risk operations that involve financial transactions require explicit confirmation to prevent accidental charges or refunds.

### How It Works

1. **First Call (Request)**: Call a high-risk tool without the `confirmed` parameter
2. **Confirmation Response**: The tool returns details about what will happen and asks for confirmation
3. **Second Call (Execution)**: Call the same tool again with `confirmed: true` to execute the action

### Example Flow

#### Step 1: Initial Request (without confirmation)

```
Claude, charge R50.00 to the card with token abc123 for "Premium Subscription"
```

Claude calls:
```json
{
  "tool": "transaction.charge",
  "params": {
    "token": "abc123",
    "amount": 50.00,
    "item_name": "Premium Subscription",
    "item_description": "Monthly premium plan"
  }
}
```

#### Step 2: Confirmation Request Response

```json
{
  "status": "confirmation_required",
  "action": "transaction.charge",
  "description": "Charge R50.00 to tokenized card for \"Premium Subscription\"",
  "warning": "This will process a real payment. Call this tool again with confirmed: true to proceed.",
  "params": {
    "token": "abc123",
    "amount": 50.00,
    "item_name": "Premium Subscription",
    "item_description": "Monthly premium plan"
  }
}
```

#### Step 3: Confirmed Execution

User confirms, and Claude calls again:
```json
{
  "tool": "transaction.charge",
  "params": {
    "token": "abc123",
    "amount": 50.00,
    "item_name": "Premium Subscription",
    "item_description": "Monthly premium plan",
    "confirmed": true
  }
}
```

#### Step 4: Success Response

```json
{
  "success": true,
  "data": {
    "pf_payment_id": "1234567",
    "status": "COMPLETE"
  },
  "message": "Successfully charged R50.00 for \"Premium Subscription\""
}
```

### Operations Requiring Confirmation

The following operations require `confirmed: true`:

- **transaction.charge**: Creates real payment charges
- **subscription.pause**: Pauses billing (impacts revenue)
- **subscription.unpause**: Resumes billing (may charge customer)
- **subscription.cancel**: Permanently stops subscription (cannot be undone)
- **subscription.update**: Changes billing parameters (affects future charges)
- **subscription.adhoc**: Creates immediate charge
- **refund.create**: Returns money to customer (may be irreversible)

## Development

### Running in Development Mode

```bash
# Run with ts-node (automatically recompiles)
npm run dev
```

### Running Tests

```bash
# Run unit tests only
npm test

# Run integration tests (requires sandbox credentials)
npm run test:integration

# Run all tests
npm run test:all
```

### Debugging with MCP Inspector

The [MCP Inspector](https://github.com/modelcontextprotocol/inspector) is a debugging tool for MCP servers:

```bash
# Install inspector globally
npm install -g @modelcontextprotocol/inspector

# Run server with inspector
npm run inspect
```

This opens a web interface where you can:
- Test tools interactively
- View request/response payloads
- Debug connection issues
- Inspect server capabilities

### Project Structure

```
payfast-mcp/
├── src/
│   ├── index.ts                 # Main entry point
│   ├── config/                  # Configuration management
│   ├── services/                # PayFast API client
│   ├── tools/                   # MCP tool implementations
│   │   ├── index.ts             # Tool registration
│   │   ├── transaction.ts       # Transaction tools
│   │   ├── subscription.ts      # Subscription tools
│   │   ├── refund.ts            # Refund tools
│   │   └── creditcard.ts        # Credit card tools
│   ├── types/                   # TypeScript types and Zod schemas
│   └── utils/                   # Logging, errors, signatures
├── tests/
│   ├── unit/                    # Unit tests
│   └── integration/             # Integration tests
├── dist/                        # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

### Key Architectural Decisions

1. **Separation of Concerns**: Tools, services, and utilities are cleanly separated
2. **Type Safety**: Full TypeScript coverage with Zod runtime validation
3. **STDIO Transport**: Uses standard input/output for MCP communication
4. **Structured Logging**: All logs go to stderr (stdout reserved for MCP protocol)
5. **Error Handling**: Comprehensive error catching and standardized error responses
6. **Configuration**: Environment-based configuration with validation

## Security Considerations

### Credential Safety

- **Never commit credentials**: Always use `.env` files and add them to `.gitignore`
- **No credential logging**: The server never logs merchant IDs, keys, or passphrases
- **Environment separation**: Use sandbox for development, production only when ready
- **Secure storage**: MCP clients should store credentials securely

### Human-in-the-Loop Protection

- **Financial operations protected**: All charges, refunds, and subscription changes require confirmation
- **Clear warnings**: Confirmation messages explain exactly what will happen
- **Two-step process**: Prevents accidental execution through AI misunderstanding

### API Security

- **Signature verification**: All PayFast API calls include MD5 signatures
- **HTTPS only**: All API communication over secure connections
- **Input validation**: Zod schemas validate all input parameters
- **Error sanitization**: Error messages don't expose sensitive data

### Best Practices

1. **Test in sandbox first**: Always test with sandbox credentials before production
2. **Monitor logs**: Review stderr logs for errors and warnings
3. **Limit permissions**: Use API credentials with minimal required permissions
4. **Regular audits**: Periodically review PayFast transaction logs
5. **Update dependencies**: Keep the MCP SDK and other dependencies up to date

## Contributing

Contributions are welcome! Here's how you can help:

### Reporting Issues

If you encounter a bug or have a feature request:

1. Check if the issue already exists in [GitHub Issues](https://github.com/yourusername/payfast-mcp/issues)
2. Create a new issue with:
   - Clear description of the problem or feature
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Environment details (OS, Node version, MCP client)

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`npm run test:all`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Development Guidelines

- Follow the existing code style (TypeScript, ESLint)
- Add JSDoc comments for public functions
- Include unit tests for new features
- Update documentation as needed
- Keep commits atomic and well-described

## Roadmap

Future enhancements planned:

- [ ] Add webhook support for payment notifications
- [ ] Implement payment link generation
- [ ] Add batch operation tools
- [ ] Support for additional payment methods (EFT, SnapScan, etc.)
- [ ] Enhanced reporting and analytics tools
- [ ] Automated reconciliation helpers
- [ ] Support for PayFast Checkout API
- [ ] CLI tool for direct command-line usage

## License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2025 PayFast MCP Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Support

- **Documentation**: [modelcontextprotocol.io](https://modelcontextprotocol.io)
- **PayFast API Docs**: [developers.payfast.co.za](https://developers.payfast.co.za/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/payfast-mcp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/payfast-mcp/discussions)

## Acknowledgments

- Built with the [Model Context Protocol SDK](https://github.com/modelcontextprotocol/sdk)
- Powered by [PayFast](https://www.payfast.co.za/)
- Inspired by the MCP community

---

**Made with care for the South African developer community**
