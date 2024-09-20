const { db } = require('../config/config');
const axios = require('axios');

const PokemonRef = db.ref('dataPengguna/pengguna');

module.exports = async (message) => {
  try {
    const sanitizedSender = (message.author || message.from).replace(/[\.\@\[\]\#\$]/g, "_");
    const RefPokemon = PokemonRef.child(sanitizedSender).child('pokemon').child('inventory').child('pokemon');
    const RefInven = PokemonRef.child(sanitizedSender).child('pokemon').child('inventory');
    const param1 = message.body.split(' ')[1] || 'pokeballs';

    const snapshot = await RefPokemon.once('value');
    const pokemonData = snapshot.val() || {};
    const pokemonCount = Object.keys(pokemonData).length;

    if (pokemonCount > 25) {
      return 'Pokedex kamu sudah penuh\nhapus(!dismiss <nomor Pokedex>)\natau\njual salah satu Pokemon(!sell <nomor Pokedex> <harga>).';
    }

    const resp = await axios.get(`https://pokeapi.co/api/v2/pokemon/?offset=0&limit=2200`);
    const raw = resp.data.results;
    const randomPoke = raw[Math.floor(Math.random() * raw.length)];
    const resultValue = Math.random();

    const inventorySnapshot = await RefInven.once('value');
    const inventory = inventorySnapshot.val() || {};
    const balls = {
      pokeballs: inventory.pokeballs || 0,
      greatballs: inventory.greatballs || 0,
      ultraball: inventory.ultraball || 0,
      masterball: inventory.masterball || 0,
    };

    const ballTypes = {
      pokeballs: { chance: 0.3, label: "pokeballs", bonus: 0 },
      greatballs: { chance: 0.55, label: "greatballs", bonus: 10 },
      ultraball: { chance: 0.85, label: "ultraball", bonus: 50 },
      masterball: { chance: 1, label: "masterball", bonus: 100 },
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

      // Tambahkan bonus stat sesuai bola yang digunakan
      const HP = stats[0].base_stat + selectedBall.bonus;
      const MAXHP = stats[0].base_stat + selectedBall.bonus;
      const ATTACK = stats[1].base_stat + selectedBall.bonus;
      const DEFENSE = stats[2].base_stat + selectedBall.bonus;
      const SPEED = stats[5].base_stat + selectedBall.bonus;
      const LVL = 0;
      const EXP = 0;
      const TYPE = types;

      await RefPokemon.push({
        namaPokemon: randomPoke.name.toUpperCase(),
        HP,
        MAXHP,
        ATTACK,
        DEFENSE,
        SPEED,
        LVL,
        EXP,
        TYPE
      });

      return `*${randomPoke.name.toUpperCase()}*\nSTATUS:\nHP: ${HP}\nATTACK: ${ATTACK}\nDEFENSE: ${DEFENSE}\nSPEED: ${SPEED}\n\nPokemon Type: ${types}.`;
    } else {
      return 'WAKOAWOKAW Pokemonnya kabur!';
    }
  } catch (err) {
    console.error(err);
    return 'Terjadi kesalahan saat mencoba menangkap Pokemon.';
  }
};
