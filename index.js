const {
  WAConnection,
  MessageType,
  MessageOptions,
  Presence,
  Mimetype,
  GroupSettingChange
} = require('@adiwajshing/baileys')
const fs = require('fs')
const qrcode = require("qrcode-terminal")
const { start, success, getBuffer, h2k, generateMessageID, getGroupAdmins, getRandom } = require('./lib/functions')
const { color, bgcolor } = require('./lib/color')
const { fetchJson, getBase64, kyun, createExif } = require('./lib/fetcher')
const axios = require('axios')
const moment = require('moment-timezone')
const fetch = require("node-fetch")
const lolcatjs = require('lolcatjs')
const figlet = require('figlet')
let { spawn } = require('child_process')
let path = require('path')
const CFonts = require('cfonts')

require('./Prasz.js')
nocache('./Prasz.js', module => console.log(`${module} is now updated!`))


let blocked = JSON.parse(fs.readFileSync('./database/json/blocked.json'))
const _welkom = JSON.parse(fs.readFileSync('./database/json/welkom.json'))
blocked = []
baterai = {
  persen: "sedang mendeteksi mohon tunggu",
  cas: "sedang mendeteksi mohon tunggu",
  hemat: "sedang mendeteksi mohon tunggu"
}

lolcatjs.options.seed = Math.round(Math.random() * 1000)
lolcatjs.options.colors = true

CFonts.say('/system/data/data/com.teremux/files:\n[ROOT] STARTING BOT...\nBy: Prassz', {
  font: 'console',
  align: 'left',
  gradient: ['magenta', 'red']
})

