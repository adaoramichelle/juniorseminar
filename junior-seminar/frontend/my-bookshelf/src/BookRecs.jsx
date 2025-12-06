import Book from "./Book";
function BookRecs(props) {
    function capitalizeName(name) {
        return name.split(' ')
            .map(word =>
                word.length > 0
                    ? word[0].toUpperCase() + word.slice(1).toLowerCase()
                    : ''
            )
            .join(' ');
    }
    if (!props.bookRecs || props.bookRecs.length === 0) {
        return (
            <div className="book-recs-empty">
                <h2>Add books to your shelf to view recommendations 📚</h2>
            </div>
        );
    }
    return (
        <>
            <h1 className="book-category">Some books we think you'll like</h1>
            <div className="book-list">
                {(props.bookRecs).map((book) => {
                    return (
                        <div key={book.id}>
                            <Book
                                modalBook={props.modalBook}
                                setModalBook={props.setModalBook}
                                isClicked={props.isClicked}
                                setIsClicked={props.setIsClicked}
                                googleId={book.googleId}
                                bookCover={`https://books.google.com/books/content?id=${book.googleId}&printsec=frontcover&img=1&zoom=1&source=gbs_api`}
                                bookTitle={book.title}
                                bookAuthor={book.authors.map(author => capitalizeName(author))}
                                bookDescription={book.description}
                                genres={book.categories} />
                        </div>
                    )
                })}
            </div> </>
    )
}
export default BookRecs;
