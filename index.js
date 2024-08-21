const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const admin = require('firebase-admin');
const {handleCommand} = require('./config/handleCommand');
const { EventEmitter } = require('events');

require('dotenv').config();

const eventEmitter = new EventEmitter();

const client = new Client({authStrategy: new LocalAuth()});

client.on('qr', qr => { qrcode.generate(qr, {small: true})});

const db = admin.database();
const pointRef = db.ref('dataPengguna/pengguna');
const DataData = db.ref('dataData');


//Reset Absen to True
function RestartServer() {
  const absensi = false;
  const absenWeb = true;
  pointRef.once('value', (snapshot) => {
    const penggunaData = snapshot.val();
    if (penggunaData) {
      Object.entries(penggunaData).forEach(([randomkey, data]) => {
        pointRef.child(randomkey).child('absen').set(absensi);
        pointRef.child(randomkey).child('absenWeb').set(absenWeb);
        });
        } else {
          console.log('Database is empty');
        }
      });
}

// Update stok pada jam 12:00mlm
function UpdateStock() {
  DataData.child('delay').child('elixir').once('value', async (snapshot) => {
      const SElixir = snapshot.val().stock || 0;
      DataData.child('delay').child('greatballs').once('value', async (snapshot) => {
          const SGreatballs = snapshot.val().stock || 0;
          DataData.child('delay').child('masterball').once('value', async (snapshot) => {
            const SMasterball = snapshot.val().stock || 0;
            DataData.child('delay').child('pokeballs').once('value', async (snapshot) => {
              const SPokeballs = snapshot.val().stock || 0;
              DataData.child('delay').child('potion').once('value', async (snapshot) => {
                const SPotion = snapshot.val().stock || 0;
                DataData.child('delay').child('trainingTicket').once('value', async (snapshot) => {
                  const STrainingTicket = snapshot.val().stock || 0;
                  DataData.child('delay').child('ultraball').once('value', async (snapshot) => {
                    const SUltraball = snapshot.val().stock || 0;
                    
                    DataData.child('delay').child('elixir').update({ stock: SElixir + 10 });
                    DataData.child('delay').child('greatballs').update({ stock: SGreatballs + 10 });
                    DataData.child('delay').child('masterball').update({ stock: SMasterball + 10 });
                    DataData.child('delay').child('pokeballs').update({ stock: SPokeballs + 10 });
                    DataData.child('delay').child('potion').update({ stock: SPotion + 10 });
                    DataData.child('delay').child('trainingTicket').update({ stock: STrainingTicket + 10 });
                    DataData.child('delay').child('ultraball').update({ stock: SUltraball + 10 });
                    setTimeout(() => {
                      const dataBarang = `Elixir : ${SElixir}\nPotion : ${SPotion}\nTraining Ticket : ${STrainingTicket}\nPokeballs : ${SPokeballs}\nGreatballs : ${SGreatballs}\nUltraballs : ${SUltraball}\nMasterballs : ${SMasterball}\nBelanjanya di => https://www.rraf-project.site/shopping/pokemon`
                      client.sendMessage(`${process.env.GROUP_1}`, `Barang Telah Restock\n${dataBarang}`);
                    },3000)
                  })
                })
              })
            })
          })
        })
      })
}

function selesaiRestart() {

  console.log("Silakan isi alasan restart server:");
  const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
  });

  readline.question('Alasan restart: ', (alasan) => {
      console.log(`Alasan restart: ${alasan}`);
      readline.close();
      eventEmitter.emit('selesaiRestart', alasan);
  });
}

    // settings jam/reset Stock
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    const timeUntilNextMidnight = nextMidnight - now;
    setTimeout(UpdateStock, timeUntilNextMidnight);

selesaiRestart();


eventEmitter.on('selesaiRestart', (alasan) => {
  client.on('ready', () => {
    console.log('Client is ready!')
    //client.sendMessage(`6285210306474_c_us`, `Server Restart Done\nStatus: *ONLINE*\nReset Absen: *OK*\nReindex Database: *OK*\nReason Restart: ${alasan}`);
    RestartServer();
  });
})

client.on('message', async (message) => {
    handleCommand(message,client);
});
client.initialize();