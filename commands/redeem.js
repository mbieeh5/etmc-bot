const { db } = require('../config/config');

const refRedeem = db.ref('dataData/couponCodes');
const refPengguna = db.ref('dataPengguna/pengguna');

module.exports = async (message) => {
    try {
        const noKupon = parseInt((message.body).split(" ")[1]);
        const sanitizedSender = (message.author || message.from).replace(/[\.\@\[\]\#\$]/g, "_");
        const penggunaRef = refPengguna.child(sanitizedSender);
        
        // Ambil semua data kupon
        const redeemRef = await refRedeem.once('value');
        const redeem = redeemRef.val() || {};
        
        // Cari kupon yang cocok dengan noKupon
        const foundCoupon = Object.values(redeem).find(data => data.code === noKupon);

        // Cek apakah kupon ditemukan
        if (foundCoupon === undefined) {
            return 'No Kupon Tidak Tersedia/Tidak Valid 1 ';
        }

        // Cek apakah kupon sudah digunakan
        if (foundCoupon.isRedeem) {
            return `Kupon ${foundCoupon.name} sudah digunakan.`;
        }
        
        const ssPoint = await penggunaRef.child('point').once('value');
        const ssRep = await penggunaRef.child('reputasi').once('value');
        const ssExp = await penggunaRef.child('exp').once('value');
        const refPokemon = await penggunaRef.child('pokemon').child('inventory').once('value');
        const ssRedeem = await penggunaRef.child('redeem').child(foundCoupon.name).child('isRedeem').once('value');
        const isRedeemed = ssRedeem.val() || false;
        const point = ssPoint.val() || 0;
        const reputasi = ssRep.val() || 0;
        const pokemonInven = refPokemon.val() || 0;
        const exp = ssExp.val() || 0;

        // Logika berdasarkan kode kupon
        switch (noKupon) {
            case 35818153:
                if(isRedeemed === true){
                    return `Kamu sudah meredeem ${foundCoupon.name} sebelumnya`
                }
                if(point >= 0){
                    await penggunaRef.child('redeem').child(foundCoupon.name).child('isRedeem').set(true);
                    return `Point Kamu tidak mines mas.`
                }
                await penggunaRef.child('redeem').child(foundCoupon.name).child('isRedeem').set(true);
                await penggunaRef.child('point').set(0)
                message.reply(`${foundCoupon.name} Berhasil digunakan\n${foundCoupon.desc}\nkupon berlaku 1 akun 1x redeem`);
                break;
            case 85764660:
                const redeemed = point + 10000
                if(isRedeemed === true){
                    return `Kamu sudah meredeem ${foundCoupon.name} sebelumnya`
                }
                await penggunaRef.child('redeem').child(foundCoupon.name).child('isRedeem').set(true);
                await penggunaRef.child('point').set(redeemed)
                message.reply(`${foundCoupon.name} Berhasil digunakan\n${foundCoupon.desc}\nkupon berlaku 1 akun 1x redeem`);
                break;
            case 90732715:
                if(isRedeemed === true){
                    return `Kamu sudah meredeem ${foundCoupon.name} sebelumnya`
                }
                if(reputasi >= 0){
                    await penggunaRef.child('redeem').child(foundCoupon.name).child('isRedeem').set(true);
                    return `reputasimu tidak mines mas`
                }
                await penggunaRef.child('redeem').child(foundCoupon.name).child('isRedeem').set(true);
                await penggunaRef.child('reputasi').set(0)
                message.reply(`${foundCoupon.name} Berhasil digunakan\n${foundCoupon.desc}\nkupon berlaku 1 akun 1x redeem`);
                break;
            case 18227424:
                if(isRedeemed === true){
                    return `Kamu sudah meredeem ${foundCoupon.name} sebelumnya`
                }
                const addedPotion = pokemonInven.potion ? pokemonInven.potion + 10 : 10;
                const addedGreatballs = pokemonInven.greatballs ? pokemonInven.greatballs + 10 : 10;
                const addedelixir = pokemonInven.elixir ? pokemonInven.elixir + 5 : 5;
                const addedTT = pokemonInven.trainingTicket ? pokemonInven.trainingTicket + 5 : 5;
                const pokemonStater = {
                    potion: addedPotion,
                    greatballs: addedGreatballs,
                    elixir: addedelixir,
                    trainingTicket: addedTT
                }
                console.log(pokemonStater)
                await penggunaRef.child('redeem').child(foundCoupon.name).child('isRedeem').set(true);
                await penggunaRef.child('pokemon').child('inventory').update(pokemonStater);
                message.reply(`${foundCoupon.name} Berhasil digunakan\n${foundCoupon.desc}\n- pokeball +10\n- greatballs +10\n- elixir +5\n- training ticket +5\nkupon berlaku 1 akun 1x redeem`);
                break;
            case 61279612:
                const expAdded = exp + 500
                if(isRedeemed === true){
                    return `Kamu sudah meredeem ${foundCoupon.name} sebelumnya`
                }    
                await penggunaRef.child('redeem').child(foundCoupon.name).child('isRedeem').set(true);
                await penggunaRef.child('exp').set(expAdded);
                message.reply(`${foundCoupon.name} Berhasil digunakan\n${foundCoupon.desc}\nkupon berlaku 1 akun 1x redeem`);
                break;
            default:
                return 'No Kupon Tidak Tersedia/Tidak Valid 2 ';
        }

    } catch (error) {
        console.error('Error saat proses redeem kupon:', error);
        return 'Error saat proses redeem kupon';
    }
};
