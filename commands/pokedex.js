const { db } = require('../config/config');
const PokemonRef = db.ref('dataPengguna/pengguna');

module.exports = async (message) => {
  try {
    const sanitizedSender = (message.author || message.from).replace(/[\.\@\[\]\#\$]/g, "_");
    const RefPokemon = PokemonRef.child(sanitizedSender).child('pokemon').child('inventory').child('pokemon');

    const snapshot = await RefPokemon.once('value');
    const pokemonData = snapshot.val() || {};

    const pokemon = Object.keys(pokemonData).map((id, index) => {
      const { namaPokemon: name, HP: hp, ATTACK: attack, DEFENSE: defense, TYPE: type } = pokemonData[id];
      return { index: index + 1, name, hp, attack, defense, type };
    });

    const jumlahPokemon = pokemon.length;
    const pokemonList = pokemon.map(({ index, name, hp, attack, defense, type }) => (
      `${index}. ${name}\n   - HP: ${hp}\n   - Attack: ${attack}\n   - Defense: ${defense}\n   - Type: ${type}`
    )).join('\n');

    message.reply(`*POKÉDEX*.\nJumlah Pokemon: ${jumlahPokemon}\n${pokemonList}`);
  } catch (error) {
    console.error(error);
    message.reply('Terjadi kesalahan saat mengambil data Pokémon.');
  }
};
