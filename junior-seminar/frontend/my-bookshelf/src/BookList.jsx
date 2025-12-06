import Book from "./Book";
function BookList(props) {
    return (
        <div>
            <h1 className="book-category">More</h1>
            <div className="book-list">
                {(props.popularBooks).map((book) => {
                    const info = book.volumeInfo;
                    return (
                        <div key={book.id}>
                            <Book
                                modalBook={props.modalBook}
                                setModalBook={props.setModalBook}
                                isClicked={props.isClicked}
                                setIsClicked={props.setIsClicked}
                                googleId={book.id}
                                bookCover={info.imageLinks?.thumbnail}
                                bookTitle={info.title}
                                bookAuthor={info.authors}
                                bookDescription={info.description}
                                genres={info.categories} />
                        </div>
                    )
                })}
            </div></div>
    )
}
export default BookList;
