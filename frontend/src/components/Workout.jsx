// contains a list of exercise components

import { useState } from 'react';
import ExercisePanel from "./Exercise";

export default function WorkoutPanel( { date, index, onDelete} ) {
    const [exercises, setExercises] = useState([]);
    // toggles the exercise form
    const [addButtonIsVisible, setAddButtonIsVisible] = useState(true);

    const onNewExerciseSubmit = (name, category) => {
        setExercises([...exercises, { name, category }]);
        setAddButtonIsVisible(true);
    };

    const deleteExercise = (index) => {
        setExercises(exercises.filter((_, i) => i != index));
    }; 

    return (
        <div className="workoutPanel">
            <label>Workout, Date: {date}</label>

            <ul>
                {exercises.map((e, index) => 
                <>  
                    <ExercisePanel 
                        name={e.name} 
                        category={e.category} 
                        index={index} 
                        onDelete={deleteExercise}/>
                    
                </>)}
            </ul>
            
            { addButtonIsVisible ? 
                <AddExerciseButton onClick={() => setAddButtonIsVisible(false)}/> :
                <ExerciseForm onSuccessfulSubmit={ onNewExerciseSubmit }/>}
            
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
