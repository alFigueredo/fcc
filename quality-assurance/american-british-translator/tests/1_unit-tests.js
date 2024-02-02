const chai = require("chai");
const assert = chai.assert;

const Translator = require("../components/translator.js");
const translator = new Translator();

suite("Unit Tests", function () {
  suite("American to British", () => {
    test("Mangoes are my favorite fruit.", (done) => {
      const translation = translator.translate(
        "Mangoes are my favorite fruit.",
        "american-to-british"
      );
      assert.isString(translation);
      assert.include(translation, "favourite");
      done();
    });
    test("I ate yogurt for breakfast.", (done) => {
      const translation = translator.translate(
        "I ate yogurt for breakfast.",
        "american-to-british"
      );
      assert.isString(translation);
      assert.include(translation, "yoghurt");
      done();
    });
    test("We had a party at my friend's condo.", (done) => {
      const translation = translator.translate(
        "We had a party at my friend's condo.",
        "american-to-british"
      );
      assert.isString(translation);
      assert.include(translation, "flat");
      done();
    });
    test("Can you toss this in the trashcan for me?", (done) => {
      const translation = translator.translate(
        "Can you toss this in the trashcan for me?",
        "american-to-british"
      );
      assert.isString(translation);
      assert.include(translation, "bin");
      done();
    });
    test("The parking lot was full.", (done) => {
      const translation = translator.translate(
        "The parking lot was full.",
        "american-to-british"
      );
      assert.isString(translation);
      assert.include(translation, "car park");
      done();
    });
    test("Like a high tech Rube Goldberg machine.", (done) => {
      const translation = translator.translate(
        "Like a high tech Rube Goldberg machine.",
        "american-to-british"
      );
      assert.isString(translation);
      assert.include(translation, "Heath Robinson device");
      done();
    });
    test("To play hooky means to skip class or work.", (done) => {
      const translation = translator.translate(
        "To play hooky means to skip class or work.",
        "american-to-british"
      );
      assert.isString(translation);
      assert.include(translation, "bunk off");
      done();
    });
    test("No Mr. Bond, I expect you to die.", (done) => {
      const translation = translator.translate(
        "No Mr. Bond, I expect you to die.",
        "american-to-british"
      );
      assert.isString(translation);
      assert.include(translation, "Mr");
      done();
    });
    test("Dr. Grosh will see you now.", (done) => {
      const translation = translator.translate(
        "Dr. Grosh will see you now.",
        "american-to-british"
      );
      assert.isString(translation);
      assert.include(translation, "Dr");
      done();
    });
    test("Lunch is at 12:15 today.", (done) => {
      const translation = translator.translate(
        "Lunch is at 12:15 today.",
        "american-to-british"
      );
      assert.isString(translation);
      assert.include(translation, "12.15");
      done();
    });
  });
  suite("British to American", () => {
    test("We watched the footie match for a while.", (done) => {
      const translation = translator.translate(
        "We watched the footie match for a while.",
        "british-to-american"
      );
      assert.isString(translation);
      assert.include(translation, "soccer");
      done();
    });
    test("Paracetamol takes up to an hour to work.", (done) => {
      const translation = translator.translate(
        "Paracetamol takes up to an hour to work.",
        "british-to-american"
      );
      assert.isString(translation);
      assert.include(translation, "Tylenol");
      done();
    });
    test("First, caramelise the onions.", (done) => {
      const translation = translator.translate(
        "First, caramelise the onions.",
        "british-to-american"
      );
      assert.isString(translation);
      assert.include(translation, "caramelize");
      done();
    });
    test("I spent the bank holiday at the funfair.", (done) => {
      const translation = translator.translate(
        "I spent the bank holiday at the funfair.",
        "british-to-american"
      );
      assert.isString(translation);
      assert.include(translation, "public holiday");
      done();
    });
    test("I had a bicky then went to the chippy.", (done) => {
      const translation = translator.translate(
        "I had a bicky then went to the chippy.",
        "british-to-american"
      );
      assert.isString(translation);
      assert.include(translation, "cookie");
      done();
    });
    test("I've just got bits and bobs in my bum bag.", (done) => {
      const translation = translator.translate(
        "I've just got bits and bobs in my bum bag.",
        "british-to-american"
      );
      assert.isString(translation);
      assert.include(translation, "odds and ends");
      done();
    });
    test("The car boot sale at Boxted Airfield was called off.", (done) => {
      const translation = translator.translate(
        "The car boot sale at Boxted Airfield was called off.",
        "british-to-american"
      );
      assert.isString(translation);
      assert.include(translation, "swap meet");
      done();
    });
    test("Have you met Mrs Kalyani?", (done) => {
      const translation = translator.translate(
        "Have you met Mrs Kalyani?",
        "british-to-american"
      );
      assert.isString(translation);
      assert.include(translation, "Mrs.");
      done();
    });
    test("Prof Joyner of King's College, London.", (done) => {
      const translation = translator.translate(
        "Prof Joyner of King's College, London.",
        "british-to-american"
      );
      assert.isString(translation);
      assert.include(translation, "Prof.");
      done();
    });
    test("Tea time is usually around 4 or 4.30.", (done) => {
      const translation = translator.translate(
        "Tea time is usually around 4 or 4.30.",
        "british-to-american"
      );
      assert.isString(translation);
      assert.include(translation, "4:30");
      done();
    });
  });
  suite("Highlight translation", () => {
    test("Mangoes are my favorite fruit.", (done) => {
      const translation = translator.translate(
        "Mangoes are my favorite fruit.",
        "american-to-british"
      );
      assert.isString(translation);
      assert.include(translation, '<span class="highlight">favourite</span>');
      done();
    });
    test("I ate yogurt for breakfast.", (done) => {
      const translation = translator.translate(
        "I ate yogurt for breakfast.",
        "american-to-british"
      );
      assert.isString(translation);
      assert.include(translation, '<span class="highlight">yoghurt</span>');
      done();
    });
    test("We watched the footie match for a while.", (done) => {
      const translation = translator.translate(
        "We watched the footie match for a while.",
        "british-to-american"
      );
      assert.isString(translation);
      assert.include(translation, '<span class="highlight">soccer</span>');
      done();
    });
    test("Paracetamol takes up to an hour to work.", (done) => {
      const translation = translator.translate(
        "Paracetamol takes up to an hour to work.",
        "british-to-american"
      );
      assert.isString(translation);
      assert.include(translation, '<span class="highlight">Tylenol</span>');
      done();
    });
  });
});
