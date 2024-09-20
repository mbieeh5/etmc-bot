const { default: axios } = require("axios");

module.exports = async (message) => {
    try {
        const kataKunci = (message.body).split(' ')[1].trim();
        const resp = await axios.get(`https://id.wikipedia.org/api/rest_v1/page/summary/${kataKunci}`)
        const datas = resp.data.extract;
        const balasan = datas
            if(datas){
                return balasan;
            }else {
                return `Gagal Saat Mencari ${kataKunci}.`
            }
    } catch (error) {
        return 'error while !Cari something';
    }
}