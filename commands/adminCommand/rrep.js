const {db} = require('../../config/config');

const reputasiRef = db.ref('dataPengguna/pengguna');


module.exports = async (message) => {
    try {
        const reputasiSnapshot = await reputasiRef.once('value');
        const reputasiPengguna = pointSnapshot.val() || {};

        if(pointPengguna) {
            Object.entries(reputasiPengguna).forEach(([randomkey, data]) => {
                const currentEeputasi = data.point || 0;
                pointRef.child(randomkey).child('reputasi').set(0);
            });
            message.reply(`Point Berhasil di reset ke semua users`)
        }else {
            message.reply('Database is Empty');
        };

        return `addPoint to all users ${param1}` 
        
    } catch (error) {
        console.error(`error while Reset Reputasi to all users`,error)
        return 'error while add Reset to all users'
    }
}