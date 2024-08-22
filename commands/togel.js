const {db} = require('../config/config');

const pointRef = db.ref('dataPengguna/pengguna');

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = async (message) => {
    try {
        let isPasang = false;
        const sA = message.author;
        const sender = message.from;
        const corection = sA !== undefined ? sA : sender;
        const sanitizedSender = corection.replace(/[\.\@\[\]\#\$]/g, "_");
        const masangTogel = (message.body).split(" ")[1];
        const RefPoint = pointRef.child(sanitizedSender).child('point');
        const snapshot = await RefPoint.once('value');
        const poin = snapshot.val() || 0;
        console.log(poin);
        if (poin >= 5000) {
            if (masangTogel.length === 4 && !isNaN(parseInt(masangTogel))) {
                isPasang = true;
            } else {
                return 'Ulang boss, pasangnya 4 angka !togel 1234';
            }

            if (isPasang) {
                const angkaTogel = masangTogel;
                const bayarTogel = poin - 5000;
                await RefPoint.set(bayarTogel);
                
                const initialMessage = `Berhasil Masang Angkanya: *${angkaTogel}*.`;
                await delay(2000); // Menunggu 10 detik
                
                let hasil;
                if (sanitizedSender === process.env.ADMIN_1) {
                    hasil = angkaTogel;
                } else {
                    hasil = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
                }

                let resultMessage;
                if (hasil === angkaTogel) {
                    const menangTogel = poin + 50000;
                    await RefPoint.set(menangTogel);
                    resultMessage = `*Togel ETMC: ${hasil}*.\n_Boss Masang: ${angkaTogel}_`;
                    await delay(1000); // Menunggu 1 detik
                    resultMessage += `\nMantap Boss, dapet JP 50.000.`;
                } else {
                    resultMessage = `*Togel ETMC: ${hasil}*.\n_Lu masang: ${angkaTogel}_`;
                    await delay(1000); // Menunggu 1 detik
                    
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
                    const reprep1 = capitalizedRep[Math.floor(Math.random() * capitalizedRep.length)];
                    resultMessage += `\n${reprep1}`;
                }

                return `${initialMessage}\n${resultMessage}`;
            }
        } else {
            return 'Point masih dikit aja, gaya gayaan maen togel cuak';
        }
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        return 'Error Saat Masang Togel, coba lagi nanti.';
    }
};
