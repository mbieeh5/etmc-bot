const { MessageMedia } = require('whatsapp-web.js');
const { db } = require('../config/config');

const linkRef = db.ref('dataData/link');
const pointRef = db.ref('dataPengguna/pengguna');

module.exports = async (message) => {
    try {
        const sA = message.author;
        const sender = message.from;
        const corection = sA !== undefined ? sA : sender;
        const sanitizedSender = corection.replace(/[\.\@\[\]\#\$]/g, "_");
        
        // Ambil link dari database
        const linkPap = linkRef.child('pap');
        const papSnapshot = await linkPap.once('value');
        const link = papSnapshot.val() || [];

        // Ambil poin dari database
        const RefPoint = pointRef.child(sanitizedSender).child('point');
        const pointSnapshot = await RefPoint.once('value');
        const Point = pointSnapshot.val() || 0;

        if (link.length === 0) {
            return 'Tidak ada link tersedia.';
        }

        // Ambil link acak
        const randomIndex = Math.floor(Math.random() * link.length);
        const randomLink = link[randomIndex];
        
        const pengurangan = 50000

        if (Point > 50000) {
            // Mengambil media dari URL
            const BayarPap = Point - pengurangan;
            await RefPoint.set(BayarPap);
            const media = await MessageMedia.fromUrl(randomLink);
            return media;
        } else {
            const kurangBerapa = pengurangan - Point;
            return `Point lu ada ${Point}\nMasih kurang ${kurangBerapa.toLocaleString()} `;
        }
    } catch (error) {
        console.error('Error while fetching pap:', error);
        return 'Error while fetching the !Pap';
    }
};
