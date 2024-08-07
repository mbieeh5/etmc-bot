
function calculateEXP(exp) {
    if (exp >= 55000) {
      return 55;
    } else if (exp >= 50000) {
      return 54;
    } else if (exp >= 45000) {
      return 53;
    } else if (exp >= 40000) {
      return 52;
    } else if (exp >= 35000) {
      return 51;
    } else if (exp >= 30000) {
      return 50;
    } else if (exp >= 27000) {
      return 49;
    } else if (exp >= 24000) {
      return 48;
    } else if (exp >= 21000) {
      return 47;
    } else if (exp >= 18000) {
      return 46;
    } else if (exp >= 16000) {
      return 45;
    } else if (exp >= 14000) {
      return 44;
    } else if (exp >= 12000) {
      return 43;
    } else if (exp >= 10000) {
      return 42;
    } else if (exp >= 9000) {
      return 41;
    } else if (exp >= 8000) {
      return 40;
    } else if (exp >= 7000) {
      return 39;
    } else if (exp >= 6000) {
      return 38;
    } else if (exp >= 5000) {
      return 37;
    } else if (exp >= 4500) {
      return 36;
    } else if (exp >= 4000) {
      return 35;
    } else if (exp >= 3500) {
      return 34;
    } else if (exp >= 3000) {
      return 33;
    } else if (exp >= 2500) {
      return 32;
    } else if (exp >= 2000) {
      return 31;
    } else if (exp >= 1750) {
      return 30;
    } else if (exp >= 1500) {
      return 29;
    } else if (exp >= 1250) {
      return 28;
    } else if (exp >= 1000) {
      return 27;
    } else if (exp >= 900) {
      return 26;
    } else if (exp >= 800) {
      return 25;
    } else if (exp >= 700) {
      return 24;
    } else if (exp >= 600) {
      return 23;
    } else if (exp >= 500) {
      return 22;
    } else if (exp >= 450) {
      return 21;
    } else if (exp >= 400) {
      return 20;
    } else if (exp >= 350) {
      return 19;
    } else if (exp >= 300) {
      return 18;
    } else if (exp >= 250) {
      return 17;
    } else if (exp >= 200) {
      return 16;
    } else if (exp >= 175) {
      return 15;
    } else if (exp >= 150) {
      return 14;
    } else if (exp >= 125) {
      return 13;
    } else if (exp >= 100) {
      return 12;
    } else if (exp >= 90) {
      return 11;
    } else if (exp >= 80) {
      return 10;
    } else if (exp >= 70) {
      return 9;
    } else if (exp >= 60) {
      return 8;
    } else if (exp >= 50) {
      return 7;
    } else if (exp >= 40) {
      return 6;
    } else if (exp >= 30) {
      return 5;
    } else if (exp >= 20) {
      return 4;
    } else if (exp >= 10) {
      return 3;
    } else if (exp >= 0) {
      return 2;
    } else {
      return 1;
    }
  };

exports.module = {
    calculateEXP : calculateEXP(exp)
}