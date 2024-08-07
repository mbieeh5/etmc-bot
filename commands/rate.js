const axios = require('axios');

exports.module = async (message) => {
    axios.get(`https://api.freecurrencyapi.com/v1/latest?apikey=${process.env.API_KEY_RATE}&currencies=IDR`).then(resp => {
        const data2 = resp.data.data.IDR;
        const dataAkhir = data2.toLocaleString("id-ID",{style: "currency", currency: "IDR"})
        const balasan = `Harga $1.00 = ${dataAkhir}`;
        return balasan;
    })
}