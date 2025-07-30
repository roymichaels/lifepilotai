# 🤖 Autonomous Agents Overview

This document outlines the autonomous agents present in the project, their architecture, purpose, and interaction protocols. These agents are modular, self-contained entities that carry out specific tasks and communicate via decentralized systems like Waku.

---

## 🧠 Core Principles

- **Agent = Self-contained intelligence unit** that operates with minimal hardcoding.
- **All agents communicate via Waku topics** (no centralized database).
- **OpenAI (ChatGPT-4)** is used for reasoning, idea generation, and analysis.
- Agents are designed to evolve toward self-integration and task autonomy.

---

## 📦 Agents in This Project

### 1. `InstagramAgent`

- **Purpose:** Discovers fast-growing Instagram accounts in a specific niche, analyzes their content using GPT-4, and publishes viral content ideas.
- **Inputs:**
  - Niche keyword (e.g. "freedom", "fitness")
  - Captions (mock or real)
  - `getRecentCaptions(username)` fetches up to 5 recent captions via the Instagram Basic Display API and publishes them on `/aura/instagram-agent/captions/1/app`
- **Outputs:**
  - Waku messages to:
    - `/aura/instagram-agent/accounts/1/app` (discovered accounts)
    - `/aura/instagram-agent/ideas/1/app` (GPT-generated content hooks)
    - `/aura/instagram-agent/engagements/1/app` (like/comment events)
  - Hook ideas are generated via the OpenAI client and each one is published individually


  - IPFS/Pinata integration:
    - Store GPT-generated media, transcripts, or idea packs as JSON
    - Publish IPFS hashes via Waku topics
    - Maintain a content vault for each user



- **Technologies:**
  - Waku (LightNode, LightPush, LightSubscribe)
  - GPT-4 via OpenAI API
- **Status:** Active. Data is persisted exclusively via Waku topics (see `src/lib/wakuTopics.ts`).

- **Planned Features:**
  - Real caption scraping
  - Engagement simulations
  - Cross-platform idea mapping
  - Basic engagement events published on `/aura/instagram-agent/engagements/1/app`

#### Pinata Setup
1. Create an account on [Pinata](https://www.pinata.cloud/) and generate a JWT token.
2. Add the token to a `.env` file as `VITE_PINATA_JWT=<your-token>`.
   Tests can use the variable `PINATA_JWT`.
3. Restart the dev server so the Instagram agent can upload ideas to IPFS.

### 2. `YouTubeAgent`
- **Purpose:** Analyze YouTube videos for better titles, thumbnails, and scripts.
- **Inputs:**
  - Video ID and metadata
  - Thumbnail URL
  - Transcript or script text
- **Outputs:**
  - `/aura/youtube-agent/titles/1/app` (published titles)
  - `/aura/youtube-agent/thumbnails/1/app` (thumbnail data)
  - `/aura/youtube-agent/scripts/1/app` (scripts or transcripts)
### 2. `AuraGrowthAgent`
- **Purpose:** Coordinates platform agents like InstagramAgent, listens to their result topics, and publishes aggregated progress.
- **Outputs:** `/aura/growth-agent/progress/1/app`
### 2. `FiverrAgent`

- **Purpose:** Optimize your Fiverr profile, analyze top freelancers and update gigs automatically.
- **Outputs:**
  - `/aura/fiverr-agent/freelancers/1/app` (top freelancer data)
  - `/aura/fiverr-agent/gigs/1/app` (gig updates)
- **Status:** Prototype. Listens on the topics above and publishes placeholder data.

---

## 🧪 Future Agent Ideas

### 3. `FiverrAgent` (Coming Soon)
- **Goal:** Optimize your Fiverr profile, update gigs automatically, scrape high-performing freelancers, and suggest profitable services.

### 4. `AuraGrowthAgent`
- **Meta-agent** that coordinates other platform-specific agents, tracks goal completion, and adapts based on feedback.
=======
### 1. `FiverrAgent` (Coming Soon)
- **Goal:** Optimize your Fiverr profile, update gigs automatically, scrape high-performing freelancers, and suggest profitable services.

### 3. `YouTubeAgent`
- **Goal:** Analyze your or others' videos to optimize thumbnails, titles, and scripts.

---

## 🛠 Agent Communication Protocol

All agents communicate via Waku using the following topics:
These topics are listed in `src/lib/wakuTopics.ts`.

| Purpose             | Topic Path                                       |
|---------------------|--------------------------------------------------|
| New account found   | `/aura/instagram-agent/accounts/1/app`           |
| Content ideas       | `/aura/instagram-agent/ideas/1/app`              |
| Scraped captions    | `/aura/instagram-agent/captions/1/app`           |
| Engagement events   | `/aura/instagram-agent/engagements/1/app`        |
| Video titles        | `/aura/youtube-agent/titles/1/app`               |
| Video thumbnails    | `/aura/youtube-agent/thumbnails/1/app`           |
| Video scripts       | `/aura/youtube-agent/scripts/1/app`              |
| Progress updates    | `/aura/growth-agent/progress/1/app`              |
| User profile        | `/aura/users/{pubkey}/profile`                   |
| User config         | `/aura/users/{pubkey}/config`                    |
| User traits         | `/aura/users/{pubkey}/traits`                    |

All payloads are JSON-encoded and contain:

```
{
  "agentId": "aura_001",
  "timestamp": "2025-07-29T13:00:00Z",
  "type": "content_idea",
  "payload": {
    "accountId": "...",
    "idea": "Hook example here"
  }
}
```

📌 Notes
Agents should never rely on centralized storage.

Agents can listen to each other’s Waku topics to form swarm intelligence.

This document must be updated whenever a new agent is added or changed.
