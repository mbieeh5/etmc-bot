
module.exports = async (message) => {
    try {
        const RandomNumber = Math.floor(Math.random() * 100);
        return `Moodmu : ${RandomNumber}%`
    } catch (error) {
        return 'Error While Fetching Your Mood\n You So Random';
    }
}