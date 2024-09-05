const axios = require('axios');
const { fightAiPokemon } = require('../lib/fightAi');
const {db} = require('../config/config');
const {fightPvP} = require('../lib/fightPvP');

const PokemonRef = db.ref('dataPengguna/pengguna');

module.exports = async (message) => {
    try {
        const Pvp = message.body.split(" ")[1];
        const sanitizedSender = (message.author || message.from).replace(/[\.\@\[\]\#\$]/g, "_");
        const RefGacoan = PokemonRef.child(sanitizedSender).child('pokemon').child('gacoan');
        const gacoanSnapshot = await RefGacoan.once('value');
        const gacoanP1 = gacoanSnapshot.val();
        if (Pvp) {
            const NoGacoanP2 = Pvp.replace(/@/g, '') + '_c_us';
            const RefGacoanP2 = PokemonRef.child(NoGacoanP2).child('pokemon').child('gacoan');
            const snapshotGacoanP2 = await RefGacoanP2.once('value');
            const gacoanP2 = snapshotGacoanP2.val() || {};
            if (gacoanP2 && gacoanP2.namaPokemon && gacoanP1 && gacoanP1.namaPokemon) {
                fightPvP(gacoanP1, gacoanP2, Pvp, message);
                return `Persiapan Arena!...`;
            } else {
                message.reply(`Dia Gak Punya gacoan suruh set dulu gih\n!setgacoan <noPokedex>`);
                return false;
            }
        } else {
            let BOT = [];
            let P1 = [];


            if (gacoanP1) {
                P1.push(gacoanP1);

                // Mencari musuh
                const pokemonResp = await axios.get('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=2200');
                const raw = pokemonResp.data.results;
                const randomPoke = raw[Math.floor(Math.random() * raw.length)];

                const respon = await axios.get(randomPoke.url);
                const randomPokemon = {
                    namaPokemon: randomPoke.name.toUpperCase(),
                    HP: Math.max(1, P1[0].MAXHP - respon.data.stats[0].base_stat),
                    ATTACK: Math.max(1, P1[0].ATTACK - respon.data.stats[1].base_stat),
                    DEFENSE: Math.max(1, P1[0].DEFENSE - respon.data.stats[2].base_stat),
                    SPEED: Math.max(1, P1[0].SPEED - respon.data.stats[5].base_stat),
                    TYPE: respon.data.types[0].type.name.toUpperCase()
                };
                BOT.push(randomPokemon);

                const musuhStats = Object.entries(BOT[0])
                    .map(([key, value]) => `${key}: ${value}`)
                    .join('\n');
                
                message.reply(`Musuh ditemukan\n${musuhStats}`);
                await fightAiPokemon(P1, BOT, message);
            } else {
                message.reply('Belum ada dekingan, mending cari dulu gih !catch, kalo udah !setgacoan');
            }
        }
    } catch (error) {
        console.error("Error while fight: ", error);
        message.reply('Terjadi kesalahan saat menjalankan !fight, coba lagi nanti.');
        return 'error while !fight';
    }
}
