import OpenAI from 'openai'
import { deductEnergy, syncEnergy, initEconomy, FEES, MAX_ENERGY } from '../lib/economy.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `*يرجى إدخال نص*\n\n*مثال: ${usedPrefix + command} كيف حالك؟*`

  const user = global.db.data.users[m.sender]
  if (user) {
    initEconomy(user)
    syncEnergy(user)
    if (user.energy < FEES.ai) {
      throw `╭────『 ⚡ طاقة ناضبة 』────\n│\n│ ❌ الذكاء الاصطناعي يحتاج *${FEES.ai} ⚡*\n│ طاقتك: *${user.energy}/${MAX_ENERGY}*\n│\n│ 💡 استخدم *${usedPrefix}يومي* أو انتظر الشحن التلقائي\n│\n╰──────────────────`.trim()
    }
    deductEnergy(user, FEES.ai)
  }

  await conn.sendMessage(m.chat, { react: { text: '🤖', key: m.key } })

  try {
    const client = new OpenAI()
    const response = await client.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        { role: 'system', content: 'أنت مساعد ذكي يُدعى زيريف (Zeref). أنت ودود ومفيد وتتحدث باللغة العربية. كن مختصراً وواضحاً.' },
        { role: 'user', content: text }
      ]
    })

    let result = response.choices[0].message.content
    const energyLeft = user?.energy ?? MAX_ENERGY
    await m.reply(result + `\n\n⚡ *طاقتك المتبقية:* ${energyLeft}/${MAX_ENERGY}`)

  } catch (e) {
    console.error(e)
    throw '*❌ حدث خطأ أثناء معالجة طلبك. يرجى المحاولة لاحقاً.*'
  }
}

handler.help    = ['ai', 'بوت']
handler.tags    = ['tools']
handler.command = /^(ai|بوت|زيريف)$/i
export default handler
