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

### 2. Environment Variables

Copy the provided `.env.example` file to `.env` in the project root and replace the placeholder strings (for example `YOUR_FIREBASE_API_KEY`) with your actual credentials.
Frontend variables must be prefixed with `VITE_` so Vite can expose them to the client. The
Firebase values are required for authentication to work correctly.

#### Frontend
- `VITE_API_BASE_URL` – base URL of the remote API (e.g., `http://localhost:3000`)
- The backend exposes `/projects` for project CRUD operations. Requests are made relative to this base URL.
- During development the Vite server proxies API paths like `/projects`, `/subscription`, `/users`, and more to this URL.
- `VITE_OPENAI_API_KEY` – OpenAI key used by the browser (optional)
- `VITE_ELEVENLABS_API_KEY` – ElevenLabs key for voice features (optional)
- `VITE_ENABLE_WAKU` – set to `true` to enable Waku peer-to-peer chat (optional)
- `VITE_WAKU_RELAY_URL` – multiaddress of a Waku relay to bootstrap from (optional; defaults to public peers)
- `VITE_FIREBASE_API_KEY` – Firebase project API key
- `VITE_FIREBASE_AUTH_DOMAIN` – Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID` – Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET` – Firebase storage bucket URL
- `VITE_FIREBASE_MESSAGING_SENDER_ID` – Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID` – Firebase app ID

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
[Waku](https://waku.org/). Start a Waku node and set `VITE_WAKU_RELAY_URL` in
your `.env` file to the node's multiaddress and set `VITE_ENABLE_WAKU=true`.
Leaving these variables unset keeps the app in offline mode and no network
requests are made for messaging.


### Waku Messaging
Setting `VITE_ENABLE_WAKU` to `true` enables peer-to-peer chat via the
[@waku/sdk](https://github.com/waku-org/js-waku) package. When enabled the
client starts a light node and publishes chat messages on the `/lifepilot/1/chat`
content topic. If the variable is unset or the browser is offline, the app
continues to function using only local storage.

### 3. Waku Identity Setup
1. Generate a new peer key for Waku using the CLI:
   ```bash
   npx waku-keygen > waku-key.json
   ```
   Keep this file safe&mdash;it acts as your login credential.
2. Start the app and choose **Import Waku Key** to load the JSON file. The key is
   stored locally and lets the client sign Waku messages.
3. After the key is imported, your profile configuration is published on the
   `/lifepilot/user-config/1/app` topic so it can be restored from any device.

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
Set `VITE_WAKU_RELAY_URL` to point at your own node if you prefer to use a
specific relay.

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
