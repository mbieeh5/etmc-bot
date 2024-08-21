const axios = require('axios');

module.exports = async (message) => {
    try {
            const resp = await axios.get(`https://api.freecurrencyapi.com/v1/latest?apikey=${process.env.API_KEY_RATE}&currencies=IDR`)
            const data2 = resp.data.data.IDR;
            const dataAkhir = data2.toLocaleString("id-ID",{style: "currency", currency: "IDR"})
            const balasan = `Harga $1.00 = ${dataAkhir}`;
            return balasan;
    }catch (error) {
        console.error('Error fetch data !rate', error);
        return 'error while fetching data !rate'
    }
}