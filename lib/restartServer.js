const db = require('../config/config').db;
const client = require('../config/config').client;

// Reset Absen to True
async function selesaiRestart() {
    const pointRef = db.ref('dataPengguna/pengguna');
    const absensi = false;
    const absenWeb = true;

    // Mendapatkan waktu saat ini
    const now = new Date();
    const formattedDate = now.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    const formattedTime = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    // Mengatur status dengan waktu restart terakhir
    const status = `Last Restart : ${formattedDate} @${formattedTime}\nSERVER ONLINE`;
    await client.setStatus(status);

    // Melakukan reset absen di database
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
