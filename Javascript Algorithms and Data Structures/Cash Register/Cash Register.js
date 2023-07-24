function checkCashRegister(price, cash, cid) {
  let change = cash - price;
  const currency = {
    PENNY: 0.01,
    NICKEL: 0.05,
    DIME: 0.1,
    QUARTER: 0.25,
    ONE: 1,
    FIVE: 5,
    TEN: 10,
    TWENTY: 20,
    "ONE HUNDRED": 100,
  };
  let changeDue = {};
  for (let i = 0; i < cid.length; i++) {
    let item = cid[cid.length - 1 - i];
    if (change >= currency[item[0]] && item[1] !== 0) {
      changeDue[item[0]] = 0;
      do {
        change -= currency[item[0]];
        changeDue[item[0]] += currency[item[0]];
        change = Math.round(change * 100) / 100;
        changeDue[item[0]] = Math.round(changeDue[item[0]] * 100) / 100;
      } while (change >= currency[item[0]] && item[1] > changeDue[item[0]]);
    }
  }
  if (change !== 0) return { status: "INSUFFICIENT_FUNDS", change: [] };
  for (let i = 0; i < cid.length; i++) {
    let item = cid[cid.length - 1 - i];
    if (
      (item[1] !== 0 && !changeDue[item[0]]) ||
      (changeDue[item[0]] && item[1] !== changeDue[item[0]])
    )
      return {
        status: "OPEN",
        change: Object.entries(changeDue).sort((a, b) => b[1] - a[1]),
      };
  }
  return { status: "CLOSED", change: cid };
}

console.log(
  checkCashRegister(19.5, 20, [
    ["PENNY", 0.5],
    ["NICKEL", 0],
    ["DIME", 0],
    ["QUARTER", 0],
    ["ONE", 0],
    ["FIVE", 0],
    ["TEN", 0],
    ["TWENTY", 0],
    ["ONE HUNDRED", 0],
  ])
);
