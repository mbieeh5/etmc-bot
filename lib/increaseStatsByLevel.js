

function increaseStatsByLevel(currentLevel, newLevel) {
  let statIncrease = {
      HP: 0,
      ATTACK: 0,
      DEFENSE: 0,
      SPEED: 0,
  };

  // Pastikan newLevel adalah peningkatan satu tingkat dari currentLevel
  if (newLevel === currentLevel + 1) {
      // Buat mapping untuk level spesifik
      const levelBonuses = {
          5: 100,
          10: 200,
      };

      if (newLevel <= 9) {
          statIncrease = { HP: 50, ATTACK: 50, DEFENSE: 50, SPEED: 50 };
      } else if (levelBonuses[newLevel]) {
          statIncrease = {
              HP: levelBonuses[newLevel],
              ATTACK: levelBonuses[newLevel],
              DEFENSE: levelBonuses[newLevel],
              SPEED: levelBonuses[newLevel],
          };
      } else if (newLevel >= 11 && newLevel <= 55) {
          const multiplier = newLevel <= 50 ? 9 : 1;
          statIncrease = {
              HP: 9 * newLevel,
              ATTACK: multiplier,
              DEFENSE: multiplier,
              SPEED: multiplier,
          };
      }
  }

  return statIncrease;
}

module.exports = {
  increaseStatsByLevel,
};
