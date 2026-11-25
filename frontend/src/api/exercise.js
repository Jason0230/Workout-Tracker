import { apiFetch } from "./api";

// GET /api/exercise
export const getExercises = () => apiFetch("/exercise");

// POST /api/exercise
export const createExercise = (data) => apiFetch("/exercise", { method: "POST", body: JSON.stringify(data)});

// GET /api/exercise/:id
export const getExercise = (id) => apiFetch(`/exercise/${id}`);

// PUT /api/exercise/:id
export const updateExercise = (id, data) => apiFetch(`/exercise/${id}`, { method: "PUT", body: JSON.stringify(data) });

// DELETE /api/exercise/:id
export const deleteExercise = (id) => apiFetch(`/exercise/${id}`, { method: "DELETE" });
