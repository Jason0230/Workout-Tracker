import { apiFetch } from "./api";

// POST /api/workout/:workoutId/exercise
export const addExerciseToWorkout = (workoutId, data) => 
    apiFetch(`/workout/${workoutId}/exercise`, { method: "POST", body: JSON.stringify(data) });

// GET /api/workout/:workoutId/:id
export const getExerciseFromWorkout = (workoutId) => 
    apiFetch(`/workout/${workoutId}/exercise`);

// DELETE /api/workout-exercise/:id
export const removeExerciseFromWorkout = (workoutId, workoutExerciseId) => 
    apiFetch(`/workout/${workoutId}/exercise/${workoutExerciseId}`, { method: "DELETE" });