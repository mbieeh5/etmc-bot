const axios = require('axios');

module.exports = async (message) => {
  try {
    const resp = await axios.get('https://ibnux.github.io/BMKG-importer/cuaca/5002227.json');
    const dataCuaca = resp.data;
    const waktuSekarang = new Date();
    const dataCuacaTerdekat = dataCuaca.find(data => {
      const waktuData = new Date(data.jamCuaca);
      return waktuData > waktuSekarang;
    });

    if (dataCuacaTerdekat) {
      const balasan = `Cuaca terdekat:\nJam: ${dataCuacaTerdekat.jamCuaca}\nCuaca: ${dataCuacaTerdekat.cuaca}\nSuhu: ${dataCuacaTerdekat.tempC}°C`;
      return balasan;
    } else {
      return 'Maaf, tidak ada data cuaca yang tersedia untuk waktu mendatang.';
    }
  } catch (error) {
    console.error('Error while fetching data:', error);
    return 'Error while fetching data';
  }
};
