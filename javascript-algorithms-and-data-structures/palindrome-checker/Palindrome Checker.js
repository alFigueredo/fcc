function palindrome(str) {
  let newStr = str.replace(/[\s-_.:;,()\\/]/g, "").toLowerCase();
  for (let i = 0; i < newStr.length / 2; i++) {
    if (newStr[i] !== newStr[newStr.length - i - 1]) return false;
  }
  return true;
}

palindrome("eye");
palindrome("0_0 (: /- :) 0-0");
