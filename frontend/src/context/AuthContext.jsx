import { createContext, useContext, useEffect, useState } from "react";
import { tryRefresh } from "../api/api";
import * as userApi from "../api/user"

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // initial load
    useEffect(() => {
        tryRefresh()
            .then((ok) => (ok ? userApi.getMe() : null))
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const login = async (email, password) => {
        await userApi.login(email, password);
        setUser(await userApi.getMe());
    }

    const register = async (username, email, password) => {
        await userApi.register(username, email, password);
        await login(email, password);           // log in right after signing up
    };

    const logout = async () => {
        await userApi.logout();
        setUser(null);
    }

    const demoLogin = async () => {
        await userApi.demoLogin();
        setUser(await userApi.getMe());
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, demoLogin }}>
            { children }
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}