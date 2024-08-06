const {witAi, client} = require('./config')
const db = require('./config').db;

const kataTerlarang = [
  /\banjg\b/i, /\bajg\b/i, /\banal\b/i, /\basu\b/i, /\bass\b/i, /\banjing\b/i, /\banjeng\b/i, /\bbajingan\b/i,
  /\bbgst\b/i, /\bbangsat\b/i, /\bbabi\b/i, /\bcuk\b/i, /\bcok\b/i, /\bcukimai\b/i, /\bdancok\b/i, /\bdancuk\b/i,
  /\bentot\b/i, /\bewe\b/i, /\bengas\b/i, /\bebol\b/i, /\bjingkontot\b/i, /\bjing\b/i, /\bjink\b/i, /\bjembut\b/i,
  /\bjembod\b/i, /\bjmbd\b/i, /\bkon\b/i, /\bkontot\b/i, /\bkontol\b/i, /\bkntl\b/i, /\bkentot\b/i, /\bkintil\b/i,
  /\bkimak\b/i, /\bler\b/i, /\bmemek\b/i, /\bmek\b/i, /\bmmk\b/i, /\bmeki\b/i, /\bngen\b/i, /\bngentot\b/i,
  /\bnigga\b/i, /\bni99a\b/i, /\bnenen\b/i, /\bpantek\b/i, /\bpanteq\b/i, /\bpntek\b/i, /\bpntk\b/i, /\bpler\b/i,
  /\bpepek\b/i, /\bpendo\b/i, /\bppk\b/i, /\bpuki\b/i, /\bpukimak\b/i, /\bpentek\b/i, /\bpukima\b/i, /\bsu\b/i,
  /\bsange\b/i, /\bsagne\b/i, /\bsat\b/i, /\btot\b/i, /\btod\b/i, /\btolol\b/i, /\btll\b/i, /\bttt\b/i, /\btitit\b/i,
  /\btai\b/i, /\btod\b/i
];

async function handleCommand(message) {
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
      witAi.message(pesan, {})
        .then(data => {
          //console.log(`AI Response: ${JSON.stringify(data)}`);
          const TraitNormal = JSON.stringify(data.traits.normal[0].value);
          client.sendMessage(message.from, TraitNormal);
        })
        .catch(console.error);

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
          const pointMultiply = 5000* dikali;
          const pinalty = poin - pointMultiply;
          await RefPoint.set(pinalty);
          sisaPo = await pinalty.toLocaleString('id-ID');
        }

        const updateReputation = async () => {
          const ss = await RefRep.once('value');
          const Rep = ss.val() || 0;
          const repMultiply = 50 * dikali;
          const pinalty = Rep - repMultiply;
          await RefRep.set(pinalty);
          sisaRe = await pinalty.toLocaleString('id-ID');
        }

        Promise.all([updatePoint(), updateReputation()]).then(async () => {
          const pointFinal = 5000 * dikali;
          const repFinal = 50 * dikali;
            await message.reply(`priiiitt\npoint *-${pointFinal.toLocaleString()} x${dikali},00*\n*Reputasi -${repFinal.toLocaleString()} x${dikali},00*\nsisa point : _${sisaPo}_\nReputasi : _${sisaRe}_`)
        })
      }
      if(!point[corection]){
        point[corection] = 0;
      } for (const threshold of thresholds) {
        if(point[corection] >= threshold){
          const sanitizedSenderF = corection.replace(/[\.\@\[\]\#\$]/g, "_");
          const pointAdded = pointRef.child(sanitizedSenderF).child('point');
          pointAdded.once('value', async (ss) => {
            const poin = ss.val() || 0;
            const pointPerHuruf = pesan.length * 3.00;
            console.log(pointPerHuruf);

            if(pointPerHuruf === 0){
              const pointIfNol = poin + 1;
              await pointRef.child(sanitizedSender).child('point').set(pointIfNol);
            } else if(pointPerHuruf <= 511) {
              const pointIfUnder = poin + pointPerHuruf;
              await pointRef.child(sanitizedSender).child('point').set(pointIfUnder);
            }
          })
          break;
        }
      }
      if(!reputasi[corection]){
        reputasi[corection] = 0;
    } for (const threshold of thresholds){
      const sanitizedSenderC = corection.replace(/[\.\@\[\]\#\$]/g, "_");
      if(reputasi[corection] >= threshold){
        const reputasiAdded = pointRef.child(sanitizedSenderC).child('reputasi');
        reputasiAdded.once('value', async (ss) => {
          const reputasi = ss.val() || 0
          const newRep = parseInt(reputasi + 5);
          await reputasiAdded.set(newRep);
        });
      }
      break;
    }
  }
}
  
  module.exports = {
    handleCommand
  };