function convertToRoman(num) {
  let romStr = "";
  const romans = {
    1000: "M",
    900: "CM",
    500: "D",
    400: "CD",
    100: "C",
    90: "XC",
    50: "L",
    40: "XL",
    10: "X",
    9: "IX",
    5: "V",
    4: "IV",
    1: "I",
  };
  const keys = Object.keys(romans)
    .map((n) => parseInt(n))
    .sort((a, b) => b - a);
  for (let key of keys) {
    while (num >= key) {
      num -= key;
      romStr += romans[key];
    }
  }
  return romStr;
}

convertToRoman(36);
