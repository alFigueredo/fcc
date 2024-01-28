const checkDivision = (numStr) => {
  const nums = numStr.split("/");
  return nums.length === 2 ? makeDivision(nums) : "invalid number";
};

const makeDivision = (nums) => {
  const numbers = nums.map(Number) || ["invalid number"];
  if (!numbers[1] || isNaN(numbers[0])) return "invalid number";
  return numbers[0] / numbers[1];
};

function ConvertHandler() {
  this.getNum = function (input) {
    const numStr = (input.match(/[.\d\/]+/g) || ["1"])[0];
    return numStr.includes("/")
      ? checkDivision(numStr)
      : Number(numStr) || "invalid number";
  };

  this.getUnit = function (input) {
    const unitMap = ["gal", "l", "lbs", "kg", "mi", "km"];
    const unit = (input.match(/[a-zA-Z]+/g) || [""])[0].toLowerCase();
    return unit === "l" ? "L" : unitMap.includes(unit) ? unit : "invalid unit";
  };

  this.getReturnUnit = function (initUnit) {
    const unitMap = {
      gal: "L",
      L: "gal",
      mi: "km",
      km: "mi",
      lbs: "kg",
      kg: "lbs",
    };
    return unitMap[initUnit];
  };

  this.spellOutUnit = function (unit) {
    const unitMap = {
      gal: "gallons",
      L: "liters",
      mi: "miles",
      km: "kilometers",
      lbs: "pounds",
      kg: "kilograms",
    };
    return unitMap[unit];
  };

  this.convert = function (initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    const unitMap = {
      gal: galToL,
      L: 1 / galToL,
      mi: miToKm,
      km: 1 / miToKm,
      lbs: lbsToKg,
      kg: 1 / lbsToKg,
    };
    return Math.round(initNum * unitMap[initUnit] * 10e4) / 10e4;
  };

  this.getString = function (initNum, initUnit, returnNum, returnUnit) {
    return `${initNum} ${this.spellOutUnit(
      initUnit
    )} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`;
  };
}

module.exports = ConvertHandler;
