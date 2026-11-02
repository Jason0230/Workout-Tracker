import { apiFetch, setAccessToken } from "./api";

//!TODO get me to know id of the user

// POST /api/user (public)
export const register = (username, email, password) => 
    apiFetch("/user", {
        method: "POST",
        body: JSON.stringify({ username, email, password })
});

// POST /api/user/login (public)
// Stores the access token in memory. The refresh token arrives as an httpOnly cookie.
export async function login(email, password) {
    const data = await apiFetch("/user/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
    setAccessToken(data.accessToken);
    return data;
}

// POST /api/user/logout (public, uses the refresh cookie)
// Revokes the refresh token on the server, then clears the local access token.
export async function logout() {
    try {
        await apiFetch("/user/logout", { method: "POST" });
    } finally {
        setAccessToken(null); // clear it even if the request fails
    }
}

// GET /api/user/:id (private, must be your own id)
export const getUser = (id) => apiFetch(`/user/${id}`);

// PUT /api/user/:id (private, must be your own id)
// Send only the fields you want to change: { username?, email?, password? }
export const updateUser = (id, changes) => 
    apiFetch(`user/${id}`, {
        method: 'PUT',
        body: JSON.stringify(changes)
});

// DELETE /api/user/:id (private, must be your own id)
export const deleteUser = (id) => {
    const deleted = apiFetch(`user/${id}`, {method: 'DELETE'});
    setAccessToken(null);
    return deleted
}

// Get /api/user/me (private) returns user info
export const getMe = () => apiFetch("user/me");