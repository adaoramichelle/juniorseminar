import { use, useEffect } from "react";
import { useState } from "react";
import './BookShelf.css'
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import StarRatingDisplay from "./StarRatingDisplay";
import { saveBookshelvesData, getBookshelvesData } from './utils/db';
function BookShelf() {
    const [bookshelves, setBookshelves] = useState([])
    const navigate = useNavigate()
    const [ratingsMap, setRatingsMap] = useState({});
    const [openShelf, setOpenShelf] = useState(null);
    const toggleShelf = (shelfname) => {
        setOpenShelf(prev => (prev === shelfname ? null : shelfname));
    };
    async function fetchRatings(googleId) {
        try {
            const res = await fetch(`http://localhost:3000/book-ratings/${googleId}`,
                {
                    method: 'GET',
                    credentials: 'include'
                }
            );
            return await res.json();
        } catch (error) {
            console.error("Error fetching ratings:", error);
            return { averageRating: null, ratingsCount: 0 };
        }
    };

    async function fetchBookShelves() {
        if (navigator.onLine) {
            try {
                const res = await fetch('http://localhost:3000/user-bookshelves', {
                    method: 'GET',
                    credentials: 'include'
                });
                const data = await res.json();
                saveBookshelvesData(data);
                setBookshelves(data);
                const allBooks = Object.values(data).flat();
                const ratingsResults = await Promise.all(
                    allBooks.map(async (book) => {
                        const ratingData = await fetchRatings(book.googleId);
                        return { googleId: book.googleId, ...ratingData };
                    })
                );

                const newRatingsMap = {};
                ratingsResults.forEach(({ googleId, averageRating, ratingsCount }) => {
                    newRatingsMap[googleId] = { averageRating, ratingsCount };
                });

                setRatingsMap(newRatingsMap);

            } catch (err) {
                toast.error("Error fetching bookshelves", err);
            }
        }
        else {
            fallbackToCache();
        }

    }
    async function fallbackToCache() {
        const cached = await getBookshelvesData();
        if (cached) {
            setBookshelves(cached);
        } else {
            setBookshelves({});
        }
    }
    const goBackHome = () => {
        navigate("/home")
    }
    useEffect(() => {
        fetchBookShelves()
    }, [])
    return (
        <div>
            <div className="header">
                <i id="goBack" onClick={goBackHome} className="fa-solid fa-arrow-left"></i>
                <h1 className="my-books">MY BOOKS</h1>
            </div>
            {Object.entries(bookshelves).map(([shelfname, books]) => (
                <div key={shelfname} className="accordion-section">
                    <div
                        className="accordion-header"
                        onClick={() => toggleShelf(shelfname)}
                    >
                        <h2>
                            {shelfname.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/to/g, ' to ')}
                        </h2>
                        <i
                            className={`fa-solid fa-caret-down accordion-icon ${openShelf === shelfname ? 'open' : ''}`}
                            aria-hidden="true"
                        ></i>
                    </div>
                    <div
                        className={`accordion-content ${openShelf === shelfname ? "open" : ""}`}
                    >
                        <div className="books">
                            {books.map((book) =>
                            (
                                <div className="book-card" key={book.googleId}>
                                    <Link
                                        state={{ book }}
                                        to={`/books/${book.googleId}/reflection`}
                                    >
                                        <img src={book.cover} alt="bookcover" />
                                    </Link>
                                    <div className="title-rating">
                                        <h4>{book.title}</h4>
                                        <p>{book.authors.join(", ")}</p>

                                        {(shelfname === "WanttoRead" || shelfname === "CurrentlyReading") && ratingsMap[book.googleId] && (
                                            <>
                                                {ratingsMap[book.googleId].averageRating !== null ? (
                                                    <>
                                                        <StarRatingDisplay rating={ratingsMap[book.googleId].averageRating} />
                                                        <p>
                                                            ({ratingsMap[book.googleId].ratingsCount} ratings)
                                                        </p>
                                                    </>
                                                ) : (
                                                    <p>
                                                        No ratings yet
                                                    </p>
                                                )}
                                            </>
                                        )}
                                        {shelfname === "Read" && (
                                            <>
                                                {book.reviews && book.reviews.length > 0 ? (
                                                    <>
                                                        <p>Your Rating:</p>
                                                        <StarRatingDisplay rating={book.reviews[0].rating} />
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => navigate(`/books/${book.googleId}/reflection`, { state: { book } })}>
                                                        Leave a Review
                                                    </button>
                                                )}
                                            </>
                                        )}

                                    </div>
                                </div>
                            )
                            )}

                        </div>
                    </div>
                </div>
            ))
            }
        </div >
    )
}
export default BookShelf;
