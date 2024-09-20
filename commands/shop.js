const { db } = require('../config/config');
const MarketRef = db.ref('dataData/market');
const EtcRef = db.ref('dataData/delay');

module.exports = async (message) => {
    const Market = [];

    try {
        const snapshot = await MarketRef.once('value');
        const marketData = snapshot.val() || {};
        const ssStock = await EtcRef.once('value');
        const Stock = ssStock.val() || {};
        const Elixir = Stock.elixir;
        const Potion = Stock.potion;
        const Pokeballs = Stock.pokeballs;
        const Greatballs = Stock.greatballs;
        const Ultraballs = Stock.ultraball;
        const Masterballs = Stock.masterball;
        const TrainingTicket = Stock.trainingTicket;
        // Mengumpulkan data Pokémon dari pasar
        Object.keys(marketData).forEach((id) => {
            const pokemon = marketData[id];
            const pokemonList = {
                namaPokemon: pokemon.namaPokemon,
                LVL: pokemon.LVL,
                HP: pokemon.HP,
                MAXHP: pokemon.MAXHP,
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
                const { namaPokemon, LVL, MAXHP, HP, ATTACK, DEFENSE, SPEED, TYPE, harga } = pokemonList;
                marketList += ` ${index + 1}. ${namaPokemon} (@${harga.toLocaleString('id-ID', { minimumFractionDigits: 0 })} Point)\n`;
                marketList += `- HP: ${MAXHP}\n`;
                marketList += `- Level: ${LVL}\n`;
                marketList += `- Attack  : ${ATTACK}\n`;
                marketList += `- Defense: ${DEFENSE}\n`;
                marketList += `- Speed: ${SPEED}\n`;
                marketList += `- Type: ${TYPE}\n`;
            });
            marketList = `*Welcome To Pokemon Shop*\n1. Potion (@${Potion.harga} Point): ${Potion.stock}\n2. Elixir (@${Elixir.harga} Point): ${Elixir.stock}\n3. Pokeballs (@${Pokeballs.harga} Point): ${Pokeballs.stock}\n4. Greatballs (@${Greatballs.harga} Point): ${Greatballs.stock}\n5. Ultraballs (@${Ultraballs.harga} Point): ${Ultraballs.stock}\n6. Masterballs (@${Masterballs.harga} Point): ${Masterballs.stock}\n7. Training Ticket (@${TrainingTicket.harga} Point): ${TrainingTicket.stock}\nItem di atas bertambah Setiap Malam\n*POKEMON*\n${marketList}`;
        }

        // Mengirimkan pesan ke pengguna
        await message.reply(marketList);

    } catch (error) {
        console.error('Error fetching market data:', error);
        await message.reply('Terjadi kesalahan saat mengambil data pasar.');
    }
};
