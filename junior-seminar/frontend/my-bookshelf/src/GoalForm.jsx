import { useState, useEffect } from "react"
import { addToQueue } from "./utils/db"
import { toast } from 'react-toastify';
function GoalForm(props) {
    const currentYear = new Date().getFullYear()
    const [isEditing, setIsEditing] = useState(false)
    const [target, setTarget] = useState(0)
    const [isPublic, setIsPublic] = useState(false)
    const handleFormChange = (e) => {
        setTarget(() => e.target.value)
    }
    async function handleSubmit(e) {
        e.preventDefault()
        const data = { year: currentYear, target, isPublic }
        if (!navigator.onLine) {
            await addToQueue({ type: "SAVE_GOAL", data: data })
            toast.info("You are offline, We'll sync this when you come online")
            return
        }
        try {
            const res = await fetch('http://localhost:3000/goal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include'
            })
            props.fetchGoal()
            props.fetchAllGoal()
        } catch (error) {
            return
        }
    }
    useEffect(() => {
        const handleSync = (e) => {
            if (!e.detail) return
            props.fetchGoal()
            props.fetchAllGoal()
        }
        window.addEventListener('GOAL_SAVED', handleSync)
        return () => { window.removeEventListener('GOAL_SAVED', handleSync) }
    }, [])
    return (
        <div>
            <form action="">
                <label htmlFor="">Set your {currentYear} reading goal!</label><br />
                <input onChange={handleFormChange} value={target} type="number" /><br />
                <label htmlFor="">Make goal pubic!</label>
                <input className="is-public" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} type="checkbox" />
            </form>
            <button onClick={handleSubmit} type="submit">Save Goal</button>
        </div>
    )
}
export default GoalForm
