# Product Requirements Document: PayFast MCP Server

## 1. Executive Summary

The PayFast MCP Server is the first open-source Model Context Protocol server for PayFast, South Africa's leading payment gateway. It enables AI assistants (Claude, GPT, and others) to securely interact with PayFast merchant accounts through a standardized protocol.

This project fills a gap in the MCP ecosystem: no PayFast integration exists today. By following established patterns from Stripe, PayPal, and Square MCP servers, this project provides South African developers and businesses with AI-powered payment management capabilities.

**Key drivers**: Growing demand for AI-assisted business operations, PayFast's dominance in SA e-commerce, and the maturing MCP ecosystem.

**Expected impact**: First-mover advantage in the PayFast MCP space, enabling thousands of SA merchants to leverage AI for payment operations.

---

## 2. Problem Statement

### Current State

- PayFast merchants manage transactions, subscriptions, and refunds through the PayFast dashboard or direct API integration
- AI assistants cannot interact with PayFast accounts; no MCP server exists
- Developers building AI-powered tools for SA businesses must build custom integrations from scratch
- No standardized, secure pattern exists for AI-to-PayFast communication

### Pain Points

- Manual, repetitive payment operations (checking transaction status, processing refunds, managing subscriptions)
- No way to ask an AI assistant "show me today's transactions" or "pause subscription X"
- Each developer rebuilds PayFast API integration independently
- Security concerns around giving AI systems access to payment operations without human oversight

### Opportunity

- PayFast serves tens of thousands of South African merchants
- The MCP ecosystem is rapidly growing with major AI providers adopting the standard
- No competing PayFast MCP server exists; this is a greenfield opportunity
- Open-source distribution enables community adoption and contribution

---

## 3. Goals and Objectives

### Business Goals

1. **Be the definitive PayFast MCP server** - First and best-in-class implementation, published to npm
2. **Enable secure AI-payment interactions** - Zero credential leaks, human approval for risky operations
3. **Maximize developer adoption** - Easy setup, clear docs, sandbox-first development experience
4. **Follow industry patterns** - Align with Stripe/PayPal/Square MCP implementations for familiarity

### User Goals

- Developers: Integrate PayFast into AI workflows in under 15 minutes
- Business owners: Ask AI assistants to perform payment operations safely
- DevOps: Deploy with confidence using environment-based configuration

### Success Metrics

| Metric | Target |
|--------|--------|
| PayFast API endpoint coverage | 100% of documented endpoints |
| Credential leaks in logs | Zero |
| HITL enforcement on high-risk ops | 100% |
| Sandbox end-to-end test pass rate | 100% |
| npm package published | Yes |
| Setup time (dev, sandbox) | Under 15 minutes |

---

## 4. User Personas

### Persona 1: SA Developer (Primary)

- **Role**: Full-stack developer building AI-powered applications for SA businesses
- **Needs**: Quick integration, sandbox testing, clear tool naming, TypeScript types
- **Pain points**: No existing PayFast MCP server; must build custom solutions; unclear security patterns for AI + payments
- **Goals**: Ship AI features that interact with PayFast; reduce boilerplate; trust the security model

### Persona 2: Business Owner / Merchant

- **Role**: PayFast merchant wanting AI assistance with daily payment operations
- **Needs**: Natural language access to transaction data, subscription management, refund processing
- **Pain points**: Dashboard is manual and time-consuming; cannot delegate routine queries to AI
- **Goals**: Ask "what were my sales today?" or "refund order X" through an AI assistant with confidence

### Persona 3: DevOps / Platform Engineer

- **Role**: Engineer deploying and securing AI integrations in production
- **Needs**: Environment-based config, audit logging, sandbox/production separation, no secrets in logs
- **Pain points**: Unclear security boundaries for AI + financial APIs; risk of accidental production operations
- **Goals**: Deploy the MCP server with proper access controls and monitoring

---

## 5. Functional Requirements

### 5.1 Connection and Authentication

**FR-1**: The server connects to PayFast using Merchant ID, Merchant Key, and Passphrase credentials.

- **User Story**: As a developer, I want to configure my PayFast credentials via environment variables so that the server authenticates securely without hardcoding secrets.
- **Acceptance Criteria**:
  - Server reads PAYFAST_MERCHANT_ID, PAYFAST_MERCHANT_KEY, PAYFAST_PASSPHRASE from environment
  - Server supports .env file loading for local development
  - Server validates all required credentials are present at startup
  - Server fails fast with a clear error if credentials are missing
- **Priority**: Must Have

**FR-2**: The server generates valid MD5 signatures for every PayFast API request.

