const {db} = require('../config/config');



const Makanan = db.ref('dataData/DaftarMakanan');
module.exports = async (message) => {
    try {
        const daftarMakanan = await Makanan.once('value');
        const Makanans = daftarMakanan.val() || [];
        if(Makanans.length > 0){
            const randomIndex = Math.floor(Math.random() * Makanans.length);
            const selectedMakanans = Makanans[randomIndex];
            return `Makanan Hari Ini : ${selectedMakanans}`;
        }else{
            return 'Gagal Terhubung ke dunia Kuliner, silahkan Cari Manual';
        }
    } catch (error) {
        return 'Gagal Terhubung ke dunia Kuliner, silahkan Cari Manual';
    }
}