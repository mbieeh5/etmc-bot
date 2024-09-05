const { db } = require('../config/config');
const axios = require('axios');

const PokemonRef = db.ref('dataPengguna/pengguna');

module.exports = async (message) => {
  try {
    const sanitizedSender = (message.author || message.from).replace(/[\.\@\[\]\#\$]/g, "_");
    const RefPokemon = PokemonRef.child(sanitizedSender).child('pokemon').child('inventory').child('pokemon');
    const RefInven = PokemonRef.child(sanitizedSender).child('pokemon').child('inventory');
    const param1 = message.body.split(' ')[1] || 'pokeball';
    
    const snapshot = await RefPokemon.once('value');
    const pokemonData = snapshot.val() || {};
    const pokemonCount = Object.keys(pokemonData).length;

    if (pokemonCount > 25) {
      return message.reply('Pokedex kamu sudah penuh\nhapus(!dismiss <nomor Pokedex>)\natau\njual salah satu Pokemon(!sell <nomor Pokedex> <harga>).');
    }

    const resp = await axios.get(`https://pokeapi.co/api/v2/pokemon/?offset=0&limit=2200`);
    const raw = resp.data.results;
    const randomPoke = raw[Math.floor(Math.random() * raw.length)];
    const resultValue = Math.random();

    const inventorySnapshot = await RefInven.once('value');
    const inventory = inventorySnapshot.val() || {};
    const balls = {
      pokeball: inventory.pokeballs || 0,
      greatball: inventory.greatballs || 0,
      ultraball: inventory.ultraball || 0,
      masterball: inventory.masterball || 0,
    };

    const ballTypes = {
      pokeball: { chance: 0.5, label: "Pokeball" },
      greatball: { chance: 0.65, label: "Greatball" },
      ultraball: { chance: 0.85, label: "Ultraball" },
      masterball: { chance: 1, label: "Masterball" },
    };

    if (!ballTypes[param1]) {
      await message.react('😂');
      return;
    }

    const selectedBall = ballTypes[param1];

    if (balls[param1] < 1) {
      return message.reply(`Kamu tidak memiliki ${selectedBall.label}, cari(!pokeball) atau beli(!buy pokeball) terlebih dahulu.`);
    }

    const newBallCount = balls[param1] - 1;
    await RefInven.child(param1).set(newBallCount);

    if (resultValue <= selectedBall.chance) {
      const pokeData = await axios.get(randomPoke.url);
      const stats = pokeData.data.stats;
      const types = pokeData.data.types.map(type => type.type.name.toUpperCase()).join(', ');
      
      await RefPokemon.push({
          namaPokemon: randomPoke.name.toUpperCase(),
          HP: stats[0].base_stat,
          MAXHP: stats[0].base_stat,
          ATTACK: stats[1].base_stat,
          DEFENSE: stats[2].base_stat,
          SPEED: stats[5].base_stat,
          LVL: 0,
          EXP: 0,
          TYPE: types,
      });

      return message.reply(`*${randomPoke.name.toUpperCase()}*\nSTATUS:\n${stats[0].stat.name.toUpperCase()}: ${stats[0].base_stat}\n${stats[1].stat.name.toUpperCase()}: ${stats[1].base_stat}\n${stats[2].stat.name.toUpperCase()}: ${stats[2].base_stat}\n${stats[5].stat.name.toUpperCase()}: ${stats[5].base_stat}\n\nPokemon Type: ${types}.`);
    } else {
      return message.reply('WAKOAWOKAW Pokemonnya kabur!');
    }
  } catch (err) {
    console.error(err);
    return message.reply('Terjadi kesalahan saat mencoba menangkap Pokemon.');
  }
};
