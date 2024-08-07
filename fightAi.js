function fightAiPokemon(P1, P2){
    const maxHPP1 = P1[0].MAXHP;
      DataData.child('delay').child('fightCooldown').once('value', async(snapshot) => {
        const cooldown = snapshot.val();
        if(cooldown === "true"){
          if(P1.length > 0 && P2.length > 0){
            if(P1[0].HP <= 0){
              client.sendMessage(message.from,`Darahmu habis mas\n!use potion dulu gih`);
            }else{
              client.sendMessage(message.from,`Pertarungan antara ${P1[0].namaPokemon} VS ${P2[0].namaPokemon}`);
              DataData.child('delay').child('fightCooldown').set('false');
              let P1HP = P1[0].HP;
              let P2HP = P2[0].HP;

                    const fightLoop = async () => {
                      let winner = null;
                      const P1attck = (P1[0].ATTACK / P2[0].DEFENSE * 82).toFixed(0);
                      const P2attck = (P2[0].ATTACK / P1[0].DEFENSE * 20).toFixed(0);
                      const P1CriticalChance = P1HP <= (P1[0].MAX_HP * 0.1) ? 0.6 : 0.2;
                      const P2CriticalChance = P2HP <= (P2[0].MAX_HP * 0.1) ? 0.6 : 0.2;
                      const isP1Critical = Math.random() <= P1CriticalChance;
                      const isP2Critical = Math.random() <= P2CriticalChance;
                      const P1AttckFinal = isP1Critical ? P1attck * 10 : P1attck;
                      const P2AttckFinal = isP2Critical ? P2attck * 10 : P2attck;
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
                          //client.sendMessage(message.from,`${P1[0].namaPokemon} Menyerang dengan ${P1AttckFinal} dan ${P2[0].namaPokemon} Menyerang dengan ${P2AttckFinal}`);
                        }else{
                          if(P1HP <= 0 && P2HP <= 0){
                            const expDraw1 = P1[0].EXP + 1;
                            const levelAfterBattleP1 = calculateEXP(P1[0].EXP + 1);
                            const statIncreaseP1 = increaseStatsByLevel(P1[0].LVL, levelAfterBattleP1);
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
                            RefGacoan.set(pokemonAfterBattleP1);
                            client.sendMessage(message.from,`Pertarungan berakhir dengan hasil seri!`);
                          }else if(P1HP <= 0){
                            const minExp = 1;
                            const maxExp = 2;
                            const randomExp = Math.floor(Math.random() * (maxExp - minExp + 1)) + minExp;
                            console.log(`EXP KALAH : ${randomExp}`)
                            const expDraw1 = P1[0].EXP + randomExp;
                            const levelAfterBattleP1 = calculateEXP(P1[0].EXP + randomExp)
                            const statIncreaseP1 = increaseStatsByLevel(P1[0].LVL,levelAfterBattleP1);
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
                            await RefGacoan.set(pokemonAfterBattleP1);
                            winner = P2[0].namaPokemon;
                            if (levelAfterBattleP1 > P1[0].LVL) {
                            const levelUpInfo = `LevelUp: ${levelAfterBattleP1}\nHP: +${statIncreaseP1.HP}\nAttack: +${statIncreaseP1.ATTACK}\nDefense: +${statIncreaseP1.DEFENSE}\nSPeed: ${statIncreaseP1.SPEED}`;
                            client.sendMessage(message.from, `Pertarungan berakhir! ${winner} adalah pemenangnya!\n${levelUpInfo}`);
                          } else {
                            client.sendMessage(message.from, `Pertarungan berakhir! ${winner} adalah pemenangnya!`);
                          }
                          }else{
                            let minExp = 1;
                            let maxExp = 10;
                            if(P1[0].LVL <= 15){
                              minExp = 1;
                              maxExp = 10;
                            }else if(P1[0].LVL >= 16 && P1[0].LVL <= 25){
                              minExp = 10;
                              maxExp = 50;
                            }else if(P1[0].LVL >= 26 && P1[0].LVL <= 30){
                              minExp = 50;
                              maxExp = 100;
                            }else if(P1[0].LVL >= 31 && P1[0].LVL <= 36){
                              minExp = 100;
                              maxExp = 250;
                            }else if(P1[0].LVL >= 37 && P1[0].LVL <= 40){
                              minExp = 250;
                              maxExp = 500;
                            }else if(P1[0].LVL >= 41 && P1[0].LVL <= 45){
                              minExp = 500;
                              maxExp = 1000;
                            }else if(P1[0].LVL >= 46 && P1[0].LVL <= 50){
                              minExp = 500;
                              maxExp = 2000;
                            }else{
                              minExp = 1000;
                              maxExp = 1575;
                            }
                            setTimeout(async () => {

                              const randomExp = Math.floor(Math.random() * (maxExp - minExp + 1)) + minExp;
                              const expDraw1 = P1[0].EXP + randomExp;
                              console.log(`EXP: ${randomExp}`);
                              const levelAfterBattleP1 = calculateEXP(P1[0].EXP + randomExp)
                            const statIncreaseP1 = increaseStatsByLevel(P1[0].LVL,levelAfterBattleP1);
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
                            await RefGacoan.set(pokemonAfterBattleP1);
                            winner = P1[0].namaPokemon;
                            if (levelAfterBattleP1 > P1[0].LVL) {
                              const levelUpInfo = `LevelUp: ${levelAfterBattleP1}\nHP: +${statIncreaseP1.HP}\nAttack: +${statIncreaseP1.ATTACK}\nDefense: +${statIncreaseP1.DEFENSE}\nSPeed: ${statIncreaseP1.SPEED}`;
                              client.sendMessage(message.from, `Pertarungan berakhir! ${winner} adalah pemenangnya!\n${levelUpInfo}`);
                            } else {
                              client.sendMessage(message.from, `Pertarungan berakhir! ${winner} adalah pemenangnya!`);
                            }
                          }, 2000)
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
                  setTimeout(fightLoop, 10);
            }//else darah nya pada abis
          }else{
            client.sendMessage(message.from,`Musuhmu belum ada gacoannya mas`);
          }//else kalo ga punya gacoan
        }else{
          client.sendMessage(message.from, `Pertarungan sedang cooldown, Arenanya cuma satu cuk`);
          setTimeout(async () => {
            await DataData.child('delay').child('fightCooldown').set('true');
          }, 5000)
        }//else if cooldown false
      });//close DataData fight Cooldown
  };
exports.module = {
    fightAiPokemon:fightAiPokemon(P1, P2)
}