function rot13(str) {
  let newStr = "";
  for (let letter of str) {
    let charCode = letter.charCodeAt();
    if (charCode >= 65 && charCode <= 90) {
      charCode -= 13;
      if (charCode < 65) charCode += 26;
    }
    newStr += String.fromCharCode(charCode);
  }
  return newStr;
}

rot13("SERR PBQR PNZC");
