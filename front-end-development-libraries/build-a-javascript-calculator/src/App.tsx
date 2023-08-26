import { useState } from "react";
import "./App.css";

function App() {
  const [answer, setAnswer] = useState("0");
  const [expression, setExpression] = useState("");
  const et = expression.trim();

  enum Keys {
    CLEAR,
    NEGATIVE,
    PERCENTAGE,
    DIVIDE,
    SEVEN,
    EIGHT,
    NINE,
    MULTIPLY,
    FOUR,
    FIVE,
    SIX,
    SUBTRACT,
    ONE,
    TWO,
    THREE,
    ADD,
    ZERO,
    DECIMAL,
    EQUALS,
  }

  const buttonPress = (symbol: Keys) => {
    switch (symbol) {
      case Keys.CLEAR:
        setAnswer("");
        setExpression("0");
        break;
      case Keys.NEGATIVE:
        if (answer === "") return;
        setAnswer(
          answer.toString().charAt(0) === "-" ? answer.slice(1) : "-" + answer
        );
        break;
      case Keys.PERCENTAGE:
        if (answer === "") return;
        setAnswer((parseFloat(answer) / 100).toString());
        break;
      case Keys.DIVIDE:
        setExpression(et + " / ");
        break;
      case Keys.MULTIPLY:
        setExpression(et + " * ");
        break;
      case Keys.SUBTRACT:
        setExpression(et + " - ");
        break;
      case Keys.ADD:
        setExpression(et + " + ");
        break;
      case Keys.EQUALS:
        calculate();
        break;
      case Keys.ZERO:
        if (expression.charAt(0) !== "0") setExpression(expression + "0");
        break;
      case Keys.DECIMAL:
        const lastNumber = expression.split(/[-+/*]/g).pop();
        if (lastNumber?.includes(".")) return;
        setExpression(expression + ".");
        break;
      case Keys.NINE:
        setExpression(
          (expression.charAt(0) === "0" ? expression.slice(1) : expression) +
            "9"
        );
        break;
      case Keys.EIGHT:
        setExpression(
          (expression.charAt(0) === "0" ? expression.slice(1) : expression) +
            "8"
        );
        break;
      case Keys.SEVEN:
        setExpression(
          (expression.charAt(0) === "0" ? expression.slice(1) : expression) +
            "7"
        );
        break;
      case Keys.SIX:
        setExpression(
          (expression.charAt(0) === "0" ? expression.slice(1) : expression) +
            "6"
        );
        break;
      case Keys.FIVE:
        setExpression(
          (expression.charAt(0) === "0" ? expression.slice(1) : expression) +
            "5"
        );
        break;
      case Keys.FOUR:
        setExpression(
          (expression.charAt(0) === "0" ? expression.slice(1) : expression) +
            "4"
        );
        break;
      case Keys.THREE:
        setExpression(
          (expression.charAt(0) === "0" ? expression.slice(1) : expression) +
            "3"
        );
        break;
      case Keys.TWO:
        setExpression(
          (expression.charAt(0) === "0" ? expression.slice(1) : expression) +
            "2"
        );
        break;
      case Keys.ONE:
        setExpression(
          (expression.charAt(0) === "0" ? expression.slice(1) : expression) +
            "1"
        );
        break;
    }
  };

  const calculate = () => {
    if (["+", "-", "*", "/"].includes(et.charAt(et.length - 1))) return;
    const parts = et.split(" ");
    const newParts = [];
    for (let i = parts.length - 1; i >= 0; i--) {
      if (
        ["*", "/", "+"].includes(parts[i]) &&
        ["+", "-", "*", "/"].includes(parts[i - 1])
      ) {
        newParts.unshift(parts[i]);
        while (["+", "-", "*", "/"].includes(parts[i - 1])) i--;
      } else newParts.unshift(parts[i]);
    }
    const newExpression = newParts.join("");
    if (["+", "-", "*", "/"].includes(newExpression.charAt(0)))
      setAnswer(eval(answer + newExpression) as string);
    else setAnswer(eval(newExpression) as string);
    setExpression("");
  };

  return (
    <>
      <div className="container">
        <h1>Calculator Application</h1>
        <div id="calculator">
          <div id="display" style={{ textAlign: "right" }}>
            <div id="answer">{answer}</div>
            <div id="expression">{expression}</div>
          </div>
          <button
            id="clear"
            className="light-gray"
            onClick={() => buttonPress(Keys.CLEAR)}
          >
            C
          </button>
          <button
            id="negative"
            className="light-gray"
            onClick={() => buttonPress(Keys.NEGATIVE)}
          >
            +/-
          </button>
          <button
            id="percentage"
            className="light-gray"
            onClick={() => buttonPress(Keys.PERCENTAGE)}
          >
            %
          </button>
          <button
            id="divide"
            className="yellow"
            onClick={() => buttonPress(Keys.DIVIDE)}
          >
            /
          </button>
          <button
            id="seven"
            className="dark-gray"
            onClick={() => buttonPress(Keys.SEVEN)}
          >
            7
          </button>
          <button
            id="eight"
            className="dark-gray"
            onClick={() => buttonPress(Keys.EIGHT)}
          >
            8
          </button>
          <button
            id="nine"
            className="dark-gray"
            onClick={() => buttonPress(Keys.NINE)}
          >
            9
          </button>
          <button
            id="multiply"
            className="yellow"
            onClick={() => buttonPress(Keys.MULTIPLY)}
          >
            *
          </button>
          <button
            id="four"
            className="dark-gray"
            onClick={() => buttonPress(Keys.FOUR)}
          >
            4
          </button>
          <button
            id="five"
            className="dark-gray"
            onClick={() => buttonPress(Keys.FIVE)}
          >
            5
          </button>
          <button
            id="six"
            className="dark-gray"
            onClick={() => buttonPress(Keys.SIX)}
          >
            6
          </button>
          <button
            id="subtract"
            className="yellow"
            onClick={() => buttonPress(Keys.SUBTRACT)}
          >
            -
          </button>
          <button
            id="one"
            className="dark-gray"
            onClick={() => buttonPress(Keys.ONE)}
          >
            1
          </button>
          <button
            id="two"
            className="dark-gray"
            onClick={() => buttonPress(Keys.TWO)}
          >
            2
          </button>
          <button
            id="three"
            className="dark-gray"
            onClick={() => buttonPress(Keys.THREE)}
          >
            3
          </button>
          <button
            id="add"
            className="yellow"
            onClick={() => buttonPress(Keys.ADD)}
          >
            +
          </button>
          <button
            id="zero"
            className="dark-gray"
            onClick={() => buttonPress(Keys.ZERO)}
          >
            0
          </button>
          <button
            id="decimal"
            className="dark-gray"
            onClick={() => buttonPress(Keys.DECIMAL)}
          >
            .
          </button>
          <button
            id="equals"
            className="yellow"
            onClick={() => buttonPress(Keys.EQUALS)}
          >
            =
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
