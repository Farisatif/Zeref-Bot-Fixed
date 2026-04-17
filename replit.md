# Zeref - SHADOW WhatsApp Bot

## Overview
A comprehensive, multi-functional WhatsApp bot built with Node.js. Features AI responses (ChatGPT), entertainment (anime, games, media), utility tools (translation, reminders, QR codes), an economy/RPG system, and owner/admin controls. Commands are fully in Arabic.

## Owner / Config
- **Owner number:** 967778088098 (single owner, set in `config.js`)
- **GitHub:** https://github.com/farisatif
- **Bot name:** 彡ℤ𝕖𝕣𝕖𝕗 / SHADOW Bot
- **Prefix:** `.` (and others defined in `global.prefix` regex)

## Tech Stack
- **Runtime:** Node.js (ES Modules)
- **WhatsApp:** `@whiskeysockets/baileys` for WhatsApp Web API
- **Database:** Lowdb (JSON-based local storage via `database.json`)
- **Server:** Express on port 3000 (keeps bot alive on hosting platforms)
- **Key Libraries:** axios, fluent-ffmpeg, jimp, openai, cfonts, chalk, pino

## Architecture
- **`index.js`** - Entry point; manages cluster, checks internet, starts Express server on port 3000
- **`main.js`** - Core engine; initializes WhatsApp connection (Baileys), loads database, imports all plugins in parallel
- **`handler.js`** - Central message processor; routes commands to plugins, manages XP/money
- **`config.js`** - Global configuration: owner numbers, bot name, images, GitHub link, settings
- **`plugins/`** - 91 modular plugin files for each feature (flat folder, no index subfolder)
- **`lib/`** - Shared utility functions (simple.js, print.js, store.js, levelling.js)
- **`Zeref/`** - WhatsApp session credentials (creds.json)

## Configuration
- Owner and GitHub set in `config.js` using `global.owner`, `global.nomorown`, `global.md`
- Phone number for pairing comes from `PHONE_NUMBER` environment variable
- Bot uses pairing code authentication (no QR scan needed)

## Interactive Menus
WhatsApp's native buttons and list messages are unreliable for unofficial clients, so the bot uses **poll messages** plus numeric fallback as interactive navigation:
- `plugins/menu.js` — sends stats, numbered menu sections, a full-command option, and a poll with all section options
- `plugins/menu-response.js` — accepts numeric menu replies such as `1` through `9`
- `main.js` poll vote handler (`messages.update` event) — detects the selected poll option and replies with that section's commands

## Running
- Workflow: `node index.js` on port 3000
- Bot auto-reconnects on disconnect using `process.exit()` triggers

## Key Bugs Fixed
- Removed `if (m.isGroup) return` from handler.js:34 — was blocking ALL group message responses
- Fixed `lib/print.js` JID parsing for `@lid` format (newer WhatsApp device IDs) — fixed "undefined" / "random numbers" in console display
- Fixed `plugins/الضعوم.js` — was crashing with undefined `buttonMessage` reference
- Fixed `plugins/بلاغ.js` — removed duplicate wrong-JID conn.reply
- Parallelized plugin loading in `main.js` with `Promise.all` for faster startup
- Fixed user stats display (was showing `|undefined|undefined` for new users)
- Fixed direct bank commands (`.ايداع 500`, `.سحب 500`, `.تحويل @شخص 500`) so they no longer fall through to bank stats.
- Replaced old menu buttons with poll/options + number fallback to avoid missing button/list rendering.
- Added explicit quiz answer command format: `.جواب <رمز السؤال> <الإجابة>`.
- Added chess (`.شطرنج`) and quick entertainment games (`.نرد`, `.عملة`, `.اختار`, `.حجر`).

## Economy System (lib/economy.js)
Full economy with rules, fees, and progression:

### Currencies
- **💰 `money`** — main wallet coins (start: 100)
- **🏦 `bank`** — bank savings, safe from gambling (start: 0)
- **💎 `diamond`** — rare premium currency (from daily 10% chance, quiz 5% chance)
- **⭐ `exp`** — XP for leveling up (from work, quiz, daily)

### Energy System (⚡)
- Max: 100 energy per user
- Auto-regens: +1 energy every 3 minutes (full tank in 5 hours)
- **Costs per command:**
  - 🤖 AI (ChatGPT): 5 ⚡
  - 🖼️ HD image enhance: 10 ⚡
  - 🌍 Translation: 2 ⚡
  - 🛠️ Work: 10 ⚡
  - 🎮 Games/quiz: FREE
  - 📖 Basic commands: FREE

### Commands
| Command | Function |
|---------|----------|
| `.بنك` | Full stats: wallet, bank, energy, cooldowns |
| `.ايداع <مبلغ>` | Deposit coins to bank |
| `.سحب <مبلغ>` | Withdraw coins from bank |
| `.تحويل @شخص <مبلغ>` | Transfer (5% fee) |
| `.عمل` | Work for 100-350 coins (-10 energy, 30 min cooldown) |
| `.يومي` | Daily reward: 300-700 coins + 50 energy + 200 XP |
| `.طاقة` | Energy status + regen timer + fee list |
| `.سوال` | Quiz: correct answer = 150-400 coins + 50 XP |
| `.تحدي [1-4]` | Math challenge (4 difficulty levels): 80-700 coins |
| `.رهان <مبلغ>` | Slot machine (3x win, 1.1x partial, lose) |

### Roles by Level
🌱 مبتدئ (0) → ⚔️ محارب (5) → 🏅 متقدم (10) → 🥇 محترف (20) → 🌟 بطل (30) → 👑 أسطورة (50)

## Menu Sections
1. 📖 القرآن الكريم — أذكار، آيات، قرآن
2. 🤖 الذكاء الاصطناعي — AI/ChatGPT (يتطلب طاقة)
3. 🎮 الألعاب — سؤال بجائزة، جواب، تحدي رياضيات، شطرنج، نرد، عملة، اختار، حجر ورقة مقص، رهان، اكس او
4. 😄 ترفيه — ذكاء، جمال، حظ، نرد، عملة، اختار، حجر ورقة مقص، اقتباسات، حكم
5. 🛠️ الأدوات — ترجم، تذكير، منبه، QR، اختفاء (بعضها يتطلب طاقة)
6. 💰 الاقتصاد — بنك، ايداع، سحب، تحويل، عمل، يومي، طاقة
7. 📊 المعلومات — حالة البوت، توقيت، بلاغ، المالك
8. 👑 أوامر المالك — صلاحيات كاملة
9. 📜 كل الأوامر — يجمع جميع الأقسام في رسالة واحدة
