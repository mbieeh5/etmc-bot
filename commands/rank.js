const { db } = require('../config/config');
const { getLevel } = require('../lib/getLevelStat'); // Fungsi kalkulasi level kamu

const RefPengguna = db.ref('dataPengguna/pengguna');

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

module.exports = async (message) => {
    try {
        const params = (message.body).split(' ')[1];  // Mengambil parameter setelah !rank

        const SSpengguna = await RefPengguna.once('value');
        const pengguna = SSpengguna.val() || {};

        // Filter pengguna dengan akhiran _c_us
        const filteredPengguna = Object.keys(pengguna).filter(users => /_c_us$/.test(users));

        // Mapping nama, point, reputasi, dan level dari pengguna
        const penggunaArray = filteredPengguna.map(user => {
            const { level, rank } = getLevel(pengguna[user].exp || 0);
            return {
                nama: pengguna[user].nama || 'Anak Bapa',
                point: pengguna[user].point || 0,
                reputasi: pengguna[user].reputasi || 0,
                level: level,
                rank: rank,
            };
        });

        // Fungsi untuk mendapatkan top 5 dan format data sesuai kebutuhan
        const getTop5 = (key) => {
            return penggunaArray
            .sort((a, b) => b[key] - a[key])
                .slice(0, 5)
                .map((pengguna, index) => (
                    `${index + 1}. ${pengguna.nama}\n- Point: ${(pengguna.point).toLocaleString('id-ID', { minimumFractionDigits: 0 })}\n- Reputasi: ${getTier(pengguna.reputasi || 0)}\n- Level: ${pengguna.level} (${pengguna.rank})`
                ))
                .join('\n\n');
            };
            const getTop3 = (key) => {
                return penggunaArray
                .sort((a, b) => a[key] - b[key])
                .slice(0, 3)
                .map((pengguna, index) => (
                    `${index + 1}. ${pengguna.nama}\n- Point: ${(pengguna.point).toLocaleString('id-ID', { minimumFractionDigits: 0 })}\n- Reputasi: ${getTier(pengguna.reputasi || 0)}\n- Level: ${pengguna.level} (${pengguna.rank})`
                ))
                .join('\n\n');
            };
            
        if (params === 'point') {
            const top5Points = getTop5('point');
            return message.reply(`Top 5 Users by Points:\n\n${top5Points}`);
        }
        
        if (params === 'level') {
            const top5Levels = getTop5('level');
            return message.reply(`Top 5 Users by Levels:\n\n${top5Levels}`);
        }
        
        if (params === 'reputasi') {
            const top5Reputasi = getTop5('reputasi');
            return message.reply(`Top 5 Users by Reputasi:\n\n${top5Reputasi}`);
        }
        
        if(params === 'toxic') {
            const top3Toxic = getTop3('reputasi')
            
            return message.reply(`Top 3 Raja Toxic Dari Mexico :\n\n${top3Toxic}`);
        }

        return message.reply('Parameter tidak valid. Gunakan !rank point, !rank level, atau !rank reputasi.');
    } catch (error) {
        console.error('Error while fetching data for !rank:', error);
        return message.reply('Error saat mengambil data !rank || !rank point || !rank level || !rank reputasi');
    }
};
