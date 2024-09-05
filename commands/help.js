const commands = [
{ p: '!berita', label: 'Berita Terkini' },
{ p: '!cuaca', label: 'Info Cuaca (Under Develop)' },
{ p: '!doa', label: 'Doa Harian' },
{ p: '!absen', label: 'Absen buat nambah point reputasi dan exp' },
{ p: '!kirim <Tag orangnya> <nominal>', label: 'Kirim Point ke Teman' },
{ p: '!nama <isi nama kalian>', label: 'isi namamu di grub ini!' },
{ p: '!quotes', label: 'Apa Quotes Untuk mu?' },
{ p: '!rate', label: 'Cek Rate 1USD = Rp xx.xxx' },
{ p: '!rank', label: 'Cek peringkat tertinggi (Under Develop)' },
{ p: '!rank point', label: 'Cek Point terbanyak (Under Develop)' },
{ p: '!rules', label: 'Aturan' },
{ p: '!stat', label: 'Cek Point, Reputasi & status' },
{ p: '!ribut <tag yang mau di ajak ribut>', label: 'Kalo ada masalah ributnya pake ini ya' },
{ p: '-- *GAMES* --', label: '-- *GAMES* --' },
{ p: '!togel <masukan 4 digit angka>', label: 'Main Togel ngebid 5.000Point kalo menang dapet 50.000Point' },
{ p: '!slot', label: 'Main Slot bayar 2.500Point kalo menang dapet 10.000Point' },
{ p: '!pap', label: 'ngirim pap jahat tapi bayar 50K Point sama minimal lvl 5 di !stat' },
{ p: '!catch', label: 'Tangkap Pokemon' },
{ p: '!catch greatball/ultraball/masterballs', label: 'Tangkap Pokemon' },
{ p: '!pokeball', label: 'nyari pokeballs & potion, ada chance buat dapet elixir/ultraball/masterball/training ticket' },
{ p: '!cektas', label: 'cek inventory kalian' },
{ p: '!cekgacoan <tag orangnya>', label: 'ngecek gacoan lawan lu, biar ada gambaran' },
{ p: '!training', label: 'use 1 training ticket untuk melatik gacoanmu' },
{ p: '!cekgacoan', label: 'ngecek gacoan lu sendiri' },
{ p: '!sell <angka pokemon yang tertera pada !pokedex> <harga jual>', label: 'jual pokemon mu ke market' },
{ p: '!buy <pokeball/elixir/potion> <jumlah itemsnya>', label: 'beli items dari !shop' },
{ p: '!buy <nomor pokemonnya>', label: 'beli pokemon dari !shop' },
{ p: '!shop', label: 'cek market list pokemon' },
{ p: '!pokedex', label: 'cek list pokemon yang udah kalian dapat' },
{ p: '!dismiss <angka yang tertera pada !pokedex>', label: 'melepaskan kembali pokemon mu ke alam liar' },
{ p: '!lepasgacoan', label: 'menyimpan gacoanmu ke pokedex' },
{ p: '!setgacoan <angka yang tertera pada !pokedex>', label: 'set gacoan pokemon mu dan ngadu dengan teman mu' },
{ p: '!fight <tag orangnya>', label: 'ajak temen kalian berantem pokemon, yg menang dapet 100reputasi' },
{ p: '!fight', label: 'Pokemon mu VS Bot, udah gitu aja' },
{ p: '!redeem <Masukin kode redeemnya>', label: 'mendapatkan hadiah dari kode redeem' },
];
module.exports = async (message) => {
    let menuText = '*ETMC-BOT nih boss*\n\n';
    commands.forEach((command, index) => {
        menuText += `${index + 1}. ${command.p} - ${command.label}\n`;
    });
    menuText += '\nBaru ada Command Ini Doang ni\nMade By : W0lV\nMaintenance By : W0lV & ETMC';
    return menuText;
}