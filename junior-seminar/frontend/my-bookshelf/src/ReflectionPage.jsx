import { useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import ReviewForm from "./ReviewForm"
import ReviewsPage from "./ReviewsPage"
import ReflectionCard from "./ReflectionCard"
import { useUser } from "./contexts/UserContext"
import { addToQueue } from "./utils/db"
import { toast } from 'react-toastify';
import './ReflectionPage.css'
import { useNavigate } from "react-router-dom"

function ReflectionPage(props) {
    const location = useLocation();
    const state = location.state || {};
    const bookData = state.book || state;
    const [reflection, setReflection] = useState(" ");
    const [reviews, setReviews] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(0);
    const user = useUser();
    const [existingReflection, setExistingReflection] = useState(false);
    const navigate = useNavigate();
    const [aiPrompt, setAiPrompt] = useState("");
    const [loadingPrompt, setLoadingPrompt] = useState(false);

    const generatePrompt = async () => {
        setLoadingPrompt(true);
        try {
            const res = await fetch("http://localhost:3000/generate-prompt", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: bookData.title,
                    authors: bookData.authors,
                    description: bookData.description
                }),
            });

            const data = await res.json();
            if (data.prompt) {
                setAiPrompt(data.prompt);
            }
        } catch (error) {
            console.error("Failed to generate prompt:", error);
        } finally {
            setLoadingPrompt(false);
        }
    };

    const goBackHome = () => {
        navigate("/mybookshelf");
    };

    const fetchReflection = async () => {
        const res = await fetch(`http://localhost:3000/reflection/${bookData.googleId}`, {
            method: 'GET',
            credentials: 'include',
        });
        const data = await res.json();
        if (data?.content) {
            setReflection(data.content);
            setExistingReflection(true);
        }
    };

    async function getReviews() {
        const res = await fetch('http://localhost:3000/reviews');
        const data = await res.json();
        const filteredReviews = data.filter((review) => (review.googleId === bookData.googleId));
        const userReview = filteredReviews.find((review) => (review.userId === user.user.id));
        if (userReview) {
            setContent(userReview.content);
            setRating(() => userReview.rating);
        }
        setReviews(() => filteredReviews);
    }

    const handleSave = async (e) => {
        e.preventDefault();
        const data = {
            googleId: bookData.googleId,
            content: reflection,
            title: bookData.title,
            authors: bookData.authors,
            cover: bookData.cover,
            description: bookData.description,
        };
        if (!navigator.onLine) {
            await addToQueue({ type: "SAVE_REFLECTION", data: data });
            toast.info("You are offline, We'll sync this when you come online");
            return;
        }
        try {
            const res = await fetch('http://localhost:3000/reflection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(data)
            });
            if (res && res.ok) {
                toast.success("Reflection saved successfully");
                setEditMode(false);
                setExistingReflection(true);
            } else {
                toast.error("Error saving reflection");
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    useEffect(() => {
        fetchReflection();
        getReviews();
        generatePrompt();
    }, [bookData.googleId]);

    useEffect(() => {
        const handleSync = (e) => {
            if (!e.detail) return;
            const { reflection, googleId } = e.detail;
            if (googleId === bookData.googleId) {
                setReflection(reflection);
                setEditMode(false);
                setExistingReflection(true);
            }
        };
        window.addEventListener('REFLECTION_SAVED', handleSync);
        return () => { window.removeEventListener('REFLECTION_SAVED', handleSync); };
    }, [bookData.googleId]);

    return (
        <div className="wrapper">
            <div className="reflection-page">
                <i id="goBack" onClick={goBackHome} className="fa-solid fa-arrow-left"></i>

                <div className="reflection-header">
                    <img width="200px" height="300px" src={bookData.cover} alt="bookcover" />
                    <h3>{bookData.title} - {bookData.authors.join(", ")}</h3>
                    <p>{bookData.description}</p>
                    <div className="buy-links">
                        <a href={`https://www.barnesandnoble.com/s/${encodeURIComponent(bookData.title + ' ' + bookData.authors.join(", "))}`}>Buy on Barnes & Noble</a>
                        <a href={` https://www.amazon.com/s?k=${encodeURIComponent(bookData.title + ' ' + bookData.authors.join(", "))}`}>Buy on Amazon</a>
                    </div>
                </div>
                <div className="reflection-prompt">
                    <div className="ai-prompt-section" >
                        <h3>Reflection Prompt</h3>

                        {loadingPrompt ? (
                            <p>Loading prompt...</p>
                        ) : (
                            <p style={{ fontStyle: "italic", minHeight: "50px" }}>
                                {aiPrompt || "No prompt generated yet."}
                            </p>
                        )}

                        <button
                            onClick={generatePrompt}
                            disabled={loadingPrompt}
                            style={{ marginTop: "10px" }}
                        >
                            <i className="fa-solid fa-arrows-rotate"></i>
                        </button>

                    </div>

                    <div className="reflection">
                        <form onSubmit={handleSave}>
                            <ReflectionCard
                                reflection={reflection}
                                setReflection={setReflection}
                                editMode={editMode}
                                setEditMode={setEditMode}
                                handleSave={handleSave}
                            />
                            {editMode && (
                                <button className="reflection-btn" type="submit">{existingReflection ? "Save Changes" : "Save Reflection"}</button>
                            )}
                        </form></div></div>


            </div>

            <div className="review">
                <ReviewForm setContent={setContent} setRating={setRating} content={content} rating={rating} reviews={reviews} getReviews={getReviews} bookData={bookData} />
                <ReviewsPage setContent={setContent} setRating={setRating} content={content} rating={rating} reviews={reviews} getReviews={getReviews} bookData={bookData} />
                {existingReflection && !editMode && (
                    <p><strong>Your Reflection:</strong></p>
                )}

            </div>
        </div>
    );
}

export default ReflectionPage;
