// contains a list of set components
import "./Exercise.css";
import "./Set.css";

import { useState, useEffect } from 'react';
import { getSets, createSet, updateSet, deleteSet } from "../api/set";
import Set from "./Set";

/* 
    Exercise Panel
    Contains information of one exercise
    
    Adding new set
*/
export default function ExercisePanel( { name, category, onDelete, exerciseId, isCollapsed, onToggle } ) {

    const [sets, setSets] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isExpanded, setIsExpanded] = useState(!isCollapsed);

    useEffect(() => {
        let ignore = false;

        getSets(exerciseId)
            .then((data) => { if (!ignore) setSets(data); })
            .catch((err) => { if (!ignore) setError(err.message); })
            .finally(() => { if (!ignore) setLoading(false); });

        return () => { ignore = true }; 

    }, []);

    // acts as a preset
    const handleQuickAddSet = async () => {
        const lastSet = sets[sets.length - 1];
        const newSetData = lastSet
            ? { reps: lastSet.reps, weight: lastSet.weight, weight_unit: lastSet.weight_unit }
            : { reps: 0, weight: 0, weight_unit: "lb" };

        const createdSet = await createSet(exerciseId, newSetData);
        setSets((prev) => [...prev, createdSet]);
    };

    const handleUpdateSet = async (setId, updatedData) => {
        try {
            setError("");
            const savedSet = await updateSet(setId, updatedData);
            setSets((prev) => prev.map((s) => (s.id === setId ? savedSet : s)));
        } catch (err) {
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

            <div className="exerciseHeader">
                <button 
                    className="exerciseToggle"
                    type="button"
                    onClick={() => {
                        setIsExpanded((prev) => !prev)
                        onToggle();
                    }}>
                    
                    <span>{isExpanded ? "▼" : "▶"}</span>
                    <label className="exercisePanelLabel"> Exercise: {name}, Category: {category}</label>
                    <button className="delete" onClick={() => onDelete(exerciseId)}> Remove Exercise </button> 
                </button>
            
            </div>

            {isExpanded && 
                <div className="exerciseBody">
                    {error && <p role="alert">{error}</p>}

                    {sets.length > 0 && (
                        <div className="setHeader">
                            <span className="setLabel">Set</span>
                            <span>Reps</span>
                            <span>Weight</span>
                            <span>Unit</span>
                            <span></span> {/* Empty header for the delete button column */}
                        </div>
                    )}

                    <ul className="setList">
                        {sets.map((set, index) => 
                            <li key={set.id}>
                                <Set
                                    set={set}
                                    index={index}
                                    onUpdate={handleUpdateSet}
                                    onDelete={handleDeleteSet}
                                    />
                            </li>
                        )}

                    </ul>
                    
                    <button className="add" onClick={handleQuickAddSet}> Add Set </button>
                </div>
            }
        </div>
    );
}
