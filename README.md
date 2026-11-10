# NEAR Saboteur

A social deduction game with a real economy on NEAR. 4–10 players are on a space station: the crew do missions, and secret saboteurs try to stop them. Players meet, discuss and vote people out. You can play for free, put up a prize pool, or play paid games for real NEAR. Every week the top players on the Ranks are paid in NEAR by an AI agent.

**Hackathon track:** Games With Real Economies

- **Play:** `<PASTE YOUR LIVE GAME LINK HERE>`
- **Demo video:** `<PASTE YOUR VIDEO LINK HERE>`
- **How to play (with screenshots):** `<YOUR LIVE LINK>/how-to-play`
- **Backend + smart contract:** https://github.com/Om7eth/near-saboteur-backend (contract guide: [`contract/README.md`](https://github.com/Om7eth/near-saboteur-backend/tree/dev/contract))

## What uses NEAR

| Feature | How it works | Network |
|---|---|---|
| **Weekly Rewards Agent** | The weekly top 3 are paid automatically by an agent account on **NEAR Intents** (Agent API). `saboteur.near` signs the agent's rules once: withdraw-only, wNEAR only, a weekly $ cap and a per-payment cap. All 3 are queued with a 30-minute timer the admin can cancel, then paid together. Every payment has an idempotency key, so nobody is ever paid twice. | Mainnet |
| **Pool games** | The host funds a prize. 1–5 matches are played, then the top 3 by total points are paid by our escrow contract (v4, with tie support and failed-transfer claims). | Testnet |
| **Paid games** | Every player pays an entry fee into the contract. The pot (minus a 5% fee) goes to the top 3. | Testnet |
| **Real-NEAR pools** | The host pays the winners straight from their own wallet in one click (one approval, every winner), or pays manually. Every payment is checked on-chain. The home page reminds the host until everyone is paid. | Mainnet |
| **Play Pass** | Premium skins and 2× rewards. Paid in NEAR from the player's own wallet, then verified on-chain. | Mainnet |
| **$SABOTEUR token** | Every finished match pays a reward token by rank (NEP-141). | Testnet |
| **Wallet identity** | Players sign in with HOT / Meteor / Intear. The NEAR Legion SBT gives a badge. | Mainnet |
| **NEAR AI** | AI bots talk in meetings, and a NEAR AI mission asks players questions (with offline fallbacks). | NEAR AI Cloud |

## Stack

- **Frontend:** React + Vite. NEAR Wallet Selector and NEAR Connect for wallets.
- **Backend:** Node.js, Express, Socket.io (real-time game) and MongoDB.
- **Contract:** Rust, near-sdk 5.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173 (expects the backend on :3000)
```

To run the backend, see the backend repo's README.

## Prior work (disclosure)

**Built before the hackathon:**
- The base game: rooms, roles (crew and saboteurs), movement, missions, sabotage, meetings, chat and voting.
- Accounts and email login.
- Free Play, Ranks and Inbox.
- The first version of the pool escrow contract (v3) on testnet.

**Built during the hackathon:**
- **Weekly Rewards Agent:** the weekly top 3 are paid in NEAR on mainnet through a NEAR Intents agent.
  - Owner-signed rules, a 30-minute timer, and payments that can never go out twice.
  - An admin page, a Ranks prize banner, and automatic Inbox and News posts.
- **Pool contract v4:** an internal audit and its fixes.
  - Ties are supported.
  - Failed transfers can be claimed back.
  - No funds get stuck.
  - 28 unit tests and a testnet end-to-end test.
- **Real-NEAR pools:**
  - One-click payouts from the host's wallet, or manual payouts.
  - Every payment is checked on-chain.
  - A home-page reminder until all winners are paid.
- **Play Pass and wallets:**
  - Play Pass paid in mainnet NEAR.
  - A pay wallet tied to each account.
  - $SABOTEUR match rewards.
- **NEAR AI:** a mission that asks players questions (with backup answers), and AI bots that talk in meetings.
- **Game features:** stickers in chat, station map v2 (location card and floating map), and watch mode for hosts (spectator seats).
- **Guides and fixes:** a How to Play page with screenshots, performance (lag) fixes, and many bug fixes.

## Team

Om7eth: solo founder.
