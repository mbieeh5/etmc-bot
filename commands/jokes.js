
const jokes = [
    { question: "Huruf apa yang paling kedinginan, Pak?", answer: "Huruf B. Karena berada di tengah-tengah AC" },
    { question: "Buah, buah apa yang paling receh?", answer: "Buah ha ha ha ha ha." },
    { question: "Hewan apa yang hobi telat ke sekolah?", answer: "Kaki seribu. Soalnya kelamaan pakai sepatunya." },
    { question: "Gendang apa yang nggak bisa dipukul?", answer: "Gendang telinga" },
    { question: "Kalau ditutup kelihatan, tapi kalau dibuka malah nggak ada. Apa hayo?", answer: "Pintu rel kereta api." },
    { question: "Buah apa yang pernah menjajah Indonesia?", answer: "Terong Belanda." },
    { question: "Apa bedanya sepatu sama jengkol?", answer: "Kalau sepatu disemir, kalau jengkol disemur." },
    { question: "Kipas apa yang ditunggu-tunggu cewek?", answer: "Kipastian untuk dilamar." },
    { question: "Ayam apa yang nyebelin?", answer: "Ayamnya sudah habis, nasinya masih banyak." },
    { question: "Apa beda antara semut dan orang?", answer: "Orang bisa kesemutan, tetapi semut nggak bisa keorangan." },
    { question: "Kalau hitam dibilang bersih, kalau putih dibilang kotor?", answer: "Papan tulis." },
    { question: "Kuman apa yang paling bersih?", answer: "Kumandi pakai sabun." },
    { question: "Kota apa yang banyak bapak-bapaknya?", answer: "Purwodaddy." },
    { question: "Monyet apa yang senang maju mundur?", answer: "Monyet-trika baju." },
    { question: "Ikan apa yang matanya sangat banyak?", answer: "Ikan teri satu kilo." },
    { question: "Hewan apa yang ternyata bersaudara?", answer: "Katak beradik." },
    { question: "Hewan apa yang kalau diinjek nggak marah?", answer: "Kera mik." },
    { question: "Bundaran HI kalau diputerin dua kali jadi apa, Pak?", answer: "HIHI." },
];

function getRandomJoke() {
  const randomIndex = Math.floor(Math.random() * jokes.length);
  return jokes[randomIndex];
}

module.exports = async () => {
    const jokeToSend = getRandomJoke();
    
    // Kembalikan pertanyaan setelah 3 detik
    await new Promise(resolve => setTimeout(resolve, 0));
    const question = jokeToSend.question;
    
    // Kembalikan jawaban setelah 5 detik lagi
    await new Promise(resolve => setTimeout(resolve, 0));
    const answer = jokeToSend.answer;
    
    // Kembalikan tawa setelah 5 detik lagi
    await new Promise(resolve => setTimeout(resolve, 0));
    const laugh = "XIXIXIXI🤣🤣🤣";
    
    return `${question}\n\n${answer}\n\n${laugh}`;
  };