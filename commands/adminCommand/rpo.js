const {db} = require('../../config/config');

const pointRef = db.ref('dataPengguna/pengguna');


module.exports = async (message) => {
    try {
        const pointSnapshot = await pointRef.once('value');
        const pointPengguna = pointSnapshot.val() || {};

        if(pointPengguna) {
            Object.entries(pointPengguna).forEach(([randomkey, data]) => {
                const currentPoint = data.point || 0;
                pointRef.child(randomkey).child('point').set(0);
            });
            message.reply(`Point Berhasil di reset ke semua users`)
        }else {
            message.reply('Database is Empty');
        };

        return `addPoint to all users ${param1}` 
        
    } catch (error) {
        console.error(`error while Reset point to all users`,error)
        return 'error while add Reset to all users'
    }
}