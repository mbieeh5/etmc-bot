const { db } = require('../config/config');

const PokemonRef = db.ref('dataPengguna/pengguna');

module.exports = async (message) => {
    const sA = message.author;
    const sender = message.from;
    const corection = sA != undefined ? sA : sender;
    const sanitizedSender = corection.replace(/[\.\@\[\]\#\$]/g, "_");
    const RefPokemon = PokemonRef.child(sanitizedSender).child('pokemon').child('inventory').child('pokemon');
    const RefInven = PokemonRef.child(sanitizedSender).child('pokemon').child('inventory');

    try {
        // Mengambil data Pokemon
        const pokemonSnapshot = await RefPokemon.once('value');
        const pokemonData = pokemonSnapshot.val() || {};
        const pokemonList = Object.keys(pokemonData).slice(0, 5).map((id) => `- ${pokemonData[id].namaPokemon}`).join("\n");

        // Mengambil data Inventory
        const inventorySnapshot = await RefInven.once('value');
        const inventory = inventorySnapshot.val() || {};

        const pokeballs = inventory.pokeballs || 0;
        const greatballs = inventory.greatballs || 0;
        const ultraball = inventory.ultraball || 0;
        const masterball = inventory.masterball || 0;
        const potion = inventory.potion || 0;
        const elixir = inventory.elixir || 0;
        const trainingTicket = inventory.trainingTicket || 0;

        // Mengirim balasan
        const responseMessage = `
Inventory
Items:
  - PokeBalls: ${pokeballs}
  - GreatBalls: ${greatballs}
  - UltraBalls: ${ultraball}
  - MasterBalls: ${masterball}
  - Elixir: ${elixir}
  - Potion: ${potion}
  - Training Ticket: ${trainingTicket}
Pokemon:
${pokemonList || 'Tidak ada Pokemon.'}
        `;

        message.reply(responseMessage);
    } catch (error) {
        console.error('Error fetching inventory or Pokemon:', error);
        message.reply('Terjadi kesalahan saat mengambil data inventory atau Pokemon.');
    }
};
