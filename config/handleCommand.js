const db = require('./config').db;
const path = require('path')
const fs = require('fs');
const {preventSpam} =  require('../lib/antiSpam');
const kataTerlarang = [
  /\banjg\b/i, /\bajg\b/i, /\banal\b/i, /\basu\b/i, /\bass\b/i, /\banjing\b/i, /\banjeng\b/i, /\bbajingan\b/i,
  /\bbgst\b/i, /\bbangsat\b/i, /\bbabi\b/i, /\bcuk\b/i, /\bcok\b/i, /\bcukimai\b/i, /\bdancok\b/i, /\bdancuk\b/i,
  /\bentot\b/i, /\bewe\b/i, /\bengas\b/i, /\bebol\b/i, /\bjingkontot\b/i, /\bjing\b/i, /\bjink\b/i, /\bjembut\b/i,
  /\bjembod\b/i, /\bjmbd\b/i, /\bkon\b/i, /\bkontot\b/i, /\bkontol\b/i, /\bkntl\b/i, /\bkentot\b/i, /\bkintil\b/i,
  /\bkimak\b/i, /\bler\b/i, /\bmemek\b/i, /\bmek\b/i, /\bmmk\b/i, /\bmeki\b/i, /\bngen\b/i, /\bngentot\b/i,
  /\bnigga\b/i, /\bni99a\b/i, /\bnenen\b/i, /\bpantek\b/i, /\bpanteq\b/i, /\bpntek\b/i, /\bpntk\b/i, /\bpler\b/i,
  /\bpepek\b/i, /\bpendo\b/i, /\bppk\b/i, /\bpuki\b/i, /\bpukimak\b/i, /\bpentek\b/i, /\bpukima\b/i, /\bsu\b/i,
  /\bsange\b/i, /\bsagne\b/i, /\bsat\b/i, /\btot\b/i, /\btolol\b/i, /\btll\b/i, /\bttt\b/i, /\btitit\b/i,
  /\btai\b/i, /\btod\b/i
];

const commands = {};
const adminCommands = {}
fs.readdirSync(path.join(__dirname, '../commands')).forEach(file => {
  if(file.endsWith('.js')) {
    const commandName = file.replace('.js', '');
    try {
      commands[commandName] = require(`../commands/${file}`);
      console.log(`Loaded command: ${commandName}`);
    } catch (error) {
      console.error(`Failed to load command ${commandName}:`, error);
    }
  }
});
fs.readdirSync(path.join(__dirname, '../commands/adminCommand')).forEach(file => {
  if(file.endsWith('.js')) {
    const adminCommandName = file.replace('.js', '');
    try {
      adminCommands[adminCommandName] = require(`../commands/adminCommand/${file}`);
      console.log(`Loaded Admin command: ${adminCommandName}`);
    } catch (error) {
      console.error(`Failed to load command ${adminCommandName}:`, error);
    }
  }
});

const updatePointsAndReputation = async (userRef, pointPerHuruf, reputasiIncrement) => {
  const pointSnap = await userRef.child('point').once('value');
  const repSnap = await userRef.child('reputasi').once('value');
  const expSnap = await userRef.child('exp').once('value');

  const currentPoint = pointSnap.val() || 0;
  const currentReputasi = repSnap.val() || 0;
  const currentExp = expSnap.val() || 0;

  const newPoint = currentPoint + (pointPerHuruf === 0 ? 1 : Math.min(pointPerHuruf, 511));
  const newReputasi = currentReputasi + reputasiIncrement;
  const newExp = currentExp + 10;

  await userRef.child('point').set(newPoint);
  await userRef.child('reputasi').set(newReputasi);
  await userRef.child('exp').set(newExp);
};


