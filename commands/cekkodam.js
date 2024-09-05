const {db} = require('../config/config');



const CekKodam = db.ref('dataData/CekKodam');
module.exports = async (message) => {
    try {
        const cekKodam = await CekKodam.once('value');
        const kodam = cekKodam.val() || [];
        if(kodam.length > 0){
            const randomIndex = Math.floor(Math.random() * kodam.length);
            const selectedKodam = kodam[randomIndex];
            return `Kodam mu : ${selectedKodam}`;
        }else{
            return 'Gagal Terhubung ke dunia Ghoib, silahkan ritual dulu';
        }
    } catch (error) {
        return 'Gagal Terhubung ke dunia Ghoib, silahkan ritual dulu';
    }
}