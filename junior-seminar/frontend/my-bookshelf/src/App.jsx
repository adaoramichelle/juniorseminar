import { useState, useEffect, use } from 'react'
import './App.css'
import SignUp from './SignUp'
import Login from './Login'
import { useUser } from "./contexts/UserContext"
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import WithAuth from './WithAuth'
import Home from './Home'
import BookShelf from './BookShelf'
import Goals from './Goals'
import ReflectionPage from './ReflectionPage'
import { getQueue, initDB, syncQueue } from './utils/db'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
import './index.css'
function App() {
  const { user, setUser } = useUser()
  const [currUser, setCurrUser] = useState("")
  const ProtectedHome = WithAuth(Home);
  const ProtectedBookshelf = WithAuth(BookShelf)
  useEffect(() => {
    fetch("http://localhost:3000/me", { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          setUser(data);
          setCurrUser(data);
        }
      });
  }, []);

  useEffect(() => {
    const handleOnline = () => {

      syncQueue()
    }
    window.addEventListener("online", handleOnline)
    if (navigator.onLine) {
      syncQueue()

    }
    return () => {
      window.removeEventListener("online", handleOnline)
    }
  }
    , [])
  if (!navigator.onLine) {
    toast.info('You are currently offline');
  }
  useEffect(() => {
    const handleOffline = () => {
      toast.info('You are offline')

    };
    const handleOnline = () => toast.info('Back online!');

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);
  return (
    <>
      <BrowserRouter>
        <Routes >
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<ProtectedHome currUser={currUser} />} />
          <Route path="/mybookshelf" element={<ProtectedBookshelf currUser={currUser} />}></Route>
          <Route path="/goal" element={<Goals />} />
          <Route path="/books/:googleId/reflection" element={<ReflectionPage />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce} />
    </>

  )
}
export default App
