const API_BASE = "http://localhost:5000/api";

let accesstoken = null;

function setAccessToken(token) {
    accesstoken = token;
}

async function apiFetch(endpoint, options = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...options.headers,
    };

    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
        credentials: "include", // sends the httpOnly refresh cookie automatically
    });

    if (res.status === 401 && endpoint !== "/user/refresh") {
        const refreshed = await tryRefresh();
        if (refreshed) {
            return apiFetch(endpoint, options); // retry original request
        }
    }

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.message || `Request failed: ${res.status}`);
    }

    return res.status === 204 ? null : res.json();
}

async function tryRefresh() {
    try {
        const res = await fetch(`${API_BASE}/user/refresh`, {
            method: "POST",
            credentials: "include",
        });

        if (!res.ok) return false;

        const data = await res.json();
        setAccessToken(data.accessToken);
        return true;
    } catch {
        return false;
    }
}