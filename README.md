# NEAR Saboteur

A social deduction game with a real economy on NEAR. 4–10 players are on a space station: the crew do missions, and secret saboteurs try to stop them. Players meet, discuss and vote people out. You can play for free, put up a prize pool, or play paid games for real NEAR. Every week the top players on the Ranks are paid in NEAR by an agent account on NEAR Intents. The game token, $SABOTEUR, keeps its rules in its own contract: every caught saboteur burns supply.

**Hackathon tracks:** Games With Real Economies (main) · Memecoins With Mechanics ($SABOTEUR v2) · Agent Economy (Weekly Rewards Agent)

- **Play:** https://nearsaboteur.com
- **Demo video (5:24, with timestamps):** https://x.com/NearSaboteur/status/2120862694026940559
- **How to play (with screenshots):** https://nearsaboteur.com/how-to-play
- **$SABOTEUR token page (live from the contract):** https://nearsaboteur.com/token
- **Backend + smart contract:** https://github.com/Om7eth/near-saboteur-backend (pool contract: [`contract/README.md`](https://github.com/Om7eth/near-saboteur-backend/tree/main/contract) · token contract: [`token-v2/README.md`](https://github.com/Om7eth/near-saboteur-backend/tree/main/token-v2))

## Try it in 5 minutes (for judges)

No wallet or crypto is needed for steps 1–3.

