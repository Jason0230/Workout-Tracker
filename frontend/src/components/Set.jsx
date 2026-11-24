
export default function Set( { reps, weight, unit, index, onDelete } ) {
    return (
        <div className="setPanel">
            <label>Set #{index+1} </label>
            <label>Reps: {reps}, Weight: {weight}, unit: {unit} </label>
            <RemoveSetButton onDelete={onDelete}/>
        </div>
    );
}

function RemoveSetButton( {onDelete} ) {
    return(
        <button onClick={onDelete}>-</button>
    );
}