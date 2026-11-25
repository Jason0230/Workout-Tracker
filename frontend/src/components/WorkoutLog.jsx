import { useState, useEffect } from 'react';

import WorkoutPanel from './Workout';
import Modal from "./Modal";

import { getWorkouts, createWorkout, deleteWorkout, updateWorkout } from "../api/workout";
import { getExercises } from '../api/exercise';
import { useAuth } from "../context/AuthContext";

// contains the code for workoutlog
// Contains a list of Workout components

export default function WorkoutLog() {
    const { logout } = useAuth();

    const [workouts, setWorkouts] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);

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
                <WorkoutForm onSuccessfulSubmit={ handleCreateWorkout }/>
            </Modal>
            
        </>
    );
}

function WorkoutForm( { onSuccessfulSubmit } ) {
    const [date, setDate] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        if (date != "") {
            onSuccessfulSubmit(date);
            setDate("");
        }
    };

    return (
        <>
        <label>Add Workout</label>
        <form type="submit" onSubmit={handleSubmit}>
            Date: <input
                type="date"
                value={date}
                name="date"
                onChange={(e) => setDate(e.target.value)}
            />
            
            <button type="submit">Submit</button>
        </form>
        </>
    );
}

function AddWorkoutButton( { onClick } ) {
    return (
        <button onClick={onClick}>Add New Workout</button>
    )
}
