


function fightPvpPokemon(P1, P2, TAG, message) {
  const maxHPP1 = P1[0].MAXHP;
  const maxHPP2 = P2[0].MAXHP;
  const RefGacoan2 = TAG.replace(/@/g, '') + '_c_us';
  const RefGacoanP2 = PokemonRef.child(RefGacoan2).child('pokemon').child('gacoan');
  const RefRep2 = pointRef.child(RefGacoan2).child('reputasi');
  const RefFightDelay = DataData.child('delay').child('fightCooldown');

  RefFightDelay.once('value', async (snapshot) => {
    const cooldown = snapshot.val();
    if (cooldown === "true") {
      if (P1.length > 0 && P2.length > 0) {
        if (P1[0].HP <= 0) {
          message.reply(`Darahmu habis mas\n!use potion dulu gih`);
        } else if (P2[0].HP <= 0) {
          message.reply(`Darah lawanmu habis mas\nsuruh !use potion dulu gih`);
        } else {
          message.reply(`Pertarungan antara ${P1[0].namaPokemon} VS ${P2[0].namaPokemon}`);
          await RefFightDelay.set('false');
          let P1HP = P1[0].HP;
          let P2HP = P2[0].HP;

          const fightLoop = async () => {
            let winner = null;
            const P1attck = (P1[0].ATTACK / P2[0].DEFENSE * 9).toFixed(0);
            const P2attck = (P2[0].ATTACK / P1[0].DEFENSE * 9).toFixed(0);
            const criticalChance = 0.4;
            const isP1Critical = Math.random() <= criticalChance;
            const isP2Critical = Math.random() <= criticalChance;
            const P1AttckFinal = isP1Critical ? P1attck * 1.5 : P1attck;
            const P2AttckFinal = isP2Critical ? P2attck * 1.5 : P2attck;
            P1HP -= P2AttckFinal;
            P2HP -= P1AttckFinal;
            P1HP = Math.max(0, P1HP);
            P2HP = Math.max(0, P2HP);

            if (P1HP > 0 && P2HP > 0) {
              setTimeout(fightLoop, 1000);
            } else {
              const expDraw1 = P1HP <= 0 ? 100 : 500;
              const expDraw2 = P2HP <= 0 ? 100 : 500;

              const levelAfterBattleP1 = calculateEXP(P1[0].EXP + expDraw1);
              const levelAfterBattleP2 = calculateEXP(P2[0].EXP + expDraw2);

              const statIncreaseP1 = increaseStatsByLevel(P1[0].LVL, levelAfterBattleP1);
              const statIncreaseP2 = increaseStatsByLevel(P2[0].LVL, levelAfterBattleP2);

              const pokemonAfterBattleP1 = {
                ...P1[0],
                HP: P1HP,
                MAXHP: maxHPP1 + statIncreaseP1.HP,
                ATTACK: P1[0].ATTACK + statIncreaseP1.ATTACK,
                DEFENSE: P1[0].DEFENSE + statIncreaseP1.DEFENSE,
                SPEED: P1[0].SPEED + statIncreaseP1.SPEED,
                LVL: levelAfterBattleP1,
                EXP: P1[0].EXP + expDraw1,
              };

              const pokemonAfterBattleP2 = {
                ...P2[0],
                HP: P2HP,
                MAXHP: maxHPP2 + statIncreaseP2.HP,
                ATTACK: P2[0].ATTACK + statIncreaseP2.ATTACK,
                DEFENSE: P2[0].DEFENSE + statIncreaseP2.DEFENSE,
                SPEED: P2[0].SPEED + statIncreaseP2.SPEED,
                LVL: levelAfterBattleP2,
                EXP: P2[0].EXP + expDraw2,
              };

              await RefGacoan.set(pokemonAfterBattleP1);
              await RefGacoanP2.set(pokemonAfterBattleP2);

              if (P1HP <= 0 && P2HP <= 0) {
                message.reply(`Pertarungan berakhir dengan hasil seri!`);
              } else if (P1HP <= 0) {
                await RefRep2.set(val => val + 50);
                await RefRep.set(val => val + 5);
                winner = P2[0].namaPokemon;
                message.reply(`Pertarungan berakhir! ${winner} adalah pemenangnya!`);
              } else {
                await RefRep2.set(val => val + 5);
                await RefRep.set(val => val + 50);
                winner = P1[0].namaPokemon;
                message.reply(`Pertarungan berakhir! ${winner} adalah pemenangnya!`);
              }
              setTimeout(async () => {
                await RefFightDelay.set('true');
              }, 60000);
            }
          };
          setTimeout(fightLoop, 2000);
        }
      } else {
        message.reply(`Musuhmu belum ada gacoannya mas`);
      }
    } else {
      message.reply(`Pertarungan sedang berlangsung, Arenanya cuma satu cuk`);
    }
  });
}

module.exports = {
  fightPvpPokemon,
};
