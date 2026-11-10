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

`<EDIT THIS HONESTLY>` The base game (rooms, roles, meetings, voting, missions) and pool contract v3 existed before the hackathon. Built during the hackathon:
- Weekly Rewards Agent (NEAR Intents)
- Pool contract v4 (audit fixes, ties, claimable failed transfers)
- One-click Real-NEAR payouts
- Unpaid-pool reminder
- Station map v2
- NEAR AI mission
- Stickers
- How to Play page
- Watch mode
- Many fixes

## Team

Om7eth: solo founder.
