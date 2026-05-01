# VoltFlow Full-Stack QuickBooks Integration

VoltFlow is now a full-stack electrician business management dashboard with a QuickBooks Online integration foundation. The original React dashboard UI is preserved and extended with integration screens, sync history, and a Node/Express backend.

## Project Structure

```text
voltflow/
├── client/                  # Existing Vite React dashboard, preserved and extended
├── server/                  # Node.js + Express QuickBooks API backend
├── shared/                  # Shared constants/models for future TS migration
├── docker-compose.yml       # Optional local Docker dev setup
├── package.json             # Root scripts
├── .gitignore
└── README.md
```

## What Was Added

### Frontend

- Preserved the existing VoltFlow dashboard design, colors, sidebar, cards, and layout.
- Added responsive sidebar/topbar behavior for tablet and mobile.
- Added QuickBooks integration route:
  - `/integrations/quickbooks`
  - `/settings/integrations`
- Added sync audit page:
  - `/sync-logs`
- Added `client/src/services/quickbooksService.js` so all QuickBooks calls go through the backend.
- Added loading states, success/error feedback, connection status, masked realmId, company name, and last sync time.

### Backend

- Node.js + Express API under `server/`.
- QuickBooks OAuth 2.0 flow using Intuit OAuth.
- Token storage is encrypted even while using local JSON files.
- Repository pattern so JSON storage can later be swapped for PostgreSQL, Supabase, Prisma, or Drizzle.
- Sync logs with metadata: action, status, message, timestamp, source, localId, qbId, duration, and error details.
- QuickBooks endpoints are versioned under `/api/v1`.
- Security middleware: Helmet, CORS, rate limiting, validation, and backend-only token access.
- Placeholder webhook route for future QuickBooks webhook support.

## Setup

### 1. Install dependencies

```bash
cd voltflow
npm run install:all
```

### 2. Configure the server

Create this file:

```bash
server/.env
```

Copy the contents from:

```bash
server/.env.example
```

Then fill in your QuickBooks sandbox app values:

```env
SERVER_PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development

QUICKBOOKS_CLIENT_ID=your_sandbox_client_id
QUICKBOOKS_CLIENT_SECRET=your_sandbox_client_secret
QUICKBOOKS_REDIRECT_URI=http://localhost:5000/api/v1/quickbooks/callback
QUICKBOOKS_ENVIRONMENT=sandbox
QUICKBOOKS_SCOPES=com.intuit.quickbooks.accounting openid profile email phone address

TOKEN_ENCRYPTION_SECRET=replace_with_a_32_plus_character_random_secret
DATABASE_URL=postgresql://future_user:future_password@localhost:5432/voltflow
```

In the Intuit Developer dashboard, add this redirect URI exactly:

```text
http://localhost:5000/api/v1/quickbooks/callback
```

### 3. Run client and server together

```bash
npm run dev
```

Client:

```text
http://localhost:3000
```

Server:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/v1/health
```

## QuickBooks Flow

1. Open the app at `http://localhost:3000`.
2. Go to **Integrations** in the sidebar.
3. Click **Connect to QuickBooks**.
4. Sign in through Intuit sandbox.
5. QuickBooks redirects back to the backend callback.
6. Backend stores encrypted tokens and redirects back to the frontend.
7. Use the buttons to test connection, sync customers, sync invoices, sync payments, or create a sample invoice.

## API Endpoints

Base URL:

```text
/api/v1
```

### QuickBooks

```text
GET    /quickbooks/connect
GET    /quickbooks/callback
GET    /quickbooks/status
POST   /quickbooks/disconnect
POST   /quickbooks/refresh-token
POST   /quickbooks/test-connection
GET    /quickbooks/company-info
POST   /quickbooks/sync/customers
POST   /quickbooks/sync/invoices
POST   /quickbooks/sync/payments
POST   /quickbooks/invoices
```

### Logs

```text
GET    /sync-logs
POST   /sync-logs
```

### Webhooks

```text
POST   /webhooks/quickbooks
```

## Local JSON Data

The server creates these files automatically while running:

```text
server/src/data/tokens.json
server/src/data/syncLogs.json
server/src/data/localBusiness.json
```

They are ignored by Git because they may contain local secrets or environment-specific data.

## Future Upgrade Path

### PostgreSQL / Supabase

Replace the repository files in:

```text
server/src/repositories/
```

Keep the services and controllers unchanged. This lets you migrate from JSON files to a relational database without rewriting the app.

Recommended future tables:

- companies
- users
- quickbooks_connections
- customers
- jobs
- technicians
- service_items
- invoices
- payments
- sync_logs
- webhook_events

### Multi-Tenant SaaS

The backend already reads `x-tenant-id` and defaults to `default-company`. Later, connect this to authenticated users and company IDs.

### Webhooks

The webhook endpoint is present but intentionally conservative. Before production, add Intuit webhook signature verification, event deduplication, and queue-based processing.

### Production Notes

Before production:

- Move token storage to a database or managed secret store.
- Use HTTPS everywhere.
- Add authentication and role-based access control.
- Add Intuit webhook signature verification.
- Add a queue for sync jobs.
- Add retries for rate limits and transient QuickBooks API failures.
- Add centralized logs and alerting.

## Commands

```bash
# Install root, client, and server dependencies
npm run install:all

# Run client and server together
npm run dev

# Run only frontend
npm run dev --prefix client

# Run only backend
npm run dev --prefix server

# Build frontend
npm run build

# Start backend in production mode
npm run start
```

## Final Product Pages Added

Every sidebar icon now opens a real working product page instead of a placeholder:

- Dashboard: executive KPI overview
- Jobs: active job board, job values, technicians, statuses, addresses
- Scheduling: daily dispatch timeline, technician availability, route notes
- Invoices: invoice center with QuickBooks sync status
- Customers: CRM cards with balances, contact info, and account type
- Employees: employee directory with roles, hours, jobs, and field status
- Payroll: payroll approval queue and gross pay estimates
- Materials: inventory control with reorder warnings and vendor tracking
- Reports: revenue/job charts and KPI cards
- Integrations: QuickBooks Online OAuth, sync actions, connection status
- Sync Logs: searchable audit table for QuickBooks activity
- Settings: company profile, roles, alerts, and integration preferences

The frontend build was verified with:

```bash
cd client
npm install
npm run build
```

Build completed successfully. Vite only showed a normal bundle-size warning because charts and dashboard dependencies are included in the app bundle.