- **User Story**: As a developer, I want the server to handle PayFast's signature requirements automatically so that I never deal with signature generation.
- **Acceptance Criteria**:
  - Parameters are alphabetized before signing
  - Values are URL-encoded per PayFast spec
  - Passphrase is appended before hashing
  - MD5 hash is generated correctly
  - Required headers (merchant-id, version, timestamp, signature) are included on every request
- **Priority**: Must Have

**FR-3**: The server supports sandbox and production modes.

- **User Story**: As a developer, I want to switch between sandbox and production environments so that I can test safely before going live.
- **Acceptance Criteria**:
  - PAYFAST_ENVIRONMENT variable controls the base URL (sandbox vs production)
  - Defaults to sandbox when not specified
  - Logs clearly indicate which environment is active
  - Production mode requires explicit opt-in
- **Priority**: Must Have

### 5.2 Ping / Health

**FR-4**: `ping` - Test connectivity to the PayFast API.

- **User Story**: As a developer, I want to verify my PayFast connection is working so that I can troubleshoot configuration issues.
- **Acceptance Criteria**:
  - Returns success/failure status
  - Includes environment info (sandbox/production)
  - Reports latency
  - Does not expose credentials in the response
- **Priority**: Must Have
- **Risk Level**: Low (read-only)

### 5.3 Transaction Tools

**FR-5**: `transaction.fetch` - Retrieve a specific transaction by ID.

- **User Story**: As a merchant, I want to look up a specific transaction so that I can check its status and details.
- **Acceptance Criteria**:
  - Accepts a transaction ID (required)
  - Returns transaction details (amount, status, date, payment method, customer info)
  - Returns clear error if transaction not found
  - Masks sensitive card data in response
- **Priority**: Must Have
- **Risk Level**: Low (read-only)

**FR-6**: `transaction.history` - Get transaction history with flexible date ranges.

- **User Story**: As a merchant, I want to view my transaction history so that I can understand my sales patterns.
- **Acceptance Criteria**:
  - Supports date range queries (from/to dates)
  - Supports period shortcuts (daily, weekly, monthly)
  - Returns paginated results
  - Includes summary totals where available
  - Accepts optional filters (status, payment method)
- **Priority**: Must Have
- **Risk Level**: Low (read-only)

**FR-7**: `transaction.charge` - Process a tokenized payment.

- **User Story**: As a developer, I want to charge a stored payment token so that I can process recurring or repeat payments.
- **Acceptance Criteria**:
  - Accepts token, amount, and item description (required)
  - Validates amount is positive and within PayFast limits
  - Returns transaction result with ID and status
  - Requires human approval before execution (MEDIUM risk)
- **Priority**: Must Have
- **Risk Level**: Medium (creates financial transaction)
- **HITL**: Optional (configurable)

### 5.4 Subscription Tools

**FR-8**: `subscription.fetch` - Get subscription details.

- **User Story**: As a merchant, I want to view a subscription's current state so that I can understand its status and terms.
- **Acceptance Criteria**:
  - Accepts subscription token (required)
  - Returns status, amount, frequency, next billing date, and customer info
  - Returns clear error if subscription not found
- **Priority**: Must Have
- **Risk Level**: Low (read-only)

**FR-9**: `subscription.pause` - Pause an active subscription.

- **User Story**: As a merchant, I want to pause a subscription so that the customer is not billed during a temporary hold.
- **Acceptance Criteria**:
  - Accepts subscription token (required) and optional cycles count
  - Validates subscription is in active state
  - Returns updated subscription status
  - Requires human approval before execution
- **Priority**: Must Have
- **Risk Level**: High (modifies billing)
- **HITL**: Required

**FR-10**: `subscription.unpause` - Resume a paused subscription.

- **User Story**: As a merchant, I want to resume a paused subscription so that billing continues.
- **Acceptance Criteria**:
  - Accepts subscription token (required)
  - Validates subscription is in paused state
  - Returns updated subscription status
- **Priority**: Must Have
- **Risk Level**: Medium (resumes billing)
- **HITL**: Optional (configurable)

**FR-11**: `subscription.cancel` - Cancel a subscription permanently.

- **User Story**: As a merchant, I want to cancel a subscription so that it stops billing permanently.
- **Acceptance Criteria**:
  - Accepts subscription token (required)
  - Returns confirmation of cancellation
  - Requires human approval before execution
  - Communicates that cancellation is irreversible
- **Priority**: Must Have
- **Risk Level**: High (irreversible)
- **HITL**: Required

**FR-12**: `subscription.update` - Modify subscription parameters.

- **User Story**: As a merchant, I want to update a subscription's amount or frequency so that I can adjust billing terms.
- **Acceptance Criteria**:
  - Accepts subscription token (required) and update fields (amount, frequency, run_date, cycles)
  - Validates new values are within PayFast limits
  - Returns updated subscription details
  - Requires human approval before execution
