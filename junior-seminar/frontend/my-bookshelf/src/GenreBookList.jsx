import Book from "./Book";
import "./GenreBookList.css"
function GenreBookList(props) {
    return (
        <div className="book-list">
            {Object.entries(props.genreBooks).map(([genre, books]) => (
                <section key={genre}>
                    <h1 className="book-category">{genre.charAt(0).toUpperCase() + genre.slice(1)}</h1>
                    <div className="book-list">
                        {books.map((book) => {
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
                                        genres={info.categories}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </section>
            ))}
        </div>
    );
}

export default GenreBookList;
