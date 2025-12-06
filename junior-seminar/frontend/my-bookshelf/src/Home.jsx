import { useState } from "react"
import { useEffect } from "react";
import Search from "./Search"
import BookList from "./BookList";
import BookModal from "./BookModal";
import Header from "./Header";
import Sidebar from "./Sidebar";
import QuoteBanner from "./QuoteBanner";
import { useUser } from './contexts/UserContext';
import { saveBookstoDB, getBooksFromDB } from "./utils/db";
import { toast } from 'react-toastify';
import BookFlippingLoader from "./BookFlippingLoader";
import BookRecs from "./BookRecs";
import GenreBookList from "./GenreBookList";
import SearchResults from "./SearchResults";
import { saveRecs, getRecs } from './utils/db';
function Home(props) {
    const [searchInput, setSearchInput] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [popularBooks, setPopularBooks] = useState([])
    const [isClicked, setIsClicked] = useState(false)
    const [modalBook, setModalBook] = useState({})
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [bookRecs, setBookRecs] = useState([])
    const [genreBooks, setGenreBooks] = useState({})
    const ApiKey = import.meta.env.VITE_API_KEY;
    const { user, setUser } = useUser()
    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev)
    }
    function handleFormChange(e) {
        setSearchInput(() => e.target.value)
    }
    async function fetchRecs() {
        if (navigator.onLine) {
            try {
                const url = `http://localhost:3000/recs`;
                const response = await fetch(url, {
                    method: 'GET',
                    credentials: 'include'
                });
                const data = await response.json();
                setBookRecs(data);
                saveRecs(data)
            } catch (err) {
                fallbackToCachedRecs();
            }
        } else {
            fallbackToCachedRecs()
        }

    }
    async function fallbackToCachedRecs() {
        const cached = await getRecs();
        if (cached) {
            setBookRecs(cached);
        } else {
            setBookRecs([]);
        }
    }
    async function fetchGenreBooks() {
        try {
            const url = `http://localhost:3000/home-sections`
            const response = await fetch(url)
            const data = await response.json()
            setGenreBooks(data)
        } catch {
            return false
        }

    }
    async function fetchPopularBooks() {
        if (navigator.onLine) {
            try {
                const url = `http://localhost:3000/popular`
                const response = await fetch(url)
                const data = await response.json()
                setPopularBooks(data)
                setIsLoading(false)
                await saveBookstoDB(data)
            } catch {
                setIsLoading(false)
                return false
            }
        } else {
            const cached = await getBooksFromDB()
            if (cached) {
                setPopularBooks(cached)
            } else {
                alert("No offline data found")
            }
            setIsLoading(false)
        }
    }
    useEffect(() => {
        fetchGenreBooks()
        fetchPopularBooks()
        fetchRecs()
    }, [])
    async function fetchBookSearch() {
        const url = `http://localhost:3000/search?q=${searchInput}`
        const response = await fetch(url);
        const data = await response.json();
        setSearchResults(data)
    }
    function handleSearch(e) {
        e.preventDefault()
        fetchBookSearch()
    }
    function clearSearch(e) {
        e.preventDefault()
        setSearchResults([])
        setSearchInput("")
        fetchPopularBooks()
    } return (
        <div>
            <Sidebar
                toggleSidebar={toggleSidebar}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                modalBook={modalBook}
                setModalBook={setModalBook}
            />
            <div id="main" className={isSidebarOpen ? "main-sidebar-open" : "main"}>
                <Header toggleSidebar={toggleSidebar} />
                <QuoteBanner />
                <Search
                    handleFormChange={handleFormChange}
                    handleSearch={handleSearch}
                    fetchBookSearch={fetchBookSearch}
                    clearSearch={clearSearch}
                    searchInput={searchInput}
                />
                {searchResults.length > 0 ? (
                    <SearchResults
                        isClicked={isClicked}
                        setIsClicked={setIsClicked}
                        popularBooks={popularBooks}
                        modalBook={modalBook}
                        setModalBook={setModalBook}
                        searchResults={searchResults} />
                ) : (
                    <>
                        {isLoading && <BookFlippingLoader />}
                        {bookRecs && (
                            <BookRecs
                                isClicked={isClicked}
                                setIsClicked={setIsClicked}
                                setModalBook={setModalBook}
                                modalBook={modalBook}
                                bookRecs={bookRecs}
                            />
                        )}
                        <GenreBookList
                            isClicked={isClicked}
                            setIsClicked={setIsClicked}
                            modalBook={modalBook}
                            setModalBook={setModalBook}
                            genreBooks={genreBooks}
                        />
                        <BookList
                            isClicked={isClicked}
                            setIsClicked={setIsClicked}
                            popularBooks={popularBooks}
                            modalBook={modalBook}
                            setModalBook={setModalBook}
                        />
                    </>
                )}
            </div>

            {isClicked && <BookModal setIsClicked={setIsClicked} modalBook={modalBook} />}
        </div>
    );
}
export default Home;
