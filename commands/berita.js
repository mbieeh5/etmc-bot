const axios = require('axios');

exports.module = async (message) => {
    axios.get(`https://api-berita-indonesia.vercel.app/cnn/terbaru/`)
    .then(response => {
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
    })
    .catch(error => {
        console.log(error);
    });
}