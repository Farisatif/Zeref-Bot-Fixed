const choices = ['حجر', 'ورقة', 'مقص']

function pick(list) {
  return list[Math.floor(Math.random() * list.length)]
}

let handler = async (m, { args, command, usedPrefix }) => {
  if (/^(نرد|dice)$/i.test(command)) {
    const a = Math.floor(Math.random() * 6) + 1
    const b = Math.floor(Math.random() * 6) + 1
    return m.reply(`🎲 رميت النرد:\nالأول: *${a}*\nالثاني: *${b}*\nالمجموع: *${a + b}*`)
  }

  if (/^(عملة|coin)$/i.test(command)) {
    return m.reply(`🪙 النتيجة: *${Math.random() < 0.5 ? 'ملك' : 'كتابة'}*`)
  }

  if (/^(اختار|اختر|choose)$/i.test(command)) {
    const text = args.join(' ')
    const options = text.split(/[،,|]/).map(x => x.trim()).filter(Boolean)
    if (options.length < 2) return m.reply(`اكتب خيارين أو أكثر مفصولة بفاصلة:\n${usedPrefix}${command} قهوة, شاي, عصير`)
    return m.reply(`🎯 اختياري هو: *${pick(options)}*`)
  }

  const userChoice = (args[0] || '').replace(/[إأآ]/g, 'ا')
  if (!userChoice || !choices.includes(userChoice)) {
    return m.reply(`العب حجر ورقة مقص هكذا:\n${usedPrefix}${command} حجر\n${usedPrefix}${command} ورقة\n${usedPrefix}${command} مقص`)
  }

  const bot = pick(choices)
  const win =
    (userChoice === 'حجر' && bot === 'مقص') ||
    (userChoice === 'ورقة' && bot === 'حجر') ||
    (userChoice === 'مقص' && bot === 'ورقة')
  const result = userChoice === bot ? 'تعادل' : win ? 'فزت أنت' : 'فاز البوت'
  return m.reply(`✊✋✌️ حجر ورقة مقص\n\nأنت: *${userChoice}*\nالبوت: *${bot}*\nالنتيجة: *${result}*`)
}

handler.help = ['نرد', 'عملة', 'اختار', 'حجر']
handler.tags = ['game', 'fun']
handler.command = /^(نرد|dice|عملة|coin|اختار|اختر|choose|حجر|حجره|rps)$/i
export default handler