const axios = require('axios');

exports.module = async (message) => {
    axios.get('https://ibnux.github.io/BMKG-importer/cuaca/5002227.json').then(resp => {
        const dataCuaca = resp.data;
        const waktuSekarang = new Date();
        const dataCuacaTerdekat = dataCuaca.find(data => {
          const waktuData = new Date(data.jamCuaca);
          return waktuData > waktuSekarang;
        });
        if (dataCuacaTerdekat) {
          const balasan = `Cuaca terdekat:\nJam: ${dataCuacaTerdekat.jamCuaca}\nCuaca: ${dataCuacaTerdekat.cuaca}\nSuhu: ${dataCuacaTerdekat.tempC}°C`;
          return balasan
      } else {
          const balasan = 'Maaf, tidak ada data cuaca yang tersedia untuk waktu mendatang.';
          return balasan
        }
      });
}