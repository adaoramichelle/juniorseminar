import React from "react";
import "./BookFlippingLoader.css";
const BookFlippingLoader = ({ message = "Loading..." }) => {
    return (
        <div className="spinner-container">
            <div className="spinner" /><br />
            <div className="message"> <p>Loading..</p></div>

        </div>
    )
};
export default BookFlippingLoader;
