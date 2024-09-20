const db = require('../config/config').db;

const pointRef = db.ref('dataPengguna/pengguna');
const Multiply = db.ref('dataData/dataDelay');

module.exports = async (message) => {
  try {
    const sA = message.author;
    const sender = message.from;
    const corection = sA !== undefined ? sA : sender;
    const sanitizedSender = corection.replace(/[\.\@\[\]\#\$]/g, "_");

    const RefAbsen = pointRef.child(sanitizedSender).child('absen');
    const RefPoint = pointRef.child(sanitizedSender).child('point');
    const RefRep = pointRef.child(sanitizedSender).child('reputasi');
    const RefExp = pointRef.child(sanitizedSender).child('exp');

    // Menggunakan Promise untuk mendapatkan data dari Firebase
    const [absenSnapshot, MultiSnapshot, reputasiSnapshot, pointSnapshot, expSnapshot] = await Promise.all([
      RefAbsen.once('value'),
      Multiply.child('AbsenX').once('value'),
      RefRep.once('value'),
      RefPoint.once('value'),
      RefExp.once('value')
    ]);

    const absen = absenSnapshot.val();
    const Multi = MultiSnapshot.val() || {};
    const diKali = Multi.dikali || 1;
    const exp = expSnapshot.val() || 1;

    if (absen === false) {
      const reputasi = reputasiSnapshot.val() || 0;
      const minRep = 20;
      const maxRep = 40;
      const randomRep = Math.floor(Math.random() * (maxRep - minRep + 1)) + minRep;
      const repFinal = randomRep * diKali;
      const reputasiAbsen = reputasi + repFinal;

      const point = pointSnapshot.val() || 0;
      const minPoint = 300;
      const maxPoint = 600;
      const randomPoint = Math.floor(Math.random() * (maxPoint - minPoint + 1)) + minPoint;
      const PointFinal = randomPoint * diKali;
      const pointAbsen = point + PointFinal;

      const ExpFinal = 12 * diKali;
      const ExpAbsen = exp + ExpFinal;

      // Menyimpan data ke Firebase
      await Promise.all([
        RefPoint.set(pointAbsen),
        RefRep.set(reputasiAbsen),
        RefAbsen.set(true),
        RefExp.set(ExpAbsen)
      ]);
      // Menunggu 3 jam sebelum mengubah status absen
      setTimeout(async () => {
        await RefAbsen.set(false);
      }, 3 * 60 * 60 * 1000);

      return `Absen berhasil\npoint: +${PointFinal} x${diKali}.00\nReputasi: +${repFinal} x${diKali}.00\nEXP: +${ExpFinal} x${diKali}`;

    } else if (absen === true) {
      return 'Kamu sudah absen tadi';
    } else {
        await RefAbsen.set(false);
        return `!absen lagi cuy`;
    }

  } catch (error) {
    console.error('Error while handling absences:', error);
    return 'Terjadi kesalahan saat memproses absensi.';
  }
};