CFonts.say('Base\nSelf Zero', {
  font: 'simple',
  align: 'center',
  color: 'blue'
})
CFonts.say(`WELCOME USER\nBy: Prassz`, {
  font: 'console',
  align: 'center',
  gradient: ['red', 'magenta']
})
const starts = async (pras = new WAConnection()) => {
  pras.version = [2, 2119, 6]
  pras.browserDescription = ['PraszBot', 'Safari', '3.0']
  pras.logger.level = 'warn'
  pras.on('qr', qr => {
    qrcode.generate(qr, { small: true })
    lolcatjs.fromString('[SYSTEM] SCAN THIS QR CODE...')
  })

  fs.existsSync('./Prasz.json') && pras.loadAuthInfo('./Prasz.json')
  pras.on('connecting', () => {
    start('2', 'Connecting...')
  })
  pras.on('open', () => {
    success('2', 'Connected:)')
  })
  await pras.connect({ timeoutMs: 30 * 1000 })
  fs.writeFileSync('./Prasz.json', JSON.stringify(pras.base64EncodedAuthInfo(), null, '\t'))


  const sendButImage = async (from, context, fotext, img, but) => {
    gam = img
    jadinya = await pras.prepareMessage(from, gam, MessageType.image)
    buttonMessagesI = {
      imageMessage: jadinya.message.imageMessage,
      contentText: context,
      footerText: fotext,
      buttons: but,
      headerType: 4
    }
    pras.sendMessage(from, buttonMessagesI, MessageType.buttonsMessage)
  }

  function tanggal() {
    myMonths = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    myDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum’at', 'Sabtu']
    var tgl = new Date()
    var day = tgl.getDate()
    bulan = tgl.getMonth()
    var thisDay = tgl.getDay(),
      thisDay = myDays[thisDay]
    var yy = tgl.getYear()
    var year = (yy < 1000) ? yy + 1900 : yy
    const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
    let d = new Date
    let locale = 'id'
    let gmt = new Date(0).getTime() - new Date('1 January 1970').getTime()
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(((d * 1) + gmt) / 84600000) % 5]
    return `${thisDay}, ${day} - ${myMonths[bulan]} - ${year}`
  }

  pras.on('chat-update', async (message) => {
    require('./Prasz.js')(pras, message, _welkom)
  })

  pras.on('group-update', async (chat) => {

    var from = chat.jid
    var group = await pras.groupMetadata(from)
    if (!chat.desc == '') {
      var tag = chat.descOwner.split('@')[0] + '@s.whatsapp.net'
      var teks = `
    「 *TERDETEKSI* 」
    Deskripsi Group telah diubah oleh
    ❖ Admin : @${chat.descOwner.split('@')[0]}
    ❖ Pada : ${tanggal()}
    ❖ Deskripsi Baru : ${chat.desc}`
      pras.sendMessage(group.id, teks, MessageType.text, { contextInfo: { 'mentionedJid': [tag] } })
    } else if (chat.announce == 'false') {
      var opengc = `
    「 *GROUP TELAH DIBUKA* 」
    Group Telah Dibuka Oleh Admin
    _Sekarang Semua Member Bisa Mengirim Pesan_`
      pras.sendMessage(group.id, opengc, MessageType.text)
    } else if (chat.announce == 'true') {
      var closegc = `
    「 *GROUP TELAH DITUTUP* 」
    Group Telah Ditutup Oleh Admin
    _Sekarang Hanya Admin Yang Dapat Mengirim Pesan_`
      pras.sendMessage(group.id, closegc, MessageType.text)
    } else if (chat.restrict == 'false') {
      teks = `
    「 *PERUBAHAN PENGATURAN GROUP* 」
    Edit Group info telah dibuka untuk member
    Sekarang semua member dapat mengedit info Group Ini`
      pras.sendMessage(group.id, teks, MessageType.text)
    } else if (chat.restrict == 'true') {
      teks = `
    「 *PERUBAHAN PENGATURAN GROUP* 」
    Edit Group info telah ditutup untuk member
    Sekarang hanya admin group yang dapat mengedit info Group Ini`
      pras.sendMessage(group.id, teks, MessageType.text)
    }
  })

  pras.on("group-participants-update", async (anu) => {

    const isWelkom = _welkom.includes(anu.jid)
    try {
      groupMet = await pras.groupMetadata(anu.jid)
      groupMembers = groupMet.participants
      groupAdmins = getGroupAdmins(groupMembers)
      mem = anu.participants[0]

      console.log(anu)
      try {
        pp_user = await pras.getProfilePicture(mem)
      } catch (e) {
        pp_user = "https://telegra.ph/file/c9dfa715c26518201f478.jpg"
      }
      try {
        pp_grup = await pras.getProfilePicture(anu.jid)
      } catch (e) {
        pp_grup =
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60"
      }
      if (anu.action == "add" && mem.includes(pras.user.jid)) {
        pras.sendMessage(anu.jid, "Halo!.. saya ZeroBot saya akan membatu mempermudah kehidupan..seperti membuat sticker dan lain-lain. untuk meulai silahkan ketik !menu.", "conversation")
      }
      if (!isWelkom) return
      if (anu.action == "add" && !mem.includes(pras.user.jid)) {
        mdata = await pras.groupMetadata(anu.jid)
        memeg = mdata.participants.length
        num = anu.participants[0]
        let v = pras.contacts[num] || { notify: num.replace(/@.+/, "") }
        anu_user = v.vname || v.notify || num.split("@")[0]
        time_wel = moment.tz("Asia/Jakarta").format("HH:mm")
        wel = `Halo @${anu_user} \nWelcome In ${mdata.subject} \nKalau Mau Intro Silahkan \nTaati Peraturan Group ya Umm \nsapa member baru dengan cara klik tombol dibawah`
        buff = await getBuffer(
          `http://hadi-api.herokuapp.com/api/card/welcome?nama=${anu_user}&descriminator=${groupMembers.length
          }&memcount=${memeg}&gcname=${encodeURI(
            mdata.subject
          )}&pp=${pp_user}&bg=https://telegra.ph/file/4a7f884935b8ebf444d9e.jpg`
        )

        but = [
          { buttonId: 'add', buttonText: { displayText: 'Welcome Member Baru' }, type: 1 }
        ]
        sendButImage(mdata.id, wel, "Welcome Semoga Betah :)\nBy: <02/> Zero", buff, but)
      }
      if (!isWelkom) return
      if (anu.action == "remove" && !mem.includes(pras.user.jid)) {
        mdata = await pras.groupMetadata(anu.jid)
        num = anu.participants[0]
        let w = pras.contacts[num] || { notify: num.replace(/@.+/, "") }
        anu_user = w.vname || w.notify || num.split("@")[0]
        time_wel = moment.tz("Asia/Jakarta").format("HH:mm")
        memeg = mdata.participants.length
        out = `Mari Kita Doakan Bersama-Sama Buat Yang Keluar \nSayonara @${anu_user} Semoga Tenang Di Alam Sana`
        buff = await getBuffer(
          `http://hadi-api.herokuapp.com/api/card/goodbye?nama=${anu_user}&descriminator=${groupMembers.length
          }&memcount=${memeg}&gcname=${encodeURI(
            mdata.subject
          )}&pp=${pp_user}&bg=https://telegra.ph/file/4a7f884935b8ebf444d9e.jpg`
        )

        but = [
          { buttonId: 'remove', buttonText: { displayText: 'Sayonara kawand' }, type: 1 }
        ]
        sendButImage(mdata.id, out, "Sayonaraa \nKlo Balik Bawa Gorengan ye :) \nBy: <02/> Zero", buff, but)
      }
      if (anu.action == "promote") {
        const mdata = await pras.groupMetadata(anu.jid)
        anu_user = pras.contacts[mem]
        num = anu.participants[0]
        try {
          ppimg = await pras.getProfilePicture(
            `${anu.participants[0].split("@")[0]}@c.us`
          )
        } catch {
          ppimg =
            "https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg"
        }
        let buff = await getBuffer(ppimg)
        teks = `@${num.split("@")[0]} Telah dipromote`
        pras.sendMessage(mdata.id, teks, MessageType.text)
      }

      if (anu.action == "demote") {
        anu_user = pras.contacts[mem]
        num = anu.participants[0]
        const mdata = await pras.groupMetadata(anu.jid)
        try {
          ppimg = await pras.getProfilePicture(
            `${anu.participants[0].split("@")[0]}@c.us`
          )
        } catch {
          ppimg =
            "https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg"
        }

        let buff = await getBuffer(
          `https://gatauajg.yogipw.repl.co/api/demote?name=${anu_user.notify}&msg=selamat%20menjadi%20admin&mem=5&picurl=${ppimg}&bgurl=https://cdn.discordapp.com/attachments/819995259261288475/835055559941292032/style.jpg`
        )
        teks = `@${num.split("@")[0]} Telah didemote`
        pras.sendMessage(mdata.id, teks, MessageType.text)
      }
    } catch (e) {
      console.log("Error : %s", color(e, "red"))
    }

  })

  pras.on('CB:Blocklist', json => {
    if (blocked.length > 2) return
    for (let i of json[1].blocklist) {
      blocked.push(i.replace('c.us', 's.whatsapp.net'))
    }
  })
  pras.on('CB:action,,call', async json => {
    const callerId = json[2][0][1].from
    pras.sendMessage(callerId, `*ID: ${callerId}*\n*Sorry umm lu melanggar peraturan, bot akan memblokir kamu, unblock? hubunggi owner* \n`, MessageType.text)
    setTimeout(function () {
      pras.blockUser(callerId, "add")
    }, 1000 * 2)
  })
  pras.on('CB:action,,battery', json => {
    const a = json[2][0][1].value
    const b = json[2][0][1].live
    const c = json[2][0][1].powersave
    baterai.persen = a
    baterai.cas = b
    baterai.hemat = c
  })
}

/**
 * Uncache if there is file change
 * @param {string} module Module name or path
 * @param {function} cb <optional> 
 */
function nocache(module, cb = () => { }) {
  console.log('Module', `'${module}'`, 'is now being watched for changes')
  fs.watchFile(require.resolve(module), async () => {
    await uncache(require.resolve(module))
    cb(module)
  })
}

/**
* Uncache a module
* @param {string} module Module name or path
*/
function uncache(module = '.') {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(module)]
      resolve()
    } catch (e) {
      reject(e)
    }
  })
}

starts()












/*function start() {
  let args = [path.join('Prasz.js'), ...process.argv.slice(2)]
  CFonts.say([process.argv[0], ...args].join(' '), {
    font: 'console',
    align: 'center',
    gradient: ['red', 'magenta']
  })
  let p = spawn(process.argv[0], args, {
    stdio: ['inherit', 'inherit', 'inherit', 'ipc']
  })
  .on('message', data => {
    if (data == 'reset') {
      console.log('RESET')
      p.kill()
      start()
      delete p
    }
  })
}
start('Prasz.js')*/