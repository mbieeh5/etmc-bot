const {db} = require('../config/config')
const {calculateEXP} = require('./calculateEXP');
const {increaseStatsByLevel} = require('./increaseStatsByLevel');


const DataData = db.ref('dataData');
const PokemonRef = db.ref('dataPengguna/pengguna');
const pointRef = db.ref('dataPengguna/pengguna');


function fightPvP(P1, P2, TAG, message){
  const maxHPP1 = P1.MAXHP;
  const maxHPP2 = P2.MAXHP;
  const RefGacoan2 = TAG.replace(/@/g, '') + '_c_us';
  const RefGacoanP2 = PokemonRef.child(RefGacoan2).child('pokemon').child('gacoan');
  const RefRep2 = pointRef.child(RefGacoan2).child('reputasi');
  const sanitizedSender = (message.author || message.from).replace(/[\.\@\[\]\#\$]/g, "_");
  const RefRep = pointRef.child(sanitizedSender).child('reputasi');
  const RefGacoan = PokemonRef.child(sanitizedSender).child('pokemon').child('gacoan');
  const RefFightDelay = PokemonRef.child(sanitizedSender).child('pokemon').child('delayF');

    DataData.child('delay').child('fightCooldown').once('value', async(snapshot) => {
      const cooldown = snapshot.val();
      if(cooldown === "true"){
        if(P1 && P2){
          if(P1.HP <= 0){
            message.reply(`Darahmu habis mas\n!use potion dulu gih`);
          }else if(P2.HP <= 0){
            message.reply(`Darah lawanmu habis mas\nsuruh !use potion dulu gih`);
          }else{
            message.reply(`Pertarungan antara ${P1.namaPokemon} VS ${P2.namaPokemon}`);
            DataData.child('delay').child('fightCooldown').set('true');
            let P1HP = P1.HP;
            let P2HP = P2.HP;

            RefRep.once('value', async(snapshot) => {
              const valP1 = snapshot.val();
              const RepMenang = valP1 + 50;
              const repKalah = valP1 + 5;

              RefRep2.once('value', async(snapshot) => {
                const valP2 = snapshot.val();
                const RepMenang2 = valP2 + 50;
                const RepKalah2 = valP2 + 5;

                  const fightLoop = async () => {
                    let winner = null;
                    const P1attck = (P1.ATTACK / P2.DEFENSE * 9).toFixed(0);
                    const P2attck = (P2.ATTACK / P1.DEFENSE * 9).toFixed(0);
                    const criticalChance = 0.4;
                    const isP1Critical = Math.random() <= criticalChance;
                    const isP2Critical = Math.random() <= criticalChance;
                    const P1AttckFinal = isP1Critical ? P1attck * P1attck : P1attck;
                    const P2AttckFinal = isP2Critical ? P2attck * P2attck : P2attck;
                    P1HP -= P2AttckFinal;
                    P2HP -= P1AttckFinal;
                    P1HP = Math.max(0, P1HP);
                    P2HP = Math.max(0, P2HP);
                      if(P1HP > 0 && P2HP > 0){
                        setTimeout(fightLoop, 10);
                      }else{
                        if(P1HP <= 0 && P2HP <= 0){
                          const expDraw1 = P1.EXP + 50;
                          const expDraw2 = P2.EXP + 50;
                          const levelAfterBattleP1 = calculateEXP(P1.EXP + 50);
                          const levelAfterBattleP2 = calculateEXP(P2.EXP + 50);
                          const statIncreaseP1 = increaseStatsByLevel(P1.LVL, levelAfterBattleP1);
                          const statIncreaseP2 = increaseStatsByLevel(P2.LVL, levelAfterBattleP2);
                          const pokemonAfterBattleP1 = {
                            HP: P1HP,
                            namaPokemon: P1.namaPokemon,
                            MAXHP: maxHPP1 + statIncreaseP1.HP,
                            ATTACK: P1.ATTACK + statIncreaseP1.ATTACK, 
                            DEFENSE: P1.DEFENSE + statIncreaseP1.DEFENSE,
                            SPEED: P1.SPEED + statIncreaseP1.SPEED, 
                            LVL: levelAfterBattleP1,
                            EXP: expDraw1,
                            TYPE: P1.TYPE
                          };
                          const pokemonAfterBattleP2 = {
                            HP: P2HP,
                            namaPokemon: P2.namaPokemon,
                            MAXHP: maxHPP2 + statIncreaseP2.HP,
                            ATTACK: P2.ATTACK + statIncreaseP2.ATTACK, 
                            DEFENSE: P2.DEFENSE + statIncreaseP2.DEFENSE,
                            SPEED: P2.SPEED + statIncreaseP2.SPEED, 
                            LVL: levelAfterBattleP2,
                            EXP: expDraw2,
                            TYPE: P2.TYPE
                          };
                          RefGacoan.set(pokemonAfterBattleP1);
                          RefGacoanP2.set(pokemonAfterBattleP2);
                         message.reply(`Pertarungan berakhir dengan hasil seri!`);
                        }else if(P1HP <= 0){
                          const expDraw1 = P1.EXP + 100;
                          const expDraw2 = P2.EXP + 500;
                          const levelAfterBattleP1 = calculateEXP(P1.EXP + 100)
                          const levelAfterBattleP2 = calculateEXP(P2.EXP + 500)
                          const statIncreaseP1 = increaseStatsByLevel(P1.LVL,levelAfterBattleP1);
                          const statIncreaseP2 = increaseStatsByLevel(P2.LVL,levelAfterBattleP2);
                          const pokemonAfterBattleP1 = {
                            namaPokemon: P1.namaPokemon,
                            HP: P1HP,
                            MAXHP: maxHPP1 + statIncreaseP1.HP,
                            ATTACK: P1.ATTACK + statIncreaseP1.ATTACK, 
                            DEFENSE: P1.DEFENSE + statIncreaseP1.DEFENSE,
                            SPEED: P1.SPEED + statIncreaseP1.SPEED, 
                            LVL: levelAfterBattleP1,
                            EXP: expDraw1,
                            TYPE: P1.TYPE
                          };
                          const pokemonAfterBattleP2 = {
                            namaPokemon: P2.namaPokemon,
                            HP: P2HP,
                            MAXHP: maxHPP2 + statIncreaseP2.HP,
                            ATTACK: P2.ATTACK + statIncreaseP2.ATTACK, 
                            DEFENSE: P2.DEFENSE + statIncreaseP2.DEFENSE,
                            SPEED: P2.SPEED + statIncreaseP2.SPEED, 
                            TYPE: P2.TYPE,
                            EXP: expDraw2,
                            LVL: levelAfterBattleP2
                          };
                          await RefGacoan.set(pokemonAfterBattleP1);
                          await RefGacoanP2.set(pokemonAfterBattleP2);
                          await RefRep2.set(RepMenang2);
                          await RefRep.set(repKalah);
                          winner = P2.namaPokemon;
                          message.reply(`Pertarungan berakhir! ${winner} adalah pemenangnya!`);
                        }else{
                          const expDraw1 = P1.EXP + 500;
                          const expDraw2 = P2.EXP + 100;
                          const levelAfterBattleP1 = calculateEXP(P1.EXP + 500)
                          const levelAfterBattleP2 = calculateEXP(P2.EXP + 100)
                          const statIncreaseP1 = increaseStatsByLevel(P1.LVL,levelAfterBattleP1);
                          const statIncreaseP2 = increaseStatsByLevel(P2.LVL,levelAfterBattleP2);
                          const pokemonAfterBattleP1 = {
                            namaPokemon: P1.namaPokemon,
                            HP: P1HP,
                            MAXHP: maxHPP1 + statIncreaseP1.HP,
                            ATTACK: P1.ATTACK + statIncreaseP1.ATTACK, 
                            DEFENSE: P1.DEFENSE + statIncreaseP1.DEFENSE,
                            SPEED: P1.SPEED + statIncreaseP1.SPEED, 
                            LVL: levelAfterBattleP1,
                            EXP: expDraw1,
                            TYPE: P1.TYPE
                          };
                          const pokemonAfterBattleP2 = {
                            namaPokemon: P2.namaPokemon,
                            HP: P2HP,
                            MAXHP: maxHPP2 + statIncreaseP2.HP,
                            ATTACK: P2.ATTACK + statIncreaseP2.ATTACK, 
                            DEFENSE: P2.DEFENSE + statIncreaseP2.DEFENSE,
                            SPEED: P2.SPEED + statIncreaseP2.SPEED, 
                            TYPE: P2.TYPE,
                            EXP: expDraw2,
                            LVL: levelAfterBattleP2
                          };
                          await RefGacoan.set(pokemonAfterBattleP1);
                          await RefGacoanP2.set(pokemonAfterBattleP2);
                          await RefRep2.set(RepKalah2);
                          await RefRep.set(RepMenang);
                          winner = P1.namaPokemon;
                          message.reply(`Pertarungan berakhir! ${winner} adalah pemenangnya!`);
                        }
                        await RefFightDelay.set('true');
                      }//else jika fight loop selesai
                    };//fightloop
                  await DataData.child('delay').child('fightCooldown').set('true');
                  await RefFightDelay.set('true');
                setTimeout(fightLoop, 2000);
              })//RefRep2
            });//RefRep
          }//else darah nya pada abis
        }else{
          message.reply(`Musuhmu belum ada gacoannya mas`);
        }//else kalo ga punya gacoan
      }else{
        message.reply(`Pertarungan sedang berlangsung`);
        await DataData.child('delay').child('fightCooldown').set('true');
      }//else if cooldown false
    });//close DataData fight Cooldown
};

module.exports = {
  fightPvP,
}