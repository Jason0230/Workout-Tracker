// contains a list of set components

import { useState, useEffect } from 'react';
import { getSets, createSet, updateSet, deleteSet } from "../api/set";
import Set from "./Set";

/* 
    Exercise Panel
    Contains information of one exercise
    
    Adding new set
*/
export default function ExercisePanel( { name, category, onDelete, exerciseId } ) {

    const [sets, setSets] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    

    // toggles the set form
    const [addButtonIsVisible, setAddButtonIsVisible] = useState(true);

    useEffect(() => {
        let ignore = false;

        getSets(exerciseId)
            .then((data) => { if (!ignore) setSets(data); })
            .catch((err) => { if (!ignore) setError(err.message); })
            .finally(() => { if (!ignore) setLoading(false); });

        return () => { ignore = true }; 

    }, []);

    const handleAddSet = async (reps, weight, weight_unit) => {
        try {
            const createdSet = await createSet(exerciseId, { reps: parseInt(reps), weight: parseFloat(weight), weight_unit });

            setSets([...sets, createdSet]);
            // remove from from DOM and replace with add set button again
            setAddButtonIsVisible(true);
        }
        catch (err) {
            setError(err.message);
        }
    }

    const handleDeleteSet = async (setId) => {
        try {
            await deleteSet(setId);
            setSets(sets.filter((e) => e.id != setId));
        }
        catch (err) {
            setError(err.message);
        }
        
    }

    return (
        <div className="exercisePanel">
            <label>Exercise Panel</label> <br/>
            <label> Exercise: {name}, Category: {category}</label>

            {error && <p role="alert">{error}</p>}

            <ul>
                {sets.map((set, index) => 
                    <li key={set.id}>
                        <Set 
                            reps={set.reps}
                            weight={set.weight}
                            index={index}
                            unit={set.weight_unit}
                            onDelete={() => handleDeleteSet(set.id)}/>
                    </li>
                )}

            </ul>

            { addButtonIsVisible ? 
                <AddSetButton onClick={() => setAddButtonIsVisible(false)}/> : <SetForm onSuccessfulSubmit={handleAddSet}/>
            }

            <RemoveExerciseButton onClick={() => onDelete(exerciseId)}/>
                

        </div>
    );
}

function SetForm( { onSuccessfulSubmit } ) {
    const [reps, setReps] = useState("");
    const [weight, setWeight] = useState("");
    const [unit, setUnit] = useState("lb");

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
                <select 
                    name="unit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    >
                    <option>lb</option>
                    <option>kg</option>
                </select>
                
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

