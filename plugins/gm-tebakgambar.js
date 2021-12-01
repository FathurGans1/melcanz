let fetch = require('node-fetch')
let timeout = 120000
let poin = 500

let handler = async (m, { conn, usedPrefix }) => {
  conn.tebakgambar = conn.tebakgambar ? conn.tebakgambar : {}
  let id = m.chat
  if (id in conn.tebakgambar) {
    conn.reply(m.chat, 'belum dijawab!', conn.tebakgambar[id][0])
    throw false
  }
  let res = await fetch(API('amel', '/game/tebakgambar', {}, 'apikey'))
  if (!res.ok) throw eror
  let json = await res.json()
  if (json.status != 200) throw json
  let caption = `
    ${json.result.deskripsi}
Waktu *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}hint untuk bantuan
`.trim()
  conn.tebakgambar[id] = [
    await conn.sendButtonImg(m.chat, json.result.img, caption, wm, 'Bantuan', '.hint', m),
    json, poin,
    setTimeout(async () => {
      if (conn.tebakgambar[id]) await conn.sendButton(m.chat, `Waktu habis!\nJawabannya adalah *${json.result.jawaban}*`, wm, 'Tebak Gambar', '.tebakgambar', conn.tebakgambar[id][0])
      delete conn.tebakgambar[id]
    }, timeout)
  ]
}
handler.help = ['tebakgambar']
handler.tags = ['game']
handler.command = /^tebakgambar$/i

handler.game = true

module.exports = handler