const { db } = require('../config/config');

const pointRef = db.ref('dataPengguna/pengguna');

module.exports = async (message) => {
    try {
        // Pastikan corection didefinisikan dengan benar
        const corection = message.author || message.from;
        const sanitizedSender = corection.replace(/[\.\@\[\]\#\$]/g, "_");
        const originalSender = sanitizedSender.replace(/_/g, ".");
        const RefPoint = pointRef.child(sanitizedSender).child('point');

        const buah = [
            ['🥝', '🍓', '🥭'],
            ['🍍', '🍊', '🍋'],
            ['🍉', '🥑', '🍌'],
        ];

        // Ambil data poin dari Firebase
        const snapshot = await RefPoint.once('value');
        const poin = snapshot.val() || 0;

        if (poin >= 2500) {
            let result = [];
            const isAdmin = sanitizedSender === process.env.ADMIN_1;

            if (isAdmin) {
                // Jika admin, hasil slot selalu menang
                const winningSymbol = '🍒'; // Pilih simbol kemenangan yang diinginkan
                result = [
                    [winningSymbol, winningSymbol, winningSymbol],
                    [winningSymbol, winningSymbol, winningSymbol],
                    [winningSymbol, winningSymbol, winningSymbol],
                ];
            } else {
                // Jika bukan admin, hasil slot acak
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
            }

            let replyMessage = '';
            for (let i = 0; i < result.length; i++) {
                replyMessage += result[i].join(' ') + '\n';
            }
            await message.reply(replyMessage);

            const isWinning = isWinningCombination(result);

            let multiplier = 10; // Rating pengalian default 10%
            if (isWinning) {
                multiplier = Math.floor(Math.random() * multiplier); // Admin tetap 10% dari total kemenangan
            }

            if (isWinning) {
                const winAmountFix = 10000
                const winAmount = isAdmin ? winAmountFix * 10 : winAmountFix * multiplier;
                await RefPoint.set(poin + winAmount);
                await message.reply(`Wihh menang! Kamu mendapatkan ${winAmount} point.`);
            } else {
                const loseAmount = 2500;
                await RefPoint.set(poin - loseAmount);
                await message.reply('Yahaha kalah blog, coba lagi sampe miskin');
            }
        } else {
            await message.reply('Pointnya ga cukup boss, mending jangan dah');
        }
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        await message.reply('Error saat memproses permainan slot.');
    }

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
};
