const { db } = require('../config/config');
const PokemonRef = db.ref('dataPengguna/pengguna');

module.exports = async (message) => {
  try {
    const param1 = parseInt(message.body.split(' ')[1]) - 1;
    if (isNaN(param1) || param1 < 0) {
      return message.reply('Format yang benar: `!dismiss <nomor_pokemon>`\nContoh: `!dismiss 4`');
    }

    const sanitizedSender = (message.author || message.from).replace(/[\.\@\[\]\#\$]/g, "_");
    const RefPokemon = PokemonRef.child(sanitizedSender).child('pokemon').child('inventory').child('pokemon');
    const snapshot = await RefPokemon.once('value');
    const pokemonData = snapshot.val() || {};
    const pokemonKeys = Object.keys(pokemonData);

    if (param1 >= pokemonKeys.length) {
      return message.reply('Nomor Pokémon yang dimasukkan tidak valid.');
    }

    const pokemonIdToDelete = pokemonKeys[param1];
    const pokemonToRelease = pokemonData[pokemonIdToDelete];
    const { namaPokemon, HP, ATTACK, DEFENSE, SPEED, TYPE } = pokemonToRelease;

    const pokemonInfo = `
      Nama: ${namaPokemon}
      HP: ${HP}
      Attack: ${ATTACK}
      Defense: ${DEFENSE}
      Speed: ${SPEED}
      Type: ${TYPE}
    `;

    await message.reply(`Berhasil Ngelepasin Pokémon:\n${pokemonInfo}`);
    
    // Menghapus Pokémon dari inventory
    await RefPokemon.child(pokemonIdToDelete).remove();
    await message.reply(`${namaPokemon} telah dilepas.`);

  } catch (error) {
    console.error(error);
    return message.reply('Terjadi kesalahan saat mencoba melepaskan Pokémon.');
  }
};
