const FILES = 'abcdefgh'
const START = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  ['.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.'],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
]
const ICON = {
  K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
  k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟', '.': '·'
}

function cloneBoard() {
  return START.map(row => [...row])
}

function pos(square) {
  if (!/^[a-h][1-8]$/i.test(square)) return null
  const file = FILES.indexOf(square[0].toLowerCase())
  const rank = 8 - Number(square[1])
  return { r: rank, c: file }
}

function isWhite(piece) {
  return piece && piece !== '.' && piece === piece.toUpperCase()
}

function pathClear(board, from, to) {
  const dr = Math.sign(to.r - from.r)
  const dc = Math.sign(to.c - from.c)
  let r = from.r + dr
  let c = from.c + dc
  while (r !== to.r || c !== to.c) {
    if (board[r][c] !== '.') return false
    r += dr
    c += dc
  }
  return true
}

function legalMove(game, from, to) {
  const board = game.board
  const piece = board[from.r][from.c]
  const target = board[to.r][to.c]
  if (piece === '.') return 'لا توجد قطعة في هذا المربع.'
  const whiteTurn = game.turn === 'w'
  if (isWhite(piece) !== whiteTurn) return 'هذه ليست قطعتك الآن.'
  if (target !== '.' && isWhite(target) === whiteTurn) return 'لا يمكنك أكل قطعة من نفس اللون.'

  const p = piece.toLowerCase()
  const dr = to.r - from.r
  const dc = to.c - from.c
  const adr = Math.abs(dr)
  const adc = Math.abs(dc)

  if (p === 'p') {
    const dir = isWhite(piece) ? -1 : 1
    const startRow = isWhite(piece) ? 6 : 1
    if (dc === 0 && target === '.' && dr === dir) return true
    if (dc === 0 && target === '.' && from.r === startRow && dr === dir * 2 && board[from.r + dir][from.c] === '.') return true
    if (adc === 1 && dr === dir && target !== '.') return true
    return 'حركة البيدق غير صحيحة.'
  }
  if (p === 'n') return (adr === 2 && adc === 1) || (adr === 1 && adc === 2) || 'حركة الحصان غير صحيحة.'
  if (p === 'b') return (adr === adc && pathClear(board, from, to)) || 'حركة الفيل غير صحيحة أو الطريق مغلق.'
  if (p === 'r') return ((dr === 0 || dc === 0) && pathClear(board, from, to)) || 'حركة القلعة غير صحيحة أو الطريق مغلق.'
  if (p === 'q') return (((adr === adc) || dr === 0 || dc === 0) && pathClear(board, from, to)) || 'حركة الوزير غير صحيحة أو الطريق مغلق.'
  if (p === 'k') return (adr <= 1 && adc <= 1) || 'حركة الملك غير صحيحة.'
  return 'قطعة غير معروفة.'
}

function render(game) {
  const rows = game.board.map((row, i) => `${8 - i}  ${row.map(p => ICON[p]).join(' ')}`).join('\n')
  const white = game.white ? `@${game.white.split('@')[0]}` : 'بانتظار لاعب'
  const black = game.black ? `@${game.black.split('@')[0]}` : 'بانتظار لاعب'
  const turn = game.turn === 'w' ? white : black
  return `♟️ *شطرنج SHADOW*

الأبيض: ${white}
الأسود: ${black}

\`\`\`
   a b c d e f g h
${rows}
\`\`\`

الدور: ${turn}
الحركة: *.شطرنج e2 e4*
الانسحاب: *.شطرنج استسلام*`
}

function findGame(conn, chat, sender) {
  conn.chess = conn.chess || {}
  return Object.values(conn.chess).find(game => game.chat === chat && [game.white, game.black].includes(sender))
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
  conn.chess = conn.chess || {}
  const sub = (args[0] || '').toLowerCase()
  let game = findGame(conn, m.chat, m.sender)

  if (/^(انهاء|حذف|stop|end)$/i.test(sub) && game) {
    delete conn.chess[game.id]
    return m.reply('♟️ تم إنهاء مباراة الشطرنج.')
  }

  if (/^(استسلام|surrender)$/i.test(sub) && game) {
    const winner = game.white === m.sender ? game.black : game.white
    delete conn.chess[game.id]
    return conn.reply(m.chat, `🏳️ استسلم @${m.sender.split('@')[0]}\n🏆 الفائز: @${winner.split('@')[0]}`, m, { mentions: [m.sender, winner] })
  }

  if (!game) {
    const waiting = Object.values(conn.chess).find(item => item.chat === m.chat && !item.black)
    if (waiting && waiting.white !== m.sender) {
      waiting.black = m.sender
      return conn.reply(m.chat, `${render(waiting)}\n\nبدأت المباراة. الأبيض يبدأ.`, m, { mentions: [waiting.white, waiting.black] })
    }

    const id = `chess-${Date.now()}`
    conn.chess[id] = {
      id,
      chat: m.chat,
      white: m.sender,
      black: null,
      turn: 'w',
      board: cloneBoard()
    }
    return m.reply(`♟️ تم إنشاء مباراة شطرنج.\nلينضم لاعب آخر يكتب:\n${usedPrefix}${command}`)
  }

  if (!game.black) return m.reply('⏳ المباراة بانتظار لاعب ثاني.')
  const expected = game.turn === 'w' ? game.white : game.black
  if (m.sender !== expected) return m.reply('ليس دورك الآن.')

  const from = pos(args[0] || '')
  const to = pos(args[1] || '')
  if (!from || !to) return m.reply(`اكتب الحركة بهذا الشكل:\n${usedPrefix}${command} e2 e4`)

  const legal = legalMove(game, from, to)
  if (legal !== true) return m.reply(`❌ ${legal}`)

  const piece = game.board[from.r][from.c]
  const captured = game.board[to.r][to.c]
  game.board[to.r][to.c] = piece
  game.board[from.r][from.c] = '.'
  if (piece === 'P' && to.r === 0) game.board[to.r][to.c] = 'Q'
  if (piece === 'p' && to.r === 7) game.board[to.r][to.c] = 'q'

  if (captured.toLowerCase() === 'k') {
    const winner = m.sender
    delete conn.chess[game.id]
    return conn.reply(m.chat, `${render(game)}\n\n🏆 كش ملك! الفائز @${winner.split('@')[0]}`, m, { mentions: [game.white, game.black] })
  }

  game.turn = game.turn === 'w' ? 'b' : 'w'
  return conn.reply(m.chat, render(game), m, { mentions: [game.white, game.black] })
}

handler.help = ['شطرنج', 'chess']
handler.tags = ['game']
handler.command = /^(شطرنج|chess)$/i
export default handler