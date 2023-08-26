import { useState } from "react";
import "./App.css";

function App() {
  const [answer, setAnswer] = useState("0");
  const [expression, setExpression] = useState("");
  const et = expression.trim();

  const buttonPress = (symbol: string) => {
    switch (symbol) {
      case "clear":
        setAnswer("");
        setExpression("0");
        break;
      case "negative":
        if (answer === "") return;
        setAnswer(
          answer.toString().charAt(0) === "-" ? answer.slice(1) : "-" + answer
        );
        break;
      case "percentage":
        if (answer === "") return;
        setAnswer((parseFloat(answer) / 100).toString());
        break;
      case "/":
      case "*":
      case "-":
      case "+":
        setExpression(et + " " + symbol + " ");
        break;
      case "=":
        calculate();
        break;
      case "0":
        if (expression.charAt(0) !== "0") setExpression(expression + symbol);
        break;
      case ".":
        const lastNumber = expression.split(/[-+/*]/g).pop();
        if (lastNumber?.includes(".")) return;
        setExpression(expression + symbol);
        break;
      default:
        setExpression(
          (expression.charAt(0) === "0" ? expression.slice(1) : expression) +
            symbol
        );
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
            onClick={() => buttonPress("clear")}
          >
            C
          </button>
          <button
            id="negative"
            className="light-gray"
            onClick={() => buttonPress("negative")}
          >
            +/-
          </button>
          <button
            id="percentage"
            className="light-gray"
            onClick={() => buttonPress("percentage")}
          >
            %
          </button>
          <button
            id="divide"
            className="yellow"
            onClick={() => buttonPress("/")}
          >
            /
          </button>
          <button
            id="seven"
            className="dark-gray"
            onClick={() => buttonPress("7")}
          >
            7
          </button>
          <button
            id="eight"
            className="dark-gray"
            onClick={() => buttonPress("8")}
          >
            8
          </button>
          <button
            id="nine"
            className="dark-gray"
            onClick={() => buttonPress("9")}
          >
            9
          </button>
          <button
            id="multiply"
            className="yellow"
            onClick={() => buttonPress("*")}
          >
            *
          </button>
          <button
            id="four"
            className="dark-gray"
            onClick={() => buttonPress("4")}
          >
            4
          </button>
          <button
            id="five"
            className="dark-gray"
            onClick={() => buttonPress("5")}
          >
            5
          </button>
          <button
            id="six"
            className="dark-gray"
            onClick={() => buttonPress("6")}
          >
            6
          </button>
          <button
            id="subtract"
            className="yellow"
            onClick={() => buttonPress("-")}
          >
            -
          </button>
          <button
            id="one"
            className="dark-gray"
            onClick={() => buttonPress("1")}
          >
            1
          </button>
          <button
            id="two"
            className="dark-gray"
            onClick={() => buttonPress("2")}
          >
            2
          </button>
          <button
            id="three"
            className="dark-gray"
            onClick={() => buttonPress("3")}
          >
            3
          </button>
          <button id="add" className="yellow" onClick={() => buttonPress("+")}>
            +
          </button>
          <button
            id="zero"
            className="dark-gray"
            onClick={() => buttonPress("0")}
          >
            0
          </button>
          <button
            id="decimal"
            className="dark-gray"
            onClick={() => buttonPress(".")}
          >
            .
          </button>
          <button
            id="equals"
            className="yellow"
            onClick={() => buttonPress("=")}
          >
            =
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
