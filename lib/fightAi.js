const { increaseStatsByLevel } = require('./increaseStatsByLevel');
const { calculateEXP } = require('./calculateEXP');
const {db} = require('../config/config');

const DataData = db.ref('dataData');
const PokemonRef = db.ref('dataPengguna/pengguna');

async function fightAiPokemon(P1, P2, message) {
    const maxHPP1 = P1[0].MAXHP;
    const cooldownSnapshot = await DataData.child('delay').child('fightCooldown').once('value');
    const cooldown = cooldownSnapshot.val();

    if (cooldown !== "true") {
        message.reply(`Pertarungan sedang cooldown, Arenanya cuma satu cuk`);
        setTimeout(() => {
            DataData.child('delay').child('fightCooldown').set('true');
        }, 5000);
        return;
    }

    if (P1.length === 0 || P2.length === 0) {
        message.reply(`Musuhmu belum ada gacoannya mas`);
        return;
    }

    if (P1[0].HP <= 0) {
        message.reply(`Darahmu habis mas\n!use potion dulu gih`);
        return;
    }

    message.reply(`Pertarungan antara ${P1[0].namaPokemon} VS ${P2[0].namaPokemon}`);
    await DataData.child('delay').child('fightCooldown').set('true');

    let P1HP = P1[0].HP;
    let P2HP = P2[0].HP;

    const fightLoop = async () => {
        const P1attck = (P1[0].ATTACK / P2[0].DEFENSE * 50).toFixed(0);
        const P2attck = (P2[0].ATTACK / P1[0].DEFENSE * 50).toFixed(0);
        const P1CriticalChance = P1HP <= (P1[0].MAXHP * 0.1) ? 0.3 : 0.1;
        const P2CriticalChance = P2HP <= (P2[0].MAXHP * 0.1) ? 0.3 : 0.1;

        const isP1Critical = Math.random() <= P1CriticalChance;
        const isP2Critical = Math.random() <= P2CriticalChance;

        const P1AttckFinal = isP1Critical ? P1attck * 2 : P1attck;
        const P2AttckFinal = isP2Critical ? P2attck * 2 : P2attck;

        P1HP = Math.max(0, P1HP - P2AttckFinal);
        P2HP = Math.max(0, P2HP - P1AttckFinal);
        console.log({P1HP, P2HP, P1AttckFinal, P2AttckFinal})
        if (P1HP > 0 && P2HP > 0) {
            setTimeout(fightLoop, 10);
        } else {
            const battleResult = await handleBattleResult(P1, P1HP, P2, P2HP, maxHPP1, message);
            message.reply(battleResult);

            setTimeout(() => {
                DataData.child('delay').child('fightCooldown').set('true');
            }, 60000);
        }
    };

    setTimeout(fightLoop, 10);
}

async function handleBattleResult(P1, P1HP,P2,  P2HP, maxHPP1, Message) {
    const sA = Message.author;
    const sender = Message.from;
    const corection = sA != undefined ? sA : sender;
    const sanitizedSender = corection.replace(/[\.\@\[\]\#\$]/g, "_");
    const RefGacoan = PokemonRef.child(sanitizedSender).child('pokemon').child('gacoan');

    let winner, expGain;

    if (P1HP > 0) {
        winner = P1[0].namaPokemon;
        expGain = calculateExperienceGain(P1[0].LVL);
    } else if (P2HP > 0) {
        winner = P2[0].namaPokemon;
        expGain = calculateExperienceGain(P1[0].LVL, true);
    } else {
        winner = 'draw';
        expGain = 1;
    }

    const levelAfterBattleP1 = calculateEXP(P1[0].EXP + expGain);
    const statIncreaseP1 = increaseStatsByLevel(P1[0].LVL, levelAfterBattleP1);

    const pokemonAfterBattleP1 = {
        ...P1[0],
        HP: P1HP,
        MAXHP: maxHPP1 + statIncreaseP1.HP,
        ATTACK: P1[0].ATTACK + statIncreaseP1.ATTACK,
        DEFENSE: P1[0].DEFENSE + statIncreaseP1.DEFENSE,
        SPEED: P1[0].SPEED + statIncreaseP1.SPEED,
        LVL: levelAfterBattleP1,
        EXP: P1[0].EXP + expGain,
    };

    await RefGacoan.set(pokemonAfterBattleP1);

    if (winner !== 'draw') {
        const levelUpInfo = levelAfterBattleP1 > P1[0].LVL 
            ? `Level Up!\nLevel: ${levelAfterBattleP1}\nHP: +${statIncreaseP1.HP}\nAttack: +${statIncreaseP1.ATTACK}\nDefense: +${statIncreaseP1.DEFENSE}\nSpeed: +${statIncreaseP1.SPEED}` 
            : '';
        return `Pertarungan berakhir! ${winner} adalah pemenangnya!\n${levelUpInfo}`;
    } else {
        return `Pertarungan berakhir dengan hasil seri!`;
    }
}

function calculateExperienceGain(level, isLoss = false) {
    let minExp = 1;
    let maxExp = 10;

    if (level > 15) {
        if (level <= 25) {
            minExp = 10;
            maxExp = 50;
        } else if (level <= 30) {
            minExp = 50;
            maxExp = 100;
        } else if (level <= 36) {
            minExp = 100;
            maxExp = 250;
        } else if (level <= 40) {
            minExp = 250;
            maxExp = 500;
        } else if (level <= 45) {
            minExp = 500;
            maxExp = 1000;
        } else if (level <= 50) {
            minExp = 500;
            maxExp = 2000;
        } else {
            minExp = 1000;
            maxExp = 1575;
        }
    }

    return isLoss ? Math.floor(Math.random() * (maxExp - minExp + 1)) + minExp : maxExp;
}

module.exports = {
    fightAiPokemon
};
