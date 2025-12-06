import { useState } from "react"
import './SideBar.css'
import { useUser } from "./contexts/UserContext";
import { useNavigate } from "react-router-dom";
function Sidebar(props) {
    const { user, setUser } = useUser()
    const handleLogout = async () => {
        await fetch("http://localhost:3000/logout", { method: "POST", credentials: "include" });
        setUser(null); // Remove user from context
        window.location.href = "/"; // Redirect to homepage
    };
    const navigate = useNavigate();
    const viewBookshelf = () => {
        navigate("/mybookshelf", { state: { modalBooks: props.modalBooks, setModalBooks: props.setModalBooks } })
    }
    const viewGoalPage = () => {
        navigate('/goal')
    }
    return (
        <>
            <div id="sidebar" className={`sidebar ${props.isSidebarOpen ? 'open' : ''}`}>
                <i onClick={props.toggleSidebar} id="closeIcon" className="fa-solid fa-xmark"></i>
                <button onClick={viewBookshelf} className="view-bookshelf">My Books</button>
                <button onClick={viewGoalPage}>Goals</button>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>

        </>
    )
}
export default Sidebar;
