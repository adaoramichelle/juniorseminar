import './Book.css'
function Book(props) {
    const modalBookObject = {
        title: props.bookTitle,
        authors: props.bookAuthor,
        cover: props.bookCover,
        description: props.bookDescription,
        amazonLink: `https://www.amazon.com/s?k=${encodeURIComponent(props.bookTitle + ' ' + props.bookAuthor)}`,
        barnesandNobleLink: `https://www.barnesandnoble.com/s/${encodeURIComponent(props.bookTitle + ' ' + props.bookAuthor)}`,
        googleId: props.googleId,
        genres: props.genres
    }
    const modalDisplay = () => {
        props.setIsClicked(true)
        props.setModalBook(modalBookObject)
    }
    return (
        <div className="book" onClick={modalDisplay}>
            <img
                src={props.bookCover || "/default-cover.jpeg"}
                alt="bookcover"
                className="book-cover"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-cover.jpeg";
                }}
            />
            <div className='details'>
                <h2 className='book-title'>{props.bookTitle}</h2>
                <p className='author'> {Array.isArray(props.bookAuthor)
                    ? props.bookAuthor.join(", ")
                    : props.bookAuthor}</p>
            </div>
        </div>
    )
}
export default Book;
