export function before(m) {
  global.db.data.users[m.sender] ||= {}
  let user = global.db.data.users[m.sender]

  if (user.afk && user.afk > -1) {
      let time = clockString(new Date - user.afk)

      m.reply(`
*[❗𝐈𝐍𝐅𝐎❗] رجع من الاختفاء (AFK)*
${user.afkReason ? '*—◉ السبب:* ' + user.afkReason : ''}

*—◉ مدة الاختفاء:* ${time}
`.trim())

      user.afk = -1
      user.afkReason = ''
  }

  let jids = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]

  for (let jid of jids) {
      let target = global.db.data.users[jid]
      if (!target) continue

      if (!target.afk || target.afk < 0) continue

      let time = clockString(new Date - target.afk)

      m.reply(`*[❗] المستخدم غير نشط (AFK)*

*—◉ السبب:* ${target.afkReason || 'لم يحدد سبب'}
*—◉ المدة:* ${time}
`.trim())
  }

  return true
}

function clockString(ms) {
let h = Math.floor(ms / 3600000)
let m = Math.floor(ms / 60000) % 60
let s = Math.floor(ms / 1000) % 60
return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}