const { Client, MessageMedia, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const admin = require('firebase-admin');
const axios = require('axios');
const serviceAccount = require('./etmc-whatsapp-bot.json');
require('dotenv').config();

const client = new Client({
    authStrategy: new LocalAuth()
  });
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
  });

client.on('ready', () => {
    console.log('Client is ready!');
  });

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL
  }); 
const db = admin.database();
const pointRef = db.ref('dataPengguna/pengguna');
const PokemonRef = db.ref('dataPengguna/pengguna');
const linkRef = db.ref('dataData/link');
const ReplyRef = db.ref('dataData/BalasanKataKasar');
const ToxicRef = db.ref('dataData/kataKasar');
const DataMRef = db.ref('dataData/mabar');
const point = {};
const reputasi = {};
const thresholds = [0, 100 ,200, 500, 1000, 5000, 10000, 20000, 500000, 1000000, 1000000000];
const regexCari = /^!cari\s(.+)/;
const regexKirim = /^!kirim\s(.+)/;
const regexTogel = /^!togel\s(\d{4})/;
const regexPBuyPoke = /^!buy\s+(\w+)\s+(\d+)$/;
const regexRibut = /^!ribut\s(.+)/;
const regexNama = /^!nama\s(.+)/;
const regexInfo = /^!info\s(.+)/;
const regexMabar = /^!mabar\s(.+)/;

