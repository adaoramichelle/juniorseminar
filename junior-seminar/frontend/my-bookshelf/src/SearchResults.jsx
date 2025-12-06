import Book from "./Book";
function SearchResults(props) {
    return (
        <div>
            <div className="book-list">
                {(props.searchResults).map((book) => {
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
export default SearchResults;
