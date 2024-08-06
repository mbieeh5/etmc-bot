const db = require('../config/config').db;
const client = require('../config/config').client;
const { EventEmitter } = require('events');

// Reset Absen to True
async function selesaiRestart() {
  const eventEmitter = new EventEmitter();
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

  eventEmitter.on('selesaiRestart', (alasan) => {
    client.on('ready', () => {
      console.log('Client is ready!');
      //client.sendMessage(`${process.env.GROUP_1}`, `Server Restart Done\nStatus: *ONLINE*\nReset Absen: *OK*\nReindex Database: *OK*\nReason Restart: ${alasan}`);
      RestartServer();
    });
  });

  function RestartServer() {
    const pointRef = db.ref('dataPengguna/pengguna');
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
}

module.exports = {
  selesaiRestart
}