1. **Play a match.** Open https://nearsaboteur.com → *or jump in as a guest* → *Play with AI bots* (on a phone: *PLAY WITH BOTS* at the right end of the LIVE bar) → START. You get a secret role. Walk around (WASD), do missions, or press the red button to call a meeting. **You'll see** AI bots move, do missions, and in the meeting chat they accuse, defend and vote with a reason ("I saw X standing right next to the body").
2. **See the token mechanic.** Open https://nearsaboteur.com/token. **You'll see** live numbers read from the `sabo.saboteur.testnet` contract: burned supply, saboteurs caught, the Wall of Shame, the latest burns with explorer links, and the rules the contract enforces.
3. **See the contract refuse cheating.** On the token page, scroll to *Try to cheat $SABOTEUR* and open any *Failed tx on explorer* link. **You'll see** a real failed testnet transaction whose error names the rule, e.g. `Smart contract panicked: Already recorded`.
4. **See the weekly NEAR payout.** Sign in (email) → RANKS → WEEKLY. **You'll see** this week's prize in USD and NEAR, the top 3 who would win, and the founder account marked DEV and excluded. Payouts are sent on mainnet by the agent account on NEAR Intents after the Saturday 00:00 IST reset.
5. **Run the tests.** In the [backend repo](https://github.com/Om7eth/near-saboteur-backend#run-locally-and-test): `npm install && npm test` (bot rules), `cd contract && cargo test` (28), `cd token-v2 && cargo test` (20). **You'll see** all tests pass, with no database, keys or network needed.

## Track hints → how we use them

| Hint | In NEAR Saboteur |
|---|---|
| **Agent NPCs** (games) | AI bots play as crew or saboteur, talk and vote in meetings (NEAR AI), and each bot has **its own NEAR account** (`bot-<name>.saboteur.testnet`) that earns $SABOTEUR by rank. A bot past 50,000 sends its earnings to the Bot Treasury (`bots.saboteur.testnet`). |
| **Social login** (games) | Email login with an in-game wallet made for you, or play as a guest. No seed phrase, no gas. |
| **NEAR Intents** (games, agents) | The Weekly Rewards Agent pays the top 3 in NEAR on mainnet through the NEAR Intents Agent API. |
| **Mechanic in the contract** (memecoins) | $SABOTEUR v2: catch = burn, Play Pass by burning, a weekly budget that grows with burns. Rules are fixed in the contract, and the contract account has **0 access keys**. |

## What uses NEAR

| Feature | How it works | Network |
|---|---|---|
| **Weekly Rewards Agent** | The weekly top 3 are paid automatically by an agent account on **NEAR Intents** (Agent API). `saboteur.near` signs the agent's rules once: withdraw-only, wNEAR only, a weekly $ cap and a per-payment cap. All 3 are queued with a 30-minute timer the admin can cancel, then paid together. Every payment has an idempotency key, so nobody is ever paid twice. The game's own founder and test accounts (shown with a DEV tag) can't win. | Mainnet |
| **Pool games** | The host funds a prize. 1–5 matches are played, then the top 3 by total points are paid by our escrow contract (v4, with tie support and failed-transfer claims). | Testnet |
| **Paid games** | Every player pays an entry fee into the contract. The pot (minus a 5% fee) goes to the top 3. | Testnet |
| **Real-NEAR pools** | The host pays the winners straight from their own wallet in one click (one approval, every winner), or pays manually. Every payment is checked on-chain. The home page reminds the host until everyone is paid. | Mainnet |
| **Play Pass** | Premium skins and 2× rewards. Paid in NEAR from the player's own wallet, then verified on-chain. | Mainnet |
| **Custom character requests** | Play Pass players can order their own character. Paid in real NEAR from their own wallet to `saboteur.near`, verified on-chain like Play Pass. | Mainnet |
| **Referrals** | Invite link `?ref=username`. When a friend finishes 3 matches with other real players, the inviter unlocks 1,000 $SABOTEUR + 30 points (max 5 friends a week for Ranks). | Testnet token |
| **$SABOTEUR v2 token: "catch = burn"** | NEP-141 token with its mechanic **in the contract** ([`token-v2`](https://github.com/Om7eth/near-saboteur-backend/tree/main/token-v2)). The game only reports a match; the contract computes every reward and accepts each match only once. When the crew catches the saboteur, the contract burns supply from its Ritual Pool. Play Pass can be bought by burning 15,000. The weekly reward budget is 150k plus 50% of last week's burns. Rule changes wait in public for 7 days, and the contract account has 0 access keys, so nobody can redeploy it. The public [token page](https://nearsaboteur.com/token) reads every number from the chain and shows a Wall of Shame of the most-caught saboteurs, plus **"Try to cheat $SABOTEUR"**: real failed testnet transactions where the contract refused a double payout, a fake match report, a non-owner rule change and a free Play Pass. | Testnet |
| **Wallet identity** | Players sign in with HOT / Meteor / Intear. The NEAR Legion SBT gives a badge. | Mainnet |
| **NEAR AI** | AI bots talk in meetings, and a NEAR AI mission asks players questions (with offline fallbacks). | NEAR AI Cloud |

## 🚀 Vision

**Make NEAR Saboteur the social deduction game people play every night with friends, with an economy that is fair, verifiable and run on NEAR.**

- **Fun first, chain invisible:** email login, an in-game wallet made for you, no gas or seed phrases.
- **Fair by code:** prizes are paid by a contract or an agent under owner-signed rules, and every payment can be checked on-chain.
- **Never an empty lobby:** NEAR AI bots fill rooms and talk in meetings like real crew.
- **No pay-to-win, legal first:** money buys looks and prizes, never an edge, and real-money features grow only as the law allows.

### Roadmap

**✅ Now (live at [nearsaboteur.com](https://nearsaboteur.com))**
Weekly Rewards Agent (mainnet) · real-NEAR pools · Play Pass · contract v4 · $SABOTEUR v2 (catch = burn) · NEAR AI bots · Watch Live · Telegram bot

**🔜 Next: the $SABOTEUR loop (testnet)**
- More ways to spend: a cosmetic shop (skins, name colours, emotes) and "Sponsor a Room" prizes, all burning $SABOTEUR.
- One wallet: $SABOTEUR in the in-game wallet, and gasless pools on $SABOTEUR (contract v5).
- Monthly ranked seasons with badges.

**🛠 Then: grow the game**
- New maps, roles and sabotages.
- A Telegram Mini App and a mobile-first version.
- Smarter AI crew with memory, clans and community tournaments.

**🌐 Later: open the economy**
- External contract audit, then host-funded pools on mainnet.
- NEAR Intents agents that run leagues and pay prizes in any token.
- A creator economy: players design skins and earn when others use them.
- Mainnet $SABOTEUR and entry-fee games only after legal review.

> $SABOTEUR is a testnet token you earn by playing. You can burn it for in-game items like Play Pass, but it has no cash value: it can't be bought, sold, transferred or cashed out, and nothing is promised about its future.

## Code map (where to look)

The game files are big (one React file for the game, one server file), so here is where each hackathon feature lives. Search for the function name inside the file.

| Feature | Where | Look for |
|---|---|---|
| **Weekly Rewards Agent** (NEAR Intents, mainnet) | [`economy/weeklyAgent.js`](https://github.com/Om7eth/near-saboteur-backend/blob/main/economy/weeklyAgent.js) | `leaders` (top 3, staff excluded), `tick` (30-min batch), `sendWinner` (idempotent payout) |
| **$SABOTEUR v2 token contract** | [`token-v2/src/lib.rs`](https://github.com/Om7eth/near-saboteur-backend/blob/main/token-v2/src/lib.rs) | `Rules::launch`, `reward_match`, `catch_ritual`, `buy_play_pass`, `propose_rules` (7-day timelock), 20 tests at the bottom; 60-day supply simulation in [`token-v2/simulate.py`](https://github.com/Om7eth/near-saboteur-backend/blob/main/token-v2/simulate.py) |
| Game ↔ token (reports only, contract decides) | [`economy/saboteurToken.js`](https://github.com/Om7eth/near-saboteur-backend/blob/main/economy/saboteurToken.js), [`economy/match.js`](https://github.com/Om7eth/near-saboteur-backend/blob/main/economy/match.js) | `reportMatch`, `catchRitual`, `buyPlayPass`, `catchBurn`, `payPendingV2`, `wallOfShame` |
| Catch = burn trigger (saboteur voted out) | [`index.js`](https://github.com/Om7eth/near-saboteur-backend/blob/main/index.js) | `finalizeVoting` → `economy.catchBurn` |
| Public token page | [`token/index.html`](https://github.com/Om7eth/near-saboteur-frontend/blob/main/token/index.html) | live stats, Wall of Shame, "Try to cheat" proofs |
| **Pool escrow contract v4** | [`contract/src/lib.rs`](https://github.com/Om7eth/near-saboteur-backend/blob/main/contract/src/lib.rs) | `create_pool`, `distribute_shares` (ties), `claim_unclaimed`, 28 tests |
| **AI bots** (NEAR AI) | [`bots/meetingBrain.js`](https://github.com/Om7eth/near-saboteur-backend/blob/main/bots/meetingBrain.js), [`bots/brain.js`](https://github.com/Om7eth/near-saboteur-backend/blob/main/bots/brain.js) | `evidenceLines` (detective rules), `skipLoses` (endgame), `think`, `perceive` (what a bot sees); tests in [`tests/bots.test.js`](https://github.com/Om7eth/near-saboteur-backend/blob/main/tests/bots.test.js) |
| Game UI | [`src/game.jsx`](https://github.com/Om7eth/near-saboteur-frontend/blob/main/src/game.jsx), [`src/homeConsole.jsx`](https://github.com/Om7eth/near-saboteur-frontend/blob/main/src/homeConsole.jsx) | `RanksScreen` (prize + DEV tag), `SabBurnBox` (Play Pass burn), `SabLivePanel` |

## Stack

- **Frontend:** React + Vite. NEAR Wallet Selector and NEAR Connect for wallets.
- **Backend:** Node.js, Express, Socket.io (real-time game) and MongoDB.
- **Contract:** Rust, near-sdk 5.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173 (expects the backend on :3000)
npm run build      # production build (main game + /how-to-play + /token)
```

Set `VITE_BACKEND_URL` to point at another backend. To run the backend and the tests (bot rules, both contracts), see the [backend README](https://github.com/Om7eth/near-saboteur-backend#run-locally-and-test).

## Hackathon diff (what to judge)

This game existed before the hackathon. Only the work inside the window (19 Oct – 14 Nov 2026) should be judged. The baseline below is the last commit before the window (also tagged `pre-hackathon`); everything after it on `main` was built during the hackathon.

| Repo | Baseline (6 Oct 2026) | Everything built during the hackathon |
|---|---|---|
| Frontend (this repo) | [`ec86165`](https://github.com/Om7eth/near-saboteur-frontend/commit/ec86165) | [compare `ec86165...main`](https://github.com/Om7eth/near-saboteur-frontend/compare/ec86165...main) |
| Backend + contract | [`25b6b99`](https://github.com/Om7eth/near-saboteur-backend/commit/25b6b99) | [compare `25b6b99...main`](https://github.com/Om7eth/near-saboteur-backend/compare/25b6b99...main) |

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
- **$SABOTEUR v2 "catch = burn":** a new NEP-141 contract (20 unit tests) where the rules live on-chain. It has match rewards by real players, an on-chain burn when the saboteur is caught, Play Pass by burning 15,000, a weekly budget that grows with burns, and a 7-day public timelock on rule changes. Every v1 balance was migrated, and a live panel shows it all in the game.
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
