
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {

    const { register } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await register(username, email, password);
            navigate("/");
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setSubmitting(false);
        }
    };

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

                <label> Username: </label>
                <input 
                    id="username" 
                    type="text"
                    value={username}
                    onChange= {(e) => setUsername(e.target.value)}
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
                    {submitting ? "Loading..." : "Register"}
                </button>

                {error && <p role="alert">{error}</p>}
            </form>
        </>

    );
}