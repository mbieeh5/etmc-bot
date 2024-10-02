const db = require('../config/config').db;

const pointRef = db.ref('dataPengguna/pengguna');
const Multiply = db.ref('dataData/dataDelay');

module.exports = async (message) => {
  try {
    const sA = message.author;
    const sender = message.from;
    const corection = sA !== undefined ? sA : sender;
    const sanitizedSender = corection.replace(/[\.\@\[\]\#\$]/g, "_");
    const Tag = (message.body).split(' @')[1];

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

    
    if (Tag) {
      // Cek apakah Tag berisikan karakter selain alfanumerik dan underscore
      const tagRegex = /^[a-zA-Z0-9_]+$/;
      
      if (!tagRegex.test(Tag)) {
        return "Tag mengandung karakter tidak valid.";
      }
    
      const validTag = Tag + "_c_us";
      const RefAbsenTag = pointRef.child(validTag).child('absen');
      const RefPointTag = pointRef.child(validTag).child('point');
      const RefRepTag = pointRef.child(validTag).child('reputasi');
      const RefExpTag = pointRef.child(validTag).child('exp');
      
      try {
        // Ambil semua data dari Firebase secara paralel
        const [absenSnapshotT, reputasiSnapshotT, pointSnapshotT, expSnapshotT] = await Promise.all([
          RefAbsenTag.once('value'),
          RefRepTag.once('value'),
          RefPointTag.once('value'),
          RefExpTag.once('value')
        ]);
        
        // Cek apakah snapshot memiliki nilai (tidak null)
        const absenTag = absenSnapshotT.val();
        const reputasiTag = reputasiSnapshotT.val();
        const pointTag = pointSnapshotT.val();
        const expTag = expSnapshotT.val();
        
        
        console.log({Tag, validTag, absenTag});

        // Jika tidak ada data (snapshot kosong), kembalikan pesan bahwa user sudah absen
        if (absenTag === null) {
          return "Dia sudah absen.";
        }
    
        // Cek apakah user belum absen
        if (absen === false) {
          const reputasiT = reputasiTag || 0;
          const minRep = 20;
          const maxRep = 40;
          const randomRep = Math.floor(Math.random() * (maxRep - minRep + 1)) + minRep;
          const repFinal = randomRep * diKali;
          const reputasiAbsen = reputasiT + repFinal;
    
          const pointT = pointTag || 0;
          const minPoint = 300;
          const maxPoint = 600;
          const randomPoint = Math.floor(Math.random() * (maxPoint - minPoint + 1)) + minPoint;
          const PointFinal = randomPoint * diKali;
          const pointAbsen = pointT + PointFinal;
    
          const ExpFinal = 12 * diKali;
          const ExpAbsen = expTag + ExpFinal;
    
          // Menyimpan data ke Firebase
          await Promise.all([
            RefPointTag.set(pointAbsen),
            RefRepTag.set(reputasiAbsen),
            RefAbsenTag.set(true),
            RefExpTag.set(ExpAbsen)
          ]);

          setTimeout(async () => {
            await RefAbsenTag.set(false);
          }, 3 * 60 * 60 * 1000);

          return `Absenin berhasil\npoint: +${PointFinal} x${diKali}.00\nReputasi: +${repFinal} x${diKali}.00\nEXP: +${ExpFinal} x${diKali}`;
        }
    
        return "Dia Sudah absen";
        
      } catch (error) {
        console.error("Error saat mengambil data Firebase:", error);
        return "Terjadi kesalahan saat memproses absen.";
      }
    }
    

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