client.on('message', async (message) => {
    const sA = message.author;
    const sender = message.from;
    const corection = sA != undefined ? sA : sender;
    const sanitizedSender = corection.replace(/[\.\@\[\]\#\$]/g, "_");
    const pesan = message.body.toLocaleLowerCase();
    const cocok = pesan.match(regexCari);
    const match1 = pesan.match(regexKirim);
    const togel = pesan.match(regexTogel);
    const ribut = pesan.match(regexRibut);
    const isiNama = pesan.match(regexNama);
    const InfoMas = pesan.match(regexInfo);
    const Buy = pesan.match(regexPBuyPoke);
    const Mabar = pesan.match(regexMabar);
    const RefNama = pointRef.child(sanitizedSender).child('nama');
    const RefPoint = pointRef.child(sanitizedSender).child('point');
    const RefRep = pointRef.child(sanitizedSender).child('reputasi');
    const RefRepOld = pointRef.child(sanitizedSender).child('reputasiS1');
    const RefPokemon = PokemonRef.child(sanitizedSender).child('pokemon').child('inventory').child('pokemon');
    const RefPoke = PokemonRef.child(sanitizedSender).child('pokemon').child('inventory').child('pokeballs');
    const RefGacoan = PokemonRef.child(sanitizedSender).child('pokemon').child('gacoan');
    const RefPokeDelay = PokemonRef.child(sanitizedSender).child('pokemon').child('delay');

    function addMabarData(mabar, nama) {
      DataMRef.child("1").set({
        name: nama,
        desc: mabar
      });
    }
    function generateSN(length){
        const character = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let sn = '';
        for(let i = 0; i < length; i++){
            const randomIndex = Math.floor(Math.random() * character.length);
            sn += character.charAt(randomIndex);
        }
        return sn;
    }
//Pesan Balasan 
if (pesan) {
  await ToxicRef.once('value', (snapshot) => {
    const toxicWords = snapshot.val() || [];
    const pesanArray = pesan.toLowerCase().split(' ');
    const foundToxicWord = pesanArray.find((word) => {
      return toxicWords.findIndex((toxicWord) => word === toxicWord) !== -1;
    });

    if (foundToxicWord) {
      ReplyRef.once('value', (snapshot) => {
        const balasan = snapshot.val() || [];
        const pesanBalasanArray = Object.values(balasan);
        const pesanBalasan = pesanBalasanArray[Math.floor(Math.random() * pesanBalasanArray.length)] || 'Pesan balasan default';
        message.reply(pesanBalasan);
      });
    }
  });
}

    if(
      pesan.match(/\banjg\b/i) ||
      pesan.match(/\bajg\b/i) ||
      pesan.match(/\banal\b/i) ||
      pesan.match(/\basu\b/i) ||
      pesan.match(/\bass\b/i) ||
      pesan.match(/\banjing\b/i) ||
      pesan.match(/\banjeng\b/i) ||
      pesan.match(/\bbajingan\b/i) ||
      pesan.match(/\bbgst\b/i) ||
      pesan.match(/\bbangsat\b/i) ||
      pesan.match(/\bbabi\b/i) ||
      pesan.match(/\bcuk\b/i) ||
      pesan.match(/\bcok\b/i) ||
      pesan.match(/\bcukimai\b/i) ||
      pesan.match(/\bdancok\b/i) ||
      pesan.match(/\bdancuk\b/i) ||
      pesan.match(/\bentot\b/i) ||
      pesan.match(/\bewe\b/i) ||
      pesan.match(/\bengas\b/i) ||
      pesan.match(/\bebol\b/i) ||
      pesan.match(/\bjingkontot\b/i) ||
      pesan.match(/\bjing\b/i) ||
      pesan.match(/\bjink\b/i) ||
      pesan.match(/\bjembut\b/i) ||
      pesan.match(/\bjembod\b/i) ||
      pesan.match(/\bjmbd\b/i) ||
      pesan.match(/\bkon\b/i) ||
      pesan.match(/\bkontot\b/i) ||
      pesan.match(/\bkontol\b/i) ||
      pesan.match(/\bkntl\b/i) ||
      pesan.match(/\bkentot\b/i) ||
      pesan.match(/\bkintil\b/i) ||
      pesan.match(/\bkimak\b/i) ||
      pesan.match(/\bler\b/i) ||
      pesan.match(/\bmemek\b/i) ||
      pesan.match(/\bmek\b/i) ||
      pesan.match(/\bmmk\b/i) ||
      pesan.match(/\bmeki\b/i) ||
      pesan.match(/\bngen\b/i) ||
      pesan.match(/\bngentot\b/i) ||
      pesan.match(/\bnigga\b/i) ||
      pesan.match(/\bni99a\b/i) ||
      pesan.match(/\bnenen\b/i) ||
      pesan.match(/\bpantek\b/i) ||
      pesan.match(/\bpanteq\b/i) ||
      pesan.match(/\bpntek\b/i) ||
      pesan.match(/\bpntk\b/i) ||
      pesan.match(/\bpler\b/i) ||
      pesan.match(/\bpepek\b/i) ||
      pesan.match(/\bppk\b/i) ||
      pesan.match(/\bpuki\b/i) ||
      pesan.match(/\bpukimak\b/i) ||
      pesan.match(/\bpentek\b/i) ||
      pesan.match(/\bpukima\b/i) ||
      pesan.match(/\bresty\b/i) ||
      pesan.match(/\bresti\b/i) ||
      pesan.match(/\brsty\b/i) ||
      pesan.match(/\bsu\b/i) ||
      pesan.match(/\bsange\b/i) ||
      pesan.match(/\bsagne\b/i) ||
      pesan.match(/\bsat\b/i) ||
      pesan.match(/\btot\b/i) ||
      pesan.match(/\btod\b/i) ||
      pesan.match(/\btolol\b/i) ||
      pesan.match(/\btll\b/i) ||
      pesan.match(/\bttt\b/i) ||
      pesan.match(/\btitit\b/i) ||
      pesan.match(/\btai\b/i) ||
        pesan.match(/\btod\b/i)){
        let sisaPo = "";
        let sisaRe = "";
        RefPoint.once('value', async (snapshot) => {
            const poin = snapshot.val() || 0;
            const pinalty = poin - 25000;
            await RefPoint.set(pinalty);
            sisaPo = poin.toLocaleString('id-ID', { minimumFractionDigits: 0 });
        });
        RefRep.once('value', async (snapshot) => {
            const reputasi = snapshot.val() || 0;
            const pinalty = parseInt(reputasi - 100);
            await RefRep.set(pinalty)
            sisaRe = reputasi.toString();
        });
        setTimeout(() => {
            message.reply(`priiiit point -25.000, Reputasi -100.\nsisa point: ${sisaPo}\nReputasi: ${sisaRe}`);
        }, 1500);
    }
/* ADMIN COMMAND */
if(sanitizedSender === '6285210306474_c_us' || sanitizedSender === '628973997575_c_us'){
  const pesanAdmin = message.body;
  // reset season
  if (pesanAdmin.startsWith('%rS')) {
    message.reply('Welcome To Season 2 Guys\nPoint : +50.000');
    pointRef.once('value', (snapshot) => {
        const penggunaData = snapshot.val();
        if (penggunaData) {
            Object.entries(penggunaData).forEach(([randomkey, data]) => {
                const currentReputasi = data.reputasi || 0;
                let newReputasi = currentReputasi;
                if (currentReputasi < 0) {
                    newReputasi += 100;
                } else if (currentReputasi >= 1 && currentReputasi <= 100) {
                    newReputasi -= 50;
                } else if (currentReputasi >= 101 && currentReputasi <= 1999) {
                    newReputasi -= 100;
                } else if (currentReputasi >= 2000) {
                    newReputasi -= 1000;
                }
                pointRef.child(randomkey).child('reputasiS1').set(currentReputasi);
                pointRef.child(randomkey).child('reputasi').set(newReputasi);
            });
        } else {
            message.reply('Database is empty');
        }
    });

    pointRef.once('value', (snapshot) => {
      const penggunaData = snapshot.val();
      if (penggunaData) {
          Object.entries(penggunaData).forEach(([randomkey, data]) => {
              const currentPoint = data.point || 0;
              const pointAdded = currentPoint + 50000;
              pointRef.child(randomkey).child('point').set(pointAdded);
          });
        } else {
          message.reply('Database is empty');
        }
      });
}

  // reset Point
  if(pesanAdmin.startsWith('%rP')){
    const point0 = parseInt('0');
    message.reply('Reset Point Done');
    pointRef.once('value', (snapshot) => {
        const penggunaData = snapshot.val();
        if (penggunaData) {
            Object.entries(penggunaData).forEach(([randomkey, data]) => {
                pointRef.child(randomkey).child('point').set(point0);
            });
          } else {
            message.reply('Database is empty');
          }
        });
  }
  //addPoint
  if(pesanAdmin.startsWith('%addP')){
    const param1 = pesanAdmin.split(' ')[1];
    const param2 = pesanAdmin.split(' ')[2];
    const param2ParseInt = parseInt(param2, 10);
    const nomortanpa = param1.replace(/@/g, "");
    const nomorLengkap = nomortanpa+"_c_us";
    pointRef.child(nomorLengkap).child('point').once('value', async (snapshot) => {
      const point = snapshot.val() || 0;
      const pointAdded = point + param2ParseInt;
      await pointRef.child(nomorLengkap).child('point').set(pointAdded);
    });
    message.reply(`Point added ${param2.toLocaleString('id-ID',{minimumFractionDigits: 0})} to : ${param1}`);
  }
  //addReputasi
  if(pesanAdmin.startsWith('%addR')){
    const param1 = pesanAdmin.split(' ')[1];
    const param2 = pesanAdmin.split(' ')[2];
    const param2ParseInt = parseInt(param2, 10);
    const nomortanpa = param1.replace(/@/g, "");
    const nomorLengkap = nomortanpa+"_c_us";
    pointRef.child(nomorLengkap).child('reputasi').once('value', async (snapshot) => {
      const point = snapshot.val() || 0;
      const pointAdded = point + param2ParseInt;
        await pointRef.child(nomorLengkap).child('reputasi').set(pointAdded);
    });
    message.reply(`Reputation added ${param2} to : ${param1}`)
  }
  //addPoint for users
  if (pesanAdmin.startsWith('%addAP')) {
    const param1 = parseInt(pesanAdmin.split(' ')[1]);
    pointRef.once('value', (snapshot) => {
        const penggunaData = snapshot.val();
        if (penggunaData) {
            Object.entries(penggunaData).forEach(([randomkey, data]) => {
                const currentPoint = data.point || 0;
                const pointAdded = currentPoint + param1;
                pointRef.child(randomkey).child('point').set(pointAdded);
            });
          } else {
            message.reply('Database is empty');
          }
        });
    message.reply(`Point added ${param1.toLocaleString('id-ID', { minimumFractionDigits: 0 })} to all members`);
}

}


    //Command
    if (pesan === '!help' || pesan === '!bot'){
        const commands = [
          { p: '!berita', label: 'Berita Terkini' },
          { p: '!cuaca', label: 'Info Cuaca' },
          { p: '!doa', label: 'Doa Harian' },
          { p: '!info cuaca/mabar', label: 'Cek info cuaca dan info mabar' },
          { p: '!kirim @... 12345', label: 'Kirim Point ke Teman' },
          { p: '!mabar "game apa, jam berapa, kapan"', label: 'Tambah info mabar' },
          { p: '!nama namaKalian', label: 'isi namamu di grub ini!' },
          { p: '!quotes', label: 'Apa Quotes Untuk mu?' },
          { p: '!rate', label: 'Cek Rate 1USD = Rp xx.xxx' },
          { p: '!rules', label: 'Aturan' },
          { p: '!stat', label: 'Cek Point, Reputasi & status' },
          { p: '!ribut @...', label: 'Kalo ada masalah ributnya pake ini ya' },
          { p: '-- *GAMES* --', label: '-- *GAMES* --' },
          { p: '!togel 1234', label: 'Main Togel ngebid 5.000Point kalo menang dapet 50.000Point' },
          { p: '!slot', label: 'Main Slot bayar 2.500Point kalo menang dapet 10.000Point' },
          { p: '!pap', label: 'ngirim pap jahat' },
          { p: '!catch', label: 'Tangkap Pokemon' },
          { p: '!pokeball', label: 'nyari pokeballs' },
          { p: '!cektas', label: 'cek inventory kalian' },
          { p: '!pokedex', label: 'cek list pokemon yang udah kalian dapat' },
          { p: '!fight @....', label: 'ajak temen kalian berantem pokemon, yg menang dapet 100reputasi' },
          { p: '!redeem 08xxxx', label: 'Redeem 102.500Point ke Pulsa All Operator Rp 10.000' },
        ];
        
        let menuText = '*ETMC-BOT nih boss* \n\n';
        
        commands.forEach((command, index) => {
            menuText += `${index + 1}. ${command.p} - ${command.label}\n`;
        });
        
        menuText += '\nBaru ada Command Ini Doang ni';
        client.sendMessage(message.from, menuText);
    }
    if(pesan === '!rules'){
        client.sendMessage(message.from,`Aturan dibuat buat di langgar, makin sering *toxic* *reputasi* lu *ancur*\ncek reputasi !stat.\ngaboleh ngirim link *bokep* di sini kalo mau japri,\nyg mau transaksi silahkan di japri juga\nOke???\n\n*W0lv*`)
    }
    if (pesan === '!berita'){
        axios.get(`https://api-berita-indonesia.vercel.app/cnn/terbaru/`)
        .then(response => {
            const resp = response.data;
            const posts = resp.data.posts.slice();
            const randomIndex = Math.floor(Math.random() * posts.length);
            const randomData = posts[randomIndex];
            const timestamp = randomData.pubDate;
            const date = new Date(timestamp);
            const hours = date.getUTCHours().toString().padStart(2, "0");
            const minutes = date.getUTCMinutes().toString().padStart(2, "0");
            const day = date.getUTCDate().toString().padStart(2, "0");
            const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // Ditambah 1 karena indeks bulan dimulai dari 0
            const year = date.getUTCFullYear();
            const formattedDate = `${hours}:${minutes}, ${day}/${month}/${year}`;
            client.sendMessage(message.from,`*${randomData.title}* \nTanggal: ${formattedDate}. \n\n${randomData.description} \n\nBacaSelengkapnya : ${randomData.link} `);
        })
        .catch(error => {
            console.log(error);
        });
    }
    if (pesan === '!cuaca'){
        axios.get('https://ibnux.github.io/BMKG-importer/cuaca/5002227.json').then(resp => {
          const dataCuaca = resp.data;
          const waktuSekarang = new Date();
          const dataCuacaTerdekat = dataCuaca.find(data => {
            const waktuData = new Date(data.jamCuaca);
            return waktuData > waktuSekarang;
          });
          if (dataCuacaTerdekat) {
            const balasan = `Cuaca terdekat:\nJam: ${dataCuacaTerdekat.jamCuaca}\nCuaca: ${dataCuacaTerdekat.cuaca}\nSuhu: ${dataCuacaTerdekat.tempC}°C`;
            client.sendMessage(message.from, balasan);
        } else {
            const balasan = 'Maaf, tidak ada data cuaca yang tersedia untuk waktu mendatang.';
            message.reply(balasan);
          }
        });
    }
    if(pesan === '!doa'){
        axios.get(`https://doa-doa-api-ahmadramadhan.fly.dev/api`).then(resp => {
            const dataDoa = resp.data.slice();
            const randomIndex = Math.floor(Math.random() * dataDoa.length);
            const randomData = dataDoa[randomIndex];
            const balasan = `${randomData.doa}\n\n${randomData.ayat}\n${randomData.latin}\n\nArtinya: ${randomData.artinya}`
            client.sendMessage(message.from, balasan);
        })
    }
    if(pesan === '!rate'){
        axios.get(`https://api.freecurrencyapi.com/v1/latest?apikey=${process.env.API_KEY_RATE}&currencies=IDR`).then(resp => {
            const data2 = resp.data.data.IDR;
            const dataAkhir = data2.toLocaleString("id-ID",{style: "currency", currency: "IDR"})
            client.sendMessage(message.from,`Harga $1.00 = ${dataAkhir}`);
        })
    }
    if (pesan === "!quotes"){
        axios.get("https://kyoko.rei.my.id/api/quotes.php").then((resp) => {
          const quotes = resp.data.apiResult;
          if (quotes.length > 0) {
            const balasan = `'${quotes[0].indo}'\n\n"${quotes[0].character}"`;
            client.sendMessage(message.from, balasan);
          } else {
            message.reply("tidak ada quotes buat lu.");
          }
        });
    }
    if(pesan === '!hentai'){
        await axios.get(`https://kyoko.rei.my.id/api/nsfw.php`).then((resp) => {
            const gambarURL =  resp.data.apiResult.url[0];
            if(gambarURL.length > 0){
                    message.reply('sabar yaa, proses ni.')
                setTimeout(async () => {
                    await client.sendMessage(message.from, await MessageMedia.fromUrl(gambarURL,[true]));
                }, 5000);
            }else{
                console.log('gagal memuat konten');
            }
            }).catch((err) => {
            console.log(err)
        })
    }
    if (pesan === "!ping") {
        const pingTimestamp = new Date().getTime();
            if (pingTimestamp) {
            const selisihWaktu = new Date().getTime() - pingTimestamp;
            const selisihWaktuDuaAngkaDepan = (selisihWaktu / 1000).toFixed(2);
            const balasan = `Pong! : ${selisihWaktuDuaAngkaDepan}ms`;
              message.reply(`${balasan}`);
            } else {
                const balasan = "Pesan 'ping' sebelumnya tidak ditemukan.";
                message.reply(`${balasan}`);
            }
    }
    if(InfoMas){
      const parameter = InfoMas[1];
        if(parameter === "cuaca"){
          axios.get('https://ibnux.github.io/BMKG-importer/cuaca/5002227.json').then(resp => {
              const dataCuaca = resp.data;
              const waktuSekarang = new Date();
              const dataCuacaTerdekat = dataCuaca.find(data => {
                const waktuData = new Date(data.jamCuaca);
                return waktuData > waktuSekarang;
              });
              if (dataCuacaTerdekat) {
                const balasan = `Cuaca terdekat:\nJam: ${dataCuacaTerdekat.jamCuaca}\nCuaca: ${dataCuacaTerdekat.cuaca}\nSuhu: ${dataCuacaTerdekat.tempC}°C`;
                client.sendMessage(message.from, balasan);
            } else {
                const balasan = 'Maaf, tidak ada data cuaca yang tersedia untuk waktu mendatang.';
                message.reply(balasan);
              }
            });
        }
        if(parameter === "mabar"){
          DataMRef.child("1").once('value', async (snapshot) => {
            const Data = snapshot.val() || {};
            message.reply(`tuh si ${Data.name} ngajakin mabar ${Data.desc}`);
          });
        }
      }
      if (pesan.startsWith('!redeem')) {
        const param1 = pesan.split(' ')[1];
        console.log(param1);
        if (!isNaN(param1) && param1.length > 10) {
          RefPoint.once('value', async (snapshot) => {
            const point = snapshot.val() || 0;
            if (point >= 102500) {
              const bayarP = point - 102500;
              await RefPoint.set(bayarP);
              await message.reply('oke, proses yaaa. mohon tunggu');
              await client.sendMessage('628973997575@c.us', `10.${param1}.2512`);
              setTimeout(() => {
                message.reply(`*TRX PULSA 10.000*\n*TUJUAN*:${param1}\n*HRG*=102.500point\n*SN*:${generateSN(16)}\n*SUKSES* SisaPoint: ${point.toLocaleString('id-ID',{minimumFractionDigits: 0})}`);
              }, 70000)
            } else {
              message.reply('mass pointnya belom cukup yaa farming lagi gih');
            }
          });
        } else {
          message.reply('Masukan nomor Tujuan dengan benar');
        }
      } 
//tambah nama
    if(isiNama){
      const daftarNama = isiNama[1];
      RefPoint.once('value', async(snapshot) => {
        const point = snapshot.val() || 0;
        const gantiNama = point - 5000;
          RefNama.once('value', async (snapshot) => {
            const nama = snapshot.val() || sanitizedSender;
            if(nama === sanitizedSender){
              await RefNama.set(daftarNama);
              message.reply(`Nama berhasil di set: ${daftarNama}`);
            }else{
              if(point >= 5000){
                await RefPoint.set(gantiNama);
                await RefNama.set(daftarNama);
                message.reply(`Nama berhasil di ubah: ${daftarNama}`);
              }else{
                message.reply(`ubah nama minimal punya 5000Point, point lu ${point}`)
              }
            }
           });
      });
    }
//search engine
    if (cocok) {
      const kataKunci = cocok[1].trim();
      axios.get(`https://id.wikipedia.org/api/rest_v1/page/summary/${kataKunci}`)
        .then((resp) => {
          const pencarian = resp.data.extract;
          const jumlahKata = 20;
          const hasil = pencarian.split(" ");
          const kataPotong = hasil.slice(0, jumlahKata);
          const balasan = kataPotong.join(" ");
    
          if (pencarian) {
            message.reply(balasan);
          } else {
            message.reply('kaga ada itu mah, yg laen aja coba');
          }
        })
        .catch((error) => {
          message.reply('nyari apaan si?');
        });
    }
//add Mabar
    if(Mabar){
  const param1 = Mabar[1];
  RefNama.once('value', async (snapshot) => {
    const name = snapshot.val();
    addMabarData(param1, name);
  });
}

//point system
if(!point[corection]){
        point[corection] = 0;
} 
for (const threshold of thresholds) {
        if (point[corection] >= threshold) {
          const sanitizedSenderF = corection.replace(/[\.\@\[\]\#\$]/g, "_");
            const pointAdded = pointRef.child(sanitizedSenderF).child('point');
            pointAdded.once('value', async (snapshot) => {
              const poin = snapshot.val() || 0;
              const pointPerHuruf = pesan.length;
              console.log(pointPerHuruf);
              if(pointPerHuruf === 0){
                const pointJikaNol = poin + 1;
                await pointRef.child(sanitizedSender).child('point').set(pointJikaNol);
              }else{
                const pointJikaBerNilai = poin + pointPerHuruf;
                await pointRef.child(sanitizedSender).child('point').set(pointJikaBerNilai);
              }
            });
            break;
        }
}
//Status
if (pesan === '!stat') {
    let repu = "";
    let point = "";
    let tier = "";
    let tierOld = "";
    let nama = "";
    //Reputasi
    RefRep.once('value', async (snapshot) => {
        const reputasi = snapshot.val() || 0;
      if(reputasi <= 0){
        tier = "💀BOCAH TOXIC💀"
      }else if (reputasi <= 10) {
        tier = "--_Bronze_--";
      } else if (reputasi <= 20) {
        tier = "--_Silver_--";
      } else if (reputasi <= 30) {
        tier = "--_Gold_--";
      } else if (reputasi <= 50) {
        tier = "--_Platinum_--";
      } else if (reputasi <= 100) {
        tier = "--💎_Diamond_💎--";
      } else if (reputasi <= 200){
        tier = "--♚_CROWN_♚--";
      } else if (reputasi <= 500){
        tier = "--⭐_ACE_⭐--";
      } else if (reputasi === 666){
        tier = "S0N-0F-S4TAN"
      } else if (reputasi <= 1000){
        tier = "--🔥_CONQUEROR_🔥--";
      } else if (reputasi >= 2000){
        tier = "--👑GOD👑--";
      }else{
        tier = "Anak💀Haram"
      }
      repu = await reputasi.toString();
    });
    //Reputasi old
    RefRepOld.once('value', async (snapshot) => {
      const reputasiOld = snapshot.val() || 0;
      if (reputasiOld <= 0) {
        tierOld = "💀BOCAH TOXIC💀";
    } else if (reputasiOld <= 10) {
        tierOld = "--_Bronze_--";
    } else if (reputasiOld <= 20) {
        tierOld = "--_Silver_--";
    } else if (reputasiOld <= 30) {
        tierOld = "--_Gold_--";
    } else if (reputasiOld <= 50) {
        tierOld = "--_Platinum_--";
    } else if (reputasiOld <= 100) {
        tierOld = "--💎_Diamond_💎--";
    } else if (reputasiOld <= 200) {
        tierOld = "--♚_CROWN_♚--";
    } else if (reputasiOld <= 500) {
        tierOld = "--⭐_ACE_⭐--";
    } else if (reputasiOld === 666) {
        tierOld = "S0N-0F-S4TAN";
    } else if (reputasiOld <= 1000) {
        tierOld = "--🔥_CONQUEROR_🔥--";
    } else if (reputasiOld >= 2000) {
        tierOld = "--👑GOD👑--";
    } else {
        tierOld = "Anak💀Haram";
    }
    });
    //point
    RefPoint.once('value', async (snapshot) => {
        const poin = snapshot.val() || 0;
        point = await poin.toLocaleString('id-ID',{minimumFractionDigits: 0});
    });
    RefNama.once('value', async (snapshot) => {
        const name = snapshot.val() || '';
        nama = name || 'Nama Mu Masih kosong';
    });

    setTimeout(() => {
        message.reply(`Nama: ${nama}\nTier Tertinggi: ${tierOld}\n\n*${tier}*\nPoint Kamu: *${point}*\nReputasi: *${repu}*`);
    },1000)
}
// LeaderBoard
// LeaderBoard
if (pesan.startsWith('!rank')) {
  const param1 = pesan.split(' ')[1];
  if (param1 === 'point') {
      new Promise((resolve, reject) => {
          pointRef.once('value', (snapshot) => {
              const penggunaData = snapshot.val();
              if (penggunaData) {
                  const point = Object.entries(penggunaData)
                      .sort(([, a], [, b]) => b.point - a.point)
                      .map(([randomkey, data], index) => `${index + 1}. Nama: ${data.nama || 'anak bapa'}\nPoint: ${data.point}\n`);
                  const pointList = point.join('\n');
                  resolve(pointList);
              } else {
                  reject('Data Reputasi kosong');
              }
          });
      }).then((pointList) => {
          message.reply(`Point Tertinggi:\n${pointList}`);
      }).catch((error) => {
          message.reply(error);
      });
  } else {
      new Promise((resolve, reject) => {
          pointRef.once('value', (snapshot) => {
              const penggunaData = snapshot.val();
              if (penggunaData) {
                  const ranks = Object.entries(penggunaData)
                      .sort(([, a], [, b]) => b.reputasi - a.reputasi)
                      .map(([randomkey, data], index) => {
                          let tier = '';
                          if (data.reputasi <= 0) {
                              tier = "💀BOCAH TOXIC💀";
                          } else if (data.reputasi <= 10) {
                              tier = "--_Bronze_--";
                          } else if (data.reputasi <= 20) {
                              tier = "--_Silver_--";
                          } else if (data.reputasi <= 30) {
                              tier = "--_Gold_--";
                          } else if (data.reputasi <= 50) {
                              tier = "--_Platinum_--";
                          } else if (data.reputasi <= 100) {
                              tier = "--💎_Diamond_💎--";
                          } else if (data.reputasi <= 200) {
                              tier = "--♚_CROWN_♚--";
                          } else if (data.reputasi <= 500) {
                              tier = "--⭐_ACE_⭐--";
                          } else if (data.reputasi === 666) {
                              tier = "S0N-0F-S4TAN";
                          } else if (data.reputasi <= 1000) {
                              tier = "--🔥_CONQUEROR_🔥--";
                          } else if (data.reputasi >= 2000) {
                              tier = "--👑GOD👑--";
                          } else {
                              tier = "Anak💀Haram";
                          }

                          let tierOld = '';
                          if (data.reputasiS1 <= 0) {
                              tierOld = "💀BOCAH TOXIC💀";
                          } else if (data.reputasiS1 <= 10) {
                              tierOld = "--_Bronze_--";
                          } else if (data.reputasiS1 <= 20) {
                              tierOld = "--_Silver_--";
                          } else if (data.reputasiS1 <= 30) {
                              tierOld = "--_Gold_--";
                          } else if (data.reputasiS1 <= 50) {
                              tierOld = "--_Platinum_--";
                          } else if (data.reputasiS1 <= 100) {
                              tierOld = "--💎_Diamond_💎--";
                          } else if (data.reputasiS1 <= 200) {
                              tierOld = "--♚_CROWN_♚--";
                          } else if (data.reputasiS1 <= 500) {
                              tierOld = "--⭐_ACE_⭐--";
                          } else if (data.reputasiS1 === 666) {
                              tierOld = "S0N-0F-S4TAN";
                          } else if (data.reputasiS1 <= 1000) {
                              tierOld = "--🔥_CONQUEROR_🔥--";
                          } else if (data.reputasiS1 >= 2000) {
                              tierOld = "--👑GOD👑--";
                          } else {
                              tierOld = "Anak💀Haram";
                          }

                          return `${index + 1}. Nama: ${data.nama || 'anak bapa'}\nTier: ${tier}\nTier Season lalu: ${tierOld || tier}\n`;
                      });

                  const rankList = ranks.join('\n');
                  resolve(rankList);
              } else {
                  reject('Data Reputasi kosong');
              }
          });
      }).then((rankList) => {
          message.reply(`Rank TerTinggi di Season 1:\n${rankList}`);
      }).catch((error) => {
          message.reply(error);
      });
  }
}



// Kirim point
if (match1) {
  const parameter = match1[1];
  const parameterSplit = parameter.split(" ");

  if (parameterSplit.length === 2) {
    const nomorTujuan = parameterSplit[0];
    const jumlahPoint = parseInt(parameterSplit[1], 10);
    const nomortanpa = nomorTujuan.replace(/@/g, "");
    const nomorLengkap = nomortanpa+"_c_us";
    const sanitizedSender = corection.replace(/[\.\@\[\]\#\$]/g, "_");
    const originalSender = sanitizedSender.replace(/_/g, ".");
    const sn = generateSN(16);  

    if(jumlahPoint <= 0){
        message.reply("gabisa mines mines lagi wkwkw");
    }else{
      RefPoint.once('value', async (snapshot) => {
        const poin1 = snapshot.val() || 0;
        const senderName = originalSender;
        if(senderName === originalSender){
            if(poin1 >= jumlahPoint){
              const iniYangNgirim  = poin1 - jumlahPoint;
              await message.reply(`Pengiriman Point sejumlah: ${jumlahPoint}, _sedang Dalam Proses_`)
              await RefPoint.set(iniYangNgirim);
                    pointRef.child(nomorLengkap).child('point').once('value', async (snapshot) => {
                      const poin2 = snapshot.val() || 0;
                      const iniYangNerima = poin2 + jumlahPoint;
                      await pointRef.child(nomorLengkap).child('point').set(iniYangNerima);
                    });
                    
                    setTimeout(() => {
                        message.reply(`Pengiriman point ke ${nomorTujuan}, Berhasil. SN:${sn}`)
                    }, 2000)
                  }else{ 
                    message.reply('point lu ga cukup anjg');
                setTimeout(() => {
                  client.sendMessage(message.from,'eh maap toxic');
                },2000)
              }
            }
          });
        }
  } else {
    message.reply("Format pesan tidak sesuai. Harap masukkan nomor tujuan dan jumlah point dengan benar.");
  } 
}
//game Togel
if (togel) {
        let isPasang = false;
        const masangTogel = togel[1];
        RefPoint.once('value', async (snapshot) => {
            const poin = snapshot.val() || 0;
                if (poin >= 5000) {
                              if(masangTogel.match(/(\d{4})/)){
                                isPasang = true;  
                            }else{
                                message.reply('ulang boss, pasangnya 4 angka')
                            }
                                if (isPasang) {
                                        const angkaTogel = masangTogel;
                                        const bayarTogel = poin - 5000;
                                        RefPoint.set(bayarTogel);
                                        message.reply(`Berhasil Masang Angkanya: *${angkaTogel}*.\n\nHasil 10 Detik`);
                                        setTimeout(() => {
                                            const hasil = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
                                            if (hasil === angkaTogel) {
                                                const menangTogel = poin + 50000;
                                                RefPoint.set(menangTogel);
                                                message.reply(`*Togel ETMC: ${hasil}*.\n_Boss Masang: ${angkaTogel}_`);
                                                setTimeout(() => {
                                                    message.reply(`Mantap Boss, dapet JP 50.000.`);
                                                }, 1000);
                                            } else {
                                                message.reply(`*Togel ETMC: ${hasil}*.\n_lu masang: ${angkaTogel}_`);
                                                setTimeout(() => {
                                                    const repmaaf = [
                                                        'sori boss belom tembus wkwk',
                                                        'maaf ni belom tembus boss',
                                                        'maaf ya, belum ada keberuntungan kali ini',
                                                        'mohon maaf, belum berhasil kali ini',
                                                        'maaf boss, belum mendapatkan hasil yang diinginkan',
                                                        'terima kasih atas kesabaran boss, masih belum beruntung',
                                                        'jangan putus asa boss, semoga keberuntungan menyertai',
                                                        'maafkan kami boss, belum bisa memberikan yang diharapkan',
                                                        'belum berhasil boss, tetap semangat dan coba lagi',
                                                        'maaf ya boss, belum ada rezeki kali ini',
                                                        'tolong maafkan kegagalan ini boss',
                                                        'maaf atas ketidakberuntungan ini boss',
                                                        'semoga keberuntungan datang di lain waktu boss',
                                                        'mohon maaf atas hasil yang belum memuaskan boss',
                                                        'sabar ya boss, masih ada kesempatan lainnya',
                                                        'maaf boss, masih belum berjodoh dengan kemenangan',
                                                        'tolong dimaklumi boss, masih dalam perjuangan mencari keberuntungan',
                                                        'semangat boss, kita belum menyerah',
                                                        'maaf atas ketidakberhasilan ini boss, tetap optimis',
                                                      ];
                                                    const capitalizedRep = repmaaf.map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1));
                                                    const reprep1 = capitalizedRep[Math.floor(Math.random() * capitalizedRep.length)] 
                                                    message.reply(reprep1);
                                                }, 1000);
                                            }
                                        }, 10000);
                                }
                        } else {
                            message.reply('Point masih dikit aja, gaya gayaan maen togel cuak');
                        }
        });
}
//gameSlot
if (pesan === '!slot') {
        const sanitizedSender = corection.replace(/[\.\@\[\]\#\$]/g, "_");
        const originalSender = sanitizedSender.replace(/_/g, ".");
        const buah = [
            ['🥝', '🍓', '🥭'],
            ['🍍', '🍊', '🍋'],
            ['🍉', '🥑', '🍌'],
        ];
        RefPoint.once('value', async (snapshot) => {
          const poin = snapshot.val() || 0;
          const senderName = originalSender;
          if (senderName === originalSender) {
            if (poin >= 2500) {
                const result = [];
                for (let i = 0; i < 3; i++) {
                    const row = [];
                    for (let j = 0; j < 3; j++) {
                        const randomIndex = Math.floor(Math.random() * buah.length);
                        const randomBuah = buah[randomIndex];
                        const randomBuahIndex = Math.floor(Math.random() * randomBuah.length);
                        const buahItem = randomBuah[randomBuahIndex];
                        row.push(buahItem);
                    }
                    result.push(row);
                }
              let replyMessage = '';
              for (let i = 0; i < result.length; i++) {
                  replyMessage += result[i].join(' ') + '\n';
                }
                setTimeout(() => {
                    message.reply(replyMessage);
                }, 2000);
                    
                if (isWinningCombination(result)) {
                    setTimeout(() =>{
                        const menangSlot = poin + 10000;
                        RefPoint.set(menangSlot);
                        message.reply('wihh menang 5.000.');
                    }, 2000);
                } else {
                    setTimeout(() =>{
                        const bayarSlot = poin - 2500;
                        RefPoint.set(bayarSlot);
                        message.reply('yahaha kalah blog, coba lagi sampe miskin');
                    }, 2000);
              }
            } else {
              message.reply('pointnya ga cukup boss, mending jangan dah');
            }
          } else {
            message.reply('err');
          }
        }).catch((err) =>{
            console.log(err)
        });
        function isWinningCombination(result) {
        // Cek baris
        for (let i = 0; i < result.length; i++) {
          if (result[i][0] === result[i][1] && result[i][1] === result[i][2]) {
            return true;
          }
        }
      
        // Cek kolom
        for (let j = 0; j < result[0].length; j++) {
          if (result[0][j] === result[1][j] && result[1][j] === result[2][j]) {
            return true;
          }
        }
      
        // Cek diagonal
        if (result[0][0] === result[1][1] && result[1][1] === result[2][2]) {
          return true;
        }
        if (result[0][2] === result[1][1] && result[1][1] === result[2][0]) {
          return true;
        }
        return false;
      }
}
//game Ribut
if(ribut){
      let p1 = "";
      let p2 = "";
      RefNama.once('value', async (snapshot) => {
        const nama1 = snapshot.val() || sanitizedSender;
        if(nama1 === sanitizedSender){
          p1 = "bocah";
        }else{
          p1 = await nama1;
        }
      });
      
      pointRef.child(ribut[1].replace(/@/g, "")+"_c_us").child('nama').once('value', async (snapshot) => {
        const nama2 = snapshot.val() || sanitizedSender;
        if(nama2 === sanitizedSender){
          p2 = "dia";
        }else{
          p2 = await nama2;
        }
      });
      setTimeout(() => {
        //line1
        const line1 = [
          `Mereka kembali terlibat perselisihan, ${p1} melawan ${p2}.`,
          `Terjadi keributan hebat antara ${p1} dan ${p2}.`,
          `Konflik sengit pecah di antara ${p1} dan ${p2}.`,
          `Perang kata-kata meletus antara ${p1} dan ${p2}.`,
          `Saling serang terjadi antara ${p1} dan ${p2}.`,
          `Perseteruan tak terelakkan melibatkan ${p1} dan ${p2}.`,
          `Kembali terjadi bentrok antara ${p1} dan ${p2}.`,
          `Situasi semakin memanas saat ${p1} berhadapan dengan ${p2}.`,
          `Terjadi ketegangan tinggi antara ${p1} dan ${p2}.`,
          `Muncul pertikaian baru antara ${p1} dan ${p2}.`,
          `Keduanya saling berhadapan dalam pertengkaran sengit, ${p1} melawan ${p2}.`,
        ];
        const line1Random = line1[Math.floor(Math.random() * line1.length)];
        client.sendMessage(message.from, line1Random);
      },2000);
      setTimeout(() => {
        //line2
        const line2 = [
          `Anjir, mereka mulai gigit-gigitan!`,
          `Mereka adu bacot guys, gokil abis!`,
          `Oooowww, ${p1} meludahi ${p2}!`,
          `Tiba-tiba, mereka saling cakar-mencakar!`,
          `Terjadi aksi saling serang di antara mereka!`,
          `Semakin memanas, mereka bergulat dengan ganas!`,
          `Bentrokan kata-kata yang mengguncang, tak ada ampun!`,
          `Saling mencela dan menghina terjadi di antara mereka!`,
          `Perkelahian hebat dimulai, mereka tak kenal belas kasihan!`,
          `Emosi memuncak, mereka saling menerjang dengan kemarahan!`,
          `Teriakan dan umpatan menggema, mereka bertarung dengan nafsu!`,
          `Dalam kegilaan, mereka saling mencambuk dengan kata-kata tajam!`,
        ];
        const line2Random = line2[Math.floor(Math.random() * line2.length)];
        client.sendMessage(message.from, line2Random);
      },6000);
      setTimeout(() => {
        //line3
        const line3 = [
          `Pihak ${p2} pun tidak terima habis disepongin oleh ${p1}.`,
          `GOKIL! ${p1} mencium lawannya dengan keras!`,
          `Pertarungan yang sangat sengit terjadi antara ${p1} dengan ${p2}.`,
          `Tak terima dengan perlakuan ${p1}, ${p2} mengamuk!`,
          `Mereka saling menyerang dengan kemarahan yang membara!`,
          `Emosi tak terbendung, kedua belah pihak terlibat konfrontasi sengit!`,
          `Intensitas pertarungan semakin meningkat, tak ada yang mundur!`,
          `Darah panas menguap, mereka bertarung dengan penuh kebencian!`,
          `Perkelahian yang mencekam, tak ada yang bisa menghentikan mereka!`,
          `Aksi kekerasan memuncak, pertarungan ini tak tertandingi!`,
          `Gelombang kemarahan melanda, mereka saling menghujat dengan kejam!`,
          `Dalam ketegangan yang tiada tara, kedua belah pihak saling berusaha mengalahkan!`,
        ];
        const line3Random = line3[Math.floor(Math.random() * line3.length)];
        client.sendMessage(message.from, line3Random);
      }, 9000);
      setTimeout(() => {
        //linePemenang
        const pemenang = Math.random() < 0.5 ? p1 : p2;
        if(pemenang === p1){
          client.sendMessage(message.from, `pemenangnya adalah ${pemenang} 🥳🥳`);
        }else if( pemenang === p2){
          client.sendMessage(message.from, `pemenangnya adalah ${pemenang} 🥳🥳`);
        };
      }, 13000);
}
//Belanja
if(pesan === "!pap"){
  linkRef.child('pap').once('value',async (snapshot) => {
    const link = snapshot.val() || "1";
    const randomLink = Math.floor(Math.random() * link.length);
    const randomIndex = link[randomLink];
    RefPoint.once('value', async (snapshot) => {
      const point = snapshot.val() || 0;
      if(point >= 50000){
        message.reply('bentar gua foto dulu')
        const bayarPap = point - 50000;
        await RefPoint.set(bayarPap);
        setTimeout(async () => {
          message.reply(await MessageMedia.fromUrl(randomIndex));
        }, 3000)
      }else{
        const kurangBerapa = point - 50000;
        client.sendMessage(message.from, `point lu ada ${point.toLocaleString('id-ID',{minimumFractionDigits: 0})}. kurang ${kurangBerapa.toLocaleString('id-ID',{minimumFractionDigits: 0})}\n harga pap lagi naik ni 50K !`)
      }
    })
  })
}
//reputasi
if(!reputasi[corection]){
    reputasi[corection] = 0;
}
for(const threshold of thresholds){
  const sanitizedSenderC = corection.replace(/[\.\@\[\]\#\$]/g, "_");

    if(reputasi[corection] >= threshold){
        const reputasiAdded = pointRef.child(sanitizedSenderC).child('reputasi');
        reputasiAdded.once('value', async (snapshot) => {
            const reputasi = snapshot.val() || 0;
            const newRep = parseInt(reputasi + 1);
            await reputasiAdded.set(newRep);
        });
    }
    break;
}
//LeaderBoard




//POKEMON SYSTEM
  /* POKEBALLS*/
  function usePokeball(){
    let pokeballsCount = Math.floor(Math.random() * 3) + 1;
    RefPokeDelay.once('value', async (snapshot) => {
        const delay = snapshot.val() || 'true';
        if(delay === 'true'){
          RefPoke.once('value',async (snapshot) => {
            const poke = snapshot.val() || 0;
              const nambahpoke = poke + pokeballsCount;
              await RefPoke.set(nambahpoke);
              client.sendMessage(sender, `selamat kamu dapat ${pokeballsCount} Pokeballs.`)
            });
            await RefPokeDelay.set('false');
            setTimeout(async () => {
              await RefPokeDelay.set('true');
            }, 60000)
          }else{
            setTimeout(async () => {
              await RefPokeDelay.set('true');
            }, 60000)
            message.reply('Jeda 1 menit ya, buat farming Pokeballs...')
          }
    });
  };
  /*BELI POKEBALL*/
  function BuyPokeballs(jumlah) {
    RefPoint.once('value', async (snapshot) => {
      const point = snapshot.val()
      const jumlahBeli = jumlah * 100;
      const jumlahParam = parseInt(jumlah);
      const bayarPoke = point - jumlahBeli;
      if(jumlah <= 0){
        message.reply('gabisa mines mines lagi, wkwkwk');
      }else{
        if(point <= 0){
          client.sendMessage(sender, 'point mu mines, sering2 aktif di grub ya biar banyak point hehe');
        }else if(point >= jumlahBeli){
          setTimeout(async () => {
            await RefPoint.set(bayarPoke);
          }, 1000)
          RefPoke.once('value', async (snapshot) => {
            const poke = snapshot.val() || 0;
            const nambahPoke = parseInt(poke + jumlahParam);
            await RefPoke.set(nambahPoke);
          });
        message.reply(`pembelian pokeballs sebanyak ${jumlah} berhasil`)
      }else{
        message.reply('point tidak cukup cuy, harga pokeballs 1 nya 100point');
      }
    }
    });
  }





  /*command pokemon */
if(pesan === '!pokeball'){
  usePokeball();
};
if(Buy){
  const trigger = Buy[1];
  const param1 = Buy[2];
  if(trigger === 'pokeball'){
    BuyPokeballs(param1);
  }else if(trigger === 'pokemon'){
    client.sendMessage(sender, 'Sedang dalam tahap development')
  }
}
if(pesan === '!cektas'){
  let pokeballs = '';
  const pokemon = [];
  RefPoke.once('value', async (snapshot) => {
      const poke = snapshot.val() || 0;
      pokeballs = await poke;
    });
  await RefPokemon.once('value', async (snapshot) => {
    const pokemonA = await snapshot.val() || {};
    const Vlimited = Object.keys(pokemonA);
    const limited5 = Vlimited.slice(0,5);
    limited5.forEach((id) => {
      const pokemonName = pokemonA[id].namaPokemon;
      pokemon.push(pokemonName);
    });
  });
  setTimeout(async () => {
    const pokemonList = pokemon.map((name, index) => `${'-'} ${name}`).join("\n");
    message.reply(`Pokeballs: ${pokeballs}.\nPokemon:\n${pokemonList}`);
  },1000 )
}

if (pesan === '!pokedex') {
  const pokemon = [];

  await RefPokemon.once('value', async (snapshot) => {
    const pokemonData = snapshot.val() || {};

    Object.keys(pokemonData).forEach((id) => {
      const pokemonName = pokemonData[id].namaPokemon;
      const pokemonHP = pokemonData[id].HP;
      const pokemonATT = pokemonData[id].ATTACK;
      const pokemonDEFF = pokemonData[id].DEFENSE;
      const pokemonTYPE = pokemonData[id].TYPE;

      const pokemonStats = {
        name: pokemonName,
        hp: pokemonHP,
        attack: pokemonATT,
        defense: pokemonDEFF,
        type: pokemonTYPE
      };

      pokemon.push(pokemonStats);
    });
  });

  setTimeout(() => {
    const jumlahPokemon = pokemon.length;
    let pokemonList = '';
    pokemon.forEach((pokemonStats, index) => {
      const { name, hp, attack, defense, type } = pokemonStats;
      pokemonList += `${index + 1}. ${name}\n`;
      pokemonList += `   - HP: ${hp}\n`;
      pokemonList += `   - Attack: ${attack}\n`;
      pokemonList += `   - Defense: ${defense}\n`;
      pokemonList += `   - Type: ${type}\n`;
    });

    message.reply(`*POKÉDEX*.\nJumlah Pokemon: ${jumlahPokemon}\n${pokemonList}`);
  }, 1000);
}

if(pesan === "!catch"){
  await axios.get(`https://pokeapi.co/api/v2/pokemon/?offset=0&limit=2200`).then(resp => {
  const raw = resp.data.results;
  const pickOnePoke = raw.map(pokemon => pokemon);
  const randomPoke = pickOnePoke[Math.floor(Math.random() * raw.length)];
  const resultValue = Math.random();
  const chanceBerhasil = 0.6;
  if(chanceBerhasil <= resultValue){
    RefPoke.once('value', async (snapshot) => {
      const pokeball = snapshot.val() || 0;
      const pakePokeball = pokeball - 1;
      if(pokeball >= 1){
        await RefPoke.set(pakePokeball);
        await axios.get(randomPoke.url).then(respon => {
          message.reply(`*${randomPoke.name.toUpperCase()}*\nSTATUS:\n${respon.data.stats[0].stat.name.toUpperCase()}: ${respon.data.stats[0].base_stat}.\n${respon.data.stats[1].stat.name.toUpperCase()}: ${respon.data.stats[1].base_stat}\n${respon.data.stats[2].stat.name.toUpperCase()}: ${respon.data.stats[2].base_stat}\n${respon.data.stats[5].stat.name.toUpperCase()}: ${respon.data.stats[5].base_stat}\n\nPokemon Type: ${respon.data.types[0].type.name.toUpperCase()}.`);
          RefPokemon.push({
            namaPokemon : randomPoke.name.toUpperCase(),
            HP : respon.data.stats[0].base_stat,  
            ATTACK : respon.data.stats[1].base_stat,  
            DEFENSE : respon.data.stats[2].base_stat,  
            SPEED : respon.data.stats[5].base_stat,  
            TYPE : respon.data.types[0].type.name.toUpperCase()
          })
        });
      }else{
        message.reply('nangkep pokemon gabisa pake tangan mas. cari pokeball dlu gih !pokeball.\nKalo ga beli !buy pokeball 1');
      }
    })
  }else{
    RefPoke.once('value', async (snapshot) => {
      const pokeball = snapshot.val() || 0;
      const pakePokeball = pokeball - 1;
      if(pokeball >= 1){
        await RefPoke.set(pakePokeball);
        message.reply('awokaowk, kabur pokemonnya');
      }else{
        message.reply('nangkep pokemon gabisa pake tangan mas. cari pokeball dlu gih !pokeball.\nKalo ga beli !buy pokeball 1');
      }
      RefPoke.set(pakePokeball);
    })
      
  }
  }).catch((err) => {
    console.log(err);
  })
}

if (pesan.startsWith('!setgacoan')) {
  const param1 = parseInt(pesan.split(' ')[1]) - 1;
  const pokemon = [];

  if (param1 >= 0) {
    await RefPokemon.once('value', async (snapshot) => {
      const pokemonData = snapshot.val() || {};

      Object.keys(pokemonData).forEach((id) => {
        const pokemonName = pokemonData[id].namaPokemon;
        const pokemonHP = pokemonData[id].HP;
        const pokemonATT = pokemonData[id].ATTACK;
        const pokemonDEFF = pokemonData[id].DEFENSE;
        const pokemonSPD = pokemonData[id].SPEED;
        const pokemonTYPE = pokemonData[id].TYPE;

        const pokemonStats = {
          name: pokemonName,
          hp: pokemonHP,
          attack: pokemonATT,
          defense: pokemonDEFF,
          speed: pokemonSPD,
          type: pokemonTYPE
        };

        pokemon.push(pokemonStats);
      });
    });

    setTimeout(() => {
      const jumlahPokemon = pokemon.length;
      if (param1 < jumlahPokemon) {
        const gacoan = pokemon[param1];
        const { name, hp, attack, defense, speed, type } = gacoan;

        // Simpan gacoan ke dalam database
        RefGacoan.set(gacoan);
        let pokemonList = '';
        pokemonList += `Gacoan: ${name}\n`;
        pokemonList += `   - HP: ${hp}\n`;
        pokemonList += `   - Attack: ${attack}\n`;
        pokemonList += `   - Defense: ${defense}\n`;
        pokemonList += `   - Speed: ${speed}\n`;
        pokemonList += `   - Type: ${type}\n`;
        message.reply(`Berhasil set Gacoan:\n${pokemonList}`);
      } else {
        message.reply(`Nomor Pokemon tidak valid. Silakan pilih nomor antara 1 dan ${jumlahPokemon}.`);
      }
    }, 1000);
  } else {
    message.reply(`Nomor Pokemon tidak valid. Silakan pilih nomor antara 1 dan ${pokemon.length}.`);
  }
}

if (pesan.startsWith('!fight')) {
  let p1 = [];
  let p2 = [];
  let isFightInProgress = false; // Flag untuk menandakan apakah pertarungan sedang berlangsung
  const param1 = pesan.split(' ')[1];
  const RefGacoan2 = param1.replace(/@/g, '') + '_c_us';
  const RefGacoanP2 = PokemonRef.child(RefGacoan2).child('pokemon').child('gacoan');
  const RefRep2 = pointRef.child(RefGacoan2).child('reputasi');

  if (param1.length > 11) {
    // Pengecekan apakah pertarungan sedang berlangsung
    if (isFightInProgress) {
      message.reply('Pertarungan sebelumnya belum selesai.');
      return;
    }

    RefGacoan.once('value', async (snapshot) => {
      const gacoanP1 = snapshot.val() || {};
      if (Object.keys(gacoanP1).length > 0) {
        p1.push(gacoanP1);
      } else {
        message.reply('lu belum ada gacoan. set dulu !setgacoan');
      }
    });

    RefGacoanP2.once('value', async (snapshot) => {
      const gacoanP2 = snapshot.val() || {};
      if (Object.keys(gacoanP2).length > 0) {
        p2.push(gacoanP2);
      } else {
        message.reply('Lawan lu belom punya gacoan. Telponin suruh set gitu');
      }
    });

    setTimeout(async () => {
      if (p1.length > 0 && p2.length > 0) {
        isFightInProgress = true; // Set flag menjadi true saat pertarungan dimulai
        message.reply(`Pertarungan antara ${p1[0].name} VS ${p2[0].name}`);
        let P1HP = p1[0].hp;
        let P2HP = p2[0].hp;

        const fightLoop = async () => {
          let winner = null;
          RefRep.once('value', async (snapshot) => {
            const val1 = snapshot.val() || 0;
            const repmenang = val1 + 100;
            const repKalah = val1 - 10;

            RefRep2.once('value', async (snapshot) => {
              const val2 = snapshot.val() || 0;
              const repmenang2 = val2 + 100;
              const repKalah2 = val2 - 10;

              const P1att = p1[0].attack / p1[0].defense * 15;
              const P2att = p2[0].attack / p2[0].defense * 15;
              P1HP -= P2att;
              P2HP -= P1att;
              console.log(P1HP);
              console.log(P2HP);
              console.log(P1att);
              console.log(P2att);

              if (P1HP > 0 && P2HP > 0) {
                setTimeout(fightLoop, 1000);
              } else {
                if (P1HP <= 0 && P2HP <= 0) {
                  message.reply(`Pertarungan berakhir dengan hasil seri!`);
                } else if (P1HP <= 0) {
                  await RefRep2.set(repmenang2);
                  await RefRep.set(repKalah);
                  winner = p2[0].name;
                  message.reply(`Pertarungan berakhir! ${p2[0].name} adalah pemenangnya!`);
                } else {
                  await RefRep.set(repmenang);
                  await RefRep2.set(repKalah2);
                  winner = p1[0].name;
                  message.reply(`Pertarungan berakhir! ${p1[0].name} adalah pemenangnya!`);
                }
                isFightInProgress = false; // Set flag menjadi false setelah pertarungan selesai
              }
            });
          });
        };

        setTimeout(fightLoop, 2000);
      } else {
        message.reply(`Pertarungan Gagal. gatau kenapa lah, cape anjir`);
      }
    }, 1000);
  } else {
    message.reply('tag aja dlu orng nya');
  }
}

  
  //end of the line
});
client.initialize();
