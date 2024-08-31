const { db } = require('../config/config');

const MarketRef = db.ref('dataData/market');
const EtcRef = db.ref('dataData/delay');
const ETC2Ref = db.ref('dataData').child('delay');
const PokemonRef = db.ref('dataPengguna/pengguna');

module.exports = async (message) => {
    try {
        const items = ((message.body).split(" ")[1]).toLowerCase();
        const qty = parseInt((message.body).split(" ")[2], 10);
        const sanitizedSender = (message.author || message.from).replace(/[\.\@\[\]\#\$]/g, "_");
        const RefPokemon = PokemonRef.child(sanitizedSender).child('pokemon').child('inventory');

        const SSMarket = await MarketRef.once('value');
        const SSEtc = await EtcRef.once('value');

        const userPoinSnapshot = await PokemonRef.child(sanitizedSender).child('point').once('value');
        const userPoin = userPoinSnapshot.val() || 0;

        const validItems = ['potion', 'elixir', 'pokeballs', 'greatballs', 'ultraball', 'masterball', 'ticket'];
        const itemPrices = {};

        // Mengubah 'ticket' menjadi 'trainingTicket'
        const dbItem = items === 'ticket' ? 'trainingTicket' : items;

        // Mengambil harga item dari SSEtc
        validItems.forEach(item => {
            const itemStock = SSEtc.child(item === 'ticket' ? 'trainingTicket' : item).val();
            if (itemStock) {
                itemPrices[item] = itemStock.harga;
            }
        });

        if (validItems.includes(items)) {
            const itemPrice = itemPrices[items];
            const totalCost = itemPrice * qty;

            if (userPoin >= totalCost) {
                const itemStockRef = EtcRef.child(dbItem).child('stock');
                const itemStockSnapshot = await itemStockRef.once('value');
                const currentStock = itemStockSnapshot.val();

                if (currentStock >= qty) {
                    const newStock = currentStock - qty;
                    await itemStockRef.set(newStock);

                    await RefPokemon.child(dbItem).transaction(currentQty => (currentQty || 0) + qty);
                    await PokemonRef.child(sanitizedSender).child('point').set(userPoin - totalCost);
                    message.reply(`Pembelian ${qty} ${items} berhasil! dengan harga ${totalCost}\nPoin yang tersisa: ${userPoin - totalCost}`);
                }else {
                    message.reply(`stock sedang habis, nanti jam 12 malam restock lagi\n${dbItem}:${currentStock}`)
                }
            } else {
                message.reply('Poin kamu tidak cukup untuk melakukan pembelian ini.');
            }
        } else if (!isNaN(items)) {
            const index = parseInt(items, 10) - 1;
            const marketData = SSMarket.val();
            const pokemonKeys = Object.keys(marketData);
        
            if (index >= 0 && index < pokemonKeys.length) {
                const selectedPokemon = marketData[pokemonKeys[index]];
                const pokemonPrice = selectedPokemon.harga;
                const penjual = selectedPokemon.penjual;
                const penjualPoinSnapshot = await PokemonRef.child(penjual).child('point').once('value');
                const penjualPoin = penjualPoinSnapshot.val() || 0;
        
                if (userPoin >= pokemonPrice) {
                    await RefPokemon.child('pokemon').push(selectedPokemon);
                    await MarketRef.child(pokemonKeys[index]).remove();
                    await PokemonRef.child(sanitizedSender).child('point').set(userPoin - pokemonPrice);
                    await PokemonRef.child(penjual).child('point').set(penjualPoin + pokemonPrice);
        
                    message.reply(`Pembelian ${selectedPokemon.namaPokemon} seharga ${pokemonPrice} berhasil! Poin yang tersisa: ${userPoin - pokemonPrice}`);
                } else {
                    message.reply('Poin kamu tidak cukup untuk membeli Pokémon ini.');
                }
            } else {
                message.reply('Index Pokémon yang kamu masukkan tidak valid.');
            }
        } else {
            message.reply('Item yang kamu masukkan tidak valid.');
        }

    } catch (error) {
        console.error(`Error While Buy:`, error);
        message.reply('Gagal Melakukan Pembelian, Silahkan cek kembali Format Buy\n!buy <items> <qty>');
    }
}
