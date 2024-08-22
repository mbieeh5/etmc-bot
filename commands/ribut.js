const { db } = require('../config/config');

const pointRef = db.ref('dataPengguna/pengguna');

module.exports = async (message) => {
    try {
        let p1 = "";
        let p2 = "";
        const params = (message.body).split(" ")[1];
        const sA = message.author;
        const sender = message.from;
        const corection = sA !== undefined ? sA : sender;
        const sanitizedSender = corection.replace(/[\.\@\[\]\#\$]/g, "_");

        const RefNama1 = pointRef.child(sanitizedSender).child('nama');
        const nama1Snapshot = await RefNama1.once('value');
        const nama1 = nama1Snapshot.val() || sanitizedSender;
        p1 = nama1 === sanitizedSender ? "bocah" : nama1;

        const RefNama2 = pointRef.child(params.replace(/@/g, "") + "_c_us").child('nama');
        const nama2Snapshot = await RefNama2.once('value');
        const nama2 = nama2Snapshot.val() || sanitizedSender;
        p2 = nama2 === sanitizedSender ? "dia" : nama2;

        // Random line 1
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

        // Random line 2
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

        // Random line 3
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

        // Determine winner
        const pemenang = Math.random() < 0.5 ? p1 : p2;
        const linePemenang = `Pemenangnya adalah ${pemenang} 🥳🥳`;

        // Function to delay the message
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        // Send the messages in sequence with delays
        await message.reply(line1Random);
        await delay(1000);
        await message.reply(line2Random);
        await delay(2000);
        await message.reply(line3Random);
        await delay(3000);
        await message.reply(linePemenang);

    } catch (error) {
        console.error('Error processing story:', error);
        await message.reply('Terjadi kesalahan saat memproses cerita.');
    }
};
