const {db} = require('../../config/config');

const pointRef = db.ref('dataPengguna/pengguna');


module.exports = async (message) => {
    try {
        const param1 = parseInt((message.body).split(' ')[1]);
        
        if(isNaN(param1)){
            return `input the specific numbers`
        }

        const pointSnapshot = await pointRef.once('value');
        const pointPengguna = pointSnapshot.val() || {};

        if(pointPengguna) {
            Object.entries(pointPengguna).forEach(([randomkey, data]) => {
                const currentPoint = data.point || 0;
                const pointAdded = currentPoint + param1;
                pointRef.child(randomkey).child('point').set(pointAdded);
            });
            message.reply(`Point Berhasil di tambah ke semua users sebesar\n${param1}`)
        }else {
            message.reply('Database is Empty');
        };

        return `addPoint to all users ${param1}` 
        
    } catch (error) {
        console.error(`error while add point to all users`,error)
        return 'error while add point to all users'
    }
}