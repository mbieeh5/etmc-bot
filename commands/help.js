const commands = [
{ p: '!berita', label: 'Berita Terkini' },
{ p: '!cuaca', label: 'Info Cuaca' },
{ p: '!doa', label: 'Doa Harian' },
{ p: '!info <cuaca/mabar>', label: 'Cek info cuaca dan info mabar' },
{ p: '!kirim <Tag orangnya>', label: 'Kirim Point ke Teman' },
{ p: '!mabar <pesan mabar apa game apa kapan>', label: 'Tambah info mabar' },
{ p: '!nama <isi nama kalian>', label: 'isi namamu di grub ini!' },
{ p: '!quotes', label: 'Apa Quotes Untuk mu?' },
{ p: '!rate', label: 'Cek Rate 1USD = Rp xx.xxx' },
{ p: '!rank', label: 'Cek peringkat tertinggi' },
{ p: '!rank point', label: 'Cek Point terbanyak' },
{ p: '!rules', label: 'Aturan' },
{ p: '!stat', label: 'Cek Point, Reputasi & status' },
{ p: '!ribut <tag yang mau di ajak ribut>', label: 'Kalo ada masalah ributnya pake ini ya' },
{ p: '-- *GAMES* --', label: '-- *GAMES* --' },
{ p: '!togel <masukan 4 digit angka>', label: 'Main Togel ngebid 5.000Point kalo menang dapet 50.000Point' },
{ p: '!slot', label: 'Main Slot bayar 2.500Point kalo menang dapet 10.000Point' },
{ p: 'apakah <pertanyaanmu>', label: 'tanyakan bot dengan apakah... maka bot akan menjawab iya atau tidak' },
{ p: '!pap', label: 'ngirim pap jahat' },
{ p: '!catch', label: 'Tangkap Pokemon' },
{ p: '!pokeball', label: 'nyari pokeballs' },
{ p: '!cektas', label: 'cek inventory kalian' },
{ p: '!cekgacoan <tag orangnya>', label: 'ngecek gacoan lawan lu, biar ada gambaran' },
{ p: '!sell <angka pokemon yang tertera pada !pokedex> <harga jual>', label: 'jual pokemon mu ke market' },
{ p: '!buy <pokeball/pokemon> <jumlah pokeball/angka yang tertera di market>', label: 'beli pokemon dari market' },
{ p: '!market', label: 'cek market list pokemon' },
{ p: '!pokedex', label: 'cek list pokemon yang udah kalian dapat' },
{ p: '!setgacoan <angka yang tertera pada !pokedex>', label: 'set gacoan pokemon mu dan ngadu dengan teman mu' },
{ p: '!fight <tag orangnya>', label: 'ajak temen kalian berantem pokemon, yg menang dapet 100reputasi' },
{ p: '!redeem <Masukin nomer hp>', label: 'Redeem 102.500Point ke Pulsa All Operator Rp 10.000' },
];
module.exports = async (message) => {
    let menuText = '*ETMC-BOT nih boss* \n\n';
    commands.forEach((command, index) => {
        menuText += `${index + 1}. ${command.p} - ${command.label}\n`;
    });
    menuText += '\nBaru ada Command Ini Doang ni\nMade By : W0lV\nMaintenance By : W0lV & ETMC';
    return menuText;
}