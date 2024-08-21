const { MessageMedia } = require('whatsapp-web.js');

module.exports = async (message) => {
    try {
        // Cek apakah pesan adalah pesan yang dikutip
        const isQuoted = await message.getQuotedMessage();

        if (!isQuoted) {
            return 'Apa kek lah, cape gua!';
        }

        // Fungsi untuk mendapatkan media dari pesan yang dikutip
        const getDatas = async (params) => {
            try {
                const { mimetype, filename, data } = await isQuoted.downloadMedia();
                
                if (params === 'image') {
                    return new MessageMedia(mimetype, data, filename);
                }

                if (params === 'video') {
                    return 'video lah, apalagi. ga ga ada buka buka ga!';
                }

                return null;
            } catch (error) {
                console.error('Error downloading media:', error);
                return null;
            }
        };

        // Cek tipe pesan yang dikutip
        if (isQuoted.type) {
            const media = await getDatas(isQuoted.type);

            if (media) {
                // Kirim media ke pengirim pesan
                return media;
            } else {
                return 'Gagal mendapatkan media.';
            }
        }

    } catch (error) {
        console.error('Error processing message:', error);
        return 'Terjadi kesalahan saat memproses pesan.';
    }
};
