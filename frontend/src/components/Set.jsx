import { useState } from "react";
import "./Set.css";

export default function Set( { set, index, onUpdate, onDelete } ) {
    const [reps, setReps] = useState(set.reps);
    const [weight, setWeight] = useState(set.weight);
    const [unit, setUnit] = useState(set.weight_unit);


    const handleSave = (overrides = {}) => {
        const updated = {
            reps: parseInt(overrides.reps ?? reps, 10),
            weight: parseFloat(overrides.weight ?? weight),
            weight_unit: overrides.unit ?? unit,
        };

        if (!Number.isNaN(updated.reps) &&
            !Number.isNaN(updated.weight) &&
            (updated.reps !== set.reps ||
             updated.weight !== set.weight ||
             updated.weight_unit !== set.weight_unit)
        ) {
            onUpdate(set.id, updated);
        }
    };

    return (
        <div className="setPanel">
            <span>{index+1}</span>

            <input
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                onBlur={() => handleSave()}
                placeholder="Reps"
            />

            <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                onBlur={() => handleSave()}
                placeholder="Weight"
            />

            <select
                value={unit}
                onChange={(e) => {
                    setUnit(e.target.value);
                    handleSave({ unit: e.target.value }); // save dropdown immediately
                }}
            >
                <option value="lb">lb</option>
                <option value="kg">kg</option>
            </select>

            <button onClick={() => onDelete(set.id)}>-</button>
        </div>
    );
}
