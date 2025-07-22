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

Copy the provided `.env.example` file to `.env` in the project root and fill in the values.
Frontend variables must be prefixed with `VITE_` so Vite can expose them to the client.

#### Frontend
- `VITE_API_BASE_URL` – base URL of the remote API
- `VITE_OPENAI_API_KEY` – OpenAI key used by the browser (optional)
- `VITE_ELEVENLABS_API_KEY` – ElevenLabs key for voice features (optional)

### 3. Running the App
Install dependencies with `npm install` (or `yarn`). Start the development server using:

```bash
npm run dev
```
This command starts the Vite dev server.

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

