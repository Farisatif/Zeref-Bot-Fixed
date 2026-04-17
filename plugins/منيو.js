import { xpRange } from '../lib/levelling.js'
import { syncEnergy, initEconomy } from '../lib/economy.js'
import fetch from 'node-fetch'

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

// ── Section command lists ──────────────────────────────────────────────────
export const menuSections = {
  '📖 القرآن الكريم': (p) => `
*📖 ─── القرآن الكريم ───*

  ${p}اذكار الصباح  ⟵ أذكار الصباح اليومية
  ${p}اذكار المساء  ⟵ أذكار المساء اليومية
  ${p}ايه           ⟵ آية الكرسي
  ${p}قران          ⟵ آية عشوائية من القرآن`.trim(),

  '🤖 الذكاء الاصطناعي': (p) => `
*🤖 ─── الذكاء الاصطناعي ───*

  ${p}ai / ${p}بوت  ⟵ التحدث مع ChatGPT
  ${p}جوده           ⟵ رفع جودة الصورة بالـ AI
  ${p}شخصية          ⟵ تحليل شخصية أنيمي`.trim(),

  '🎮 الألعاب': (p) => `
*🎮 ─── الألعاب ───*

  ${p}سوال       ⟵ سؤال عشوائي (جائزة 💰)
  ${p}تحدي       ⟵ تحدي رياضيات (جائزة 💰)
  ${p}رهان       ⟵ لعبة القمار (راهن بعملاتك 🎰)
  ${p}اكس        ⟵ إكس أو (Tic Tac Toe)
  ${p}لو         ⟵ لعبة لو خيروك
  ${p}فزوره      ⟵ فزورة عشوائية
  ${p}علم        ⟵ خمّن علم الدولة
  ${p}تخمين      ⟵ تخمين الشخصية`.trim(),

  '😄 ترفيه': (p) => `
*😄 ─── ترفيه وطرائف ───*

  ${p}ذكاء       ⟵ نسبة ذكائك عشوائياً
  ${p}جمال       ⟵ نسبة جمالك عشوائياً
  ${p}حظ         ⟵ حظك اليوم
  ${p}قلب        ⟵ رسالة قلب
  ${p}صراحه      ⟵ سؤال بصراحة
  ${p}نصيحه      ⟵ نصيحة عشوائية
  ${p}مقولات     ⟵ اقتباسات أنيمي
  ${p}زخرفه      ⟵ زخرفة نص
  ${p}احرف       ⟵ تحويل الأحرف
  ${p}قط         ⟵ صور قطط عشوائية
  ${p}كلب        ⟵ صور كلاب عشوائية
  ${p}انمي       ⟵ بحث عن أنيمي`.trim(),

  '🛠️ الأدوات': (p) => `
*🛠️ ─── الأدوات ───*

  ${p}ترجم        ⟵ ترجمة أي نص لأي لغة
  ${p}ذكرني       ⟵ ضبط تذكير بمهمة
  ${p}منبه        ⟵ ضبط منبّه بوقت محدد
  ${p}رمزي        ⟵ عرض رمز QR الخاص بك
  ${p}اختفاء      ⟵ وضع الاختفاء / AFK
  ${p}احرف        ⟵ تحويل وتزخرف الأحرف
  ${p}زخرفه       ⟵ زخرفة أي نص`.trim(),

  '💰 الاقتصاد': (p) => `
*💰 ─── الاقتصاد ───*

  ${p}البنك        ⟵ رصيدك ومحفظتك وطاقتك
  ${p}ايداع        ⟵ إيداع عملات في البنك
  ${p}سحب          ⟵ سحب عملات من البنك
  ${p}تحويل        ⟵ تحويل لشخص آخر (5٪ رسوم)
  ${p}عمل          ⟵ اعمل واكسب عملات (-10 طاقة)
  ${p}يومي         ⟵ مكافأة يومية مجانية
  ${p}طاقة         ⟵ حالة طاقتك ومعدل الشحن
  ${p}لفل          ⟵ ارفع مستواك`.trim(),

  '📊 المعلومات': (p) => `
*📊 ─── المعلومات ───*

  ${p}الضعوم     ⟵ حالة البوت ووقت التشغيل
  ${p}التوقيت    ⟵ التوقيت الحالي
  ${p}رابطي      ⟵ رابط واتساب الخاص بك
  ${p}حكمه       ⟵ حكمة عشوائية
  ${p}حديث       ⟵ حديث نبوي شريف
  ${p}بلاغ       ⟵ إرسال بلاغ للمالك
  ${p}المالك     ⟵ معلومات مالك البوت`.trim(),

  '👑 أوامر المالك': (p) => `
*👑 ─── أوامر المالك ───*

  ${p}addprem      ⟵ إضافة مستخدم مميز
  ${p}المميزين     ⟵ قائمة المميزين
  ${p}بان          ⟵ حظر مستخدم
  ${p}فك-الحظر     ⟵ رفع الحظر عن مستخدم
  ${p}البلوكات     ⟵ قائمة المحظورين
  ${p}تشغيل        ⟵ تشغيل البوت
  ${p}ايقاف        ⟵ إيقاف البوت
  ${p}إعادة        ⟵ إعادة تشغيل البوت`.trim()
}

