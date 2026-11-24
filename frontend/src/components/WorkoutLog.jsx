import { useState, useEffect } from 'react'
import WorkoutPanel from './Workout'
import { getWorkouts, createWorkout, deleteWorkout, updateWorkout } from "../api/workout";
import { getExercises } from '../api/exercise';

// contains the code for workoutlog
// Contains a list of Workout components

export default function WorkoutLog() {
    const [workouts, setWorkouts] = useState([]);
    const [exerciseList, setExerciseList] = useState([]); // list of exercises
    const [addButtonIsVisible, setAddButtonIsVisible] = useState(true);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // initial load (get workouts from api)
    useEffect(() => {
        let ignore = false;   // avoids setting state from a stale/duplicate run

        getWorkouts()
            .then((data) => { if (!ignore) setWorkouts(data); })
            .catch((err) => { if (!ignore) setError(err.message); })
            .finally(() => { if (!ignore) setLoading(false); });

        getExercises()
            .then((data) => { if (!ignore) setExerciseList(data); })
            .catch((err) => { if (!ignore) setError(err.message); })
            .finally(() => { if (!ignore) setLoading(false); });
    
        return () => { ignore = true }; 
    }, []);


    const getExerciseId = (name) => {
        exerciseList.forEach((exercise) => {
            if (exercise.name == name) {
                return exercise.id;
            }
        });

        return 2;
    }


    const handleCreateWorkout = async (date) => {
        try {
            const createdWorkout = await createWorkout({ date });
            setWorkouts([...workouts, createdWorkout]);
            setAddButtonIsVisible(true);
        } 
        catch (err) {
            setError(err.message);
        }
    }

    const handleDeleteWorkout = async (index) => {
        try {
            await deleteWorkout(workouts[index].id);
            setWorkouts(workouts.filter((_, i) => i != index));
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
                {workouts.map((w, index) => 
                    <li key={workouts[index].id}>
                        <WorkoutPanel 
                            date={w.date} 
                            index={index} 
                            onDelete={() => handleDeleteWorkout(index)}
                            workoutId={ workouts[index].id }
                            getExerciseId={getExerciseId}
                        />
                    </li>
                )}
            </ul>

            {addButtonIsVisible ? 
                <AddWorkoutButton onClick={() => setAddButtonIsVisible(false)}/> : 
                <WorkoutForm onSuccessfulSubmit={ handleCreateWorkout }/>   
            }
            
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
            <input
                type="text"
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
