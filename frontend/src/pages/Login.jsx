
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function Login() {

    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await login(email, password);
            navigate("/");
        }
        catch (err) {
            setError(err.message);   // "Invalid Email or Password"
        }
        finally {
            setSubmitting(false);
        }
        
    }

    return (
        <>
            <form onSubmit={handleSubmit}>

                <label> Email: </label>
                <input 
                    id="email" 
                    type="email"
                    value={email}
                    onChange= {(e) => setEmail(e.target.value)}
                />

                <br/>

                <label> Password: </label>
                <input 
                    id="password" 
                    type="text"
                    value={password}
                    onChange= {(e) => setPassword(e.target.value)}
                />

                <button type="submit" disabled={submitting}>
                    {submitting ? "Logging in..." : "Log In"}
                </button>

                

                <p>No account? <Link to="/register">Register</Link></p>

                {error && <p role="alert">{error}</p>}
            </form>
        </>
    );


}