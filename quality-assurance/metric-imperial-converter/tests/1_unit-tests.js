const chai = require("chai");
let assert = chai.assert;
const ConvertHandler = require("../controllers/convertHandler.js");

let convertHandler = new ConvertHandler();

suite("Unit Tests", function () {
  suite("Function convertHandler.getNum(input)", () => {
    test("convertHandler should correctly read a whole number input", () => {
      assert.strictEqual(convertHandler.getNum("4gal"), 4);
    });
    test("convertHandler should correctly read a decimal number input", () => {
      assert.strictEqual(convertHandler.getNum("0.5mi"), 0.5);
    });
    test("convertHandler should correctly read a fractional input", () => {
      assert.strictEqual(convertHandler.getNum("1/2km"), 0.5);
    });
    test("convertHandler should correctly read a fractional input with a decimal", () => {
      assert.strictEqual(convertHandler.getNum("5.4/3lbs"), 1.8);
    });
    test("convertHandler should correctly return an error on a double-fraction", () => {
      assert.strictEqual(convertHandler.getNum("3/2/3lbs"), "invalid number");
    });
    test("convertHandler should correctly default to a numerical input of 1 when no numerical input is provided", () => {
      assert.strictEqual(convertHandler.getNum("kg"), 1);
    });
  });

  suite("Function convertHandler.getUnit(input)", () => {
    test("convertHandler should correctly read each valid input unit", () => {
      assert.strictEqual(convertHandler.getUnit("4gal"), "gal");
      assert.strictEqual(convertHandler.getUnit("4l"), "L");
      assert.strictEqual(convertHandler.getUnit("1/2km"), "km");
      assert.strictEqual(convertHandler.getUnit("0.5mi"), "mi");
      assert.strictEqual(convertHandler.getUnit("5.4/3lbs"), "lbs");
      assert.strictEqual(convertHandler.getUnit("Kg"), "kg");
    });
    test("convertHandler should correctly return an error for an invalid input unit", () => {
      assert.strictEqual(convertHandler.getUnit("4gals"), "invalid unit");
      assert.strictEqual(convertHandler.getUnit("1/2lb"), "invalid unit");
      assert.strictEqual(convertHandler.getUnit("k"), "invalid unit");
    });
  });

  suite("Function convertHandler.getReturnUnit(initUnit)", () => {
    test("convertHandler should return the correct return unit for each valid input unit", () => {
      assert.strictEqual(convertHandler.getReturnUnit("gal"), "L");
      assert.strictEqual(convertHandler.getReturnUnit("L"), "gal");
      assert.strictEqual(convertHandler.getReturnUnit("km"), "mi");
      assert.strictEqual(convertHandler.getReturnUnit("mi"), "km");
      assert.strictEqual(convertHandler.getReturnUnit("lbs"), "kg");
      assert.strictEqual(convertHandler.getReturnUnit("kg"), "lbs");
    });
  });

  suite("Function convertHandler.spellOutUnit(unit)", () => {
    test("convertHandler should correctly return the spelled-out string unit for each valid input unit", () => {
      assert.strictEqual(convertHandler.spellOutUnit("gal"), "gallons");
      assert.strictEqual(convertHandler.spellOutUnit("L"), "liters");
      assert.strictEqual(convertHandler.spellOutUnit("km"), "kilometers");
      assert.strictEqual(convertHandler.spellOutUnit("mi"), "miles");
      assert.strictEqual(convertHandler.spellOutUnit("lbs"), "pounds");
      assert.strictEqual(convertHandler.spellOutUnit("kg"), "kilograms");
    });
  });

  suite("Function conventHandler.convert(num, unit)", () => {
    test("convertHandler should correctly convert gal to L", () => {
      assert.strictEqual(convertHandler.convert(4, "gal"), 15.14164);
    });
    test("convertHandler should correctly convert L to gal", () => {
      assert.strictEqual(convertHandler.convert(4, "L"), 1.05669);
    });
    test("convertHandler should correctly convert mi to km", () => {
      assert.strictEqual(convertHandler.convert(0.5, "mi"), 0.80467);
    });
    test("convertHandler should correctly convert km to mi", () => {
      assert.strictEqual(convertHandler.convert(1 / 2, "km"), 0.31069);
    });
    test("convertHandler should correctly convert lbs to kg", () => {
      assert.strictEqual(convertHandler.convert(5.4 / 3, "lbs"), 0.81647);
    });
    test("convertHandler should correctly convert kg to lbs", () => {
      assert.strictEqual(convertHandler.convert(1, "kg"), 2.20462);
    });
  });
});
