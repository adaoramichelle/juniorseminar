import { use, useEffect, useState } from "react"
import { useUser } from "./contexts/UserContext"
import { useNavigate } from "react-router-dom"
import "./BookModal.css"
import { addToQueue } from "./utils/db"
import { toast } from 'react-toastify';

function BookModal(props) {
    const [bookshelves, setBookshelves] = useState([])
    const [selectedBookshelf, setSelectedBookshelf] = useState("")
    const [shelfOptions, setShelfOptions] = useState([])
    const [booksInShelf, setBooksInShelf] = useState([])
    const { user, setUser } = useUser()
    const navigate = useNavigate()
    const closeModal = () => {
        props.setIsClicked(false)
    }
    const fetchShelfOption = async () => {
        if (!navigator.onLine) {
            setShelfOptions(["WanttoRead", "CurrentlyReading", "Read"])

            return
        }
        try {
            const res = await fetch("http://localhost:3000/shelves", {
                credentials: "include",
            })
            const data = await res.json();
            setShelfOptions(data)
        } catch (err) {
        }
    }
    const fetchBookshelves = async () => {

        if (!navigator.onLine) {


            return
        }
        try {
            const res = await fetch("http://localhost:3000/bookshelf", {
                credentials: "include",
            });
            const data = await res.json();
            setBookshelves(data);
        } catch (err) {
            toast.error("Error fetching bookshelves", err)
        }
    }
    async function fetchBooksInShelves() {
        if (!navigator.onLine) {


            return
        }

        try {
            const res = await fetch('http://localhost:3000/user-bookshelves', {
                method: 'GET',
                credentials: 'include'
            })
            const data = await res.json()
            for (const shelf in data) {
                const found = data[shelf].find((book) => book.googleId === props.modalBook.googleId)
                if (found) {
                    setSelectedBookshelf(shelf)
                    break;
                }
            }

        } catch (err) {
            toast.error("Error fetching bookshelves", err)
        }
        if (props.modalBook.googleId) {
            fetchBooksInShelves()
        }
    }
    useEffect(() => {
        fetchBookshelves()
        fetchShelfOption()
    }, [])
    useEffect(() => {
        fetchBooksInShelves()
    }, [props.modalBook.googleId])
    const addToBookshelf = async (e) => {
        const selected = e.target.value
        if (!selected) {
            return toast.error("Please select a bookshelf")
        }
        setSelectedBookshelf(selected)
        const bookData = {
            title: props.modalBook.title,
            authors: props.modalBook.authors,
            cover: props.modalBook.cover,
            description: props.modalBook.description,
            googleId: props.modalBook.googleId,
            bookshelfId: selected,
            userId: user.user.id,
            genres: props.modalBook.genres

        }

        if (!navigator.onLine) {
            toast.info("You are offline, We'll sync this when you come online")
            await addToQueue({ type: "ADD_TO_SHELF", data: bookData })

            return
        }
        try {
            const res = await fetch("http://localhost:3000/bookshelf/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(
                    bookData
                ),
            });
            const data = await res.json();
            fetchBookshelves()
            toast.success(`Book added to ${selected}`)
        } catch (err) {
            toast.error("Error adding book to bookshelf")
        }
    }
    return (
        <div className="modal-container">
            <div className="modal">
                <div className="modal-header">
                    <i onClick={closeModal} id="closeIcon" className="fa-solid fa-xmark"></i>
                    <img className="book-cover" src={props.modalBook.cover} alt="bookcover" />

                    <div className="book-details">
                        <h3>{props.modalBook.title}</h3>
                        <h4>{props.modalBook.author}</h4>
                        <button className="see-more" onClick={() => navigate(`/books/${props.modalBook.googleId}/reflection`, { state: props.modalBook })}>See More</button></div>



                </div>

                <div><h3>{props.modalBook.description}</h3></div>
                <select value={selectedBookshelf} onChange={(e) => {
                    setSelectedBookshelf(e.target.value);
                    addToBookshelf(e)
                }} defaultValue="">
                    <option value="">Select a shelf</option>
                    {shelfOptions.map((shelf) => (
                        <option key={shelf} value={shelf}>{shelf.replace(/([A-Z])/g, "$1").trim()}</option>
                    ))}
                </select>
            </div>
        </div >
    )
}
export default BookModal;
