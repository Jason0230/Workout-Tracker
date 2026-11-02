import { apiFetch } from "./api";

// Get All Sets for a Workout
// GET /api/workout-exercise/:workoutIdExercise/set
export const getSets = (id) => apiFetch(`/workout-exercise/${id}/set`);

// POST /api/workout-exercise/:workoutExerciseId/set
export const createSet = (id, data) => apiFetch(`/workout-exercise/${id}/set`, { method: "POST", body: JSON.stringify(data) });

// GET /api/set/:id
export const getSet = (id) => apiFetch(`/set/${id}`);

// PUT /api/set/:id
export const updateSet = (id, data) => apiFetch(`/set/${id}`, { method: "PUT", body: JSON.stringify(data) });

// DELETE /api/set/:id
export const deleteSet = (id) => apiFetch(`/set/${id}`, { method: "DELETE" });