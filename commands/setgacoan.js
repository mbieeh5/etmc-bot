const { db } = require('../config/config');
const PokemonRef = db.ref('dataPengguna/pengguna');

module.exports = async (message) => {
  try {
    const param1 = parseInt(message.body.split(' ')[1]) - 1;
    const sanitizedSender = (message.author || message.from).replace(/[\.\@\[\]\#\$]/g, "_");
    const RefPokemon = PokemonRef.child(sanitizedSender).child('pokemon').child('inventory').child('pokemon');
    const RefGacoan = PokemonRef.child(sanitizedSender).child('pokemon').child('gacoan');

    if (isNaN(param1) || param1 < 0) {
      return message.reply('Nomor Pokemon tidak valid. Silakan pilih nomor yang valid.');
    }

    const snapshot = await RefPokemon.once('value');
    const pokemonData = snapshot.val() || {};

    const pokemonList = Object.keys(pokemonData).map(id => ({
      namaPokemon: pokemonData[id].namaPokemon,
      HP: pokemonData[id].HP,
      MAXHP: pokemonData[id].MAXHP,
      ATTACK: pokemonData[id].ATTACK,
      DEFENSE: pokemonData[id].DEFENSE,
      SPEED: pokemonData[id].SPEED,
      LVL: pokemonData[id].LVL,
      EXP: pokemonData[id].EXP,
      TYPE: pokemonData[id].TYPE
    }));

    const jumlahPokemon = pokemonList.length;

    if (param1 >= jumlahPokemon) {
      return message.reply(`Nomor Pokemon tidak valid. Silakan pilih nomor antara 1 dan ${jumlahPokemon}.`);
    }

    const gacoan = pokemonList[param1];
    const gacoanSnapshot = await RefGacoan.once('value');
    const gacoanUdahAda = gacoanSnapshot.val();

    if (gacoanUdahAda) {
      await RefPokemon.push(gacoanUdahAda);
    }

    const pokemonId = Object.keys(pokemonData)[param1];
    await RefPokemon.child(pokemonId).remove();
    await RefGacoan.set(gacoan);

    let pokemonDetail = `Gacoan: ${gacoan.namaPokemon} LVL: ${gacoan.LVL}\n`;
    pokemonDetail += `   - HP: ${gacoan.HP}\n`;
    pokemonDetail += `   - Attack: ${gacoan.ATTACK}\n`;
    pokemonDetail += `   - Defense: ${gacoan.DEFENSE}\n`;
    pokemonDetail += `   - Speed: ${gacoan.SPEED}\n`;
    pokemonDetail += `   - EXP: ${gacoan.EXP}\n`;
    pokemonDetail += `   - Type: ${gacoan.TYPE}\n`;

    await message.reply(`Berhasil set Gacoan:\n${pokemonDetail}`);

  } catch (error) {
    console.error(error);
    await message.reply('Terjadi kesalahan saat mencoba mengatur Gacoan.');
  }
};