
const getRank = (level) => {
    if(level <= 10) return 'Rookie🧑';
    if(level <= 20) return 'Apprentice👨‍🎓';
    if(level <= 30) return 'Warrior⚔️';
    if(level <= 40) return 'Knight🛡️';
    if(level <= 50) return 'Paladin🏅';
    if(level <= 60) return 'Champion🏆';
    if(level <= 70) return 'Master👑';
    if(level <= 80) return 'Grandmaster🌟';
    if(level <= 90) return 'Legend💫';
    if(level <= 100) return 'Mythic🚀';
    return 'Unknown';
  };

function getLevel(exp){
    const maxLevel = 100;
    const expForLevel = level => 100 * level;

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
};

module.exports = {
    getLevel,
}