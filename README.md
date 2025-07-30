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

When the client starts it checks local storage for a configuration object. If none is found you will be prompted in the browser for the API URL, OpenAI key, ElevenLabs key and Waku settings. These values are stored locally and can also be published on the `/aura/users/{pubkey}/config` topic so other devices can restore them.

The backend API should still run on port **3000** (or update the prompted URL accordingly). During development the Vite dev server will proxy requests such as `/projects` or `/users` to this URL.

### Backend API
The app communicates with a separate API server defined by the URL you provide at startup.
Run your backend locally so it listens on **3000** (or use a custom URL). A typical
Node project can be started with:

```bash
cd path/to/api && npm start
```

Rails users can run:

```bash
bundle exec rails s -p 3000
```

### Waku Messaging and Persistence
All agent data is persisted directly on Waku topics defined in `src/lib/wakuTopics.ts`.
No SQL database is required. Enable Waku when prompted and optionally enter a relay multiaddress to join a network.

### Waku Messaging
Enabling Waku turns on peer-to-peer chat via the [@waku/sdk](https://github.com/waku-org/js-waku) package. Messages are published on the topics defined in `src/lib/wakuTopics.ts` such as `/lifepilot/1/chat`. If no relay is configured, data is kept only in memory.

### 3. Waku Identity Setup
1. Generate a new peer key for Waku using the CLI:
   ```bash
   npx waku-keygen > waku-key.json
   ```
   Keep this file safe&mdash;it acts as your login credential.
2. Start the app and choose **Import Waku Key** to load the JSON file. The key is
   stored locally and lets the client sign Waku messages.
3. After the key is imported, your profile configuration is published on the
   `/aura/users/{pubkey}/config` topic so it can be restored from any device.

### 4. Running the App

**Note:** npm is required for this project. Ensure Node.js and npm are installed.

Install dependencies with `npm install`. Start the development server using:

```bash
npm run dev
```
This command starts the Vite dev server.

In another terminal start your backend API (typically on port **3000**), for example:

```bash
cd path/to/api && npm start
```

To keep the app completely offline simply skip any additional services.
If Waku is enabled the client will connect to public bootstrap peers by default.
Enter a custom relay address when prompted if you prefer to use a specific node.

### 5. Waku persistence
No database setup is required. When the dev server starts it connects to Waku and caches data in memory. See `src/lib/wakuTopics.ts` for the list of topics.

### 6. Development dependencies

Install all dependencies (including the test runner **Vitest**) before running the tests:

```bash
npm install
# or use the helper script
./scripts/setup-dev.sh
```

After installation, run the test suite with:

```bash
npm test
```

### Pinata Setup
1. Sign up at [Pinata](https://www.pinata.cloud/) and create a JWT token.
2. Add `VITE_PINATA_JWT=<your-token>` to a `.env` file (tests can use `PINATA_JWT`).
3. Restart the dev server so agents can upload content to IPFS.

### Tip Scheduler
`AuraMemoryService` periodically reviews conversations and stores short tips. The scheduler starts automatically when a project is active but can also be managed manually with `startTipScheduler(projectId)` and `stopTipScheduler(projectId)`.

### Linting

Run ESLint using the shared configuration:

```bash
npm run lint
```

## Autonomous Agents

### InstagramAgent
- **Purpose:** Discover trending accounts and generate new hooks from captions.
- **Topics:** `/aura/instagram-agent/accounts/1/app`, `/aura/instagram-agent/captions/1/app`, `/aura/instagram-agent/ideas/1/app`, `/aura/instagram-agent/engagements/1/app`
- **Status:** Active.

### YouTubeAgent
- **Purpose:** Suggest better titles, thumbnails and scripts for videos.
- **Topics:** `/aura/youtube-agent/titles/1/app`, `/aura/youtube-agent/thumbnails/1/app`, `/aura/youtube-agent/scripts/1/app`
- **Status:** Active.

### FiverrAgent
- **Purpose:** Analyse top freelancers and keep your gigs updated.
- **Topics:** `/aura/fiverr-agent/freelancers/1/app`, `/aura/fiverr-agent/gigs/1/app`
- **Status:** Prototype.

### IdeaMapper
- **Purpose:** Map Instagram ideas to Fiverr and YouTube opportunities and pin the result to IPFS.
- **Topic:** `/aura/idea-mapper/mappings/1/app`
- **Status:** Active.

### AuraGrowthAgent
- **Purpose:** Orchestrate other agents and publish progress reports.
- **Topic:** `/aura/growth-agent/progress/1/app`
- **Status:** Experimental.

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
