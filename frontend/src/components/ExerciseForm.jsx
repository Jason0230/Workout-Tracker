
// Separate form components
// Since it uses dropdown select instead of regular text input
// with special create new exercise

import { useState } from "react";
import { createExercise } from "../api/exercise";

import Form from "./Form"; 
import Modal from "./Modal";

const addNewExerciseText = "-- Add New Exercise --";

/* Form component to add information for new exercise */
export default function ExerciseForm( { onSuccessfulSubmit, availableExercises, onExerciseCreated, initialExerciseId} ) {
    const [exerciseId, setExerciseId] = useState(String(initialExerciseId));
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createError, setCreateError] = useState("");

    const handleCreateExercise = async (name, category) => {

        try {
            const created = await createExercise({ name, category }); // POST /api/exercise
            onExerciseCreated(created);           // adds `created` to availableExercises in parent
            setExerciseId(String(created.id));    // auto-selects it in the dropdown
            setIsCreateModalOpen(false);          // closes the popup
            return true;
        }
        catch (err) {
            setCreateError(err.message);
            return false;
        }

    }; 

    const handleSelectChange = (e) => {
        if (e.target.value == "__ADD_NEW__") {
            setCreateError("");
            setIsCreateModalOpen(true);
            return;
        }

        setExerciseId(e.target.value);
    }

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
                onChange={(e) => handleSelectChange(e)}
                required>
                <option value="" disabled>-- Select an Exercise --</option>

                {availableExercises.map( (ex) => (
                    <option key={ex.id} value={ex.id}>
                    {ex.name} ({ex.category})
                    </option>
                ))}

                <option value="__ADD_NEW__">{addNewExerciseText}</option>

            </select>

            <button type="submit">Submit</button>

        </form>

        <Modal 
            isOpen={isCreateModalOpen} 
            onClose={() => setIsCreateModalOpen(false)}
            title={"Create New Exercise"}>
            
            <Form 
                fields= { [
                    { name: "name", label: "Name: ", type: "text" },
                    { name: "category", label: "Category: ", type: "text" }
                ]}
                onSubmit={({ name, category }) => handleCreateExercise(name, category)}
            />

            
            {createError && <p role="alert">{createError}</p>}
        </Modal>
    </>
    )
}
