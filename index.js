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
const pointRef = db.ref('dataPengguna/pengguna')
const linkRef = db.ref('dataData/link')
const DataRef = db.ref('dataData/command')
const DataMRef = db.ref('dataData/mabar')
const point = {};
const reputasi = {};
const thresholds = [0, 100 ,200, 500, 1000, 5000, 10000, 20000, 500000, 1000000, 1000000000];
const regexCari = /^!cari\s(.+)/;
const regexKirim = /^!kirim\s(.+)/;
const regexTogel = /^!togel\s(\d{4})/;
const regexRibut = /^!ribut\s(.+)/;
const regexNama = /^!nama\s(.+)/;
const regexInfo = /^!info\s(.+)/;
const regexCommand = /^!addcommand\s(.+)/;
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
    const Mabar = pesan.match(regexMabar);
    const tambahCommand = pesan.match(regexCommand);
    const RefNama = pointRef.child(sanitizedSender).child('nama');
    const RefPoint = pointRef.child(sanitizedSender).child('point');
    const RefRep = pointRef.child(sanitizedSender).child('reputasi');
    
    // handler nama

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
    if(
        pesan.match(/\bkon\b/i) ||
        pesan.match(/\bkontol\b/i) ||
        pesan.match(/\bkntl\b/i) ||
        pesan.match(/\bkentot\b/i) ||
        pesan.match(/\bngentot\b/i) ||
        pesan.match(/\bmek\b/i) ||
        pesan.match(/\btot\b/i) ||
        pesan.match(/\bngen\b/i) ||
        pesan.match(/\bsu\b/i) ||
        pesan.match(/\banjg\b/i) ||
        pesan.match(/\bajg\b/i) ||
        pesan.match(/\bpuki\b/i) ||
        pesan.match(/\bkimak\b/i) ||
        pesan.match(/\banjing\b/i) ||
        pesan.match(/\basu\b/i) ||
        pesan.match(/\bkimak\b/i) ||
        pesan.match(/\bler\b/i) ||
        pesan.match(/\bpler\b/i) ||
        pesan.match(/\btai\b/i) ||
        pesan.match(/\bcok\b/i) ||
        pesan.match(/\bmemek\b/i) ||
        pesan.match(/\bmmk\b/i) ||
        pesan.match(/\bbajingan\b/i) ||
        pesan.match(/\bbangsat\b/i) ||
        pesan.match(/\bsat\b/i) ||
        pesan.match(/\bcuk\b/i) ||
        pesan.match(/\bass\b/i) ||
        pesan.match(/\banal\b/i) ||
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

    //Command
    if (pesan === '!bot'){
        const commands = [
          { p: '!help', label: 'Bantuan' },
          { p: '!rules', label: 'Aturan' },
          { p: '!berita', label: 'Berita Terkini' },
          { p: '!cuaca', label: 'Info Cuaca' },
          { p: '!doa', label: 'Doa Harian' },
          { p: '!quotes', label: 'Apa Quotes Untuk mu?' },
          { p: '!nama namaKalian', label: 'isi namamu di grub ini!' },
          { p: '!rate', label: 'Cek Rate 1USD = Rp xx.xxx' },
          { p: '!info cuaca/mabar', label: 'Cek info cuaca dan info mabar' },
          { p: '!stat', label: 'Cek Point, Reputasi & status' },
          { p: '!mabar "game apa, jam berapa, kapan"', label: 'Tambah info mabar' },
          { p: '!ribut @...', label: 'Kalo ada masalah ributnya pake ini ya' },
          { p: '!kirim @... 12345', label: 'Kirim Point ke Teman' },
          { p: '!togel 1234', label: 'Main Togel' },
          { p: '!pap', label: 'ngirim pap jahat' },
          { p: '!slot', label: 'Main Slot' }
        ];
        
        let menuText = '*ETMC-BOT nih boss* \n\n';
        
        commands.forEach((command, index) => {
            menuText += `${index + 1}. ${command.p} - ${command.label}\n`;
        });
        
        menuText += '\nBaru ada Command Ini Doang ni';
        client.sendMessage(message.from, menuText);
    }
    if(pesan === '!help'){
        client.sendMessage(message.from,'!togel = main togel kalo JP dapet 50.000 Point tapi lu bayar 5.000 Point\n cara main togel tinggal gini ni "!togel 1234"\n!slot = main slot kalo JP dapet 10.000 tapi lu bayar 2.500\n!berita = info berita terkini dari CNN, di pick secara random\n!kirim = kirim point ke grup caranya\n!kirim @.... 1000 \n\nMADE by : ETMC \nMAINTENANCE by: W0lV')
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
      /*if(pesan === "!semua"){
        const chat = await message.getChat();
        console.log(chat);
        let text = "";
        let tagging =[];
        console.log(tagging);
        console.log(text);
        for(let participant of chat.participant) {
          const contact = await client.getContactById(participant.id._serialized);
          tagging.push(contact);
          text += `@${participant.id.user}`;
        }
        await chat.sendMessage(text, { mentions });
      }*/
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
                message.reply(`ubah nama minimal punya 1000Point, point lu ${point}`)
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
      } else if (reputasi >= 1001){
        tier = "--👑GOD👑--";
      }else{
        tier = "Anak💀Haram"
      }
      
      repu = await reputasi.toString();
    });
    //point
    RefPoint.once('value', async (snapshot) => {
        const poin = snapshot.val() || 0;
        point = await poin.toLocaleString('id-ID',{minimumFractionDigits: 0});
    });
    RefNama.once('value', async (snapshot) => {

    })

    setTimeout(() => {
        message.reply(`*${tier}*\n\nPoint Kamu: *${point}*\nReputasi: *${repu}*`);
    },1000)
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
                                            if (hasil === angkaTogel || angkaTogel === '1111') {
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
          client.sendMessage(message.from, `pemenangnya adalah ${pemenang} 🥳🥳`)
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
        client.sendMessage(message.from, `point lu cuma ${point}. gausah minta pap!`)
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
});

client.initialize();