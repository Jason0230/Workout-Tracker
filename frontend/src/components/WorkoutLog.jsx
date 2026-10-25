import { useState } from 'react'
import WorkoutPanel from './Workout'

// contains the code for workoutlog
// Contains a list of Workout components

export default function WorkoutLog() {
    const [workouts, setWorkouts] = useState([]);
    const [addButtonIsVisible, setAddButtonIsVisible] = useState(true);

    const addWorkout = (date) => {
        setWorkouts([...workouts, { date }]);
        setAddButtonIsVisible(true);
    }

    const deleteWorkout = (index) => {
        setWorkouts(workouts.filter((_, i) => i != index));
    }

    return (
        <>
            <label> Workout Log </label>

            <ul>
                {workouts.map((w, index) => 
                    <WorkoutPanel 
                        date={w.date} 
                        index={index} 
                        onDelete={() => deleteWorkout(index)}
                    />
                )}
            </ul>

            {addButtonIsVisible ? 
                <AddWorkoutButton onClick={() => setAddButtonIsVisible(false)}/> : 
                <WorkoutForm onSuccessfulSubmit={ addWorkout }/>   
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