// ── Handler ────────────────────────────────────────────────────────────────
let handler = async (m, { conn, usedPrefix }) => {
  await conn.sendMessage(m.chat, { react: { text: '📋', key: m.key } })

  const user = global.db.data.users[m.sender] || {}
  initEconomy(user)
  syncEnergy(user)
  const { limit = 0, level = 1, role = 'مستخدم', diamond = 0 } = user
  const { max } = xpRange(level, global.multiplier)
  const uptime = clockString(process.uptime() * 1000)
  const name = m.pushName || 'مستخدم'

  const money  = user.money  || 0
  const bank   = user.bank   || 0
  const energy = typeof user.energy === 'number' ? user.energy : 100
  const epct   = Math.floor((energy / 100) * 10)
  const ebar   = '█'.repeat(epct) + '░'.repeat(10 - epct)

  const stats = `
╔══〘 🌟 *SHADOW - Bot* 🌟 〙══╗
║
║  👤 *${name}*
║  🏆 المستوى: *${level}* │ ${role}
║  ⭐ XP: *${user.exp || 0} / ${max}*
║
║  ─── الأموال ───
║  💰 محفظة: *${money.toLocaleString('en')} 🪙*
║  🏦 بنك:   *${bank.toLocaleString('en')} 🪙*
║  💎 ماس:   *${diamond || 0}*
║
║  ─── الطاقة ───
║  ${ebar} ${energy}/100 ⚡
║
║  ⏱️ وقت التشغيل: *${uptime}*
║
╚══〘 👇 اختر القسم من التصويت 〙══╝`.trim()

  try {
    let thumb = global.imagen4
    try {
      const res = await fetch('https://telegra.ph/file/d7ae77d1178f9de50825c.jpg')
      thumb = Buffer.from(await res.arrayBuffer())
    } catch { /* use local fallback */ }

    // 1️⃣ Header image with stats
    await conn.sendMessage(m.chat, {
      image: global.imagen4,
      caption: stats,
      mentions: [m.sender],
      contextInfo: {
        externalAdReply: {
          showAdAttribution: true,
          mediaType: 'IMAGE',
          title: '『 𝐒𝐇𝐀𝐃𝐎𝐖 - Bot 』',
          body: `${name} │ المستوى ${level}`,
          thumbnail: thumb,
          sourceUrl: global.md
        }
      }
    }, { quoted: m })

    // 2️⃣ Poll with section options — user taps to get that section's commands
    const sectionNames = Object.keys(menuSections)
    const pollMsg = await conn.sendPoll(
      m.chat,
      '📋 اختر قسماً لعرض أوامره',
      sectionNames.map(s => [s]),
      { quoted: m }
    )

    // Store poll so vote-handler knows which prefix to use
    if (!global.menuPolls) global.menuPolls = new Map()
    const pollId = pollMsg?.key?.id
    if (pollId) {
      global.menuPolls.set(pollId, {
        chat: m.chat,
        sender: m.sender,
        prefix: usedPrefix,
        expires: Date.now() + 5 * 60 * 1000  // 5 minutes TTL
      })
    }
  } catch (e) {
    console.error('[MENU ERROR]', e)
    // Fallback: send plain text menu
    const allText = Object.values(menuSections).map(fn => fn(usedPrefix)).join('\n\n─────────────────\n\n')
    await conn.reply(m.chat, stats + '\n\n' + allText, m)
  }
}

handler.command = /^(اوامر|أوامر|المهام|مهام|menu|قائمة)$/i
handler.exp = 0
handler.fail = null
export default handler
