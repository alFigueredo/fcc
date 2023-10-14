import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Quote } from "./App.tsx";
import "./index.css";

fetch("https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json")
  .then((res) => res.json())
  .then((data) => {
    loadQuotes(data.quotes)
  })
  .catch((e) => console.log(e))

const loadQuotes = (quotes: Quote[]) => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App quotes={quotes}/>
    </React.StrictMode>
  );
}