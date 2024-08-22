const { db } = require('../config/config');

const PokemonRef = db.ref('dataPengguna/pengguna');

module.exports = async (message) => {
    try {
        const params = (message.body).split(" ")[1];
        if (!params) {
            return message.react("😅"); // Mengirim reaksi jika tidak ada parameter
        }

        const sA = message.author;
        const sender = message.from;
        const corection = sA !== undefined ? sA : sender;
        const sanitizedSender = corection.replace(/[\.\@\[\]\#\$]/g, "_");

        const RefInven = PokemonRef.child(sanitizedSender).child('pokemon').child('inventory');
        
        // Mengambil snapshot inventory sekali saja
        const inventorySnapshot = await RefInven.once('value');
        const inventory = inventorySnapshot.val() || {};
        const Potion = inventory.potion || 0;
        const Elixir = inventory.elixir || 0;

        if (params === "elixir" && Elixir >= 1) {
            return 'use Elixir';
        }
        if (params === "potion" && Potion >= 1) {
            return 'use Potion';
        }

        return message.react("🤣"); // Mengirim reaksi jika tidak ada elixir atau potion yang mencukupi
    } catch (error) {
        console.error("Error in module:", error);
        return message.react("😵"); // Reaksi untuk menunjukkan error
    }
};
