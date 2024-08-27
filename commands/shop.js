const { db } = require('../config/config');
const MarketRef = db.ref('dataData/market');

module.exports = async (message) => {
    const Market = [];

    try {
        const snapshot = await MarketRef.once('value');
        const marketData = snapshot.val() || {};

        // Mengumpulkan data Pokémon dari pasar
        Object.keys(marketData).forEach((id) => {
            const pokemon = marketData[id];
            const pokemonList = {
                namaPokemon: pokemon.namaPokemon,
                HP: pokemon.HP,
                ATTACK: pokemon.ATTACK,
                DEFENSE: pokemon.DEFENSE,
                SPEED: pokemon.SPEED,
                TYPE: pokemon.TYPE,
                harga: pokemon.harga,
                penjual: pokemon.penjual,
            };
            Market.push(pokemonList);
        });

        // Membuat pesan untuk dikirim
        let marketList = '';
        if (Market.length === 0) {
            marketList = '*Welcome To Pokemon Market*\nMarket Masih Kosong nih';
        } else {
            Market.forEach((pokemonList, index) => {
                const { namaPokemon, HP, ATTACK, DEFENSE, SPEED, TYPE, harga } = pokemonList;
                marketList += `${index + 1}. ${namaPokemon} (@${harga.toLocaleString('id-ID', { minimumFractionDigits: 0 })} Point)\n`;
                marketList += `   - HP: ${HP}\n`;
                marketList += `   - Attack  : ${ATTACK}\n`;
                marketList += `   - Defense: ${DEFENSE}\n`;
                marketList += `   - Speed: ${SPEED}\n`;
                marketList += `   - Type: ${TYPE}\n`;
            });
            marketList = `*Welcome To Pokemon Shop*\n1. Potion: 0\n2. Elixir: 0\n3. Pokeballs: 0\n4. Greatballs: 0\n5. Ultraballs: 0\n6. Masterballs: 0\n7. Training Ticket: 0\nItem di atas bertambah Setiap Malam\n*POKEMON*\n${marketList}`;
        }

        // Mengirimkan pesan ke pengguna
        await message.reply(marketList);

    } catch (error) {
        console.error('Error fetching market data:', error);
        await message.reply('Terjadi kesalahan saat mengambil data pasar.');
    }
};
