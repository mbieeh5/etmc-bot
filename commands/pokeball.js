const {db} = require('../config/config');

const PokemonRef = db.ref('dataPengguna/pengguna');

module.exports = async (message) => {
    const sA = message.author;
    const sender = message.from;
    const corection = sA != undefined ? sA : sender;
    const sanitizedSender = corection.replace(/[\.\@\[\]\#\$]/g, "_");
    const RefPokeDelay = PokemonRef.child(sanitizedSender).child('pokemon').child('delay');
    const RefInven = PokemonRef.child(sanitizedSender).child('pokemon').child('inventory');
    const RefPoke = RefInven.child('pokeballs');

    const delaySnapshot = await RefPokeDelay.once('value');
    const delay = delaySnapshot.val() || 'true';

    if (delay !== 'true') {
        message.reply('Jeda 1 menit ya, buat farming Pokeballs...');
        setTimeout(async () => {
            await RefPokeDelay.set('true');
        }, 60000);
        return;
    }

    const randomChance = Math.random() * 100;
    let pesanBalasan = '';

    if (randomChance < 100) {
        const potionCount = Math.floor(Math.random() * 3) + 1;
        const pokeballCount = Math.floor(Math.random() * 3) + 3;

        await Promise.all([
            updateInventory(RefInven.child('potion'), potionCount),
            updateInventory(RefPoke, pokeballCount),
        ]);

        pesanBalasan += `${potionCount} Potion.\n${pokeballCount} Pokeball.\n`;

        if (randomChance > 80) {
            const greatballCount = Math.floor(Math.random() * 3) + 1;
            await updateInventory(RefInven.child('greatballs'), greatballCount);
            pesanBalasan += `${greatballCount} Greatball.\n`;
        }

        if (randomChance > 90) {
            const ultraballCount = Math.floor(Math.random() * 2) + 1;
            await updateInventory(RefInven.child('ultraball'), ultraballCount);
            pesanBalasan += `${ultraballCount} Ultraball.\n`;
        }

        if (randomChance >= 96) {
            const masterballCount = Math.floor(Math.random() * 2) + 1;
            await Promise.all([
                updateInventory(RefInven.child('masterball'), masterballCount),
                updateInventory(RefInven.child('trainingTicket'), masterballCount),
            ]);
            pesanBalasan += `${masterballCount} Masterball.\n${masterballCount} Training Ticket.\n`;
        }
    }

    await RefPokeDelay.set('false');
    setTimeout(async () => {
        await RefPokeDelay.set('true');
    }, 60000);

    message.reply(pesanBalasan);

    async function updateInventory(ref, count) {
        const snapshot = await ref.once('value');
        const currentCount = snapshot.val() || 0;
        await ref.set(currentCount + count);
    }
};