async function handleCommand(message, client) {
  const sA = message.author;
  const sender = message.from;
  const corection = sA != undefined ? sA : sender;
  const sanitizedSender = corection.replace(/[\.\@\[\]\#\$]/g, "_");
  const pointRef = db.ref('dataPengguna/pengguna');
  const ToxicRef = db.ref('dataData/kataKasar');
  const ReplyRef = db.ref('dataData/BalasanKataKasar');
  const Multiply = db.ref('dataData/dataDelay');
  const RefPoint = pointRef.child(sanitizedSender).child('point');
  const RefRep = pointRef.child(sanitizedSender).child('reputasi');
  const thresholds = [0, 100 ,200, 500, 1000, 5000, 10000, 20000, 500000, 1000000, 1000000000];
  const pesan = message.body.toLowerCase();
  const point = {};
  const reputasi = {};

    if (pesan) {
        await ToxicRef.once('value', (ss) => {
          const toxicWords = ss.val() || [];
          const pesanfilter = pesan.split(' ');
          const foundToxicWord = pesanfilter.find((word) => {
            return toxicWords.findIndex((toxicWord) => word === toxicWord) !== -1;
          }); 
        if(foundToxicWord){
          ReplyRef.once('value', (ss) => {
            const balasan = ss.val() || [];
            const pesanBalasanArray = Object.values(balasan);
            const pesanBalasan = pesanBalasanArray[Math.floor(Math.random() * pesanBalasanArray.length)] || "Pesan Balasan Default";
            message.reply(pesanBalasan);
          })
        }
      })
      if(kataTerlarang.some(kata => pesan.match(kata))){
        let sisaPo = '';
        let sisaRe = '';
        const MultiplyToxicWord = await Multiply.child('ToxicX').once('value');
        const mul = MultiplyToxicWord.val() || 0;
        const dikali = mul.dikali;
        
        const updatePoint = async () => {
          const ss = await RefPoint.once('value');
          const poin = ss.val() || 0;
          const pointMultiply = 5000 * dikali;
          const pinalty = await poin - pointMultiply;
          await RefPoint.set(pinalty);
          return sisaPo = pinalty.toLocaleString('id-ID');
        }
        
        const updateReputation = async () => {
          const ss = await RefRep.once('value');
          const Rep = ss.val() || 0;
          const repMultiply = 50 * dikali;
          const pinalty = await Rep - repMultiply;
          await RefRep.set(pinalty);
          return sisaRe = pinalty.toLocaleString('id-ID');
        }

        Promise.all([updatePoint(), updateReputation()]).then(async () => {
          const pointFinal = 5000 * dikali;
          const repFinal = 50 * dikali;
          await message.reply(`priiiitt\npoint *-${pointFinal.toLocaleString()} x${dikali},00*\n*Reputasi -${repFinal.toLocaleString()} x${dikali},00*\nsisa point : _${sisaPo}_\nReputasi : _${sisaRe}_`)
        })
      }else{
        if (!point[corection]) point[corection] = 0;
        if (!reputasi[corection]) reputasi[corection] = 0;
        const sanitizedSender = corection.replace(/[\.\@\[\]\#\$]/g, "_");
        const userRef = pointRef.child(sanitizedSender);
        for (const threshold of thresholds) {
        if (point[corection] >= threshold || reputasi[corection] >= threshold) {
            const pointPerHuruf = pesan.length * 3.00;
            const reputasiIncrement = 5;
            if(preventSpam(sanitizedSender, pesan)){
              //message.reply('Spam detected, exp/point/reputation will not be updated.')
              console.error(`Spam detected, exp/point/reputation will not be updated.`)
            }else {
              await updatePointsAndReputation(userRef, pointPerHuruf, reputasiIncrement);
            }
            if(sA){
              const groupCor = sA ? sender : sA;
              const sanitizedGroup = groupCor.replace(/[\.\@\[\]\#\$]/g, "_");
              const groupRef = pointRef.child(sanitizedGroup);
              if(preventSpam(sanitizedSender, pesan)){
                //message.reply('Spam detected, exp/point/reputation will not be updated.')
                console.error(`Spam detected, exp/point/reputation will not be updated.`)
              }else{
                await updatePointsAndReputation(groupRef, pointPerHuruf, reputasiIncrement)
              }
            }
            break;
        }
    }

    if (pesan.startsWith('!')) {
        const commandName = pesan.substring(1).split(' ')[0];
        const command = commands[commandName];

        if (typeof command === 'function') { 
            try {
                const Response = await command(message); 
                console.log({Response})
                if (Response) {
                    await client.sendMessage(message.from, Response);
                }
            } catch (error) {
                console.error(`Error executing command ${commandName}:`, error);
            }
            return;
        }
    }
    const messageFrom = message.from;
    const messageAuthor = message.author;
    console.log({messageFrom, messageAuthor})
    if(pesan.startsWith('%')){
      if(sanitizedSender === process.env.ADMIN_1 || sanitizedSender === process.env.ADMIN_2){
        const commandName = pesan.substring(1).split(' ')[0];
        const command = adminCommands[commandName];

        if(typeof command === 'function'){
          try {
              const ResponseAdmin = await command(message);
              console.log({ResponseAdmin})
              if(ResponseAdmin){
                await client.sendMessage(message.from, ResponseAdmin);
                if (commandName === 'bc') {
                  const messages = ResponseAdmin.message[1];
                  const daftarGroup = ResponseAdmin.dataGroup;
                  for (const group of daftarGroup) {
                      await client.sendMessage(group, messages);
                      console.log({group, message})
                  }
                  await client.sendMessage(message.from, `Pesan broadcast telah dikirim ke semua grup.\n${ResponseAdmin.message[1]}`);
              }
              }
          } catch (error) { 
            console.error(`error executing command ${commandName}: `, error)
          }
        }
      }else{
        client.sendMessage(message.from, 'prefix "%" used for Super Admin Only')
      }
    }
  }
}
}
  
  module.exports = {
    handleCommand
  };