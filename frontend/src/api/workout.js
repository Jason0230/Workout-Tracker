// api/workouts
import { apiFetch } from "./api";

// GET /api/workout (private)
export const getWorkouts = () => apiFetch("/workout");

// POST /api/workout (private)
export const createWorkout = (data) => apiFetch("/workout", { method: "POST", body: JSON.stringify(data) });


// GET /api/workout/:id (private)
export const getWorkout = (id) => apiFetch(`/workout/${id}`);

// PUT /api/workout/:id (private)
export const updateWorkout = (id, data) => 
    apiFetch(`/workout/${id}`, { method: "PUT", body: JSON.stringify(data) });


// DELETE /api/workout/:id
export const deleteWorkout = (id) => {
    apiFetch(`/workout/${id}`, { method: "DELETE"});
}
