
const API_BASE = import.meta.env.VITE_APP_API_URL;

let accessToken = null;
let refreshPromise = null;

export function setAccessToken(token) {
    accessToken = token;
}

async function sendRequest(endpoint, options) {
    return fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            ...options.headers,
        },
        credentials: "include", // lets the browser send/receive the refresh cookie
    });
}

// Step 2: ask the server for a new access token
export async function tryRefresh() {
    if (!refreshPromise) {
        refreshPromise = fetch(`${API_BASE}/user/refresh`, {
            method: "POST",
            credentials: "include",
        })
            .then(async (res) => {
                if (!res.ok) {
                    setAccessToken(null);
                    return false;               // refresh failed: user is logged out
                }
                const data = await res.json();
                setAccessToken(data.accessToken);
                return true;                    // got a new pass
            })
            .catch(() => false)                 // network error: treat as failed
            .finally(() => {
                refreshPromise = null;
            });
    }
    return refreshPromise;
}

// Step 3: what the rest of your app calls
export async function apiFetch(endpoint, options = {}) {
    let res = await sendRequest(endpoint, options);

    // Pass expired? Get a new one and retry exactly once.
    const isAuthRoute = endpoint === "/user/login" || endpoint === "/user/refresh";
    if (res.status === 401 && !isAuthRoute) {
        const refreshed = await tryRefresh();
        if (refreshed) {
            res = await sendRequest(endpoint, options);
        }
    }

    // Still not OK? Throw an error so the caller can handle it.
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Request failed (${res.status})`);
    }

    return res.status === 204 ? null : res.json();
}