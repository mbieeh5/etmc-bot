const userMessages = new Map();

const isSpamMessage = (sender, message) => {
  const timeLimit = 5000; // 5 detik waktu limit antar pesan
  const maxRepeatedMessages = 3; // Batas pengulangan pesan yang sama

  if (!userMessages.has(sender)) {
    userMessages.set(sender, { message, count: 1, lastMessageTime: Date.now() });
    return false;
  }

  const userData = userMessages.get(sender);
  const currentTime = Date.now();

  if (userData.message === message && currentTime - userData.lastMessageTime < timeLimit) {
    userData.count += 1;
    userData.lastMessageTime = currentTime;

    // Jika pesan sudah berulang lebih dari batas yang ditentukan
    if (userData.count >= maxRepeatedMessages) {
      return true; // Deteksi sebagai spam
    }
  } else {
    userMessages.set(sender, { message, count: 1, lastMessageTime: currentTime });
  }

  return false;
};

const isRandomCharacters = (message) => {
  const randomCharPattern = /^[a-z]{10,}$/i; // Pola untuk mendeteksi karakter acak panjang
  return randomCharPattern.test(message);
};

// Function untuk mencegah spam
const preventSpam = (sender, message) => {
  if (isSpamMessage(sender, message) || isRandomCharacters(message)) {
    console.log("Spam detected, exp/point/reputation will not be updated.");
    return true;
  }
  return false;
};

module.exports = {
    preventSpam,
}