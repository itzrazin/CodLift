# CODLIFT: OVERRIDE PROTOCOL

> **CLASSIFICATION:** LEVEL 4 [RESTRICTED]
> **SYSTEM STATUS:** ONLINE
> **HUD MODULE:** CYBER-NEON INJECTED
> **ENGINE:** ANTIGRAVITY v1.0

Welcome to the CodLift Operating Manual. This document serves as the architectural blueprint for the CodLift execution engine—a gamified, high-fidelity coding platform engineered for zero-trust execution and immersive progression.

---

## 💻 SYSTEM ARCHITECTURE

CodLift is divided into three core subsystems:

### 1. The "No Halloween" XP Validation Engine
XP is a currency of absolute mastery. Participation trophies do not exist in this system.
- **Manual Validator:** Predicts logical flaws, syntax errors, and concept misunderstandings before execution.
- **Piston Sandbox Execution:** Detached, strict-timeout environment to ensure zero infinite loops and accurate runtime analysis.
- **AI Semantic Fallback:** Anthropics Claude 3.5 Sonnet enforces strict requirement checks when manual mapping is bypassed.
- **Anti-Cheat Layer:** Enforces rate-limiting (3s cooldowns) and exact code duplication (SHA-256 caching).

### 2. The Cyber-Neon HUD (User Interface)
The frontend operates on a high-octane "Neo-Brutalism" design standard.
- **Palette:** `#FF00FF` (Electric Pink), `#00FFFF` (Cyan), `#ADFF2F` (Neon Green).
- **Gamified States:** `CRITICAL DAMAGE` terminal windows for validation failures. `VICTORY SECURED` modal sequences featuring Framer Motion physics-based confetti.
- **Dynamic Skill Trees:** Users progress visually through nodes, unlocking Pro and Master tiers only after fulfilling strict XP rank thresholds.

### 3. Server-Side Fortification
The backend operates under strict zero-trust principles.
- **Stateless XP Enforcement:** The client NEVER tells the server how much XP it earned. The server calculates it autonomously via `xpEngine.js`.
- **OAuth Hardening:** Google Auth handles namespace collisions natively (e.g. `Alex9324`), preventing database integrity failures on duplicate names.

---

## 🛠️ DEPLOYMENT INSTRUCTIONS

This codebase is production-ready. Ensure your Vercel and Render environments are linked.

### Environment Variables (.env)
```env
# SERVER
DATABASE_URL="postgres://..."
JWT_SECRET="super-secret-key"
SESSION_SECRET="another-secret"
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
OPENROUTER_API_KEY="sk-or-v1-..."
FRONTEND_URL="https://codlift.vercel.app"

# CLIENT (Vercel)
VITE_API_URL="https://codlift-api.onrender.com"
```

### Local Initialization Sequence

1. **Install Dependencies:**
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```

2. **Boot the Backend:**
   ```bash
   cd server
   npm run dev
   ```

3. **Ignite the Frontend:**
   ```bash
   cd client
   npm run dev
   ```

---

*End of manual. Proceed with execution.*
