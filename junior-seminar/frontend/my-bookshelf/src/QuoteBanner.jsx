import { useState } from "react";
import { useEffect } from "react";
import quotes from "./quotes.json";
import "./QuoteBanner.css";
function QuoteBanner() {
    const [quote, setQuote] = useState("");
    const [author, setAuthor] = useState("");
    function fetchQuote() {
        const random = quotes[Math.floor(Math.random() * quotes.length)]
        setAuthor(random.author);
        setQuote(random.quote);
    }
    useEffect(() => {
        fetchQuote();
    }, [])
    return (
        <div className="quote-container">
            <p className="quote">{quote}</p>
            <p className="author">{author}</p>
        </div>)
}
export default QuoteBanner;
