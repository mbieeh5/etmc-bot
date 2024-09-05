const {db} = require('../../config/config');

const absenRef = db.ref('dataData/dataDelay/AbsenX');
const toxicRef = db.ref('dataData/dataDelay/ToxicX');


module.exports = async (message) => {
    try {
        const param1 = (message.body).split(' ')[1];
        const param2 = parseInt((message.body).split(' ')[2]);

        const refAbsen = absenRef.child('dikali');
        const refToxic = toxicRef.child('dikali')
  
        if(isNaN(param2)){
            return `input the specific numbers`
        }
        if(param1 === 'absen'){
            await refAbsen.set(param2);
            await message.reply(`Absen berhasil di x${param2}.00`)
        }
        if(param1 === 'toxic'){
            await refToxic.set(param2);
            message.reply(`toxic berhasil di x${param2}.00`)
        }
    } catch (error) {
        console.error(`error while add point to all users`,error)
        return 'error while add point to all users'
    }
}