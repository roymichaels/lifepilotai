# 🤖 Autonomous Agents Overview

This document outlines the autonomous agents used in the LifePilot project. Each agent is a self-contained module that communicates only via Waku topics.

## 🧠 Core Principles
- **Agent = self-contained intelligence unit** with minimal hardcoding.
- **Data is broadcast on Waku** rather than stored in a central database.
- **OpenAI** provides reasoning and content generation.

## 📦 Agents

### InstagramAgent
- **Purpose:** Find trending accounts, analyse captions with GPT-4 and suggest new hooks.
- **Topics:**
  - `/aura/instagram-agent/accounts/1/app`
  - `/aura/instagram-agent/captions/1/app`
  - `/aura/instagram-agent/ideas/1/app`
  - `/aura/instagram-agent/engagements/1/app`
- **Status:** Active (uses IPFS/Pinata to store ideas).

### YouTubeAgent
- **Purpose:** Publish improved titles, thumbnails and script suggestions.
- **Topics:**
  - `/aura/youtube-agent/titles/1/app`
  - `/aura/youtube-agent/thumbnails/1/app`
  - `/aura/youtube-agent/scripts/1/app`
- **Status:** Active.

### FiverrAgent
- **Purpose:** Analyse top freelancers and update gigs automatically.
- **Topics:**
  - `/aura/fiverr-agent/freelancers/1/app`
  - `/aura/fiverr-agent/gigs/1/app`
- **Status:** Prototype.

### IdeaMapper
- **Purpose:** Map Instagram ideas to potential Fiverr gigs and YouTube videos. Results are pinned to IPFS.
- **Topic:** `/aura/idea-mapper/mappings/1/app`
- **Status:** Active.

### AuraGrowthAgent
- **Purpose:** Meta-agent that triggers other agents and reports progress.
- **Topic:** `/aura/growth-agent/progress/1/app`
- **Status:** Experimental.

### Pinata Setup
1. Create an account on [Pinata](https://www.pinata.cloud/) and generate a JWT token.
2. Add the token to a `.env` file as `VITE_PINATA_JWT=<your-token>` (tests may use `PINATA_JWT`).
3. Restart the dev server so agents can upload files to IPFS.

### Scheduler
`AuraMemoryService` uses a scheduler to review conversations and store tips every 30 minutes. The scheduler starts automatically when a project is active and can be controlled with `startTipScheduler` and `stopTipScheduler`.

---

## ⏰ Scheduling Agents

Periodic tasks for each agent are orchestrated by the `AgentScheduler` module. It
uses **node-cron** to run agent methods on a schedule. Results are still
pushed to the same Waku topics listed below. To start the scheduler:

```ts
import { AgentScheduler } from './src/agents/AgentScheduler'

const scheduler = new AgentScheduler()
await scheduler.start()
```

Call `scheduler.stop()` to gracefully halt all cron jobs and close the agents.

---

## 🛠 Agent Communication Protocol

All agents communicate via Waku using the following topics (defined in `src/lib/wakuTopics.ts`).

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
| Idea mappings       | `/aura/idea-mapper/mappings/1/app`               |
| User profile        | `/aura/users/{pubkey}/profile`                   |
| User config         | `/aura/users/{pubkey}/config`                    |
| User traits         | `/aura/users/{pubkey}/traits`                    |

All payloads are JSON-encoded and contain:

```json
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
- Agents should never rely on centralized storage.
- Agents can listen to each other’s Waku topics to form swarm intelligence.
- Update this document whenever a new agent is added or changed.