- **Priority**: Must Have
- **Risk Level**: High (modifies billing terms)
- **HITL**: Required

**FR-13**: `subscription.adhoc` - Process an ad-hoc charge on a subscription.

- **User Story**: As a merchant, I want to charge an additional amount on an existing subscription so that I can bill for extras outside the regular cycle.
- **Acceptance Criteria**:
  - Accepts subscription token (required), amount (required), and item description
  - Validates amount is positive
  - Returns transaction result
  - Requires human approval before execution
- **Priority**: Must Have
- **Risk Level**: High (creates unscheduled charge)
- **HITL**: Required

### 5.5 Refund Tools

**FR-14**: `refund.create` - Process a refund.

- **User Story**: As a merchant, I want to refund a transaction so that I can return funds to a customer.
- **Acceptance Criteria**:
  - Accepts transaction ID (required), amount (optional for partial refund), and reason
  - Defaults to full refund if amount not specified
  - Validates refund amount does not exceed original transaction
  - Returns refund confirmation with ID and status
  - Requires human approval before execution
- **Priority**: Must Have
- **Risk Level**: High (moves money out)
- **HITL**: Required

**FR-15**: `refund.fetch` - Get refund details.

- **User Story**: As a merchant, I want to check the status of a refund so that I can confirm it was processed.
- **Acceptance Criteria**:
  - Accepts refund ID or transaction ID
  - Returns refund status, amount, and date
  - Returns clear error if refund not found
- **Priority**: Must Have
- **Risk Level**: Low (read-only)

### 5.6 Credit Card Query

**FR-16**: `creditcard.fetch` - Query credit card transaction details.

- **User Story**: As a merchant, I want to look up credit card transaction specifics so that I can verify card-based payments.
- **Acceptance Criteria**:
  - Accepts transaction ID (required)
  - Returns card type, masked card number, authorization code
  - Never returns full card numbers
- **Priority**: Should Have
- **Risk Level**: Low (read-only)

### 5.7 Human-in-the-Loop (HITL) Confirmation

**FR-17**: High-risk operations require explicit human approval before execution.

- **User Story**: As a merchant, I want the AI to ask for my confirmation before processing refunds or cancellations so that I maintain control over irreversible financial actions.
- **Acceptance Criteria**:
  - All HIGH risk tools present a confirmation prompt before execution
  - Confirmation includes operation details (what will happen, amounts involved)
  - User can approve or reject the operation
  - Rejected operations return a clear "cancelled by user" message
  - MEDIUM risk tools have configurable HITL (on/off via environment variable)
- **Priority**: Must Have

---

## 6. User Experience

### 6.1 Setup Journey

1. Developer installs the package (npm install or clone)
2. Copies .env.example to .env, fills in PayFast credentials
3. Runs the server (npx or node command)
4. Configures their AI client (Claude Desktop, etc.) to use the server
5. Verifies with `ping` tool

### 6.2 Usage Journey

1. User asks AI assistant a payment-related question
2. AI identifies the appropriate PayFast MCP tool
3. For read operations: tool executes immediately, returns formatted data
4. For write/high-risk operations: AI presents confirmation prompt with details
5. User approves or rejects
6. Tool executes (or cancels), returns result
7. AI presents the result in natural language

### 6.3 Key States

- **Connected**: Server running, credentials valid, API reachable
- **Disconnected**: Server running but PayFast API unreachable
- **Unconfigured**: Missing required environment variables
- **Sandbox Mode**: Connected to sandbox (safe for testing)
- **Production Mode**: Connected to live API (real money)

### 6.4 Error Presentation

- Errors are returned as structured messages the AI can interpret
- Include actionable guidance (e.g., "Transaction not found. Verify the transaction ID and try again.")
- Never expose raw API errors containing credentials or internal details

---

## 7. Non-Functional Requirements

### 7.1 Performance

- API calls should complete within PayFast's standard response times (under 10 seconds)
- Server startup should take under 3 seconds
- No unnecessary API calls; cache nothing related to credentials

### 7.2 Security

- **NFR-1**: Credentials are sourced exclusively from environment variables; never from tool inputs, files outside .env, or hardcoded values
- **NFR-2**: No sensitive data (keys, passphrases, full card numbers) appears in any log output
- **NFR-3**: All logging uses stderr (never stdout, which is reserved for MCP protocol messages in STDIO transport)
- **NFR-4**: Input validation occurs on every tool invocation before any API call
- **NFR-5**: Production mode requires explicit environment variable setting; sandbox is the default
- **NFR-6**: MD5 signatures are generated fresh for each request; never cached or reused

### 7.3 Reliability

