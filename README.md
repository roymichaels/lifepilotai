# LifePilot Subscription & Billing System

This document outlines the setup and implementation of LifePilot's subscription and billing system with Stripe integration.

## Features

### Pricing Tiers
- **Freemium (Free)**: 3 widgets, 500 AI messages/month, basic features
- **Personal ($9/mo or $90/yr)**: Unlimited widgets, 1,500 messages, full analytics, cloud sync
- **Pro ($25/mo or $240/yr)**: 5,000 messages, voice features, team projects (5 seats), API access
- **Enterprise (Custom)**: Unlimited usage, SLA, HIPAA/GDPR compliance, dedicated support

### Add-ons
- Extra 1,000 AI messages: $5
- Additional team seat: $5/month
- Custom integrations: Quoted

### Features
- 14-day free trial for Personal plan (no credit card required)
- Annual discounts (up to 25% off)
- Pro-rated billing and refunds
- Usage tracking and limits
- Subscription management dashboard

## Setup Instructions

This project targets **Node.js 18**. Ensure you have Node 18 installed before
running the following steps.

### 1. Stripe Configuration

Create the following products and prices in your Stripe dashboard:

#### Products
1. **Personal Plan**
   - Monthly Price ID: `price_personal_monthly`
   - Yearly Price ID: `price_personal_yearly`

2. **Pro Plan**
   - Monthly Price ID: `price_pro_monthly`
   - Yearly Price ID: `price_pro_yearly`

3. **Add-ons**
   - Extra Messages: `price_addon_messages`
   - Team Seat: `price_addon_seat`

### 2. Runtime Configuration

On first launch the client now prompts for its configuration values instead of loading a `.env` file. Enter your API base URL, Firebase credentials and any optional API keys when asked. The answers are stored in `localStorage` so you only need to provide them once. Remove the `lifepilot-config` entry from the browser's storage to reconfigure.

The prompts request:
- API base URL for the backend (defaults to `http://localhost:3000`)
- Optional OpenAI and ElevenLabs API keys
- Whether to enable Waku messaging and the relay address
- Firebase project credentials

### Backend API
The app communicates with a separate API server defined by `VITE_API_BASE_URL`.
Run your backend locally so it listens on **3000** (or update the URL). A typical
Node project can be started with:

```bash
cd path/to/api && npm start
```

Rails users can run:

```bash
bundle exec rails s -p 3000
```

### Local SQLite & Waku Messaging
All application data is stored in a local SQLite database created by
`scripts/init-db.ts` using `wa-sqlite`. No external database service is
required, so the app can run completely offline.

When network access is available you can optionally sync messages over
[Waku](https://waku.org/). Start a Waku node and provide its multiaddress when
the client asks for the Waku relay URL. Choose to enable Waku messaging in the
startup prompts. Leaving these values blank keeps the app in offline mode and no
network requests are made for messaging.


### Waku Messaging
Setting `VITE_ENABLE_WAKU` to `true` enables peer-to-peer chat via the
[@waku/sdk](https://github.com/waku-org/js-waku) package. When enabled the
client starts a light node and publishes chat messages on the `/lifepilot/1/chat`
content topic. If the variable is unset or the browser is offline, the app
continues to function using only local storage.

### 3. Firebase Console Setup
1. Open the [Firebase console](https://console.firebase.google.com/) and navigate to **Authentication → Sign‑in method**.
   Enable **Email/Password** or any other providers your app uses.
2. Under **Authentication → Settings**, add your development and production
   domains to the **Authorized domains** list (include `localhost` for local testing).
3. When the client starts it will prompt for your Firebase project credentials.
   Enter the values for each field as requested.

### 4. Running the App

**Note:** npm is required for this project. Ensure Node.js and npm are installed.

Install dependencies with `npm install`. Start the development server using:

```bash
npm run dev
```
This command starts the Vite dev server.
The `predev` step automatically runs `scripts/init-db.ts` to create a local database in memory, so no `.db` file is written to disk.

In another terminal start your backend API (typically on port **3000**), for example:

```bash
cd path/to/api && npm start
```

To keep the app completely offline simply skip any additional services.
If Waku is enabled the client will connect to public bootstrap peers by default.
  Provide your own relay URL in the startup prompt if you prefer to use a
  specific node.

### 5. Database initialization
When `npm run dev` starts it first executes the `predev` script defined in
`package.json`:

```json
"predev": "ts-node scripts/init-db.ts"
```
The script loads `initSQLite` from
`src/lib/sqlite.ts` and sets up an
in-memory SQLite database using `wa-sqlite`. All migrations are applied each
time the dev server starts, so the database is recreated on every run. Restart
the dev server to reapply migrations after changing the schema.
Ensure your backend is running at `VITE_API_BASE_URL`; the dev server will proxy
API requests like `/projects` or `/subscription` to that address so the client
can use relative URLs.

### 6. Development dependencies

Use the helper script to install all development packages, including the test runner **Vitest**:

```bash
./scripts/setup-dev.sh
```

After installation, run the test suite with:

```bash
npm test
```

### Linting

Run ESLint using the shared configuration:

```bash
npm run lint
```

## Instagram Agent

The `InstagramAgent` module in `src/agents/InstagramAgent.ts` provides a
foundation for an autonomous Instagram assistant. It discovers fast-growing
accounts in a chosen niche, analyses their content and stores daily content
ideas in a local SQLite database. The agent runs entirely offline but is
designed to be extended with features like Waku messaging or NFT mechanics.

## Brain prompt configuration

The prompts and behaviour used by Aura are defined under `src/brain/`.  Each
file represents a layer of the AI:

- `cognition.ts` – base system prompt and context
- `behavior.ts` – communication style
- `filters.ts` – message filters applied before sending
- `skills.ts` – available helper skills

These are combined in `Brain.ts` and imported by the chat API.  To tweak Aura's
responses, edit the objects in these files.  No other code changes are needed as
all chat functions read the configuration from `Brain.ts`.


## License

This project is licensed under the GNU General Public License v3.0. See [LICENSE](LICENSE) for details.
