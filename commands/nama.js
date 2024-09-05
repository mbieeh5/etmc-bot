const {db} = require("../config/config");

const pointRef = db.ref('dataPengguna/pengguna');

module.exports = async (message) => {
    try {
        const namaNya = message.body.split('!nama ')[1];
        if(namaNya){
            const sanitizedSender = (message.author || message.from).replace(/[\.\@\[\]\#\$]/g, "_");
            const RefNama = pointRef.child(sanitizedSender).child('nama');
            const RefPoint = pointRef.child(sanitizedSender).child('point');
            const ssPoint = RefPoint.once('value');
            const ssNama = RefNama.once('value');
            const Point = (await ssPoint).val() || 0;
            const Nama = (await ssNama).val() || sanitizedSender;
                if(Nama === sanitizedSender){
                    await RefNama.set(namaNya);
                    return `Nama *Berhasil* di set\n  *${namaNya}*\nPenggantian nama selanjutnya dikenakan biaya 2000Point >_<`
                }else if(Nama === namaNya){
                    return `Namamu *${Nama}*\nNama Tidak Boleh Sama Dengan Sebelumnya`
                }else{
                    if(Point > 2000){
                        const biaya = 2000
                        const bayar = Point - biaya;
                        await RefPoint.set(bayar);
                        await RefNama.set(namaNya);
                        return `Nama *Berhasil* diubah\n${namaNya}\nPoint: ${Point - 2000}`
                    }
                }
        }else{
            return 'Silahkan masukan nama dengan benar'
        }
        
    } catch (error) {
        return 'Error While Set Name'
    }
}