- Graceful handling of PayFast API downtime with clear error messages
- Exponential backoff on rate-limited responses
- No partial state changes on failure (operations are atomic from the user's perspective)

### 7.4 Accessibility

- All tool responses are plain text, suitable for screen readers and text-based interfaces
- No visual-only information in responses

### 7.5 Compatibility

- Node.js 18 or higher
- Works on Windows, macOS, and Linux
- Compatible with any MCP-supporting AI client (Claude Desktop, VS Code extensions, custom clients)

---

## 8. Constraints and Assumptions

### Constraints

- PayFast API uses MD5 for signatures (not configurable; dictated by PayFast)
- STDIO transport requires all logging on stderr
- PayFast sandbox has limited test data and may not reflect all production behaviors
- PayFast API rate limits apply (server must handle gracefully)
- Open-source project; no proprietary dependencies allowed

### Assumptions

- Developers have valid PayFast merchant accounts (sandbox or production)
- PayFast API endpoints remain stable as documented
- MCP SDK maintains backward compatibility within major versions
- Users understand that high-risk operations require their explicit approval
- PayFast sandbox is available for integration testing

### Dependencies

- PayFast API availability and documentation accuracy
- @modelcontextprotocol/sdk package stability
- Node.js LTS release schedule
- npm registry for package distribution

---

## 9. Out of Scope

The following are explicitly NOT part of this PRD:

- **Payment page generation** - Creating checkout pages or payment forms
- **Webhook/ITN receiver** - Handling inbound PayFast notifications (this is a client, not a server for PayFast callbacks)
- **Multi-merchant support** - Serving multiple PayFast accounts simultaneously
- **OAuth 2.1 remote transport** - Deferred to a future phase; initial release is STDIO-only
- **PayFast onsite payments** - The /transaction/payment-identifier endpoint for embedded checkout
- **Bulk operations** - Mass refunds, bulk subscription changes
- **Custom reporting/analytics** - Aggregated dashboards or trend analysis beyond what PayFast API returns
- **Direct card tokenization** - PCI-sensitive card capture flows
- **Mobile SDK integration** - Native mobile payment flows
- **Currency conversion** - All operations are in ZAR as per PayFast

---

## 10. Open Questions

| # | Question | Impact | Owner |
|---|----------|--------|-------|
| 1 | Does PayFast sandbox support all subscription operations for testing? | May limit integration test coverage | Developer |
| 2 | What are PayFast's exact rate limits per endpoint? | Affects backoff strategy configuration | Developer |
| 3 | Should MEDIUM-risk HITL default to on or off? | Affects initial user experience | Product |
| 4 | What npm package name is available? (payfast-mcp, @payfast/mcp-server, etc.) | Affects publishing and discoverability | Developer |
| 5 | Should the server support multiple PayFast API versions or only v1? | Affects maintenance burden | Product |
| 6 | Is there a PayFast partner program or approval needed for open-source tooling? | May affect distribution or naming | Product |
| 7 | Should transaction.history support CSV/export formats? | Affects response structure | Product |

---

## Appendix: Risk Classification Summary

| Risk Level | Operations | HITL Behavior |
|------------|-----------|---------------|
| **Low** | ping, transaction.fetch, transaction.history, subscription.fetch, refund.fetch, creditcard.fetch | No confirmation needed |
| **Medium** | transaction.charge, subscription.unpause | Configurable (env var) |
| **High** | subscription.pause, subscription.cancel, subscription.update, subscription.adhoc, refund.create | Always requires confirmation |

---

## Appendix: Tool Reference

| Tool Name | PayFast Endpoint | Risk | Description |
|-----------|-----------------|------|-------------|
| `ping` | GET /ping | Low | Test API connectivity |
| `transaction.fetch` | GET /transaction/{id} | Low | Get transaction by ID |
| `transaction.history` | GET /transaction/history/* | Low | Query transaction history |
| `transaction.charge` | POST /transaction/tokenized | Medium | Charge a stored token |
| `subscription.fetch` | GET /subscription/{id} | Low | Get subscription details |
| `subscription.pause` | POST /subscription/{id}/pause | High | Pause subscription |
| `subscription.unpause` | POST /subscription/{id}/unpause | Medium | Resume subscription |
| `subscription.cancel` | POST /subscription/{id}/cancel | High | Cancel subscription |
| `subscription.update` | POST /subscription/{id}/update | High | Update subscription |
| `subscription.adhoc` | POST /subscription/{id}/adhoc | High | Ad-hoc subscription charge |
| `refund.create` | POST /refund | High | Process a refund |
| `refund.fetch` | GET /refund | Low | Get refund details |
| `creditcard.fetch` | GET /transaction/query/creditcard | Low | Query card transaction |

---

*Document version: 1.0*
*Last updated: 2026-01-23*
*Status: Draft - Pending stakeholder review*
