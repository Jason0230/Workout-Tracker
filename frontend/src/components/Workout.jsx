import "./Workout.css"

import { useState, useEffect } from 'react';

import ExercisePanel from "./Exercise";
import Modal from "./Modal"
import ActionMenu from "./ActionMenu";
import ExerciseForm from "./ExerciseForm";

import { addExerciseToWorkout, getExerciseFromWorkout, updateWorkoutExercise, removeExerciseFromWorkout } from "../api/workoutExercise";
import { createSet } from "../api/set";

export default function WorkoutPanel( { date, onEdit, onDelete, workoutId, handleCreateExercise, availableExercises, imExpanded } ) {
    const [exercises, setExercises] = useState([]);
    const [collapsedIds, setCollapsedIds] = useState({});
    const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
    const [editingExercise, setEditingExercise] = useState(null);
    const [isExpanded, setIsExpanded] = useState(imExpanded);

    const [loading, setLoading] = useState(true);
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
        
        setLoading(false);
        return () => { ignore = true }; 
    }, [workoutId]);

    const toggleExercise = (id) => {
        setCollapsedIds((prev) => ({ ...prev, [id]: !prev[id] }));
    };


    const handleAddExercise = async (exerciseId) => {
        try {
            setError("");

            const createdExercise = await addExerciseToWorkout(workoutId, { exerciseId });
            await createSet(createdExercise.id, { reps: 0, weight: 0, weight_unit: "lb" } );
            setExercises([...exercises, createdExercise]);
            setCreateModalIsOpen(false);
        }
        catch (err) {
            setError(err.message);
        }
    };

    const handleEditExercise = async (newExerciseId) => {
        try {
            setError("");

            const updated = await updateWorkoutExercise(workoutId, editingExercise.id, {
                exerciseId: newExerciseId,
            });
            setExercises((prev) =>
                prev.map((e) => (e.id === editingExercise.id ? updated : e))
            );
            setEditingExercise(null); // closes the modal
        }
        catch (err) {
            setError(err.message);
        }
        
    }

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

                </button>
                <ActionMenu onEdit={onEdit} onDelete={onDelete}/>
            </div>

            {isExpanded && 

            <div className="workoutBody">
                {error && <p role="alert">{error}</p>}

                { loading ? <p>Loading exercises...</p> : 
                
                (<>
                <ul className="exerciseList">
                    {exercises.map((e) => 
                        <li key={e.id}>  
                            <ExercisePanel 
                                name={e.exercise.name} 
                                category={e.exercise.category} 
                                onDelete={() => handleDeleteExercise(e.id)}
                                onEdit={() => setEditingExercise(e)}
                                exerciseId={e.id}
                                isCollapsed={!!collapsedIds[e.id]}
                                onToggle={() => toggleExercise(e.id)}
                            />
                        </li>
                    )}
                </ul>
                <button className="addExercise" onClick={() => setCreateModalIsOpen(true)}>Add New Exercise</button>
                </>)}
            </div>
            }
            
            <Modal isOpen={createModalIsOpen} title={"Add Exercise"} onClose={() => setCreateModalIsOpen(false)}>
                <ExerciseForm 
                    onSuccessfulSubmit={ handleAddExercise }
                    availableExercises={ availableExercises }
                    onExerciseCreated={ handleCreateExercise }
                    initialExerciseId= ""
                    />
            </Modal>

            <Modal isOpen={!!editingExercise} title={"Edit Exercise"} onClose={() => setEditingExercise(null)}>
                {editingExercise && (
                <ExerciseForm 
                    onSuccessfulSubmit={ handleEditExercise }
                    availableExercises={ availableExercises }
                    onExerciseCreated={ handleCreateExercise }
                    initialExerciseId={ editingExercise.exercise.id }
                    />)}
            </Modal>
        </div>
    );
}
