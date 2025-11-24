const { makeid } = require('./gen-id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    Browsers,
    makeCacheableSignalKeyStore,
    getAggregateVotesInPollMessage,
    DisconnectReason,
    WA_DEFAULT_EPHEMERAL,
    jidNormalizedUser,
    proto,
    getDevice,
    generateWAMessageFromContent,
    fetchLatestBaileysVersion,
    makeInMemoryStore,
    getContentType,
    generateForwardMessageContent,
    downloadContentFromMessage,
    jidDecode
} = require('baileys');

const { upload } = require('./mega');

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    async function MAWRLD_MD_PAIR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);
        try {
            // Select a random Windows browser
            var items = ["Edge", "Chrome", "Firefox"];
            function selectRandomItem(array) {
                var randomIndex = Math.floor(Math.random() * array.length);
                return array[randomIndex];
            }
            var randomItem = selectRandomItem(items);

            let sock = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(
                        state.keys,
                        pino({ level: "fatal" }).child({ level: "fatal" })
                    ),
                },
                printQRInTerminal: false,
                generateHighQualityLinkPreview: true,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                syncFullHistory: false,
                browser: Browsers.windows(randomItem)
            });

            if (!sock.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await sock.requestPairingCode(num);
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            sock.ev.on('creds.update', saveCreds);

            sock.ev.on("connection.update", async (update) => {
                const { connection, lastDisconnect } = update;

                if (connection === "open") {
                    await delay(5000);

                    let credsFilePath = __dirname + `/temp/${id}/creds.json`;
                    let data = fs.readFileSync(credsFilePath);

                    function generateRandomText() {
                        const prefix = "3EB";
                        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                        let randomText = prefix;
                        for (let i = prefix.length; i < 22; i++) {
                            const randomIndex = Math.floor(Math.random() * characters.length);
                            randomText += characters.charAt(randomIndex);
                        }
                        return randomText;
                    }

                    const randomText = generateRandomText();

                    try {
                        const mega_url = await upload(fs.createReadStream(credsFilePath), `${sock.user.id}.json`);
                        const string_session = mega_url.replace('https://mega.nz/file/', '');
                        let md = "Nebula~" + string_session;
                        let codeMsg = await sock.sendMessage(sock.user.id, { text: md });

   let desc = `
╭━━ ❉*Hey there, ${sock.user.name}!* ❉ ━━╮
┃ ✦➤
┃ ✦➤Thanks for using *NEBULA MD* 
┃ ✦➤your session has been successfully created!
┃ ✦➤🔐 *Session ID:* Sent above  
┃ ✦➤⚠️ *Keep it safe!* Don't share with anyone./
┃ ✦➤
┃ ✦➤*✅ Stay Updated:*  
┃ ✦➤Join our official WhatsApp Channel:  
https://whatsapp.com/channel/0029VasAQRiGk1FtXGUz5T2V
┃ ✦➤
╰━━━━━━━━━━━━━━━━━━━╯
> *©Cʀᴇᴀᴛᴇᴅ ʙʏ Rɪᴅᴢ Cᴏᴅᴇʀ*`;

                        await sock.sendMessage(
                            sock.user.id,
                            {
                                text: desc,
                                contextInfo: {
                                    externalAdReply: {
                                        title: "NEBULA MD",
                                        thumbnailUrl: "https://i.ibb.co/LDbPq08m/20250925-215638.png",
                                        sourceUrl: "https://whatsapp.com/channel/0029VasAQRiGk1FtXGUz5T2V",
                                        mediaType: 1,
                                        renderLargerThumbnail: true
                                    }
                                }
                            },
                            { quoted: codeMsg }
                        );

                    } catch (e) {
                        console.log("Error sending session:", e);
                    }

                    await delay(10);
                    await sock.ws.close();
                    await removeFile('./temp/' + id);
                    console.log(`👤 ${sock.user.id} Connected ✅ Restarting process...`);
                    await delay(10);
                    process.exit();

                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10);
                    MAWRLD_MD_PAIR_CODE();
                }
            });

        } catch (err) {
            console.log("Service restarted due to error:", err);
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.send({ code: "❗ Service Unavailable" });
            }
        }
    }

    return await MAWRLD_MD_PAIR_CODE();
});

module.exports = router;