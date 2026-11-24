// contains a list of exercise components

import { useState, useEffect } from 'react';
import ExercisePanel from "./Exercise";
import { addExerciseToWorkout, getExerciseFromWorkout, removeExerciseFromWorkout } from "../api/workoutExercise";

export default function WorkoutPanel( { date, index, onDelete, workoutId, getExerciseId } ) {
    const [exercises, setExercises] = useState([]);
    // toggles the exercise form
    const [addButtonIsVisible, setAddButtonIsVisible] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;   // avoids setting state from a stale/duplicate run
        
        getExerciseFromWorkout(workoutId)
            .then((data) => { if (!ignore) setExercises(data); })
            .catch((err) => { if (!ignore) setError(err.message); })
            .finally(() => { if (!ignore) setLoading(false); });

        return () => { ignore = true }; 
    }, []);


    const handleAddExercise = async (name) => {
        try {
            setError("");
            const exerciseId = await getExerciseId(name);

            if (!exerciseId) {
                setError(`Exercise "${name}" not found.`);
                return;
            }

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
                <ExerciseForm onSuccessfulSubmit={ handleAddExercise }/>}
            
            <RemoveWorkoutButton onClick={() => onDelete(index)}/>
        </div>
    );
}

/* Form component to add information for new exercise */
function ExerciseForm( { onSuccessfulSubmit } ) {
    const [name, setName] = useState("");

    const handleSubmit = (event) => {
        // 1. Prevent the default browser page refresh
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const name = formData.get("name");
        const category = "category";

        // check if exercise is valid
        if (name != "") {
            onSuccessfulSubmit(name, category);
            setName("");
        }
    };

    return(
    <>
        <label> Add New Exercise: </label>
        <form type="submit" onSubmit={ handleSubmit }>
            <label>Name: </label> 
            <input 
                type="text"
                value={name}
                name="name"
                onChange={(e) => setName(e.target.value)}/>
            <br/>

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
