const axios = require('axios');
const xml2js = require('xml2js');

module.exports = async (message) => {
  try {
    const resp = await axios.get('https://data.bmkg.go.id/DataMKG/MEWS/DigitalForecast/DigitalForecast-JawaBarat.xml');
    const dataCuacaXML = resp.data;

    // Parsing XML to JavaScript object
    const parser = new xml2js.Parser();
    const dataCuaca = await parser.parseStringPromise(dataCuacaXML);
    
    // Extract data as needed from the parsed object
    const lokasi = dataCuaca.data.forecast[0].area.find(area => area.$.description === "Cibinong");
    const parameterCuaca = lokasi.parameter.find(param => param.$.id === 't');
    const suhuTerbaru = parameterCuaca.timerange[5].value[0]._;
    
    const balasan = `Cuaca di Cibinong:\nSuhu: ${suhuTerbaru}°C`;

    return balasan;
  } catch (error) {
    console.error('Error while fetching or parsing data:', error);
    return 'Error while fetching data';
  }
};
