function telephoneCheck(str) {
  let newStr = str.replace(/\s/g, "");
  let decimals = newStr.match(/\d/g);
  if (
    decimals.length === 10 ||
    (decimals.length === 11 && decimals[0] === "1")
  ) {
    if (decimals.length === newStr.length) return true;
    let symbols = newStr.match(/[()-]/g).join("");
    if (symbols === "()-" || symbols === "--") return true;
  }
  return false;
}

console.log(telephoneCheck("1 555 555 5555"));
