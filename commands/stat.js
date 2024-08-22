const db = require('../config/config').db;
const pointRef = db.ref('dataPengguna/pengguna');

module.exports = async (message) => {
  try {
    const sA = message.author;
    const sender = message.from;
    const corection = sA !== undefined ? sA : sender;
    const sanitizedSender = corection.replace(/[\.\@\[\]\#\$]/g, "_");
    const RefNama = pointRef.child(sanitizedSender).child('nama');
    const RefPoint = pointRef.child(sanitizedSender).child('point');
    const RefExp = pointRef.child(sanitizedSender).child('exp');
    const RefRep = pointRef.child(sanitizedSender).child('reputasi');

    const getTier = (reputasi) => {
      if(reputasi <= 0) return "💀BOCAH TOXIC💀";
      if(reputasi <= 10) return "--_Bronze_--";
      if(reputasi <= 20) return "--_Silver_--";
      if(reputasi <= 30) return "--_Gold_--";
      if(reputasi <= 50) return "--_Platinum_--";
      if(reputasi <= 100) return "--💎_Diamond_💎--";
      if(reputasi <= 200) return "--♚_CROWN_♚--";
      if(reputasi <= 500) return "--⭐_ACE_⭐--";
      if(reputasi === 666) return "S0N-0F-S4TAN";
      if(reputasi <= 1000) return "--🔥_CONQUEROR_🔥--";
      if(reputasi >= 2000) return "--👑GOD👑--";
      return "Anak💀Haram";
    };

    const getLevel = (exp) => {
      const maxLevel = 100;
      const expForLevel = level => 100 * level;

      let level = 0;
      let totalExpNeeded = 0;
      let rank = '';

      for (let i = 1; i <= maxLevel; i++) {
        totalExpNeeded += expForLevel(i);
        if (exp < totalExpNeeded) {
          level = i - 1;
          rank = getRank(level); // Get the rank based on level
          break;
        }
        level = i; // Jika EXP cukup untuk mencapai level maksimal
        rank = getRank(level); // Update rank to the maximum level
      }

      return { level, rank };
    };

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

    const [reputasiSnapshot, pointSnapshot, namaSnapshot, expSnapshot] = await Promise.all([
      RefRep.once('value'),
      RefPoint.once('value'),
      RefNama.once('value'),
      RefExp.once('value')
    ]);

    const reputasi = reputasiSnapshot.val() || 0;
    const tier = getTier(reputasi);

    const poin = pointSnapshot.val() || 0;
    const point = poin.toLocaleString('id-ID', { minimumFractionDigits: 0 });

    const nama = namaSnapshot.val() || 'Nama Mu Masih kosong';

    const exp = expSnapshot.val() || 0;
    const { level, rank } = getLevel(exp); // Get level and rank together

    return `${nama}\n
    - Level: *${level}* (${rank})
    - Keramahan: *${tier}*
    - Point Kamu: *${point}*
    - Reputasi: *${reputasi}*
    - EXP: *${exp}*`;

  } catch (error) {
    console.error('Error while fetching data:', error);
    return 'Error while fetching !stat';
  }
};
