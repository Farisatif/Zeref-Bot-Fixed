# Zeref - SHADOW WhatsApp Bot

## Overview
Arabic WhatsApp bot built with Node.js and Baileys. The bot is now focused on useful group/community features: study support for school and university students, games, economy, group administration, global auto-translation, security, profile/status tools, and preserved automatic chat responses.

## Owner / Config
- **Owner number:** 967778088098
- **GitHub:** https://github.com/farisatif
- **Bot name:** 彡ℤ𝕖𝕣𝕖𝕗 / SHADOW Bot
- **Prefix:** `.` and other prefixes from `global.prefix`

## Tech Stack
- **Runtime:** Node.js ES Modules
- **WhatsApp:** `@whiskeysockets/baileys`
- **Database:** Lowdb JSON in `database.json`, auto-saved every 30 seconds and on shutdown
- **Server:** Express on port 3000

## Architecture
- `index.js` starts the app and Express server.
- `main.js` initializes WhatsApp, loads database, binds message/group events, and loads plugins.
- `handler.js` routes commands, applies permissions, XP/money, and bot status gating.
- `plugins/menu.js` contains the numbered menu sections.
- `plugins/study.js` contains student learning commands.
- `plugins/study-games.js` contains lightweight educational games.
- `plugins/شات.js` preserves automatic chat responses.

## Current Focus
The bot is being trimmed toward a useful student/community assistant. Unrelated entertainment/media commands are excluded from plugin loading in `main.js`, while games and auto-response remain active.

## Menu Sections
1. 🎓 التعلم والدراسة — plans, summaries, flashcards, quizzes, GPA, study rules, Pomodoro, sources, daily schedule
2. 📖 القرآن الكريم — adhkar and Quran commands
3. 🤖 الذكاء الاصطناعي — AI chat/image quality where configured
4. 🎮 الألعاب — quiz, math, chess, tic-tac-toe, dice, coin, RPS, educational games
5. 🛠️ أدوات نافعة — global translator, reminders, alarm, QR
6. 💰 الاقتصاد — bank, deposit, withdraw, transfer, work, daily reward, energy
7. 👤 الحساب والمعلومات — profile, bot status, time, report, owner
8. 👥 إدارة القروب — name/description, kick/add, promote/demote, lock/open, mentions, anti-link
9. 👑 أوامر المالك — bot control and moderation
10. 📜 كل الأقسام — combined section view

## Study Commands
- `.تعلم` — shows the study section help
- `.خطة رياضيات 7` — study plan by subject and days
- `.تلخيص <نص>` — quick local summary
- `.بطاقات <نص>` — flashcards from notes
- `.اختبرني فيزياء` — quick self-test question
- `.معدلي 90 85 77` — approximate average/grade
- `.قاعدة` — useful study rule
- `.بومودورو` — focus method
- `.مصادر` — recommended study resources
- `.جدول` — short daily study schedule

## Educational Games
- `.كلمة` / `.رتب` — arrange a study-related word
- `.سرعة` / `.حساب_سريع` — quick arithmetic
- `.ذاكرة` — memory number challenge
- `.حل <الإجابة>` — answer educational games

## Important Fixes
- Menu supports English, Arabic, and Persian numerals.
- Bot admin detection supports newer WhatsApp JID/LID participant formats.
- Promote/demote group update parsing avoids `@undefined` and crash cases.
- Profile command safely handles missing names.
- Legacy `.ترجم` plugins are disabled; global translator remains active.
- Duplicate bank commands are removed from active use; `plugins/البنك.js` is the main bank.
