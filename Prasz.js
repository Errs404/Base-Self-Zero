
const {
	WAConnection,
	MessageType,
	Presence,
	MessageOptions,
	Mimetype,
	WALocationMessage,
	WA_MESSAGE_STUB_TYPES,
	ReconnectMode,
	ProxyAgent,
	GroupSettingChange,
	waChatKey,
	mentionedJid,
	processTime,
} = require('@adiwajshing/baileys')
const fs = require("fs")
const axios = require('axios')
const util = require('util')
const crypto = require('crypto')
const request = require('request')
const moment = require('moment-timezone')
const { exec, spawn } = require('child_process')
const fetch = require('node-fetch')
const ffmpeg = require('fluent-ffmpeg')
const { removeBackgroundFromImageFile } = require('remove.bg')
const brainly = require('brainly-scraper')
const vapor = require('vapor-text')

const setting = JSON.parse(fs.readFileSync('./database/json/settings.json'))
const _antilink = JSON.parse(fs.readFileSync('./database/json/antilink.json'))
const _antivirtex = JSON.parse(fs.readFileSync('./database/json/antivirtex.json'))
const _badword = JSON.parse(fs.readFileSync('./database/json/badword.json'))
const user = JSON.parse(fs.readFileSync('./database/json/user.json'))
const bucinrandom = JSON.parse(fs.readFileSync('./database/json/bucin.json'))
const randomdilan = JSON.parse(fs.readFileSync('./database/json/dilan.json'))
const hekerbucin = JSON.parse(fs.readFileSync('./database/json/hekerbucin.json'))
const katailham = JSON.parse(fs.readFileSync('./database/json/katailham.json'))
let blocked = JSON.parse(fs.readFileSync('./database/json/blocked.json'))
const bad = JSON.parse(fs.readFileSync('./database/json/bad.json'))
const ban = JSON.parse(fs.readFileSync('./database/json/ban.json'))

ownernumber = setting.ownernumber
memberLimit = "2"
botinfo = setting.botinfo
name = setting.name

public = false

const zalgo = require('./Prasz/zalgo')
const { fetchJosn, fetchText } = require('./lib/fetcher')
const { recognize } = require('./lib/ocr')
const { exif } = require('./lib/exif')
const { color, bgcolor } = require('./lib/color')
const { wait, getBuffer, h2k, generateMessageID, getGroupAdmins, getRandom, start, info, success, close } = require('./lib/functions')
const { s } = require('vapor-text/lib/vapor')

const vcard = 'BEGIN:VCARD\n'
	+ 'VERSION:3.0\n'
	+ 'FN:Prasz Ganz\n'
	+ 'ORG:Owner PrasZ Bot;\n'
	+ 'TEL;type=CELL;type=VOICE;waid=628362323152:+62 838-6232-3152\n'
	+ 'END:VCARD'

function kyun(seconds) {
	function pad(s) {
		return (s < 10 ? '0' : '') + s;
	}
	var hours = Math.floor(seconds / (60 * 60));
	var minutes = Math.floor(seconds % (60 * 60) / 60);
	var seconds = Math.floor(seconds % 60);

	return `${pad(hours)} Jam ${pad(minutes)} Menit ${pad(seconds)} Detik`
}
function tanggal() {
	myMonths = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
	myDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum at', 'Sabtu'];
	var tgl = new Date();
	var day = tgl.getDate()
	bulan = tgl.getMonth()
	var thisDay = tgl.getDay(),
		thisDay = myDays[thisDay];
	var yy = tgl.getYear()
	var year = (yy < 1000) ? yy + 1900 : yy;
	return `${thisDay}, ${day} - ${myMonths[bulan]} - ${year}`
}
function monospace(string) {
	return '```' + string + '```'
}

