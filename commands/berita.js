const axios = require('axios');

module.exports = async (message) => {
    try {
        const response = await axios.get('https://api-berita-indonesia.vercel.app/cnn/terbaru/');
        const resp = response.data;
        const posts = resp.data.posts.slice();
        const randomIndex = Math.floor(Math.random() * posts.length);
        const randomData = posts[randomIndex];
        const timestamp = randomData.pubDate;
        const date = new Date(timestamp);
        const hours = date.getUTCHours().toString().padStart(2, "0");
        const minutes = date.getUTCMinutes().toString().padStart(2, "0");
        const day = date.getUTCDate().toString().padStart(2, "0");
        const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
        const year = date.getUTCFullYear();
        const formattedDate = `${hours}:${minutes}, ${day}/${month}/${year}`;
        return `*${randomData.title}* \nTanggal: ${formattedDate}. \n\n${randomData.description} \n\nBacaSelengkapnya : ${randomData.link}`;
    } catch (error) {
        console.error('Error fetching news:', error);
        return 'Maaf, terjadi kesalahan saat mengambil berita.';
    }
};
