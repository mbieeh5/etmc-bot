
module.exports = async (message) => {
    try{
        const NumberPhone = await (message.body).split(' ')[1];
        if(!isNaN(NumberPhone) && NumberPhone.length > 10){
            console.log(NumberPhone);
            return `Redeem Pulsa untuk : ${NumberPhone}\n _Sedang Dalam Proses_`;
        }else{
            return 'nomor tujuan harus Benar\n!redeem 081234567891';
            
        }
    }catch (error) {
        console.error('error while redeem', error);
        return 'error while redeem';
    }

}