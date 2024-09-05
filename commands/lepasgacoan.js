const { db } = require('../config/config');
const PokemonRef = db.ref('dataPengguna/pengguna');

module.exports = async (message) => {
  try {
    const sanitizedSender = (message.author || message.from).replace(/[\.\@\[\]\#\$]/g, "_");
    const RefPokemon = PokemonRef.child(sanitizedSender).child('pokemon').child('inventory').child('pokemon');
    const RefGacoan = PokemonRef.child(sanitizedSender).child('pokemon').child('gacoan');

    const snapshot = await RefGacoan.once('value');
    const dataGacoan = snapshot.val();

    if (dataGacoan) {
      await RefPokemon.push(dataGacoan);
      await RefGacoan.remove();
      await message.reply('Gacoan berhasil disimpan ke Pokedex.');
    } else {
      await message.reply('Tidak ada Gacoan yang ditemukan.');
    }
  } catch (error) {
    console.error(error);
    await message.reply('Terjadi kesalahan saat menyimpan Gacoan ke Pokedex.');
  }
};
