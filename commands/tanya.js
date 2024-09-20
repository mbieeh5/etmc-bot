const { GoogleGenerativeAI} = require('@google/generative-ai');



module.exports = async (message) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = (message.body).split("!tanya ");
        const result = await model.generateContent(prompt);

        //console.log(result.response.text());
        return result.response.text();
    } catch (error) {
        console.error('error tanya jawab,', error)
        return 'error saat menjawab pertanyaan!'
    }
}