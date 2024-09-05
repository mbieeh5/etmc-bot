const { db } = require('../config/config');

const PokemonRef = db.ref('dataPengguna/pengguna');

module.exports = async (message) => {
  try {
    const param1 = message.body.split(' ')[1];
    const sanitizedSender = (message.author || message.from).replace(/[\.\@\[\]\#\$]/g, "_");

    let RefGacoan;
    if (param1) {
      const RefGacoanUser = param1.replace(/@/g, '') + '_c_us';
      RefGacoan = PokemonRef.child(RefGacoanUser).child('pokemon').child('gacoan');
    } else {
      RefGacoan = PokemonRef.child(sanitizedSender).child('pokemon').child('gacoan');
    }

    const snapshot = await RefGacoan.once('value');
    const gacoan = snapshot.val();

    if (gacoan) {
      const { namaPokemon, HP, ATTACK, DEFENSE, SPEED, LVL, EXP, TYPE } = gacoan;
      await message.reply(
        `Gacoan ${param1 ? 'Dia' : 'lu'} ni:\n` +
        `Nama: ${namaPokemon}\n` +
        `Level: ${LVL}\n` +
        `HP: ${HP}\n` +
        `Attack: ${ATTACK}\n` +
        `Defense: ${DEFENSE}\n` +
        `Speed: ${SPEED}\n` +
        `Type: ${TYPE}\n` +
        `EXP: ${EXP}`
      );
    } else {
      await message.reply(`${param1 ? 'Dia' : 'Lu'} belom ada gacoan anjay.`);
    }
  } catch (error) {
    console.error(error);
    await message.reply('Terjadi kesalahan saat mengambil data gacoan.');
  }
};
