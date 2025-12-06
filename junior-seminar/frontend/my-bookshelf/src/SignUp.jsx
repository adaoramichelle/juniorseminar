import React, { useState } from "react"
import { useUser } from "./contexts/UserContext"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import "./SignUp.css"
function SignUp() {
    const [formData, setFormData] = useState({ username: "", password: "" })
    const [message, setMessage] = useState("")
    const { setUser } = useUser()
    const navigate = useNavigate()
    function handleFormChange(e) {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }
    async function handleSubmit(e) {
        e.preventDefault()
        console.log("submitted", formData)
        try {
            const response = await fetch("http://localhost:3000/signup",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                    credentials: "include"
                })
            const data = await response.json()
            if (response.ok) {
                setUser(data)
                navigate("/home")
                setMessage({ type: "success", text: "Successfully signed up" })
            } else {
                setMessage({ type: "error", text: data.error || "SignUp failed" })
            }
        } catch (error) {
            setMessage({ type: "error", text: "Network error. Please try again" })
        }
    }
    return (
        <div>
            <h1 className="title">MyBookShelf!</h1>
            <h4>Join the bookclub!</h4>
            <form className="signup-form" onSubmit={handleSubmit}>
                <label htmlFor="">Username:</label>
                <input className="username" type="text" name="username" value={formData.username} onChange={handleFormChange} />
                <label htmlFor="">Password:</label>
                <input className="password" type="password" name="password" value={formData.password} onChange={handleFormChange} />
                <button className="signup" type="submit">SignUp</button>
                {message && (<div className={`message, ${message.type}`}>
                    {message.text}</div>)}
            </form>
            <p className="message">
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    )
}
export default SignUp
