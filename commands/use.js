const { db } = require('../config/config');

const PokemonRef = db.ref('dataPengguna/pengguna');

module.exports = async (message) => {
    try {
        const params = message.body.split(" ")[1];
        if (!params) {
            return message.react("😅");
        }

        const sanitizedSender = (message.author || message.from).replace(/[\.\@\[\]\#\$]/g, "_");

        const RefInven = PokemonRef.child(sanitizedSender).child('pokemon').child('inventory');
        const RefGacoan = PokemonRef.child(sanitizedSender).child('pokemon').child('gacoan');

        // Mengambil snapshot inventory sekali saja
        const inventorySnapshot = await RefInven.once('value');
        const inventory = inventorySnapshot.val() || {};
        const Potion = inventory.potion || 0;
        const Elixir = inventory.elixir || 0;

        const handleHealing = async (item, itemStock, hpIncrease, maxHpUpdate) => {
            if (itemStock <= 0) {
                return message.reply(`Item ${item} mu habis mas, beli dulu gih di market !buy ${item} 1`);
            }

            const gacoanSnapshot = await RefGacoan.once('value');
            const dataGacoan = gacoanSnapshot.val() || {};
            const HP = dataGacoan.HP || 0;
            const MaxHP = dataGacoan.MAXHP || 0;
            const newHP = Math.min(HP + hpIncrease, MaxHP);

            if (HP >= MaxHP) {
                return message.reply(`Darah udah penuh mas`);
            }

            await RefInven.child(item).set(itemStock - 1);
            await RefGacoan.child('HP').set(newHP);
            message.reply(`Pokemon HP +${hpIncrease}`);
        };

        if (params === "elixir") {
            await handleHealing("elixir", Elixir, MaxHP, true);
        } else if (params === "potion") {
            await handleHealing("potion", Potion, 500, false);
        } else {
            return message.react("😅"); // Reaksi untuk parameter tidak dikenal
        }

    } catch (error) {
        console.error("Error in module:", error);
        return message.react("😵"); // Reaksi untuk menunjukkan error
    }
};
