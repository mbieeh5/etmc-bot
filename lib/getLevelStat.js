const getRank = (level) => {
  if(level <= 5) return 'Rookie🧑';
  if(level <= 10) return 'Apprentice👨‍🎓';
  if(level <= 15) return 'Warrior⚔️';
  if(level <= 20) return 'Knight🛡️';
  if(level <= 25) return 'Paladin🏅';
  if(level <= 30) return 'Champion🏆';
  if(level <= 35) return 'Master👑';
  if(level <= 40) return 'Grandmaster🌟';
  if(level <= 45) return 'Legend💫';
  if(level <= 50) return 'Mythic🚀';
  if(level <= 55) return 'Hero🎖️';
  if(level <= 60) return 'Guardian🛡️';
  if(level <= 65) return 'Savior👼';
  if(level <= 70) return 'Immortal🔥';
  if(level <= 75) return 'Divine✨';
  if(level <= 80) return 'Titan⚡';
  if(level <= 85) return 'Godlike💥';
  if(level <= 90) return 'Supreme☄️';
  if(level <= 95) return 'Ascendant💎';
  if(level <= 100) return 'Celestial🚀';
  return 'Unknown';
};

function getLevel(exp) {
  const maxLevel = 100;
  const expForLevel = level => 100 * level; // Formula EXP per level

  let level = 0;
  let totalExpNeeded = 0;
  let rank = '';

  for (let i = 1; i <= maxLevel; i++) {
    totalExpNeeded += expForLevel(i);
    if (exp < totalExpNeeded) {
      level = i - 1;
      rank = getRank(level);
      break;
    }
    level = i; 
    rank = getRank(level);
  }

  return { level, rank };
}

module.exports = {
  getLevel,
};
