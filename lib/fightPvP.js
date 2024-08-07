function fightPvpPokemon(P1, P2, TAG){
    const maxHPP1 = P1[0].MAXHP;
    const maxHPP2 = P2[0].MAXHP;
    const RefGacoan2 = TAG.replace(/@/g, '') + '_c_us';
    const RefGacoanP2 = PokemonRef.child(RefGacoan2).child('pokemon').child('gacoan');
    const RefRep2 = pointRef.child(RefGacoan2).child('reputasi');

      DataData.child('delay').child('fightCooldown').once('value', async(snapshot) => {
        const cooldown = snapshot.val();
        if(cooldown === "true"){
          if(P1.length > 0 && P2.length > 0){
            if(P1[0].HP <= 0){
              client.sendMessage(message.from,`Darahmu habis mas\n!use potion dulu gih`);
            }else if(P2[0].HP <= 0){
              client.sendMessage(message.from,`Darah lawanmu habis mas\nsuruh !use potion dulu gih`);
            }else{
              client.sendMessage(message.from,`Pertarungan antara ${P1[0].namaPokemon} VS ${P2[0].namaPokemon}`);
              DataData.child('delay').child('fightCooldown').set('false');
              let P1HP = P1[0].HP;
              let P2HP = P2[0].HP;

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
                      const P1attck = (P1[0].ATTACK / P2[0].DEFENSE * 9).toFixed(0);
                      const P2attck = (P2[0].ATTACK / P1[0].DEFENSE * 9).toFixed(0);
                      const criticalChance = 0.4;
                      const isP1Critical = Math.random() <= criticalChance;
                      const isP2Critical = Math.random() <= criticalChance;
                      const P1AttckFinal = isP1Critical ? P1attck * P1attck : P1attck;
                      const P2AttckFinal = isP2Critical ? P2attck * P2attck : P2attck;
                      P1HP -= P2AttckFinal;
                      P2HP -= P1AttckFinal;
                      P1HP = Math.max(0, P1HP);
                      P2HP = Math.max(0, P2HP);
                      console.log(`P1 HP: ${P1HP}`)
                      console.log(`P1 ATTACK: ${P1attck}`)
                      console.log(`P1 ATTACK if Crit: ${P1AttckFinal}`)
                      console.log(`P2 HP: ${P2HP}`)
                      console.log(`P2 ATTACK: ${P2attck}`)
                      console.log(`P2 ATTACK if Crit: ${P2AttckFinal}`)
                        if(P1HP > 0 && P2HP > 0){
                          setTimeout(fightLoop, 10);
                        }else{
                          if(P1HP <= 0 && P2HP <= 0){
                            const expDraw1 = P1[0].EXP + 50;
                            const expDraw2 = P2[0].EXP + 50;
                            const levelAfterBattleP1 = calculateEXP(P1[0].EXP + 50);
                            const levelAfterBattleP2 = calculateEXP(P2[0].EXP + 50);
                            const statIncreaseP1 = increaseStatsByLevel(P1[0].LVL, levelAfterBattleP1);
                            const statIncreaseP2 = increaseStatsByLevel(P2[0].LVL, levelAfterBattleP2);
                            const pokemonAfterBattleP1 = {
                              HP: P1HP,
                              MAXHP: maxHPP1 + statIncreaseP1.HP,
                              ATTACK: P1[0].ATTACK + statIncreaseP1.ATTACK, 
                              DEFENSE: P1[0].DEFENSE + statIncreaseP1.DEFENSE,
                              SPEED: P1[0].SPEED + statIncreaseP1.SPEED, 
                              LVL: levelAfterBattleP1,
                              EXP: expDraw1,
                              TYPE: P1[0].TYPE
                            };
                            const pokemonAfterBattleP2 = {
                              HP: P2HP,
                              MAXHP: maxHPP2 + statIncreaseP2.HP,
                              ATTACK: P2[0].ATTACK + statIncreaseP2.ATTACK, 
                              DEFENSE: P2[0].DEFENSE + statIncreaseP2.DEFENSE,
                              SPEED: P2[0].SPEED + statIncreaseP2.SPEED, 
                              LVL: levelAfterBattleP2,
                              EXP: expDraw2,
                              TYPE: P2[0].TYPE
                            };
                            RefGacoan.set(pokemonAfterBattleP1);
                            RefGacoanP2.set(pokemonAfterBattleP2);
                            client.sendMessage(message.from,`Pertarungan berakhir dengan hasil seri!`);
                          }else if(P1HP <= 0){
                            const expDraw1 = P1[0].EXP + 100;
                            const expDraw2 = P2[0].EXP + 500;
                            const levelAfterBattleP1 = calculateEXP(P1[0].EXP + 100)
                            const levelAfterBattleP2 = calculateEXP(P2[0].EXP + 500)
                            const statIncreaseP1 = increaseStatsByLevel(P1[0].LVL,levelAfterBattleP1);
                            const statIncreaseP2 = increaseStatsByLevel(P2[0].LVL,levelAfterBattleP2);
                            const pokemonAfterBattleP1 = {
                              namaPokemon: P1[0].namaPokemon,
                              HP: P1HP,
                              MAXHP: maxHPP1 + statIncreaseP1.HP,
                              ATTACK: P1[0].ATTACK + statIncreaseP1.ATTACK, 
                              DEFENSE: P1[0].DEFENSE + statIncreaseP1.DEFENSE,
                              SPEED: P1[0].SPEED + statIncreaseP1.SPEED, 
                              LVL: levelAfterBattleP1,
                              EXP: expDraw1,
                              TYPE: P1[0].TYPE
                            };
                            const pokemonAfterBattleP2 = {
                              namaPokemon: P2[0].namaPokemon,
                              HP: P2HP,
                              MAXHP: maxHPP2 + statIncreaseP2.HP,
                              ATTACK: P2[0].ATTACK + statIncreaseP2.ATTACK, 
                              DEFENSE: P2[0].DEFENSE + statIncreaseP2.DEFENSE,
                              SPEED: P2[0].SPEED + statIncreaseP2.SPEED, 
                              TYPE: P2[0].TYPE,
                              EXP: expDraw2,
                              LVL: levelAfterBattleP2
                            };
                            await RefGacoan.set(pokemonAfterBattleP1);
                            await RefGacoanP2.set(pokemonAfterBattleP2);
                            await RefRep2.set(RepMenang2);
                            await RefRep.set(repKalah);
                            winner = P2[0].namaPokemon;
                            client.sendMessage(message.from,`Pertarungan berakhir! ${winner} adalah pemenangnya!`);
                          }else{
                            const expDraw1 = P1[0].EXP + 500;
                            const expDraw2 = P2[0].EXP + 100;
                            const levelAfterBattleP1 = calculateEXP(P1[0].EXP + 500)
                            const levelAfterBattleP2 = calculateEXP(P2[0].EXP + 100)
                            const statIncreaseP1 = increaseStatsByLevel(P1[0].LVL,levelAfterBattleP1);
                            const statIncreaseP2 = increaseStatsByLevel(P2[0].LVL,levelAfterBattleP2);
                            const pokemonAfterBattleP1 = {
                              namaPokemon: P1[0].namaPokemon,
                              HP: P1HP,
                              MAXHP: maxHPP1 + statIncreaseP1.HP,
                              ATTACK: P1[0].ATTACK + statIncreaseP1.ATTACK, 
                              DEFENSE: P1[0].DEFENSE + statIncreaseP1.DEFENSE,
                              SPEED: P1[0].SPEED + statIncreaseP1.SPEED, 
                              LVL: levelAfterBattleP1,
                              EXP: expDraw1,
                              TYPE: P1[0].TYPE
                            };
                            const pokemonAfterBattleP2 = {
                              namaPokemon: P2[0].namaPokemon,
                              HP: P2HP,
                              MAXHP: maxHPP2 + statIncreaseP2.HP,
                              ATTACK: P2[0].ATTACK + statIncreaseP2.ATTACK, 
                              DEFENSE: P2[0].DEFENSE + statIncreaseP2.DEFENSE,
                              SPEED: P2[0].SPEED + statIncreaseP2.SPEED, 
                              TYPE: P2[0].TYPE,
                              EXP: expDraw2,
                              LVL: levelAfterBattleP2
                            };
                            await RefGacoan.set(pokemonAfterBattleP1);
                            await RefGacoanP2.set(pokemonAfterBattleP2);
                            await RefRep2.set(RepKalah2);
                            await RefRep.set(RepMenang);
                            winner = P1[0].namaPokemon;
                            client.sendMessage(message.from,`Pertarungan berakhir! ${winner} adalah pemenangnya!`);
                          }
                          await RefFightDelay.set('false');
                        }//else jika fight loop selesai
                      };//fightloop
                  setTimeout(async () => {
                    await DataData.child('delay').child('fightCooldown').set('true');
                  }, 60000);
                  setTimeout(async () => {
                    await RefFightDelay.set('true');
                  }, 300000);
                  setTimeout(fightLoop, 2000);
                })//RefRep2
              });//RefRep
            }//else darah nya pada abis
          }else{
            client.sendMessage(message.from,`Musuhmu belum ada gacoannya mas`);
          }//else kalo ga punya gacoan
        }else{
          client.sendMessage(message.from, `Pertarungan sedang berlangsung, Arenanya cuma satu cuk`);
          setTimeout(async () => {
            await DataData.child('delay').child('fightCooldown').set('true');
          }, 60000)
        }//else if cooldown false
      });//close DataData fight Cooldown
  };

exports.module = {
    fightPvpPokemon: fightPvpPokemon(P1, P2, TAG)
}