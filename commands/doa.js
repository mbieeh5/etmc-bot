const axios = require('axios');

exports.module = async (message) => {
    axios.get(`https://doa-doa-api-ahmadramadhan.fly.dev/api`).then(resp => {
        const dataDoa = resp.data.slice();
        const randomIndex = Math.floor(Math.random() * dataDoa.length);
        const randomData = dataDoa[randomIndex];
        const balasan = `${randomData.doa}\n\n${randomData.ayat}\n${randomData.latin}\n\nArtinya: ${randomData.artinya}`
        return balasan;
    });
}