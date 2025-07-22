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

Add the following variables to an `.env` file in the project root. Frontend variables
must be prefixed with `VITE_` so Vite can expose them to the client.

#### Frontend
- `VITE_OPENAI_API_KEY` – OpenAI key used by the browser (optional)
- `VITE_ELEVENLABS_API_KEY` – ElevenLabs key for voice features (optional)

#### Backend
- `JWT_SECRET` – secret for signing access tokens
- `JWT_REFRESH_SECRET` – secret for refresh tokens
- `OPENAI_API_KEY` – server side OpenAI key
- `PORT` – port for the Express API (default: `3000`)

### 3. Local Database
This project now uses a local SQLite database initialized from `backend/schema.sql`.
The database file `lifepilot.db` is created automatically in the project root on first start.

### 4. Single App Structure
LifePilotAI combines the React frontend and Express backend in one repository.
The React app lives in the `src/` directory and the API lives in `backend/`.
Shared utilities reside in `src/lib/`, and the SQLite schema lives in `backend/schema.sql`.

### 5. Running the App
Install dependencies with `npm install` (or `yarn`). Start both the frontend and
backend together in development mode using:

```bash
npm run dev
```
This command launches the Vite dev server and the Express API concurrently.

