import {useState} from React;

export default function WorkoutPanel() {
    [exercises, setExercises] = useState([]);

    function onAddExercises( { id, name, category }, index ) {
        setExercises()
    }

    return (
        <div className="workoutPanel">
            <text>Workout Panel</text>
        </div>
    );
}




function AddWorkoutButton() {

}

function RemoveWorkoutButton() {

}