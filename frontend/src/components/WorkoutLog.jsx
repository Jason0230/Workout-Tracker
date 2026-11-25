import { useState, useEffect } from 'react';

import WorkoutPanel from './Workout';
import Modal from "./Modal";

import { getWorkouts, createWorkout, deleteWorkout, updateWorkout } from "../api/workout";

// contains the code for workoutlog
// Contains a list of Workout components

export default function WorkoutLog() {
    const [workouts, setWorkouts] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // initial load (get workouts from api)
    useEffect(() => {
        let ignore = false;   // avoids setting state from a stale/duplicate run

        getWorkouts()
            .then((data) => { if (!ignore) setWorkouts(data); })
            .catch((err) => { if (!ignore) setError(err.message); })
            .finally(() => { if (!ignore) setLoading(false); });

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

     if (loading) return <p>Loading...</p>;

    return (
        <>
            <label> Workout Log </label>

            {error && <p role="alert">{error}</p>}

            <ul>
                {workouts.map((w) => 
                    <li key={w.id}>
                        <WorkoutPanel 
                            date={w.date} 
                            onDelete={() => handleDeleteWorkout(w.id)}
                            workoutId={ w.id }
                        />
                    </li>
                )}
            </ul>

            <AddWorkoutButton onClick={() => setModalIsOpen(true)}/>

            <Modal isOpen={modalIsOpen} title={"Add Workout"} onClose={() => setModalIsOpen(false)}>
                <WorkoutForm onSuccessfulSubmit={ handleCreateWorkout }/>
            </Modal>
            
        </>
    );
}

function WorkoutForm( { onSuccessfulSubmit } ) {
    const [date, setDate] = useState("");

    const handleSubmit = (event) => {
        // 1. Prevent the default browser page refresh
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const date = formData.get("date");
        // check if exercise is valid
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
