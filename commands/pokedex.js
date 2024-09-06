const { db } = require('../config/config');
const PokemonRef = db.ref('dataPengguna/pengguna');

module.exports = async (message) => {
  try {
    const sanitizedSender = (message.author || message.from).replace(/[\.\@\[\]\#\$]/g, "_");
    const RefPokemon = PokemonRef.child(sanitizedSender).child('pokemon').child('inventory').child('pokemon');

    const snapshot = await RefPokemon.once('value');
    const pokemonData = snapshot.val() || {};

    const pokemon = Object.keys(pokemonData).map((id, index) => {
      const { namaPokemon: name, LVL: level,MAXHP:maxHP, HP: hp, ATTACK: attack, DEFENSE: defense, SPEED:speed, EXP:exp, TYPE: type } = pokemonData[id];
      return { index: index + 1, name, level,maxHP, hp, attack, defense,speed, exp, type };
    });

    const jumlahPokemon = pokemon.length;
    const pokemonList = pokemon.map(({ index, name, level, maxHP, hp, attack, defense,speed, exp, type }) => (
      ` ${index}. ${name} (level: ${level})\n- MAX HP: ${maxHP}\n- HP: ${hp}\n- Attack: ${attack}\n- Defense: ${defense}\n- Speed: ${speed}\n- EXP: ${exp}\n- Type: ${type}`
    )).join('\n');

    message.reply(`*POKÉDEX*.\nJumlah Pokemon: ${jumlahPokemon}\n${pokemonList}`);
  } catch (error) {
    console.error(error);
    message.reply('Terjadi kesalahan saat mengambil data Pokémon.');
  }
};
