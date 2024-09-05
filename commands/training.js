const {db} = require('../config/config');

const PokemonRef = db.ref('dataPengguna/pengguna');


module.exports = async (message) => {
    try {
        const sanitizedSender = (message.author || message.from).replace(/[\.\@\[\]\#\$]/g, "_");
        const RefInven = PokemonRef.child(sanitizedSender).child('pokemon').child('inventory');
        const RefGacoan = PokemonRef.child(sanitizedSender).child('pokemon').child('gacoan');

        const ticketSS = await RefInven.child('trainingTicket').once('value');
        const ticket = ticketSS.val() || {};
        const gacoanSS = await RefGacoan.once('value');
        const gacoan = gacoanSS.val() || {}
        const usedTicket = ticket - 1;
        console.log(gacoan)
        if(!gacoan){
            return 'Kamu tidak memiliki gacoan, silahkan !setgacoan dulu'
        }

        if(ticket < 0){
            return 'Ticketmu sudah habis, silahkan beli di !shop, atau cari di !pokeball'
        }
        const namaPokemon = gacoan.namaPokemon;
        let attack = gacoan.ATTACK;
        let defense = gacoan.DEFENSE;
        let hp = gacoan.HP;
        let maxHp = gacoan.MAXHP || 0;
        const speed = gacoan.SPEED;
        const type = gacoan.TYPE;
        const exp = gacoan.EXP;
        const level = gacoan.LVL;
        
        const getRandomStatIncrease = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
          };

        const increaseAttack = getRandomStatIncrease(10, 50);
        const increaseDefense = getRandomStatIncrease(10, 50);
        const increaseHP = getRandomStatIncrease(10, 50);

        attack += increaseAttack;
        defense += increaseDefense;
        maxHp += increaseHP;

        await RefGacoan.child('ATTACK').set(attack);
        await RefGacoan.child('DEFENSE').set(defense);
        await RefGacoan.child('MAXHP').set(maxHp);
        await RefInven.child('trainingTicket').set(usedTicket);

        message.reply(`Stat ${namaPokemon} berhasil di training\nAttack +${increaseAttack}, Defense +${increaseDefense}, MAX HP +${increaseHP}`);

    } catch (error) {
        console.error('error while training Pokemon', error)
        return 'pastikan kamu memiliki training Ticket dan memasang gacoan.'
    }
}