function increaseStatsByLevel(currentLevel, newLevel){
    let statIncrease = {
      HP: 0,
      ATTACK: 0,
      DEFENSE: 0,
      SPEED: 0,
    };
  
    if (newLevel === currentLevel + 1) {
      if (newLevel === 1 || newLevel === 2 || newLevel === 3 || newLevel === 4 || newLevel === 6 || newLevel === 7 || newLevel === 8 || newLevel === 9) {
        statIncrease = {
          HP: 50,
          ATTACK: 50,
          DEFENSE: 50,
          SPEED: 50,
        };
      } else if (newLevel === 5) {
        statIncrease = {
          HP: 100,
          ATTACK: 100,
          DEFENSE: 100,
          SPEED: 100,
        };
      } else if (newLevel === 10) {
        statIncrease = {
          HP: 200,
          ATTACK: 200,
          DEFENSE: 200,
          SPEED: 200,
        };
      } else if (newLevel >= 11 && newLevel <= 50) {
        statIncrease = {
          HP: 9 * newLevel,
          ATTACK: 9 * newLevel,
          DEFENSE: 9 * newLevel,
          SPEED: 9 * newLevel,
        };
      } else if (newLevel <= 55){
        statIncrease = {
          HP: 9 * newLevel,
          ATTACK: 1 ,
          DEFENSE: 1 ,
          SPEED: 1 ,
        };

      }
    }
  
    return statIncrease;
  };

exports.module = {
    increaseStatsByLevel:increaseStatsByLevel(currentLevel, newLevel)
}