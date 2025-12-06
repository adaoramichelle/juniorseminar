const StarRatingInput = ({ rating, setRating }) => {
    return (
        <div>
            {[1, 2, 3, 4, 5].map((star) => (
                <i
                    key={star}
                    className={`fa-star fa${star <= rating ? "s" : "r"}`}
                    style={{
                        cursor: "pointer",
                        color: star <= rating ? "gold" : "gray",
                        marginRight: 5,
                        fontSize: 24,
                    }}
                    onClick={() => setRating(star)}
                    aria-label={`${star} star`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") setRating(star);
                    }}
                ></i>
            ))}
        </div>
    );
};

export default StarRatingInput;
