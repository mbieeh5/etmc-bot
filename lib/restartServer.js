const db = require('../config/config').db;
const client = require('../config/config').client;
const { EventEmitter } = require('events');

// Reset Absen to True
async function selesaiRestart() {
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

module.exports = {
  selesaiRestart
}
