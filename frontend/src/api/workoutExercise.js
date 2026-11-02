import { apiFetch } from "./api";

// POST /api/workout/:workoutId/exercise
export const addExerciseToWorkout = (id, data) => apiFetch(`/workout/${id}/exercise`, { method: "POST", body: JSON.stringify(data) });

// DELETE /api/workout-exercise/:id
export const removeExerciseFromWorkout = (id) => apiFetch(`/workout/${id}/exercise`, { method: "DELETE" });