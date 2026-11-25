import "./Workout.css"

import { useState, useEffect } from 'react';

import ExercisePanel from "./Exercise";
import Modal from "./Modal"

import { addExerciseToWorkout, getExerciseFromWorkout, removeExerciseFromWorkout } from "../api/workoutExercise";
import { getExercises, createExercise } from '../api/exercise';

// constants
const addNewExerciseText = "-- Add New Exercise --";

export default function WorkoutPanel( { date, onDelete, workoutId, handleCreateExercise, availableExercises } ) {
    const [exercises, setExercises] = useState([]);
    const [collapsedIds, setCollapsedIds] = useState({});
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    

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

        return () => { ignore = true }; 
    }, [workoutId]);

    const toggleExercise = (id) => {
        setCollapsedIds((prev) => ({ ...prev, [id]: !prev[id] }));
    };


    const handleAddExercise = async (exerciseId) => {
        try {
            setError("");

            const createdExercise = await addExerciseToWorkout(workoutId, { exerciseId });
            setExercises([...exercises, createdExercise]);
            setModalIsOpen(false);
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

            <div className="workoutHeader"> 

                <button 
                    type="button"
                    className="workoutToggle"
                    onClick={() => setIsExpanded((prev) => !prev)}>

                    <span>{isExpanded ? "▼" : "▶"}</span>
                    <span className="workoutPanelLabel">{date}</span>

                    <button className="delete" onClick={onDelete}>Delete Workout</button>
                </button>
            </div>

            {isExpanded && 

            <div className="workoutBody">
                {error && <p role="alert">{error}</p>}

                <ul className="exerciseList">
                    {exercises.map((e) => 
                        <li key={e.id}>  
                            <ExercisePanel 
                                name={e.exercise.name} 
                                category={e.exercise.category} 
                                onDelete={() => handleDeleteExercise(e.id)}
                                exerciseId={e.id}
                                isCollapsed={!!collapsedIds[e.id]}
                                onToggle={() => toggleExercise(e.id)}
                            />
                        </li>
                    )}
                </ul>
                
                <button onClick={() => setModalIsOpen(true)}>Add New Exercise</button>
            </div>
            }
            
            <Modal isOpen={modalIsOpen} title={"Add Exercise"} onClose={() => setModalIsOpen(false)}>
                    <ExerciseForm 
                        onSuccessfulSubmit={ handleAddExercise }
                        availableExercises={ availableExercises }
                        onExerciseCreated={ handleCreateExercise }
                        />
            </Modal>
        </div>
    );
}

/* Form component to add information for new exercise */
function ExerciseForm( { onSuccessfulSubmit, availableExercises, onExerciseCreated } ) {
    const [exerciseId, setExerciseId] = useState("");
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

            <CreateNewExerciseForm createExercise={handleCreateExercise}></CreateNewExerciseForm>
            {createError && <p role="alert">{createError}</p>}
        </Modal>
    </>
    )
}

function CreateNewExerciseForm ( { createExercise } ) {

    const [name, setName] = useState("");
    const [category, setCategory] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // check if name and category is valid
        if (name != "" && category != "") {
            const success = await createExercise(name, category);
            
            if (success) {
                setName("");
                setCategory("");
            }
        }
    }


    return (
        <>  
            <form type="submit" onSubmit={handleSubmit}>
                <label>Name of Exercise: </label>
                <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <br/>

                <label>Category: </label>
                <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
                <br/>

                <button type="submit">Submit</button>
            </form>
        </>
    );
}