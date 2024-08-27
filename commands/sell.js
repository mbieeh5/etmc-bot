const { db } = require('../config/config');
const PokemonRef = db.ref('dataPengguna/pengguna');
const MarketRef = db.ref('dataData/market');

const calculateRecommendedPrice = (pokemon) => {
    const basePrice = 500;
    const levelMultiplier = 100;

    const recommendedPrice = basePrice + (pokemon.LVL * levelMultiplier);

    const typeBonus = pokemon.TYPE === 'Legendary' ? 5000 : 0;
    return recommendedPrice + typeBonus;
};

module.exports = async (message) => {
    const pesan = message.body;
    const params = pesan.split(' ');
    const param1 = parseInt(params[1]) - 1; // Nomor Pokemon yang dipilih (dalam indeks 0-based)
    const param3 = params[1]; // Untuk handle 'tiket'
    const pokemon = [];
    const sanitizedSender = (message.author || message.from).replace(/[\.\@\[\]\#\$]/g, "_");
    const RefPokemon = PokemonRef.child(sanitizedSender).child('pokemon').child('inventory').child('pokemon');

    if (param1 >= 0) {
        const param2 = parseInt(params[2]); // Harga jual

        await RefPokemon.once('value', async (snapshot) => {
            const pokemonData = snapshot.val() || {};

            if (Object.keys(pokemonData).length === 0) {
                await message.reply('Inventory Pokemon kosong.');
                return;
            }

            if (param2 < 500) {
                await message.reply('Harga jual harus lebih dari atau sama dengan 500.');
                return;
            }

            Object.keys(pokemonData).forEach((id) => {
                const pokemonInfo = pokemonData[id];
                const pokemonStats = {
                    namaPokemon: pokemonInfo.namaPokemon,
                    HP: pokemonInfo.HP,
                    ATTACK: pokemonInfo.ATTACK,
                    DEFENSE: pokemonInfo.DEFENSE,
                    SPEED: pokemonInfo.SPEED,
                    TYPE: pokemonInfo.TYPE,
                    EXP: pokemonInfo.EXP || 0,
                    LVL: pokemonInfo.LVL || 0,
                    harga: param2,
                    penjual: sanitizedSender,
                };

                pokemon.push(pokemonStats);
            });

            const jumlahPokemon = pokemon.length;
            if (param1 < jumlahPokemon) {
                const jualPoke = pokemon[param1];
                const { namaPokemon, HP, ATTACK, DEFENSE, SPEED, TYPE, harga } = jualPoke;

                // Hitung harga rekomendasi
                const recommendedPrice = calculateRecommendedPrice(jualPoke);

                // Jika harga jual melebihi harga rekomendasi, beri peringatan
                if (harga > recommendedPrice) {
                    await message.reply(`Kamu menjual terlalu mahal, silahkan jual dengan harga di bawah dari ${recommendedPrice}.`);
                } else {
                    await MarketRef.push(jualPoke);

                    let pokemonList = '';
                    pokemonList += `Nama: ${namaPokemon}\n`;
                    pokemonList += `   - HP: ${HP}\n`;
                    pokemonList += `   - Attack: ${ATTACK}\n`;
                    pokemonList += `   - Defense: ${DEFENSE}\n`;
                    pokemonList += `   - Speed: ${SPEED}\n`;
                    pokemonList += `   - Type: ${TYPE}\n`;
                    pokemonList += `   - Harga: ${harga}\n`;

                    await message.reply(`Berhasil Menjual\n${pokemonList}`);

                    // Hapus Pokemon dari inventory
                    const snapshot = await RefPokemon.once('value');
                    const pokemonData = snapshot.val() || {};
                    const pokemonKeys = Object.keys(pokemonData);
                    const pokemonIdToDelete = pokemonKeys[param1];
                    await RefPokemon.child(pokemonIdToDelete).remove();
                }
            } else {
                await message.reply(`Nomor Pokémon tidak valid. Pilih nomor antara 1 dan ${jumlahPokemon}.`);
            }
        });
    } else if (param3 === 'tiket') {
        await message.reply('!sell tiket function(sellTrainingTicket(Anonymous))');
    } else {
        await message.reply('Format yang benar: `!sell <nomor_pokemon> <harga>`\nContoh: `!sell 4 100000`\nAtau !sell tiket 4500');
    }
};