module.exports = pras = async (pras, mek, _welkom) => {
	try {
		if (!mek.hasNewMessage) return
		mek = mek.messages.all()[0]
		//mek = JSON.parse(JSON.stringify(mek)).messages[0]
		if (!mek.message) return
		if (mek.key && mek.key.remoteJid == 'status@broadcast') return
		global.blocked
		mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
		const content = JSON.stringify(mek.message)
		const from = mek.key.remoteJid
		const type = Object.keys(mek.message)[0]
		const insom = from.endsWith('@g.us')
		const nameReq = insom ? mek.participant : mek.key.remoteJid
		pushname = pras.contacts[nameReq] != undefined ? pras.contacts[nameReq].vname || pras.contacts[nameReq].notify : undefined

		const { text, extendedText, contact, contactsArray, groupInviteMessage, listMessage, buttonsMessage, location, liveLocation, image, video, sticker, document, audio, product, quotedMsg } = MessageType
		const { wa_version, mcc, mnc, os_version, device_manufacturer, device_model, os_build_number } = pras.user.phone
		const date = new Date().toLocaleDateString()
		const time = moment.tz('Asia/Jakarta').format('HH:mm:ss')
		const jam = moment.tz('Asia/Jakarta').format('HH:mm')

		cmd = (type === 'conversation' && mek.message.conversation) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text ? mek.message.extendedTextMessage.text : ''.slice(1).trim().split(/ +/).shift().toLowerCase()
		const prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/.test(cmd) ? cmd.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/gi) : '-'
		body = (type === 'conversation' && mek.message.conversation) ? mek.message.conversation : (type == 'imageMessage') && mek.message[type].caption ? mek.message[type].caption : (type == 'videoMessage') && mek.message[type].caption ? mek.message[type].caption : (type == 'extendedTextMessage') && mek.message[type].text ? mek.message[type].text : (type == 'listResponseMessage') && mek.message[type].singleSelectReply.selectedRowId ? mek.message[type].singleSelectReply.selectedRowId : (type == 'buttonsResponseMessage') && mek.message[type].selectedButtonId ? mek.message[type].selectedButtonId : (type == 'stickerMessage') && (mek.message[type].fileSha256.toString('base64')) !== null && mek.message[type].fileSha256.toString('base64') !== undefined ? mek.message[type].fileSha256.toString('base64') : ""
		budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
		Link = (type === 'conversation' && mek.message.conversation) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text ? mek.message.extendedTextMessage.text : ''
		const chats = body.match(prefix) ? body.split(prefix).find((v) => v === body.replace(prefix, "")) : body
		const messagesLink = Link.slice(0).trim().split(/ +/).shift().toLowerCase()
		const command = chats.split(/ +/g)[0]
		const stickCmd = (type == 'stickerMessage') ? mek.message.stickerMessage.fileSha256.toString('base64') : '' || ''
		const butcmd = (type === 'buttonsResponseMessage') ? mek.message.buttonsResponseMessage.selectedButtonId : ''
		const listcmd = (type === 'listResponseMessage') ? mek.message.listResponseMessage.rowId : ''
		const args = body.trim().split(/ +/).slice(1)
		const q = args.join(' ')
		const txt = mek.message.conversation
		const isCmd = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message[type].caption.startsWith(prefix) ? mek.message[type].caption : (type == 'videoMessage') && mek.message[type].caption.startsWith(prefix) ? mek.message[type].caption : (type == 'extendedTextMessage') && mek.message[type].text.startsWith(prefix) ? mek.message[type].text : (type == 'listResponseMessage') && mek.message[type].singleSelectReply.selectedRowId ? mek.message[type].singleSelectReply.selectedRowId : (type == 'buttonsResponseMessage') && mek.message[type].selectedButtonId ? mek.message[type].selectedButtonId : ""


		mess = {
			wait: '*Tumgu Bemtarr Umm*',
			success: '*Dah Tuh Billang Apa*',
			error: {
				bug: '*Wkwkwk Ngebug Umm Laporin Ke Owner Gih*',
				stick: `*Gagal Convert Umm*\n*Ulangi dahh.. Replay ae fotonya trs kasih caption ${prefix}sticker*`,
				Iv: '*Link Error Umm.. Cek Lagi Dahh*'
			},
			only: {
				group: '*Bisanya Di Group Umm..*',
				benned: '*Lu Keban Hamdehh*',
				ownerG: '*Lu Bukan Admin Umm..*',
				ownerB: '*Lah Lu Bkn Owner.. Ngapain?* ',
				premium: '*Harus Premium Dumluu.. Chat Owner Umm Klo Mo Premium*',
				//userB: `Hai Kak ${pushname} Kamu Belom Terdaftar Didatabase Silahkan Ketik \n${prefix}daftar`,
				admin: '*Bisanya Cma Admin Umm..*',
				Badmin: '*Gabisa Kan Aku Bukan Admin, Adminin Dulu Lah*',
				publikG: `*𝗠𝗮𝗮𝗳 𝗕𝗼𝘁 𝗦𝗲𝗱𝗮𝗻𝗴 𝗣𝗲𝗿𝗯𝗮𝗶𝗸𝗮𝗻!!!*\n*𝗨𝗻𝘁𝘂𝗸 𝗜𝗻𝗳𝗼 𝗟𝗲𝗯𝗶𝗵 𝗝𝗲𝗹𝗮𝘀𝗻𝘆𝗮 𝗞𝗲𝘁𝗶𝗸*\n*${prefix}infobot*`
			}
		}

		const botNumber = pras.user.jid
		const ownerNumber = `${ownernumber}@s.whatsapp.net`
		const ownerInfo = `${ownernumber}`
		const isGroup = from.endsWith('@g.us')
		const sender = mek.key.fromMe ? pras.user.jid : isGroup ? mek.participant : mek.key.remoteJid
		const groupMetadata = isGroup ? await pras.groupMetadata(from) : ''
		const groupName = isGroup ? groupMetadata.subject : ''
		const groupId = isGroup ? groupMetadata.jid : ''
		const groupMembers = isGroup ? groupMetadata.participants : ''
		const groupDesc = isGroup ? groupMetadata.desc : ''
		const groupOwner = isGroup ? groupMetadata.owner : ''
		const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
		const totalchat = await pras.chats.all()

		const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
		const isGroupAdmins = groupAdmins.includes(sender) || false
		const isWelkom = isGroup ? _welkom.includes(from) : false
		const isBadWord = isGroup ? _badword.includes(from) : false
		const isAntiLink = isGroup ? _antilink.includes(from) : false
		const isAntiVirtex = isGroup ? _antivirtex.includes(from) : false
		const isOwner = ownerNumber.includes(sender)
		const isMybot = isOwner || mek.key.fromMe
		const isUser = user.includes(sender)
		const isBanned = ban.includes(sender)
		const Verived = "0@s.whatsapp.net"
		const weem = " ~ Prasz Gans"

		const isUrl = (url) => {
			return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
		}
		const createSerial = (size) => {
			return crypto.randomBytes(size).toString('hex').slice(0, size)
		}
		const ftextumb = {
			key: {
				fromMe: false,
				participant: `0@s.whatsapp.net`, ...(from ?
					{ remoteJid: "6283862323152-1613049930@g.us" } : {})
			},
			message: {
				"extendedTextMessage": {
					"text": botinfo + weem,
					"title": `Hmm`,
					'jpegThumbnail': fs.readFileSync('./database/bot')
				}
			}
		}


		const reply = (teks) => {
			pras.sendMessage(from, teks, text, { quoted: mek })
		}
		const sendMess = (hehe, teks) => {
			pras.sendMessage(hehe, teks, text)
		}
		const mentions = (teks, memberr, id) => {
			(id == null || id == undefined || id == false) ? pras.sendMessage(from, teks.trim(), extendedText, { contextInfo: { "mentionedJid": memberr } }) : pras.sendMessage(from, teks.trim(), extendedText, { quoted: mek, contextInfo: { "mentionedJid": memberr } })
		}
		const costum = (pesan, tipe, target, target2) => {
			pras.sendMessage(from, pesan, tipe, { quoted: { key: { fromMe: false, participant: `${target}`, ...(from ? { remoteJid: from } : {}) }, message: { conversation: `${target2}` } } })
		}
		if (isGroup) {
			try {
				const getmemex = groupMembers.length
				if (getmemex <= memberLimit) {
					setTimeout(() => {
						pras.groupLeave(from)
					}, 2000)
					setTimeout(() => {
						pras.sendMessage(from, `Maaf Yaa Bye All👋`, text)
					}, 1000)
					setTimeout(() => {
						pras.sendMessage(from, `Maaf ${name} Tidak Bisa Masuk Group Karna Member Group ${groupMetadata.subject} Tidak Memenuhi Limit Member\n\nMinimal Member ${memberLimit}`, text)
					}, 0)
				}
			} catch (err) { console.error(err) }
		}

		if (budy.match("chat.whatsapp.com/")) {
			if (!isGroup) return
			if (!isAntiLink) return
			if (isGroupAdmins) return reply(`${pushname} Okelah Lu Admin Gpp :D`)
			var linkgc = await pras.groupInviteCode(from)
			if (budy.match(`${linkgc}`)) return reply(`${pushname} itu adalah link gc group ini anda tidak akan di kick silahkan di share`)
			var Kick = `${sender.split("@")[0]}@s.whatsapp.net`
			setTimeout(() => {
				reply('byee👋')
			}, 1100)
			setTimeout(() => {
				pras.groupRemove(from, [Kick]).catch((e) => { reply(`*Adminin Woi* \nError: ${e}`) })
			}, 1000)
			setTimeout(() => {
				reply(`Link Group Terdeteksi maaf *${pushname}* anda akan di kick`)
			}, 0)
		}

		if (txt.length > 700) {
			if (!isGroup) return
			if (!isAntiVirtex) return
			if (isGroupAdmins) return reply(`${pushname} Adalah Admin Group Kamu Tidak Akan Di kick`)
			pras.updatePresence(from, Presence.composing)
			var kic = `${sender.split("@")[0]}@s.whatsapp.net`
			costum(monospace(`Virtex Terdeteksi maaf ${sender.split("@")[0]} anda akan di kick dari group`))
			setTimeout(() => {
				pras.groupRemove(from, [kic]).catch((e) => { reply(`*ERR:* ${e}`) })
				pras.blockUser(sender, "add")
			}, 0)
		}
		if (isGroup && isBadWord) {
			if (bad.includes(messagesLink)) {
				if (!isGroupAdmins) {
					return reply("JAGA UCAPAN DONG!!")
						.then(() => pras.groupRemove(from, sender))
						.then(() => {
							pras.sendMessage(from, `*「 ANTI BADWORD 」*\nKamu dikick karena berkata kasar!`, text, { quoted: mek })
						}).catch(() => pras.sendMessage(from, `Untung Prasz bukan admin, kalo admin udah Prasz kick!`, text, { quoted: mek }))
				} else {
					return reply("Tolong Jaga Ucapan Min👍")
				}
			}
		}
		if (isOwner) {
			if (budy.startsWith('>')) {
				console.log(color('[EVAL1]'), color(moment(mek.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`eval return`))
				try {
					let evaled = await eval(budy.slice(2))
					if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
					reply(`${evaled}`)
				} catch (err) {
					reply(`${err}`)
				}
			} else if (budy.startsWith('x')) {
				console.log(color('[EVAL2]'), color(moment(mek.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`eval identy`))
				try {
					return pras.sendMessage(from, JSON.stringify(eval(budy.slice(2)), null, '\t'), text, { quoted: mek })
				} catch (err) {
					e = String(err)
					reply(e)
				}
			}
		}

		const sleep = async (ms) => {
			return new Promise(resolve => setTimeout(resolve, ms));
		}
		colors = ['red', 'white', 'black', 'blue', 'yellow', 'green', 'aqua']
		const isMedia = (type === 'imageMessage' || type === 'videoMessage')
		const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
		const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
		const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')
		const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')

		if (!isGroup && isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
		if (!isGroup && !isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'args :', color(args.length))

		if (isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
		if (!isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))

		if (isMybot) {
			if (budy.toLowerCase() === `${prefix}self`) {
				public = false
				reply(`Sukses ` + `Status: SELF`)
			}
			if (budy.toLowerCase() === `${prefix}public`) {
				public = true
				reply(`Sukses ` + `Status: PUBLIC`)
			}
			if (budy.toLowerCase() === 'status') {
				reply(`STATUS: ${public ? 'PUBLIC' : 'SELF'}`)
			}
		}
		if (!public) {
			if (!isMybot) return
		}
		switch (command) {
			case 'menu':
			case 'help':
				teks = `ZeroBot
	== *MEDIA* ==
	${prefix}stiker <Gambar/Video>
	${prefix}toimg <stiker>
	${prefix}tovideo <stiker>
	${prefix}bass <audio>
	${prefix}slow <audio>
	${prefix}tupai <audio>
	${prefix}gemuk <audio>
	${prefix}toptt <audio>
	
	== *GROUP* ==
	${prefix}infogrup
	${prefix}linkgrup
	${prefix}grup
	${prefix}add
	${prefix}kick
	${prefix}kicktime
	${prefix}promote
	${prefix}demote
	${prefix}delet
	${prefix}ownergroup
	${prefix}adminlist
	${prefix}setname
	${prefix}setpp
	${prefix}setdesc
	${prefix}tagall
	${prefix}mentionall
	${prefix}hidetag
	${prefix}leave

	${prefix}antilink
	${prefix}antivirtex
	${prefix}badword

	== *FUN* ==
    ${prefix}fitnah
	${prefix}cekganteng
	${prefix}cekcatik
	${prefix}apakah
	${prefix}bisakah
	${prefix}kapankah
	${prefix}watak
	${prefix}hobby
	${prefix}persengay
	${prefix}persenbucin
	${prefix}rate
	${prefix}quotes
	${prefix}katailham
	${prefix}bacotandilan
	${prefix}bucin
	${prefix}hekerbucin
	${prefix}truth
	${prefix}dare
	${prefix}tebakgambar
	${prefix}caklontong
	${prefix}family100

	== *OTHER* ==
	${prefix}tagme
    ${prefix}testime
	${prefix}clearall
	${prefix}bc
	${prefix}bcgc
	${prefix}clone
	${prefix}addstatus
	${prefix}wame
	${prefix}totaluswer
	${prefix}blocklist
	${prefix}banlist
	${prefix}block
	${prefix}unblock
	${prefix}ban
	${prefix}unban
	${prefix}readmore
	${prefix}addbadword
	${prefix}dellbadword	
	${prefix}listbadword
	${prefix}tomp3

	${prefix}vapor
	${prefix}makevirtex
	${prefix}brainly
	${prefix}ocr
	${prefix}img2url
	${prefix}owner
	${prefix}creator
	${prefix}tts
	${prefix}darkjokes
	${prefix}asupan
	${prefix}addbucin
	${prefix}antivirtexx <penyekip virtex>
	${prefix}report

	== *SETING* ==
	${prefix}status
	${prefix}public
	${prefix}self
	${prefix}setbotname
	${prefix}setreply
	${prefix}setppbot
	
	*<0/> ZERO TEAM*`

				pras.sendMessage(from, teks, text, { quoted: ftextumb })
				break
			//========================================(FITUR BAILES)==============================================
			//Fa auah gatau namaya bailes or Baileys pokoknya itu
			case 'tagme':
				if (isBanned) return reply(mess.only.benned)
				await costum(`@${sender.split('@')[0]}`, text, Verived, `@${sender.split('@')[0]}`)
				break
			case 'infogroup':
			case 'infogc':
			case 'infogrub':
				if (isBanned) return reply(mess.only.benned)
				pras.updatePresence(from, Presence.composing)
				if (!isGroup) return reply(mess.only.group)
				try {
					ppUrl = await pras.getProfilePicture(from)
				} catch {
					ppUrl = 'https://i.ibb.co/Gp4H47k/7dba54f7e250.jpg'
				}
				reply(mess.wait)
				buffer = await getBuffer(ppUrl)
				pras.sendMessage(from, buffer, image, { quoted: mek, caption: `NAME : *${groupName}*\nMEMBER : *${groupMembers.length}*\nADMIN : *${groupAdmins.length}*\nDESK : \n${groupDesc}` })
				break
			case 'testime':
				setTimeout(() => {
					pras.sendMessage(from, 'Waktu habis:v', text, { quoted: mek }) // ur cods
				}, 10000) // 1000 = 1s,
				setTimeout(() => {
					pras.sendMessage(from, '5 Detik lagi', text, { quoted: mek }) // ur cods
				}, 5000) // 1000 = 1s,
				setTimeout(() => {
					pras.sendMessage(from, '10 Detik lagi', text, { quoted: mek }) // ur cods
				}, 0) // 1000 = 1s,
				break
			case 'linkgrup':
				if (isBanned) return reply(mess.only.benned)
				if (!isGroup) return reply(mess.only.group)
				if (!isBotGroupAdmins) return reply(mess.only.Badmin)
				linkgc = await pras.groupInviteCode(from)
				yeh = `https://chat.whatsapp.com/${linkgc}\n\nlink Group *${groupName}*`
				pras.sendMessage(from, yeh, text, { quoted: mek })
				break
			case 'hidetag':
				if (isBanned) return reply(mess.only.benned)
				if (!isGroup) return reply(mess.only.group)
				if (!isBotGroupAdmins) return reply(mess.only.Badmin)
				var value = body.slice(9)
				var group = await pras.groupMetadata(from)
				var member = group['participants']
				var mem = []
				member.map(async adm => {
					mem.push(adm.id.replace('c.us', 's.whatsapp.net'))
				})
				var options = {
					text: value,
					contextInfo: { mentionedJid: mem },
					quoted: mek
				}
				pras.sendMessage(from, options, text)
				break
			case 'tagall':
				if (isBanned) return reply(mess.only.benned)
				if (!isGroup) return reply(mess.only.group)
				if (!isGroupAdmins) return reply(mess.only.admin)
				members_id = []
				teks = (args.length > 1) ? body.slice(8).trim() : ''
				teks += '\n'
				for (let mem of groupMembers) {
					teks += `╠➥ @${mem.jid.split('@')[0]} wa.me/${mem.jid.split('@')[0]}\n`
					members_id.push(mem.jid)
				}
				mentions(`╔═══✪ Tag By *${pushname}* ✪══` + teks + '╚═══〘 PRASZ BOT 〙═══', members_id, true)
				break
			case 'mentionall':
				if (isBanned) return reply(mess.only.benned)
				if (!isGroup) return reply(mess.only.group)
				if (!isGroupAdmins) return reply(mess.only.admin)
				members_id = []
				teks = '\n'
				for (let mem of groupMembers) {
					teks += `╠➥ @${mem.jid.split('@')[0]}\n`
					members_id.push(mem.jid)
				}
				mentions(`╔══〘  *${body.slice(12)}*  〙✪══` + teks + '╚═〘 PRASZ BOT 〙', members_id, true)
				break
			case 'grup':
				if (isBanned) return reply(mess.only.benned)
				if (!isGroup) return reply(mess.only.group)
				if (!isGroupAdmins) return reply(mess.only.admin)
				if (!isBotGroupAdmins) return reply(mess.only.Badmin)
				if (args[0] === 'buka') {
					reply(`\`\`\`✓Sukses Membuka Group\`\`\` *${groupMetadata.subject}*`)
					pras.groupSettingChange(from, GroupSettingChange.messageSend, false)
				} else if (args[0] === 'tutup') {
					reply(`\`\`\`✓Sukses Menutup Group\`\`\` *${groupMetadata.subject}*`)
					pras.groupSettingChange(from, GroupSettingChange.messageSend, true)
				}
				break
			case 'clearall':
				if (!isOwner) return reply('Kamu siapa?')
				anu = await pras.chats.all()
				pras.setMaxListeners(25)
				for (let _ of anu) {
					pras.deleteChat(_.jid)
				}
				reply(`\`\`\`Sukses delete all chat PrasZ  BOT\`\`\``)
				break
			case 'bcgc':
				pras.updatePresence(from, Presence.composing)
				if (!isOwner) return reply(mess.only.ownerB)
				if (args.length < 1) return reply('.......')
				if (isMedia && !mek.message.videoMessage || isQuotedImage) {
					const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : mek
					bcgc = await pras.downloadMediaMessage(encmedia)
					for (let _ of groupMembers) {
						pras.sendMessage(_.jid, bcgc, image, { caption: `*「 BROADCAST GROUP 」*\n*Group* : ${groupName}\n\n${body.slice(6)}` })
					}
					reply('')
				} else {
					for (let _ of groupMembers) {
						sendMess(_.jid, `*「 BROADCAST GROUP 」*\n*Group* : ${groupName}\n\n${body.slice(6)}`)
					}
					reply('Suksess broadcast group')
				}
				break
			case 'bc':
				if (!isOwner) return reply('Kamu siapa?')
				if (args.length < 1) return reply('.......')
				anu = await pras.chats.all()
				if (isMedia && !mek.message.videoMessage || isQuotedImage) {
					const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : mek
					bc = await pras.downloadMediaMessage(encmedia)
					for (let _ of anu) {
						pras.sendMessage(_.jid, bc, image, { caption: `[ Izin Broadcast ]\n\n${body.slice(4)}` })
					}
					reply('Suksess broadcast')
				} else {
					for (let _ of anu) {
						sendMess(_.jid, `[ *PRASZBOT BROADCAST* ]\n\n${body.slice(4)}`)
					}
					reply('Suksess broadcast')
				}
				break
			case 'add':
				if (isBanned) return reply(mess.only.benned)
				if (!isGroup) return reply(mess.only.group)
				if (!isGroupAdmins) return reply(mess.only.admin)
				if (!isBotGroupAdmins) return reply(mess.only.Badmin)
				if (args.length < 1) return reply('Yang mau di add siapa??')
				if (args[0].startsWith('08')) return reply('Gunakan kode negara Gan')
				try {
					num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
					pras.groupAdd(from, [num])
				} catch (e) {
					console.log('Error :', e)
					reply('Gagal menambahkan target, mungkin karena di private')
				}
				break
			case 'kick':
				if (isBanned) return reply(mess.only.benned)
				if (!isGroup) return reply(mess.only.group)
				if (!isGroupAdmins) return reply(mess.only.admin)
				if (!isBotGroupAdmins) return reply(mess.only.Badmin)
				if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag target yang ingin di tendang!')
				mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
				if (mentioned.length > 1) {
					teks = 'Perintah di terima, mengeluarkan :\n'
					for (let _ of mentioned) {
						teks += `@${_.split('@')[0]}\n`
					}
					mentions(teks, mentioned, true)
					pras.groupRemove(from, mentioned)
				} else {
					mentions(`Perintah di terima, mengeluarkan : @${mentioned[0].split('@')[0]}`, mentioned, true)
					pras.groupRemove(from, mentioned)
				}
				break
			case 'kicktime':
				if (isBanned) return reply(mess.only.benned)
				if (!isGroup) return reply(mess.only.group)
				if (!isGroupAdmins) return reply(mess.only.admin)
				if (!isBotGroupAdmins) return reply(mess.only.Badmin)
				if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag target yang ingin di tendang!')
				mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
				setTimeout(() => {
					pras.sendMessage(from, 'Yok Sama" Al-fatihah', text)
				}, 8000)
				setTimeout(() => {
					reply('sukses min:D')
				}, 7000)
				setTimeout(() => {
					pras.groupRemove(from, mentioned)
				}, 6000)
				setTimeout(() => {
					pras.sendMessage(from, `Bismilah Kick @${mentioned[0].split('@')[0]}`, text) // ur cods
				}, 5000)
				setTimeout(() => {
					pras.sendMessage(from, 'Asikkk Dapet Makanan nihh:D', text)
				}, 2500)
				setTimeout(() => {
					reply('Perintah Diterima min:D')
				}, 0)
				break
			case 'promote':
			case 'pm':
				if (isBanned) return reply(mess.only.benned)
				if (!isGroup) return reply(mess.only.group)
				if (!isGroupAdmins) return reply(mess.only.admin)
				if (!isBotGroupAdmins) return reply(mess.only.Badmin)
				if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag target yang ingin di jadi admin!')
				mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
				if (mentioned.length > 1) {
					teks = 'Perintah di terima, anda menjdi admin :\n'
					for (let _ of mentioned) {
						teks += `@${_.split('@')[0]}\n`
					}
					mentions(teks, mentioned, true)
					pras.groupMakeAdmin(from, mentioned)
				} else {
					mentions(`Perintah di terima, @${mentioned[0].split('@')[0]} Kamu Menjadi Admin Di Group *${groupMetadata.subject}*`, mentioned, true)
					pras.groupMakeAdmin(from, mentioned)
				}
				break
			case 'delete':
			case 'd':
				if (!isGroup) return reply(mess.only.group)
				if (!isGroupAdmins) return reply(mess.only.admin)
				pras.deleteMessage(from, { id: mek.message.extendedTextMessage.contextInfo.stanzaId, remoteJid: from, fromMe: true })
				break
			case 'demote':
				if (isBanned) return reply(mess.only.benned)


				if (!isGroup) return reply(mess.only.group)
				if (!isGroupAdmins) return reply(mess.only.admin)
				if (!isBotGroupAdmins) return reply(mess.only.Badmin)
				if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag target yang ingin di tidak jadi admin!')
				mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
				if (mentioned.length > 1) {
					teks = 'Perintah di terima, anda tidak menjadi admin :\n'
					for (let _ of mentioned) {
						teks += `@${_.split('@')[0]}\n`
					}
					mentions(teks, mentioned, true)
					pras.groupDemoteAdmin(from, mentioned)
				} else {
					mentions(`Perintah di terima, Menurunkan : @${mentioned[0].split('@')[0]} Menjadi Member`, mentioned, true)
					pras.groupDemoteAdmin(from, mentioned)
				}
				break
			case 'adminlist':
				if (isBanned) return reply(mess.only.benned)


				if (!isGroup) return reply(mess.only.group)
				teks = `List admin of group *${groupMetadata.subject}*\nTotal : ${groupAdmins.length}\n\n`
				no = 0
				for (let admon of groupAdmins) {
					no += 1
					teks += `[${no.toString()}] @${admon.split('@')[0]}\n`
				}
				mentions(teks, groupAdmins, true)
				break
			case 'ownergrup':
				pras.updatePresence(from, Presence.composing)
				options = {
					text: `Owner Group ini adalah : wa.me/${from.split("-")[0]}`,
					contextInfo: { mentionedJid: [from] }
				}
				pras.sendMessage(from, options, text, { quoted: mek })
				break
			case 'leave':
				if (!isGroup) return reply(mess.only.group)
				if (!isOwner) return reply(mess.only.ownerB)
				anu = await pras.groupLeave(from, `Bye All Member *${groupMetadata.subject}*`, groupId)
				break
			case 'setname':
				if (isBanned) return reply(mess.only.benned)


				if (!isGroup) return reply(mess.only.group)
				if (!isGroupAdmins) return reply(mess.only.admin)
				if (!isBotGroupAdmins) return reply(mess.only.Badmin)
				pras.groupUpdateSubject(from, `${body.slice(9)}`)
				pras.sendMessage(from, `\`\`\`✓Sukses Mengganti Nama Group Menjadi\`\`\` *${body.slice(9)}*`, text, { quoted: mek })
				break
			case 'setdesc':
				if (isBanned) return reply(mess.only.benned)


				if (!isGroup) return reply(mess.only.group)
				if (!isGroupAdmins) return reply(mess.only.admin)
				if (!isBotGroupAdmins) return reply(mess.only.Badmin)
				pras.groupUpdateDescription(from, `${body.slice(9)}`)
				pras.sendMessage(from, `\`\`\`✓Sukses Mengganti Deskripsi Group\`\`\` *${groupMetadata.subject}* Menjadi: *${body.slice(9)}*`, text, { quoted: mek })
				break
			case 'setpp':
				if (isBanned) return reply(mess.only.benned)


				if (!isGroup) return reply(mess.only.group)
				if (!isGroupAdmins) return reply(mess.only.admin)
				if (!isBotGroupAdmins) return reply(mess.only.Badmin)
				media = await pras.downloadAndSaveMediaMessage(mek, './database/media_user')
				await pras.updateProfilePicture(from, media)
				reply(mess.wait)
				reply(`\`\`\`✓Sukses Mengganti Profil Group\`\`\` *${groupMetadata.subject}*`)
				break
			case 'clone':
				if (!isOwner) return reply(mess.only.ownerB)
				if (!isGroup) return reply(mess.only.group)
				if (!isGroupAdmins) return reply(mess.only.admin)
				if (args.length < 1) return reply('Tag target yang ingin di clone')
				if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag gan')
				mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid[0]
				let { jid, id, notify } = groupMembers.find(x => x.jid === mentioned)
				try {
					pp = await pras.getProfilePicture(id)
					buffer = await getBuffer(pp)
					pras.updateProfilePicture(botNumber, buffer)
					mentions(`Foto profile Berhasil di perbarui menggunakan foto profile @${id.split('@')[0]}`, [jid], true)
				} catch (e) {
					reply('Gagal om')
				}
				break
			case 'kickall':
				if (!isOwner) return reply(mess.only.ownerB)
				if (!isGroupAdmins) return reply(mess.only.admin)
				members_id = []
				teks = (args.length > 1) ? body.slice(8).trim() : ''
				teks += '\n\n'
				for (let mem of groupMembers) {
					teks += `*😘* ${mem.jid.split('@')[0]}\n`
					members_id.push(mem.jid)
				}
				mentions(teks, members_id, true)
				pras.groupRemove(from, members_id)
				break
			case 'addstatus':
				if (!isOwner) return reply(mess.only.ownerB)
				pras.sendMessage('status@broadcast', `${args[0]}`, extendedText)
				reply('✓Sukses...')
				break
			//========================================(FITUR OTHER WA)==============================================

			case 'wame':
				reply(`wa.me/${sender.split('@')[0]}\nAtau\napi.whatsapp.com/send?phone=${sender.split('@')[0]}`)
				break
			case 'totaluser':
				pras.updatePresence(from, Presence.composing)


				//if (!isPublic) return reply(mess.only.publikG)
				if (!isOwner) return reply(mess.only.ownerB)
				teks = `╭────「 *TOTAL USER ${name}* 」\n`
				no = 0
				for (let hehehe of user) {
					no += 1
					teks += `[${no.toString()}] @${hehehe.split('@')[0]}\n`
				}
				teks += `│+ Total Pengguna : ${user.length}\n╰──────⎿ *${name}* ⏋────`
				pras.sendMessage(from, teks.trim(), extendedText, { quoted: mek, contextInfo: { "mentionedJid": user } })
				break
			case 'blocklist':
			case 'bcl':
				teks = 'List Block :\n'
				for (let block of blocked) {
					teks += `~> @${block.split('@')[0]}\n`
				}
				teks += `Total : ${blocked.length}`
				pras.sendMessage(from, teks.trim(), extendedText, { quoted: mek, contextInfo: { "mentionedJid": blocked } })
				break
			case 'banlist':
			case 'bl':
				ben = '```List Banned``` :\n'
				for (let banned of ban) {
					ben += `~> @${banned.split('@')[0]}\n`
				}
				ben += `Total : ${ban.length}`
				pras.sendMessage(from, ben.trim(), extendedText, { quoted: mek, contextInfo: { "mentionedJid": ban } })
				break
			case 'ban':
				pras.updatePresence(from, Presence.composing)
				if (args.length < 1) return
				if (!isOwner) return reply(mess.only.ownerB)
				mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
				ban = mentioned
				reply(`berhasil banned : ${ban}`)
				break
			case 'unban':
				if (!isOwner) return reply(mess.only.ownerB)
				bnnd = body.slice(8)
				ban.splice(`${bnnd}@s.whatsapp.net`, 1)
				reply(`Nomor wa.me/${bnnd} telah di unban!`)
				break
			case 'block':
				pras.updatePresence(from, Presence.composing)
				if (!isGroup) return reply(mess.only.group)
				if (!isOwner) return reply(mess.only.ownerB)
				pras.blockUser(`${body.slice(7)}@c.us`, "add")
				pras.sendMessage(from, `perintah Diterima, memblokir ${body.slice(7)}@c.us`, text)
				break
			case 'unblock':
				if (isBanned) return reply(mess.only.benned)

				//if (!isPublic) return reply(mess.only.publikG)

				if (!isGroup) return reply(mess.only.group)
				if (!isOwner) return reply(mess.only.ownerB)
				pras.blockUser(`${body.slice(9)}@c.us`, "remove")
				pras.sendMessage(from, `perintah Diterima, membuka blokir ${body.slice(9)}@c.us`, text)
				break
			case 'readmore':
				if (isBanned) return reply(mess.only.benned)

				//if (!isPublic) return reply(mess.only.publikG)
				if (args.length < 1) return reply('teks nya mana om?')
				var kls = body.slice(9)
				var has = kls.split("/")[0];
				var kas = kls.split("/")[1];
				if (args.length < 1) return reply(mess.blank)
				pras.sendMessage(from, `${has}‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎${kas}`, text, { quoted: mek })
				break
			case 'gifstiker':
			case 'stiker':
			case 'sticker':
			case 'gifsticker':
			case 'stickergif':
			case 'stikergif':
			case 'sgif':
			case 's':
				if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
					const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : mek
					const media = await pras.downloadAndSaveMediaMessage(encmedia, './database/media_user')
					ran = getRandom('.webp')
					reply(mess.wait)
					await ffmpeg(`./${media}`)
						.input(media)
						.on('start', function (cmd) {
							console.log(`Started : ${cmd}`)
						})
						.on('error', function (err) {
							console.log(`Error : ${err}`)
							fs.unlinkSync(media)
							reply(mess.error.stick)
						})
						.on('end', function () {
							console.log('Finish')
							buffer = fs.readFileSync(ran)
							costum(buffer, sticker, Verived, ` ~ Nihh Udah Jadi Stikernya`)
							fs.unlinkSync(media)
							fs.unlinkSync(ran)
						})
						.addOutputOptions([`-vcodec`, `libwebp`, `-vf`, `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
						.toFormat('webp')
						.save(ran)
				} else if ((isMedia && mek.message.videoMessage.seconds < 11 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
					const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : mek
					const media = await pras.downloadAndSaveMediaMessage(encmedia, './database/media_user')
					ran = getRandom('.webp')
					reply(mess.wait)
					await ffmpeg(`./${media}`)
						.inputFormat(media.split('.')[1])
						.on('start', function (cmd) {
							console.log(`Started : ${cmd}`)
						})
						.on('error', function (err) {
							console.log(`Error : ${err}`)
							fs.unlinkSync(media)
							tipe = media.endsWith('.mp4') ? 'video' : 'gif'
							reply(`❌ Gagal, pada saat mengkonversi ${tipe} ke stiker. pastikan untuk video yang dikirim tidak lebih dari 9 detik`)
						})
						.on('end', function () {
							console.log('Finish')
							costum(fs.readFileSync(ran), sticker, Verived, `~ Nih Dah Jadi Gif Stikernya`)
							fs.unlinkSync(media)
							fs.unlinkSync(ran)
						})
						.addOutputOptions([`-vcodec`, `libwebp`, `-vf`, `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
						.toFormat('webp')
						.save(ran)
				} else if ((isMedia || isQuotedImage) && args[0] == 'nobg') {
					const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : mek
					const media = await pras.downloadAndSaveMediaMessage(encmedia, './database/media_user')
					ranw = getRandom('.webp')
					ranp = getRandom('.png')
					reply(mess.wait)
					keyrmbg = 'bcAvZyjYAjKkp1cmK8ZgQvWH'
					await removeBackgroundFromImageFile({ path: media, apiKey: keyrmbg, size: 'auto', type: 'auto', ranp }).then(res => {
						fs.unlinkSync(media)
						let buffer = Buffer.from(res.base64img, 'base64')
						fs.writeFileSync(ranp, buffer, (err) => {
							if (err) return reply('Gagal, Terjadi kesalahan, silahkan coba beberapa saat lagi.')
						})
						exec(`ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${ranw}`, (err) => {
							fs.unlinkSync(ranp)
							if (err) return reply(mess.error.stick)
							pras.sendMessage(from, fs.readFileSync(ranw), sticker, { quoted: mek })
							fs.unlinkSync(ranw)
						})
					})
				} else {
					reply(`Kirim gambar dengan caption ${prefix}sticker atau tag gambar yang sudah dikirim`)
				}
				break
			case 'addbadword':
				if (!isOwner) return reply(mess.only.ownerB)
				if (!isGroupAdmins) return reply(mess.only.admin)
				const bw = body.slice(12)
				bad.push(bw)
				fs.writeFileSync('./database/json/bad.json', JSON.stringify(bad))
				reply('Success ✓')
				break
			case 'dellbadword':
				if (!isOwner) return reply(mess.only.ownerB)
				if (!isGroupAdmins) return reply(mess.only.admin)
				let dbw = body.slice(12)
				bad.splice(dbw)
				fs.writeFileSync('./database/json/bad.json', JSON.stringify(bad))
				reply('Success ✓')
				break
			case 'listbadword':
			case 'lb':
				let lbw = `list BAD WORD\nTotal : ${bad.length}\n`
				for (let i of bad) {
					lbw += `➸ ${i.replace(bad)}\n`
				}
				reply(lbw)
				break
			case 'toimg':
				if (!isQuotedSticker) return reply(' reply stickernya gan')
				encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo
				media = await pras.downloadAndSaveMediaMessage(encmedia, './database/media_user')
				ran = getRandom('.png')
				exec(`ffmpeg -i ${media} ${ran}`, (err) => {
					fs.unlinkSync(media)
					if (err) return reply(' Gagal, pada saat mengkonversi sticker ke gambar ')
					buffer = fs.readFileSync(ran)
					costum(buffer, image, Verived, weem)
					fs.unlinkSync(ran)
				})
				break
			case 'tomp3':
				if (isBanned) return reply(mess.only.benned)

				pras.updatePresence(from, Presence.recording)
				if (!isQuotedVideo) return reply('_*Reply Video nya Gan!*_')
				reply(mess.wait)
				encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo
				media = await pras.downloadAndSaveMediaMessage(encmedia, './database/media_user')
				ran = getRandom('.mp4')
				exec(`ffmpeg -i ${media} ${ran}`, (err) => {
					fs.unlinkSync(media)
					if (err) return reply('Gagal, pada saat mengkonversi video ke mp3')
					bufferlkj = fs.readFileSync(ran)
					pras.sendMessage(from, bufferlkj, audio, { mimetype: 'audio/mp4', quoted: mek })
					fs.unlinkSync(ran)
				})
				break
			case 'tovideo':

				if (!isQuotedSticker) return reply('*☒* Reply stikernya')
				reply(mess.wait)
				anumedia = JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo
				anum = await pras.downloadAndSaveMediaMessage(anumedia, './database/media_user')
				ran = getRandom('.webp')
				exec(`ffmpeg -i ${anum} ${ran}`, (err) => {
					fs.unlinkSync(anum)
					//if (err) return reply('Gagal, pada saat mengkonversi sticker ke Video')
					buffer = fs.readFileSync(ran)
					pras.sendMessage(from, buffer, video, { quoted: mek, caption: 'Buat apa sii..' })
					fs.unlinkSync(ran)
				})
				break
			//========================================(FITUR ANTI2 AN)==============================================

			case 'antivirtex':
				if (isBanned) return reply(mess.only.benned)

				if (!isGroup) return reply(mess.only.group)
				if (!isGroupAdmins) return reply(mess.only.admin)
				if (!isBotGroupAdmins) return reply(mess.only.Badmin)
				if (args.length < 1) return reply('ketik on untuk mengaktifkan')
				if ((args[0]) === 'on') {
					if (isAntiVirtex) return reply('anti virtex group sudah aktif')
					_antivirtex.push(from)
					fs.writeFileSync('./database/json/antivirtex.json', JSON.stringify(_antivirtex))
					reply(`\`\`\`Sukses mengaktifkan mode anti virtex di group\`\`\` *${groupMetadata.subject}*`)
				} else if ((args[0]) === 'off') {
					if (!isAntiVirtex) return reply('Mode anti virtex sudah nonaktif')
					_antivirtex.splice(from, 1)
					fs.writeFileSync('./database/json/antivirtex.json', JSON.stringify(_antivirtex))
					reply(`\`\`\`✓Sukes menonaktifkan mode anti virtex di group\`\`\` *${groupMetadata.subject}*`)
				} else {
					reply('on untuk mengaktifkan, off untuk menonaktifkan')
				}
				break
			case 'antilink':
				if (!isGroup) return reply(mess.only.group)
				if (!isGroupAdmins) return reply(mess.only.admin)
				if (!isBotGroupAdmins) return reply(mess.only.Badmin)
				if (args.length < 1) return reply('ketik !antilink on untuk mengaktifkan')
				if ((args[0]) === 'on') {
					if (isAntiLink) return reply('anti link sudah on')
					_antilink.push(from)
					fs.writeFileSync('./database/json/antilink.json', JSON.stringify(_antilink))
					reply(`\`\`\`✓Sukses mengaktifkan fitur anti link di group\`\`\` *${groupMetadata.subject}*`)
				} else if ((args[0]) === 'off') {
					if (!isAntiLink) return reply('anti link sudah off sebelumnya')
					_antilink.splice(from, 1)
					fs.writeFileSync('./database/json/antilink.json', JSON.stringify(_antilink))
					reply(`\`\`\`✓Sukses menonaktifkan fitur anti link di group\`\`\` *${groupMetadata.subject}*`)
				} else {
					reply('on untuk mengaktifkan, off untuk menonaktifkan')
				}
				break
			case 'badword':
				if (!isGroup) return reply(mess.only.group)
				if (!isGroupAdmins) return reply(mess.only.admin)
				if (!isBotGroupAdmins) return reply(mess.only.Badmin)
				if (args.length < 1) return reply('ketik !badword on untuk mengaktifkan')
				if ((args[0]) === 'on') {
					if (isBadWord) return reply('anti badword sudah aktif')
					_badword.push(from)
					fs.writeFileSync('./database/json/badword.json', JSON.stringify(_badword))
					reply(`\`\`\`✓Sukses mengaktifkan fitur anti badword di group\`\`\` *${groupMetadata.subject}*`)
				} else if ((args[0]) === 'off') {
					if (!isBadWord) return reply('anti badword sudah off sebelumnya')
					_badword.splice(from, 1)
					fs.writeFileSync('./database/json/badword.json', JSON.stringify(_badword))
					reply(`\`\`\`✓Sukses menonaktifkan fitur anti badword di group\`\`\` *${groupMetadata.subject}*`)
				} else {
					reply('on untuk mengaktifkan, off untuk menonaktifkan')
				}
				break

			case 'welcome':
				if (!isGroup) return reply(mess.only.group)
				if (!isGroupAdmins) return reply(mess.only.admin)
				if (args.length < 1) return reply('ketik !welcome on untuk mengaktifkan')
				if ((args[0]) === 'on') {
					if (isWelkom) return reply('welcome sudah aktif')
					_welkom.push(from)
					fs.writeFileSync('./database/json/welkom.json', JSON.stringify(_welkom))
					reply(`\`\`\`✓Sukses mengaktifkan fitur welcome di group\`\`\` *${groupMetadata.subject}*`)
				} else if ((args[0]) === 'off') {
					if (!isWelkom) return reply('welcome sudah off sebelumnya')
					_welkom.splice(from, 1)
					fs.writeFileSync('./database/json/welkom.json', JSON.stringify(_welkom))
					reply(`\`\`\`✓Sukses menonaktifkan fitur welcome di group\`\`\` *${groupMetadata.subject}*`)
				} else {
					reply('on untuk mengaktifkan, off untuk menonaktifkan')
				}
				break

			//========================================(FITUR SETING )==============================================

			case 'setprefix':
				if (args.length < 1) return
				if (!isOwner) return reply(mess.only.ownerB)
				prefix = args[0]
				setting.prefix = prefix
				fs.writeFileSync('./database/json/settings.json', JSON.stringify(setting, null, '\t'))
				reply(`Prefix berhasil di ubah menjadi : ${prefix}`)
				break
			case 'setnamebot':
				if (args.length < 1) return
				if (!isOwner) return reply(mess.only.ownerB)
				name = args[0]
				setting.name = name
				fs.writeFileSync('./database/json/settings.json', JSON.stringify(setting, null, '\t'))
				reply(`Nama Bot berhasil di ubah menjadi : ${name}`)
				break
			case 'setreply':
				if (!isOwner) return reply(mess.only.ownerB)
				pras.updatePresence(from, Presence.composing)
				if (args.length < 1) return
				weem = args[0]
				setting.botinfo = weem
				fs.writeFileSync('./database/json/settings.json', JSON.stringify(setting, null, '\t'))
				reply(`reply berhasil di ubah menjadi : ${botinfo}`)
				break
			case 'setmemlimit':
				if (!isOwner) return reply(mess.only.ownerB)
				pras.updatePresence(from, Presence.composing)
				if (args.length < 1) return
				lim = args[0]
				memberLimit = lim
				//fs.writeFileSync('./database/json/settings.json', JSON.stringify(setting, null, '\t'))
				reply(`reply berhasil di ubah menjadi : ${memberLimit}`)
				break
			case 'setppbot':
				if (!isOwner) return reply(mess.only.ownerB)
				pras.updatePresence(from, Presence.composing)
				if (!isQuotedImage) return reply(`Kirim gambar dengan caption ${prefix}setbotpp atau tag gambar yang sudah dikirim`)
				enmedia = JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo
				media = await pras.downloadAndSaveMediaMessage(encmedia, './database/media_user')
				await pras.updateProfilePicture(botNumber, media)
				reply('Makasih profil barunya🙂')
				break

			//========================================(FITUR FITUR ZERO )==============================================

			case 'vapor':
				if (args.length < 1) return reply("text nya mana ?")
				reply(vapor(`${args[0]}`))
				break
			case 'makevirtex':
				if (args.length < 1) return reply("text nya mana ?")
				reply(zalgo(`${args[0]}`))
				break
			case 'slow':
				reply(mess.wait)
				encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo
				media = await pras.downloadAndSaveMediaMessage(encmedia, './database/media_user')
				ran = getRandom('.mp3')
				exec(`ffmpeg -i ${media} -filter:a "atempo=0.7,asetrate=44100" ${ran}`, (err, stderr, stdout) => {
					fs.unlinkSync(media)
					if (err) return reply('Error!')
					hah = fs.readFileSync(ran)
					pras.sendMessage(from, hah, audio, { mimetype: 'audio/mp4', ptt: true, quoted: mek })
					fs.unlinkSync(ran)
				})
				break
			case 'gemuk':
				reply(mess.wait)
				encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo
				media = await pras.downloadAndSaveMediaMessage(encmedia, './database/media_user')
				ran = getRandom('.mp3')
				exec(`ffmpeg -i ${media} -filter:a "atempo=1.6,asetrate=22100" ${ran}`, (err, stderr, stdout) => {
					fs.unlinkSync(media)
					if (err) return reply('Error!')
					hah = fs.readFileSync(ran)
					pras.sendMessage(from, hah, audio, { mimetype: 'audio/mp4', ptt: true, quoted: mek })
					fs.unlinkSync(ran)
				})
				break
			case 'tupai':
				reply(mess.wait)
				encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo
				media = await pras.downloadAndSaveMediaMessage(encmedia, './database/media_user')
				ran = getRandom('.mp3')
				exec(`ffmpeg -i ${media} -filter:a "atempo=0.5,asetrate=65100" ${ran}`, (err, stderr, stdout) => {
					fs.unlinkSync(media)
					if (err) return reply('Error!')
					hah = fs.readFileSync(ran)
					pras.sendMessage(from, hah, audio, { mimetype: 'audio/mp4', ptt: true, quoted: mek })
					fs.unlinkSync(ran)
				})
				break
			case 'toptt':
				reply(mess.wait)
				encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo
				media = await pras.downloadAndSaveMediaMessage(encmedia, './database/media_user')
				ran = getRandom('.mp3')
				exec(`ffmpeg -i ${media} ${ran}`, (err) => {
					fs.unlinkSync(media)
					if (err) return reply('Gagal mengkonversi audio ke ptt')
					topt = fs.readFileSync(ran)
					pras.sendMessage(from, topt, audio, { mimetype: 'audio/mp4', quoted: mek, ptt: true })
				})
				break
			case 'bass':
				reply(mess.wait)
				encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo
				media = await pras.downloadAndSaveMediaMessage(encmedia, './database/media_user')
				ran = getRandom('.mp3')
				exec(`ffmpeg -i ${media} -af equalizer=f=94:width_type=o:width=2:g=30 ${ran}`, (err, stderr, stdout) => {
					fs.unlinkSync(media)
					if (err) return reply('Error!')
					hah = fs.readFileSync(ran)
					pras.sendMessage(from, hah, audio, { mimetype: 'audio/mp4', ptt: true, quoted: mek })
					fs.unlinkSync(ran)
				})
				break
			case 'brainly':

				if (isBanned) return reply(mess.only.benned)
				brien = body.slice(9)
				brainly(`${brien}`).then(res => {
					teks = '❉───────────────────────❉\n'
					for (let Y of res.data) {
						teks += `\n*「 _BRAINLY_ 」*\n\n*➸ Pertanyaan:* ${Y.pertanyaan}\n\n*➸ Jawaban:* ${Y.jawaban[0].text}\n❉───────────────────────❉\n`
					}
					costum(teks, text, weem, `Ciee Cari Jawaban Yaa😂\nFollow IG: @sgt_prstyo`)
					console.log(res)
				})
				break
			case 'ocr':
				if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
					const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : mek
					const media = await pras.downloadAndSaveMediaMessage(encmedia, './database/media_user')
					reply(mess.wait)
					await recognize(media, { lang: 'eng+ind', oem: 1, psm: 3 })
						.then(teks => {
							reply(teks.trim())
							fs.unlinkSync(media)
						})
						.catch(err => {
							reply(err.message)
							fs.unlinkSync(media)
						})
				} else {
					reply('Foto aja gan Jangan Video')
				}
				break
			case 'img2url':

				//if (!isPublic) return reply(mess.only.publikG)
				if (isBanned) return reply(mess.only.benned)
				reply(mess.wait)
				var encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : mek
				var media = await pras.downloadAndSaveMediaMessage(encmedia, './database/media_user')
				var imgbb = require('imgbb-uploader')
				imgbb('3b8594f4cb11895f4084291bc655e510', media)
					.then(data => {
						var caps = `╭─「 *IMGBB TO URL* 」\n│\n*│• ID :* ${data.id}\n*│• MimeType :* ${data.image.mime}\n*│• Extension :* ${data.image.extension}\n│\n*│• URL :* ${data.display_url}\n╰─────────────────────`
						ibb = fs.readFileSync(media)
						pras.sendMessage(from, ibb, image, { quoted: mek, caption: caps })
					})
					.catch(err => {
						throw err
					})
				break
			case 'owner':
			case 'creator':
				pras.sendMessage(from, { displayname: "jeff", vcard: vcard }, MessageType.contact, { quoted: mek })
				reply('wa.me/6283862953105 tuh sv aja ntar bakal di sv back kok,tapi jan spam ya lagi sibuk soalnya')
				break
			case 'fitnah':
				if (isBanned) return reply(mess.only.benned)

				//if (!isPublic) return reply(mess.only.publikG)
				if (args.length < 1) return reply(`Usage :\n${prefix}fitnah [@tag/pesan/balasanbot]]\n\nEx : \n${prefix}fitnah @tagmember/hai/hai juga`)
				var gh = body.slice(8)
				mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
				var replace = gh.split("/")[0];
				var target = gh.split("/")[1];
				var bot = gh.split("/")[2];
				pras.sendMessage(from, `${bot}`, text, { quoted: { key: { fromMe: false, participant: `${mentioned}`, ...(from ? { remoteJid: from } : {}) }, message: { conversation: `${target}` } } })
				break
			case 'gantengcek':
			case 'cekganteng':
				if (isBanned) return reply(mess.only.benned)


				ganteng = body.slice(12)
				const gan = ['10%', '30%', '20%', '40%', '50%', '60%', '70%', '62%', '74%', '83%', '97%', '100%', '29%', '94%', '75%', '82%', '41%', '39%']
				const teng = gan[Math.floor(Math.random() * gan.length)]
				pras.sendMessage(from, 'Pertanyaan : Cek Ganteng Bang *' + ganteng + '*\n\nJawaban : ' + teng + '', text, { quoted: mek })
				break
			case 'cantikcek':
			case 'cekcantik':
				if (isBanned) return reply(mess.only.benned)


				cantik = body.slice(11)
				if (args.length < 1) return reply('Yg Mau dicek Siapa Kak??')
				const can = ['10% banyak" perawatan ya kak:v\nCanda Perawatan:v', '30% Semangat Kaka Merawat Dirinya><', '20% Semangat Ya Kaka👍', '40% Wahh Kaka><', '50% kaka cantik deh><', '60% Hai Cantik🐊', '70% Hai Ukhty??', '62% Kakak Cantik><', '74% Kakak ni cantik deh><', '83% Love You Kakak><', '97% Assalamualaikum Ukhty🐊', '100% Kakak Pake Susuk ya??:v', '29% Semangat Kakak:)', '94% Hai Cantik><', '75% Hai Kakak Cantik', '82% wihh Kakak Pasti Sering Perawatan kan??', '41% Semangat:)', '39% Lebih Semangat🐊']
				const tik = can[Math.floor(Math.random() * can.length)]
				pras.sendMessage(from, 'Pertanyaan : Cantik Cek Kakak *' + cantik + '*\n\nPersen Kecantikan : ' + tik + '', text, { quoted: mek })
				break
			case 'tts':
				if (isBanned) return reply(mess.only.benned)


				if (args.length < 1) return pras.sendMessage(from, 'Kode bahasanya mana gan?\n Kalo Gatau Kode Bahasanya Apa Aja Ketik Saja *${prefix}bahasa*', text, { quoted: mek })
				const gtts = require('./lib/gtts')(args[0])
				if (args.length < 2) return pras.sendMessage(from, 'Textnya mana gan?', text, { quoted: mek })
				dtt = body.slice(8)
				ranm = getRandom('.mp3')
				rano = getRandom('.ogg')
				dtt.length > 600
					? reply('Textnya kebanyakan gan')
					: gtts.save(ranm, dtt, function () {
						exec(`ffmpeg -i ${ranm} -ar 48000 -vn -c:a libopus ${rano}`, (err) => {
							fs.unlinkSync(ranm)
							buff = fs.readFileSync(rano)
							if (err) return reply('Gagal gan:(')
							reply(mess.wait)
							pras.sendMessage(from, buff, audio, { quoted: mek, ptt: true })
							fs.unlinkSync(rano)
						})
					})
				break
			case 'apakah':
				if (isBanned) return reply(mess.only.benned)


				apakah = body.slice(1)
				const apakahh = ["Ya", "Tidak", "Ga tau", "ga mungkin", "bisa jadi", "mungkin"]
				const kah = apakahh[Math.floor(Math.random() * apakahh.length)]
				pras.sendMessage(from, 'Pertanyaan : *' + apakah + '*\n\nJawaban : ' + kah, text, { quoted: mek })
				break
			case 'rate':
				if (isBanned) return reply(mess.only.benned)


				rate = body.slice(1)
				ratee = ["100%", "95%", "90%", "85%", "80%", "75%", "70%", "65%", "60%", "55%", "50%", "45%", "40%", "35%", "30%", "25%", "20%", "15%", "10%", "5%"]
				const te = ratee[Math.floor(Math.random() * ratee.length)]
				pras.sendMessage(from, 'Pertanyaan : *' + rate + '*\n\nJawaban : ' + te + '', text, { quoted: mek })
				break
			case 'watak':
				if (isBanned) return reply(mess.only.benned)


				watak = body.slice(1)
				wa = ["penyayang", "pemurah", "Pemarah", "Pemaaf", "Penurut", "Baik", "baperan", "Baik Hati", "penyabar", "Uwu", "top deh, pokoknya", "Suka Membantu"]
				const tak = wa[Math.floor(Math.random() * wa.length)]
				pras.sendMessage(from, 'Pertanyaan : *' + watak + '*\n\nJawaban : ' + tak, text, { quoted: mek })
				break
			case 'hobby':
				if (isBanned) return reply(mess.only.benned)


				hobby = body.slice(1)
				hob = ["ngeue sapi", "ngeue kambing", "Memasak", "Membantu Atok", "Mabar", "Nobar", "Sosmed an", "Membantu Orang lain", "Nonton Anime", "Nonton Drakor", "Naik Motor", "Nyanyi", "Menari", "Bertumbuk", "Menggambar", "Foto fotoan Ga jelas", "Maen Game", "Berbicara Sendiri"]
				const by = hob[Math.floor(Math.random() * hob.length)]
				pras.sendMessage(from, 'Pertanyaan : *' + hobby + '*\n\nJawaban : ' + by, text, { quoted: mek })
				break
			case 'bisakah':
				if (isBanned) return reply(mess.only.benned)


				bisakah = body.slice(1)
				const bisakahh = ["Bisa", "Tidak Bisa", "Ga tau", "mungkin"]
				const keh = bisakahh[Math.floor(Math.random() * bisakahh.length)]
				pras.sendMessage(from, 'Pertanyaan : *' + bisakah + '*\n\nJawaban : ' + keh, text, { quoted: mek })
				break
			case 'kapankah':
				if (isBanned) return reply(mess.only.benned)


				kapankah = body.slice(1)
				const kapankahh = ["1 Minggu lagi", "1 Bulan lagi", "1 Tahun lagi", "100 tahun lagi", "gatau", "2030", "1 Jam lagi", "1 Menit lagi"]
				const koh = kapankahh[Math.floor(Math.random() * kapankahh.length)]
				pras.sendMessage(from, 'Pertanyaan : *' + kapankah + '*\n\nJawaban : ' + koh, text, { quoted: mek })
				break
			case 'truth':
				if (isBanned) return reply(mess.only.benned)


				anu = await fetchJson(`https://xptnbotapinew.herokuapp.com/?truth&apikey=xptn`, { method: 'get' })
				ttrth = `${anu.Dare}`
				truteh = await getBuffer(`https://i.ibb.co/305yt26/bf84f20635dedd5dde31e7e5b6983ae9.jpg`)
				pras.sendMessage(from, truteh, image, { caption: '*Truth*\n\n' + ttrth, quoted: mek })
				break
			case 'dare':
				if (isBanned) return reply(mess.only.benned)


				anu = await fetchJson(`https://xptnbotapinew.herokuapp.com/?dare&apikey=xptn`, { method: 'get' })
				der = `${anu.Dare}`
				tod = await getBuffer(`https://i.ibb.co/305yt26/bf84f20635dedd5dde31e7e5b6983ae9.jpg`)
				pras.sendMessage(from, tod, image, { quoted: mek, caption: '*Dare*\n\n' + der })
				break
			case 'quotes':
				pras.updatePresence(from, Presence.composing)
				if (isBanned) return reply(mess.only.benned)

				data = fs.readFileSync('./Prasz/quotes.js');
				jsonData = JSON.parse(data);
				randIndex = Math.floor(Math.random() * jsonData.length);
				randKey = jsonData[randIndex];
				randQuote = 'Author: *' + randKey.author + '*\n\n*' + randKey.quotes + '*'
				pras.sendMessage(from, randQuote, text, { quoted: mek })
				break
			case 'darkjokes':
				pras.updatePresence(from, Presence.composing)
				if (isBanned) return reply(mess.only.benned)


				reply(mess.wait)
				data = fs.readFileSync('./Prasz/drak.js');
				jsonData = JSON.parse(data);
				randIndex = Math.floor(Math.random() * jsonData.length);
				randKey = jsonData[randIndex];
				darkjokes = await getBuffer(randKey.result)
				pras.sendMessage(from, darkjokes, image, { quoted: mek, caption: '\`\`\`DARK JOKES\`\`\`' })
				break
			case 'katailham':
				if (isBanned) return reply(mess.only.benned)


				hasil = katailham[Math.floor(Math.random() * (katailham.length))]
				pras.sendMessage(from, '*' + hasil + '*', text, { quoted: mek })
				break
			case 'persengay':
			case 'gaypersen':


				if (args.length < 1) return reply('tag temanmu!')
				rate = body.slice(11)
				persengayy = ["*4%*\n\n*Tobat Ngegay Gan:v*", "*9%*\n\n*OTW Tobat Gan:v*", "*17%*\n\n*Kang Coli*", "*28%*\n\n*Buset Dah Gay🤦*", "*34%*\n\n *Korban Tusbol*", "*48%*\n\n*Kang Hunter Bool:v*", "*59%*\n\n *Bahaya Ni Orang Gan*", "*62%*\n\n*Hati² Sama Ni Orang Beneran Dah*", "*74%*\n\n*Astagfirullah Kabur Gan🏃🌬️*", "83%\n\n Yaallah Nak🤦", "97%\n\nAstagfirullah🤦", "100%\n\nKabur ae Gan Daripada Ditusbol Bool lu🏃", "29%\n\n amann:v", "94%\n\n Yaallah🏃", "75%\n\nHadehh Gay🤦", "82%\n\nMending Lu Tobat Dah🏃", "41%\n\nSering Cari Bool Diperempatan", "39%\n\nSering Tusbol Bool Topan🏃"]
				const kl = persengayy[Math.floor(Math.random() * persengayy.length)]
				pras.sendMessage(from, 'Persen Gay: *' + rate + '*\n\nJawaban : ' + kl + '', text, { quoted: mek })
				break
			case 'persenbucin':


				if (args.length < 1) return reply('Mana Nama?')
				rate = body.slice(8)
				persenbucin = ["4%\n\nHadehh🤦", "9%\n\nMasih Kecil Dah Bucin Ae", "17%\n\nNakk Masih Kecil", "28%\n\nYoalahh hmm", "34%\n\nMayan Lah", "48%\n\nGatau", "59%\n\nBiasa Kang Bucin", "62%\n\n Hadehhh🏃", "74%\n\n bucen Teroosss", "83%\n\n Sekali² kek Ga bucin Gitu", "97%\n\nHadehh Pakboi²", "100%\n\nHadehhh Ini Bukan Bucin Tapi Pakboi", "29%\n\nKasian Mana Masih Muda", "94%\n\n Dasar Pakboi", "75%\n\n Ya Ampun"]
				const pbucin = persenbucin[Math.floor(Math.random() * persenbucin.length)]
				pras.sendMessage(from, 'Persen Bucin Kak: *' + rate + '*\n\nJawaban : ' + pbucin + '', text, { quoted: mek })
				break
			case 'caklontong':
				if (isBanned) return reply(mess.only.benned)


				data = fs.readFileSync('./Prasz/caklontong.js');
				cak = JSON.parse(data);
				lontong = Math.floor(Math.random() * cak.length);
				randKey = cak[lontong];
				Pertanyaan = randKey.result.soal
				Jawaban = '\n*' + randKey.result.desc + '*'
				setTimeout(() => {
					pras.sendMessage(from, Jawaban, text, { quoted: mek })
				}, 30000)
				setTimeout(() => {
					pras.sendMessage(from, '_10 Detik lagi…_', text) // ur cods
				}, 20000) // 1000 = 1s,
				setTimeout(() => {
					pras.sendMessage(from, '_20 Detik lagi_…', text) // ur cods
				}, 10000) // 1000 = 1s,
				setTimeout(() => {
					pras.sendMessage(from, '_30 Detik lagi_…', text) // ur cods
				}, 2500) // 1000 = 1s
				pras.sendMessage(from, Pertanyaan, text, { quoted: mek })
				break
			case 'tebakgambar':
				if (isBanned) return reply(mess.only.benned)


				data = fs.readFileSync('./Prasz/tebakgambar.js');
				jsonData = JSON.parse(data);
				randIndex = Math.floor(Math.random() * jsonData.length);
				randKey = jsonData[randIndex];
				randSoal = await getBuffer(randKey.result.soalImg)
				setTimeout(() => {
					pras.sendMessage(from, '*➸ Jawaban :* ' + randKey.result.jawaban + '\n', text, { quoted: mek }) // ur cods
				}, 30000) // 1000 = 1s,
				setTimeout(() => {
					pras.sendMessage(from, '_10 Detik lagi…_', text) // ur cods
				}, 20000) // 1000 = 1s,
				setTimeout(() => {
					pras.sendMessage(from, '_20 Detik lagi_…', text) // ur cods
				}, 10000) // 1000 = 1s,
				setTimeout(() => {
					pras.sendMessage(from, '_30 Detik lagi_…', text) // ur cods
				}, 2500) // 1000 = 1s,
				setTimeout(() => {
					pras.sendMessage(from, randSoal, image, { caption: '_Jelaskan Apa Maksud Gambar Ini_', quoted: mek }) // ur cods
				}, 0) // 1000 = 1s,
				break
			case 'family100':
				if (isBanned) return reply(mess.only.benned)


				data = fs.readFileSync('./Prasz/family100.js');
				fami = JSON.parse(data);
				ly100 = Math.floor(Math.random() * fami.length);
				randKey = fami[ly100];
				Pertanyaan = randKey.result.soal
				setTimeout(() => {
					pras.sendMessage(from, '*➸ Jawaban :* \n```' + randKey.result.jawaban + '```', text, { quoted: mek }) // ur cods
				}, 30000) // 1000 = 1s,
				setTimeout(() => {
					reply('_Waktu Anda Habis_')
				}, 29000)
				setTimeout(() => {
					pras.sendMessage(from, '_10 Detik lagi…_', text) // ur cods
				}, 20000) // 1000 = 1s,
				setTimeout(() => {
					pras.sendMessage(from, '_20 Detik lagi_…', text) // ur cods
				}, 10000) // 1000 = 1s,
				setTimeout(() => {
					pras.sendMessage(from, '_30 Detik lagi_…', text) // ur cods
				}, 2500) // 1000 = 1s,
				setTimeout(() => {
					pras.sendMessage(from, '*' + Pertanyaan + '*', text, { quoted: mek }) // ur cods
				}, 0) // 1000 = 1s,
				break
			case 'asupan':
				pras.updatePresence(from, Presence.composing)
				try {
					if (isBanned) return reply(mess.only.benned)


					reply(mess.wait)
					data = fs.readFileSync('./Prasz/asupan.js');
					jsonData = JSON.parse(data);
					randIndex = Math.floor(Math.random() * jsonData.length);
					randKey = jsonData[randIndex];
					asupan = await getBuffer(randKey.result)
					pras.sendMessage(from, asupan, video, { quoted: mek, caption: '```ASUPAN NIH:V```' })
				} catch {
					reply(mess.error.bug)
				}
				break
			case 'bucin':
				if (isBanned) return reply(mess.only.benned)

				hasil = bucinrandom[Math.floor(Math.random() * (bucinrandom.length))]
				pras.sendMessage(from, '*' + hasil + '*', text, { quoted: mek })
				break
			case 'bacotandilan':
				if (isBanned) return reply(mess.only.benned)

				hasil = randomdilan[Math.floor(Math.random() * (randomdilan.length))]
				pras.sendMessage(from, '*' + hasil + '*\n\n~ *Dilan*', text, { quoted: mek })
				break
			case 'antivirtexx':
				await costum(antivirtexx(), text, Verived, `Buset Dahh Etekel🔥`)
				break
			case 'addbucin':
				if (!isOwner) return reply(mess.only.ownerB)
				huu = body.slice(10)
				bucinrandom.push(huu)
				fs.writeFileSync('./database/json/bucin.json', JSON.stringify(bucinrandom))
				reply(`Sukses, Kata \n*${huu}*\n Telah Ditambahkan ke database`)
				break
			case 'report':
				if (isBanned) return reply(mess.only.benned)


				const pesan = body.slice(8)
				if (pesan.length > 300) return pras.sendMessage(from, 'Maaf Teks Terlalu Panjang, Maksimal 300 Teks', text, { quoted: mek })
				var nomor = mek.participant
				const teks1 = `*[REPORT]*\nNomor : @${nomor.split("@s.whatsapp.net")[0]}\nPesan : ${pesan}`
				var options = {
					text: teks1,
					contextInfo: { mentionedJid: [nomor] },
				}
				pras.sendMessage(`6283862323152@s.whatsapp.net`, options, text, { quoted: mek })
				reply('Masalah telah di laporkan ke owner BOT, laporan palsu/main2 tidak akan ditanggapi.')
				break

			//========================================(FITUR KLO MO NAMBAH FITUR DISINI AE)==============================================



			default:
		}
	} catch (e) {
		e = String(e)
		if (!e.includes("this.isZero") && !e.includes("jid")) {
			console.log('Error : %s', color(e, 'red'))
		}
	}
}









/*by prasss
base zerobot
thxto
mhankbarbar
Fxc7
ZeroTeam
#banyak yg copas bang jan dihujatt
bolleh make / kembangin asal jan dijual
janggan hps credits ya bro
*/