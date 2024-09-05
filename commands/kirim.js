const { generateSN } = require('../lib/SnGenerate');
const { db } = require('../config/config');

const pointRef = db.ref('dataPengguna/pengguna');

module.exports = async (message) => {
    try {
        const sA = message.author;
        const sender = message.from;
        const corection = sA != undefined ? sA : sender;
        const NoTujuan = (message.body).split(" ")[1];
        const denom = parseInt((message.body).split(" ")[2], 10);

        if (isNaN(denom)) {
            return 'Masukan Nominal !kirim @tag Orangnya 10000';
        } else if (denom <= 1) {
            return 'Nominal Tidak boleh kurang dari 1';
        } else {
            const RegexNoTujuan = NoTujuan.replace(/@/g, "");
            const NoFinal = RegexNoTujuan + "_c_us";
            const sanitizedSender = corection.replace(/[\.\@\[\]\#\$]/g, "_");

            const RefPointPengirim = pointRef.child(sanitizedSender).child('point');
            const RefPointPenerima = pointRef.child(NoFinal).child('point');

            const PointRefPengirim = await RefPointPengirim.once('value');
            const PointRefPenerima = await RefPointPenerima.once('value');

            const PointPengirim = PointRefPengirim.val() || 0;
            const PointPenerima = PointRefPenerima.val() || 0;

            if (PointPengirim < denom) {
                return `Point Mu Sisa ${PointPengirim}, Gagal Mengirim ${denom}`;
            } else {
                const PointKurang = PointPengirim - denom;
                const PointTambah = PointPenerima + denom;

                await RefPointPengirim.set(PointKurang);
                await RefPointPenerima.set(PointTambah);

                return `Pengiriman ${denom} Point Berhasil\nSN:${generateSN(16).toUpperCase()}`;
            }
        }
    } catch (error) {
        console.error('Error saat mengirim point:', error);
        return 'gagal mengirim point!';
    }
};
