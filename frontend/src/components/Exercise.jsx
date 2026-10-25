// contains a list of set components

import { useState } from 'react';
import Set from "./Set";

/* 
    Exercise Panel
    Contains information of one exercise
    
    Adding new set
*/
export default function ExercisePanel( { name, category, index, onDelete } ) {

    const [sets, setSets] = useState([]);
    // toggles the set form
    const [addButtonIsVisible, setAddButtonIsVisible] = useState(true);

    const createSet = (reps, weight, unit) => {
        setSets([...sets, { reps: parseInt(reps), weight: parseInt(weight), unit } ]);
        // remove from from DOM and replace with add set button again
        setAddButtonIsVisible(true);
    }

    const deleteSet = (index) => {
        setSets(sets.filter((_, i) => i != index));
    }

    return (
        <div className="exercisePanel">
            <label>Exercise Panel</label> <br/>
            <label> Exercise: {name}, Category: {category}</label>

            {/* Display current sets here */}
            <ul>
                {sets.map((s, index) => 
                    <>
                        <Set 
                            reps={s.reps}
                            weight={s.weight}
                            unit={s.unit}
                            index={index}
                            onDelete={deleteSet}/>
                    </>
                )}

            </ul>

            {/* new set form here */}

            { addButtonIsVisible ? 
                <AddSetButton onClick={() => setAddButtonIsVisible(false)}/> : <SetForm onSuccessfulSubmit={createSet}/>
            }

            <RemoveExerciseButton onClick={() => onDelete(index)}/>
                
             
            

        </div>
    );
}

function SetForm( { onSuccessfulSubmit } ) {
    const [reps, setReps] = useState("");
    const [weight, setWeight] = useState("");
    const [unit, setUnit] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const reps = formData.get("reps");
        const weight = formData.get("weight");
        const unit = formData.get("unit");

        if (reps != "" && weight != "") {
            onSuccessfulSubmit(reps, weight, unit);
            setReps("");
            setWeight("");
            setUnit("");
        }
    }

    return (
        <>
            <form type="Submit" onSubmit={handleSubmit}>

                <label>Reps: </label>
                <input
                    name="reps"
                    type="number"
                    pattern="\d*"
                    title="Only numbers are allowed"
                    value={reps} 
                    onChange={(e) => setReps(e.target.value)} />
                <br/>

                <label>Weight: </label>
                <input
                    name="weight"
                    type="number"
                    pattern="\d*"
                    title="Only numbers are allowed"
                    value={weight} 
                    onChange={(e) => setWeight(e.target.value)} />
                <br/>

                <label>Weight Unit: </label>
                <input
                    name="unit"
                    type="text" 
                    value={unit} 
                    title="lb or kg"
                    pattern="lb|kg"
                    onChange={(e) => setUnit(e.target.value)} />
                <br/>

                <button type="submit">Submit</button>

            </form>

            
        </>

    );
}

// enables visibility for setform
function AddSetButton( { onClick } ) {
    return (
        <button onClick={onClick}> Add Set </button>
    );
}

function RemoveExerciseButton( { onClick } ) {
    return (
        <button onClick={onClick}> Remove Exercise </button> 
    );
}

