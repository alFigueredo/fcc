const americanOnly = require("./american-only.js");
const americanToBritishSpelling = require("./american-to-british-spelling.js");
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require("./british-only.js");

class Translator {
  translate(text, locale) {
    const translate = {
      "american-to-british": {
        word: Object.assign(
          {},
          americanOnly,
          americanToBritishSpelling,
          americanToBritishTitles
        ),
        time: /(\d{1,2}):(\w{1,2})/gi,
        replace: '<span class="highlight">$1.$2</span>',
      },
      "british-to-american": {
        word: Object.assign(
          {},
          britishOnly,
          this.inverse(americanToBritishSpelling),
          this.inverse(americanToBritishTitles)
        ),
        time: /(\d{1,2})\.(\w{1,2})/gi,
        replace: '<span class="highlight">$1:$2</span>',
      },
    }[locale];
    const translation = this.replacer(text, translate);
    return translation.charAt(0).toUpperCase() + translation.slice(1);
  }

  inverse(object) {
    return Object.fromEntries(
      Object.entries(object).map(([key, value]) => [value, key])
    );
  }

  replacer(text, translate) {
    const timeText = text.replace(translate.time, translate.replace);
    const matches = [];
    for (const key of Object.keys(translate.word)) {
      const partialString = { text: timeText, partialIndex: 0 };
      while (partialString.text.toLowerCase().includes(key)) {
        const index =
          partialString.text.toLowerCase().indexOf(key) +
          partialString.partialIndex;
        matches.push({ key, start: index, end: index + key.length });
        partialString.text = partialString.text.slice(index + 1);
        partialString.partialIndex = index + 1;
      }
    }
    for (let i = 0; i < matches.length && matches.length > 1; i++) {
      const property = matches[i];
      const array = [...matches.slice(0, i), ...matches.slice(i + 1)];
      for (const word of array) {
        if (
          word.key.includes(property.key) &&
          (property.start === word.start ||
            property.end === word.end ||
            (property.start > word.start && property.end < word.end))
        ) {
          matches.splice(i, 1);
          i--;
          break;
        }
      }
    }
    let translation = timeText;
    let spare = 0;
    for (const match of matches) {
      const key = match.key;
      const start = match.start + spare;
      const end = match.end + spare;
      const isTitle =
        key in americanToBritishTitles ||
        key in this.inverse(americanToBritishTitles);
      const word = isTitle
        ? translate.word[key].charAt(0).toUpperCase() +
          translate.word[key].slice(1)
        : translate.word[key];
      spare +=
        word.length - (end - start) + '<span class="highlight"></span>'.length;
      translation =
        translation.slice(0, start) +
        `<span class="highlight">${word}</span>` +
        translation.slice(end);
    }
    return translation;
  }
}

module.exports = Translator;
