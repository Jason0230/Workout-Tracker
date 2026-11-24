// contains a list of exercise components

import { useState, useEffect } from 'react';
import ExercisePanel from "./Exercise";
import { addExerciseToWorkout, getExerciseFromWorkout, removeExerciseFromWorkout } from "../api/workoutExercise";
import { getExercises } from '../api/exercise';

export default function WorkoutPanel( { date, onDelete, workoutId } ) {
    const [exercises, setExercises] = useState([]);
    const [exerciseList, setExerciseList] = useState([]); // list of exercises

    // toggles the exercise form
    const [addButtonIsVisible, setAddButtonIsVisible] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // convert date into a format
    date = new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
    });

    useEffect(() => {
        let ignore = false;   // avoids setting state from a stale/duplicate run
        
        getExerciseFromWorkout(workoutId)
            .then((data) => { if (!ignore) setExercises(data); })
            .catch((err) => { if (!ignore) setError(err.message); })
            .finally(() => { if (!ignore) setLoading(false); });

        getExercises()
            .then((data) => { if (!ignore) setExerciseList(data); })
            .catch((err) => { if (!ignore) setError(err.message); })
            .finally(() => { if (!ignore) setLoading(false); });

        return () => { ignore = true }; 
    }, []);


    const handleAddExercise = async (exerciseId) => {
        try {
            setError("");

            const createdExercise = await addExerciseToWorkout(workoutId, { exerciseId });
            setExercises([...exercises, createdExercise]);
            setAddButtonIsVisible(true);
        }
        catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteExercise = async (exercisesId) => {
        try {
            await removeExerciseFromWorkout(workoutId, exercisesId);
            setExercises(exercises.filter((e) => e.id != exercisesId));
        }
        catch (err) {
            setError(err.message)
        }
    }; 

    return (
        <div className="workoutPanel">

            <label>Workout, Date: {date}</label>

            {error && <p role="alert">{error}</p>}

            <ul>
                {exercises.map((e) => 
                    <li key={e.id}>  
                        <ExercisePanel 
                            name={e.exercise.name} 
                            category={e.exercise.category} 
                            onDelete={() => handleDeleteExercise(e.id)}
                            exerciseId={e.id}
                        />
                        
                    </li>
                )}
            </ul>
            
            { addButtonIsVisible ? 
                <AddExerciseButton onClick={() => setAddButtonIsVisible(false)}/> :
                <ExerciseForm onSuccessfulSubmit={ handleAddExercise } exerciseList={exerciseList}/>}
            
            <RemoveWorkoutButton onClick={onDelete}/>
        </div>
    );
}

/* Form component to add information for new exercise */
function ExerciseForm( { onSuccessfulSubmit, exerciseList } ) {
    const [exerciseId, setExerciseId] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        
        // check if exercise is valid
        if (exerciseId != "") {
            onSuccessfulSubmit(Number(exerciseId));
            setExerciseId("");
        }
    };

    return(
    <>
        <label> Add New Exercise: </label>
        <form type="submit" onSubmit={ handleSubmit }>

            <select 
                value={exerciseId}
                onChange={(e) => setExerciseId(e.target.value)}
                required>
                <option value="" disabled>-- Select an Exercise --</option>

                {exerciseList.map( (ex) => (
                    <option key={ex.id} value={ex.id}>
                    {ex.name} ({ex.category})
                    </option>
                ))}

                <option value="">-- Add New Exercise --</option>

            </select>

            <button type="submit">Submit</button>

        </form>
    </>
    )
}

function AddExerciseButton( { onClick } ) {
    return (
        <button onClick={onClick}>Add New Exercise</button>
    )
}

function RemoveWorkoutButton( { onClick } ) {
    return (
        <button onClick={onClick}>Delete Workout</button>
    )
}
