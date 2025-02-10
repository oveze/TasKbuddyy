import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./Firebase";
import { FcGoogle } from "react-icons/fc"; 
import background from "../pages/background.png";
import './Auth.css';
import { HiOutlineClipboardList } from "react-icons/hi";
import { Dispatch, SetStateAction } from "react";

// Type for the user object
interface User {
  displayName?: string | null;
  email?: string | null;
}

// Define prop type for Auth
interface AuthProps {
  setUser: Dispatch<SetStateAction<User | null>>;
}

const Auth: React.FC<AuthProps> = ({ setUser }) => {
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User signed in:", result.user);
      setUser(result.user); // Update the user state after sign-in
    } catch (error) {
      console.error("Login failed:", error);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container" style={{ backgroundImage: `url(${background})`, height: "85vh", marginTop: "-10px", backgroundSize: "cover" }}>
      <h1> <HiOutlineClipboardList /> TaskBuddy</h1>
      <p> Streamline your workflow and track progress effortlessly <br />
        with our all-in-one task management app.</p>
      <button className="btnn" onClick={signIn} disabled={loading}> 
        <FcGoogle className="google-icon" />
        Continue with Google
      </button>
    </div>
  );
};

export default Auth;
