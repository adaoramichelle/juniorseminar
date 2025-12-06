import { useEffect, useState } from "react"
import ProgressBar from 'react-bootstrap/ProgressBar';
import GoalForm from "./GoalForm"
import GoalCircle from "./GoalCircle"
import CustomProgress from "./CustomProgress";
import './Goals.css'
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from "react-router-dom"
function Goals() {
    const navigate = useNavigate()
    const [goal, setGoal] = useState(null)
    const [allGoals, setAllGoals] = useState([])
    const [showAllGoals, setShowAllGoals] = useState(false)
    const goBackHome = () => {
        navigate("/home")
    }
    async function fetchGoal() {
        const res = await fetch('http://localhost:3000/goal', {
            method: 'GET',
            credentials: 'include'
        })
        const data = await res.json()
        setGoal(data);
    }
    async function fetchAllGoal() {
        try {
            const res = await fetch('http://localhost:3000/goals', {
                method: 'GET',
                credentials: 'include'
            })
            const data = await res.json()
            setAllGoals(data)

        } catch (err) {
            toast.error("Error fetching goals", err)
        }
    }
    useEffect(() => {
        fetchGoal()
        fetchAllGoal()
    }, [])
    return (
        <>
            <div className="back-arrow">
                <i id="goBack" onClick={goBackHome} className="fa-solid fa-arrow-left"></i>
            </div>
            <div className="goal-content">
                {goal !== null ? <GoalCircle goal={goal} /> : (<GoalForm fetchAllGoal={fetchAllGoal} fetchGoal={fetchGoal} />)}
                <button className="goals-button" onClick={() => setShowAllGoals(prev => !prev)}>{showAllGoals === true ? "Hide Community Goals" : "Show Community Goals"}</button>
            </div>
            {showAllGoals && (
                allGoals.map(goal => (
                    <section className="user-goal" key={goal.id}>
                        <img id="avatar" src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${goal.user.username}`} alt="Profile avatar" />
                        <p className="user-name"><strong>@{goal.user.username}</strong></p>
                        <p>{goal.booksReadCount} of {goal.target} books read</p>
                        <CustomProgress progress={goal.progress}></CustomProgress>
                    </section>
                ))
            )}

        </>
    )
}
export default Goals
