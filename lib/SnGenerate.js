function generateSN(length){
    const character = 'AaBbCcDdEeFfGhHjIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789';
    let sn = '';
    for(let i = 0; i < length; i++){
      const randomIndex = Math.floor(Math.random() * character.length);
      sn += character.charAt(randomIndex);
    }
    return sn;
}

module.exports = {
    generateSN
}