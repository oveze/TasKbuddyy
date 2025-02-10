import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import { FiLogOut } from "react-icons/fi";
import Auth from "./pages/Auth";
import TaskList from "./pages/TaskList";
import TaskBoard from "./pages/TaskBoard";
import { auth } from "./pages/Firebase"; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import { HiOutlineClipboardList } from "react-icons/hi";

// Type for the user object
interface User {
  displayName?: string | null;
  email?: string | null;
}

const App: React.FC = () => {
  return (
    
      <Routes>
        <Route path="/*" element={<Dashboard />} />
      </Routes>
    
  );
};

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null); // Typed user state
  const [loading, setLoading] = useState<boolean>(true); // Typed loading state
  const navigate = useNavigate(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async (): Promise<void> => {
    await signOut(auth);
    setUser(null);
    navigate("/"); 
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {!user ? (
        <Auth setUser={setUser} />
      ) : (
        <div className="dashboard">
          <header className="header">
            <h1> <HiOutlineClipboardList /> TaskBuddy</h1>
            <div className="user-info">
              <span>{user.displayName || user.email}</span>
              <button className="logout-btn" onClick={handleLogout}>
                <FiLogOut className="logout-icon" />
                Logout
              </button>
            </div>
          </header>
          <div className="content">
            <TaskList />
            <TaskBoard />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
