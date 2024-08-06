const { db, client } = require('../config/config');

// Update stok pada interval tertentu
function UpdateStock() {
    const DataData = db.ref('dataData');
    DataData.child('delay').child('elixir').once('value', async (snapshot) => {
        const SElixir = snapshot.val().stock || 0;
        DataData.child('delay').child('greatballs').once('value', async (snapshot) => {
            const SGreatballs = snapshot.val().stock || 0;
            DataData.child('delay').child('masterball').once('value', async (snapshot) => {
                const SMasterball = snapshot.val().stock || 0;
                DataData.child('delay').child('pokeballs').once('value', async (snapshot) => {
                    const SPokeballs = snapshot.val().stock || 0;
                    DataData.child('delay').child('potion').once('value', async (snapshot) => {
                        const SPotion = snapshot.val().stock || 0;
                        DataData.child('delay').child('trainingTicket').once('value', async (snapshot) => {
                            const STrainingTicket = snapshot.val().stock || 0;
                            DataData.child('delay').child('ultraball').once('value', async (snapshot) => {
                                const SUltraball = snapshot.val().stock || 0;

                                DataData.child('delay').child('elixir').update({ stock: SElixir + 10 });
                                DataData.child('delay').child('greatballs').update({ stock: SGreatballs + 10 });
                                DataData.child('delay').child('masterball').update({ stock: SMasterball + 10 });
                                DataData.child('delay').child('pokeballs').update({ stock: SPokeballs + 10 });
                                DataData.child('delay').child('potion').update({ stock: SPotion + 10 });
                                DataData.child('delay').child('trainingTicket').update({ stock: STrainingTicket + 10 });
                                DataData.child('delay').child('ultraball').update({ stock: SUltraball + 10 });

                                setTimeout(() => {
                                    const dataBarang = `Elixir : ${SElixir}\nPotion : ${SPotion}\nTraining Ticket : ${STrainingTicket}\nPokeballs : ${SPokeballs}\nGreatballs : ${SGreatballs}\nUltraballs : ${SUltraball}\nMasterballs : ${SMasterball}\nBelanjanya di => https://www.rraf-project.site/shopping/pokemon`;
                                    client.sendMessage(`${process.env.GROUP_1}`, `Barang Telah Restock\n${dataBarang}`);
                                }, 3000);
                            });
                        });
                    });
                });
            });
        });
    });
}

// Set interval untuk memperbarui stok setiap 12 jam
const twelveHoursInMillis = 12 * 60 * 60 * 1000;
UpdateStock(); // Panggilan pertama untuk memperbarui stok
setInterval(UpdateStock, twelveHoursInMillis);

module.exports = {
    UpdateStock
};
