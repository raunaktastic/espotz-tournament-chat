# Espotz Chat UI — POC

**Proof of concept** for tournament chat UX in the `webchat` app. This is a **working UI demo with mock data** — not production integration.

Use this repo to validate layout, navigation, and chat flows before wiring the real Espotz backend.

---

## What this POC proves

| Feature | Status |
|--------|--------|
| Right-side **Chat Navigator** (tournament → stages → match days → matches) | ✅ Demo |
| **Tournament Lobby** chat at top of navigator | ✅ Demo |
| Only **joined match chats** visible in navigator (others hidden) | ✅ Demo |
| **Breadcrumb** in chat header for active channel | ✅ Demo |
| **Connected players bar** above messages | ✅ Demo |
| Message list, quick replies, send input | ✅ Demo (local state only) |
| Mobile navigator drawer | ✅ Demo |
| Navigator full height on the right (aligned to top) | ✅ Demo |

---

## What is NOT in this POC

These are intentionally mocked or omitted — **not bugs**:

- No real API / WebSocket / backend
- No auth or user sessions
- Tournament data is hardcoded (`DemonlLord` mock tournament)
- Messages do not persist (refresh resets)
- Unread counts are static mock values
- No locked/grayed stages for non-qualified users
- Not embedded in `espotz-webapp` yet

Production work (API contracts, permissions, real-time sync) comes **after** this POC is signed off.

---

## Run the POC

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### Demo flow

1. **`/`** — Tournament page → click **Tournament Chat**
2. **`/chat`** — Chat UI with navigator on the right
3. Expand **DemonlLord** → try **Tournament Lobby**, **Qualifier**, **Quarter Final**
4. Select different **Match** chats — breadcrumb and messages update
5. Resize below `lg` breakpoint — use the panel icon to open the mobile navigator

---

## POC file map

```
src/
├── pages/ChatPage.tsx              Main layout: chat (left) + navigator (right)
├── components/
│   ├── ChatNavigatorSidebar.tsx    Hierarchical tree navigator
│   ├── ChatBreadcrumb.tsx          Active path breadcrumb
│   └── ConnectedPlayersBar.tsx     Online players strip
├── data/
│   ├── chatNavigatorMock.ts        Tournament tree + visibility helpers
│   ├── mockChatData.ts             Mock channels and messages
│   └── tournamentPlayers.ts        16-team mock roster
└── types/chat.ts                   Tree + channel types
```

Mock tournament name: **`DemonlLord`** — set in `chatNavigatorMock.ts`, `TournamentHeader.tsx`, and welcome message in `mockChatData.ts`.

---

## Routes

| Route   | Purpose |
|---------|---------|
| `/`     | Tournament shell (entry to chat) |
| `/chat` | Chat POC with navigator |

---

## Scripts

```bash
npm run build    # production build
npm run preview  # preview build
npm run lint     # eslint
```

---

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS · React Router · Lucide icons

---

## Notes for reviewers

- **This README describes the POC**, not a phased production rollout.
- Cursor plan file `right_chat_navigator_*.plan.md` was the build checklist used during implementation; the **deliverable is the running demo + code above**, not the plan document.
