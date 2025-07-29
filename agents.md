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
  - `getRecentCaptions(username)` now returns 3-5 mock captions used for idea generation
- **Outputs:**
  - Waku messages to:
    - `/aura/instagram-agent/accounts/1/app` (discovered accounts)
    - `/aura/instagram-agent/ideas/1/app` (GPT-generated content hooks)
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

---

## 🧪 Future Agent Ideas

### 2. `FiverrAgent` (Coming Soon)
- **Goal:** Optimize your Fiverr profile, update gigs automatically, scrape high-performing freelancers, and suggest profitable services.

### 3. `YouTubeAgent`
- **Goal:** Analyze your or others' videos to optimize thumbnails, titles, and scripts.

### 4. `AuraGrowthAgent`
- **Meta-agent** that coordinates other platform-specific agents, tracks goal completion, and adapts based on feedback.

---

## 🛠 Agent Communication Protocol

All agents communicate via Waku using the following topics:
These topics are listed in `src/lib/wakuTopics.ts`.

| Purpose             | Topic Path                                       |
|---------------------|--------------------------------------------------|
| New account found   | `/aura/instagram-agent/accounts/1/app`           |
| Content ideas       | `/aura/instagram-agent/ideas/1/app`              |
| Engagement events   | `/aura/instagram-agent/engagements/1/app`        |

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
