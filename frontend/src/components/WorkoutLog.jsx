import { useState, useEffect } from 'react';

import WorkoutPanel from './Workout';
import Modal from "./Modal";
import Form from "./Form";

import "./WorkoutLog.css";

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
    const [newestFirst, setNewestFirst] = useState(true);

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


    const sortedWorkouts = [...workouts].sort((a, b) =>
        newestFirst
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date)
    );

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
        <div className="workoutLog">

            <div className="workoutLogHeader">

                <h1> Workout Log </h1>

                <div className="workoutLogHeaderActions">

                    <button className="btn-addWorkout btn-primary" onClick={() => setModalIsOpen(true)}>+ Add Workout</button>
                    <button className="btn-sort btn-primary" onClick={() => setNewestFirst((prev) => !prev)}>Sort: {newestFirst ? "Newest ↓" : "Oldest ↑"}</button>
                    <button className= "btn-logout btn-primary" onClick={logout}>Logout</button>
                    
                </div>
                
            </div>

            <div className="workoutLogBody">
                {error && <p role="alert">{error}</p>}
                

                { workouts.length == 0 ? 
                    <p className="emptyState">No workouts yet. Click "+ Add Workout" to start.</p> :
                    
                    <ul>
                    {sortedWorkouts.map((w) => 
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
                }
                
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
            </div>

            
            
            
            
        </div>
    );
}
