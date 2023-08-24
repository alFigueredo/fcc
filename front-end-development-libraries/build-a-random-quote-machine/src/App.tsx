import { useState } from "react";
import quotes from "./assets/quotes.json";
import { FaTwitter, FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import "./App.css";

interface Quote {
  quote: string;
  author: string;
}

const getRandomQuote = (): Quote => {
  return quotes[Math.floor(Math.random() * quotes.length)];
};

function App() {
  const [quote, setQuote] = useState<Quote>(getRandomQuote());

  const changeQuote = () => {
    setQuote(getRandomQuote());
  };

  return (
    <div className="background">
      <div id="quote-box">
        <div className="quote-content">
          <FaQuoteLeft size="30" style={{ marginRight: "10px" }} />
          <h2 id="text">{quote.quote}</h2>
          <FaQuoteRight size="30" style={{ marginLeft: "10px" }} />
          <h4 id="author">- {quote.author}</h4>
        </div>
        <div className="buttons">
          <a
            href={`https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=${quote.quote}`}
            id="tweet-quote"
            style={{
              backgroundColor: "#1DA1F2",
              marginRight: "10px",
            }}
          >
            <FaTwitter color="white" />
          </a>
          <button id="new-quote" onClick={changeQuote}>
            Change Quote
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
