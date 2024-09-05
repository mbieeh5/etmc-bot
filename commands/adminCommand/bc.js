const {db} = require('../../config/config');

const pengguna = db.ref('dataPengguna/pengguna');



module.exports = async (message) => {
    try {
        const param1 = (message.body).split('%bc ');
        const daftarGroupRef = await pengguna.once('value');
        const daftarGroup = daftarGroupRef.val() || {};
        
        // Mengambil dan memfilter nama yang berakhiran "_g_us"
        const filteredGroups = Object.keys(daftarGroup).filter(groupName => /_g_us$/.test(groupName));
        
        // Mengubah akhiran "_g_us" menjadi "@g.us"
        const convertedGroups = filteredGroups.map(groupName => groupName.replace(/_g_us$/, '@g.us'));
        return {message: param1, dataGroup: convertedGroups};
    } catch (error) {
        console.error(`error while Broadcast message group`,error)
        return 'errro while Broadcast'
    }
}