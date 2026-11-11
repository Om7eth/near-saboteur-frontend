# NEAR Saboteur

A social deduction game with a real economy on NEAR. 4–10 players are on a space station: the crew do missions, and secret saboteurs try to stop them. Players meet, discuss and vote people out. You can play for free, put up a prize pool, or play paid games for real NEAR. Every week the top players on the Ranks are paid in NEAR by an AI agent.

**Hackathon track:** Games With Real Economies

- **Play:** https://nearsaboteur.com
- **Demo video:** `<PASTE YOUR VIDEO LINK HERE>`
- **How to play (with screenshots):** https://nearsaboteur.com/how-to-play
- **Backend + smart contract:** https://github.com/Om7eth/near-saboteur-backend (contract guide: [`contract/README.md`](https://github.com/Om7eth/near-saboteur-backend/tree/dev/contract))

## What uses NEAR

| Feature | How it works | Network |
|---|---|---|
| **Weekly Rewards Agent** | The weekly top 3 are paid automatically by an agent account on **NEAR Intents** (Agent API). `saboteur.near` signs the agent's rules once: withdraw-only, wNEAR only, a weekly $ cap and a per-payment cap. All 3 are queued with a 30-minute timer the admin can cancel, then paid together. Every payment has an idempotency key, so nobody is ever paid twice. | Mainnet |
| **Pool games** | The host funds a prize. 1–5 matches are played, then the top 3 by total points are paid by our escrow contract (v4, with tie support and failed-transfer claims). | Testnet |
| **Paid games** | Every player pays an entry fee into the contract. The pot (minus a 5% fee) goes to the top 3. | Testnet |
| **Real-NEAR pools** | The host pays the winners straight from their own wallet in one click (one approval, every winner), or pays manually. Every payment is checked on-chain. The home page reminds the host until everyone is paid. | Mainnet |
| **Play Pass** | Premium skins and 2× rewards. Paid in NEAR from the player's own wallet, then verified on-chain. | Mainnet |
| **Custom character requests** | Play Pass players can order their own character. Paid in real NEAR from their own wallet to `saboteur.near`, verified on-chain like Play Pass. | Mainnet |
| **Referrals** | Invite link `?ref=username`. When a friend finishes 3 matches with other real players, the inviter unlocks 1,000 $SABOTEUR + 30 points (max 5 friends a week for Ranks). | Testnet token |
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

## Hackathon diff (what to judge)

This game existed before the hackathon. Only the work inside the window (19 Oct – 14 Nov 2026) should be judged. The last commit before the window is the baseline, tagged `pre-hackathon`. The submitted state is tagged `hackathon-submission`.

| Repo | Baseline (6 Oct 2026) | Everything built during the hackathon |
|---|---|---|
| Frontend (this repo) | [`ec86165`](https://github.com/Om7eth/near-saboteur-frontend/commit/ec86165) | [compare `pre-hackathon...hackathon-submission`](https://github.com/Om7eth/near-saboteur-frontend/compare/pre-hackathon...hackathon-submission) |
| Backend + contract | [`25b6b99`](https://github.com/Om7eth/near-saboteur-backend/commit/25b6b99) | [compare `pre-hackathon...hackathon-submission`](https://github.com/Om7eth/near-saboteur-backend/compare/pre-hackathon...hackathon-submission) |

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
- **Watch Live:** anyone can watch public Free and Pool matches (from the home page or Telegram) as a silent spectator: no roles, no chat, no votes. Paid games can't be watched. Switched on/off from the admin page.
- **Referrals:** a Referrals screen with an invite link, per-friend lock/unlock progress and a weekly cap against farming.
- **Telegram bot:** every public room gets one post with a game-art banner that updates itself (lobby → live → result); commands `/play`, `/rooms`, `/live`, `/ranks`, `/help`, and `/subscribe` for other groups; weekly-prize announcements (on / off / paid). All buttons are links, so forwarded posts keep them, and every card has a "Join the group" button.
- **Custom characters:** requests now paid in real NEAR on mainnet (was a testnet wallet).
- **Guides and fixes:** a How to Play page with screenshots (updated for every feature above), performance (lag) fixes, and many bug fixes.

## Libraries and AI tools (disclosure)

- **Main libraries:** React, Vite, Socket.io, Express, MongoDB / Mongoose, near-api-js, NEAR Wallet Selector, NEAR Connect (`@hot-labs/near-connect`), near-sdk (Rust).
- **NEAR services:** NEAR Intents Agent API (Weekly Rewards Agent), NEAR AI Cloud (bot meeting chat and the NEAR AI mission), fastnear RPC.
- **AI coding tools:** much of the code was written with the help of Claude (Claude Code), directed, reviewed and tested by the founder.

## License

MIT. See [LICENSE](LICENSE).

## Team

Om7eth: solo founder.
