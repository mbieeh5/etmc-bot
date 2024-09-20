const { GoogleGenerativeAI} = require('@google/generative-ai');



module.exports = async (message) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const chat = model.startChat({
            history: [
              {
                role: "user",
                parts: [{ text: "Halo" }],
              },
              {
                role: "model",
                parts: [{ text: "Hai Apa yang mau kamu cari tau?" }],
              },
            ],
          });
          let result = await chat.sendMessage(`${(message.body).split('!chat ')}`);
          console.log(result.response.text());

        //console.log(result.response.text());
        return result.response.text();
    } catch (error) {
        console.error('error tanya jawab,', error)
        return 'error saat menjawab pertanyaan!'
    }
}