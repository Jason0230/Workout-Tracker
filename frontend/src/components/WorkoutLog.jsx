import { useState, useEffect } from 'react';

import WorkoutPanel from './Workout';
import Modal from "./Modal";
import Form from "./Form";

import { getWorkouts, createWorkout, deleteWorkout, updateWorkout } from "../api/workout";
import { getExercises } from '../api/exercise';
import { useAuth } from "../context/AuthContext";

// contains the code for workoutlog
// Contains a list of Workout components

export default function WorkoutLog() {
    const { logout } = useAuth();

    const [workouts, setWorkouts] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [editingWorkout, setEditingWorkout] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [exerciseList, setExercistList] = useState([]);

    // initial load (get workouts from api)
    useEffect(() => {
        let ignore = false;   // avoids setting state from a stale/duplicate run

        getWorkouts()
            .then((data) => { if (!ignore) setWorkouts(data); })
            .catch((err) => { if (!ignore) setError(err.message); })
            .finally(() => { if (!ignore) setLoading(false); });

        getExercises()
            .then((data) => { if (!ignore) setExercistList(data); })
            .catch((err) => { if (!ignore) setError(err.message); })
            .finally(() => { if (!ignore) setLoading(false); });
        
        setLoading(false);
        return () => { ignore = true }; 
    }, []);


    const handleCreateWorkout = async (date) => {
        try {
            const createdWorkout = await createWorkout({ date });
            setWorkouts([...workouts, createdWorkout]);
            setModalIsOpen(false);
        } 
        catch (err) {
            setError(err.message);
        }
    }

    const handleEditWorkout = async (date) => {
        const updated = await updateWorkout(editingWorkout.id, { date });
        setWorkouts((prev) =>
            prev.map((w) => (w.id === editingWorkout.id ? updated : w))
        );
        setEditingWorkout(null); // closes the modal
    }

    const handleDeleteWorkout = async (workoutId) => {
        try {
            await deleteWorkout(workoutId);
            setWorkouts(workouts.filter((w) => w.id != workoutId));
        }
        catch (err) {
            setError(err.message);
        }
    }

    const handleAddExercise = async (newExercise) => {
        setExercistList((prev) => [...prev, newExercise]);
    }

    if (loading) return <p>Loading...</p>;

    return (
        <>
            <button onClick={logout}>Logout</button>

            <label> Workout Log </label>

            {error && <p role="alert">{error}</p>}

            { loading ? <p>Loading...</p> :
            <>
            <ul>
                {workouts.map((w) => 
                    <li key={w.id}>
                        <WorkoutPanel 
                            date={w.date} 
                            onEdit={() => setEditingWorkout(w)}
                            onDelete={() => handleDeleteWorkout(w.id)}
                            workoutId={ w.id }
                            handleCreateExercise={handleAddExercise}
                            availableExercises={exerciseList}
                        />
                    </li>
                )}
            </ul>
            
            <button onClick={() => setModalIsOpen(true)}>Add New Workout</button>
            </>}
            
            <Modal isOpen={modalIsOpen} title={"Add Workout"} onClose={() => setModalIsOpen(false)}>
                <Form
                    fields={[
                        { name: "date", label: "Date: ", type: "date" }
                    ]}
                    initialValues={{ "date": new Date().toISOString().split("T")[0] }}
                    onSubmit={({ date }) => handleCreateWorkout(date)}
                    submitLabel="Submit"
                />
            </Modal>
            
            
            <Modal isOpen={!!editingWorkout} title={"Editing Workout"} onClose={() => setEditingWorkout(null)}>
                {editingWorkout && (<Form
                    fields={[
                        { name: "date", label: "Date: ", type: "date" }
                    ]}
                    initialValues={{ "date": editingWorkout.date.slice(0, 10) }}
                    onSubmit={({ date }) => handleEditWorkout(date)}
                    submitLabel="Submit"
                />)}
             </Modal>
            
            
        </>
    );
}
