
import { useState } from "react";

/* 
    Fields: Array of JS objects
        Each JS Object
        Name- name of the field
        Label- Display name of the field
        Type- type of input to use
    Initial Values: JS object, containing initial values for field if needed, uses name: value
    onSubmit: function to handle submit, parameter a js object containing the name:value of all fields
    submitLabel: Text to use for the submit button
    resetOnSuccess: After submitting, decide whether to reset fields back to initial values, default value is true
*/

export default function Form({ fields, initialValues = {}, onSubmit, submitLabel="Submit", resetOnSuccess=true }) {

    // function that takes paramters fields and initial values and creates a json object for each field
    const buildInitialState = () => {
        return fields.reduce((acc, f) => {
            acc[f.name] = initialValues[f.name] ?? "";
            return acc;
        }, {});
    };


    const [values, setValues] = useState(buildInitialState());
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    

    const handleChange = async (name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await onSubmit(values);

            if (resetOnSuccess) setValues(buildInitialState());
        }
        catch (err) {
            setError(err.message || "Something went wrong");
        }
        finally {
            setSubmitting(false);
        }
    }

    return (
        <form className="genericForm" onSubmit={handleSubmit}>
            {error && <p className="formError" role="alert">{error}</p>}
            
            {
                fields.map((field) => (
                    <div className="formField" key={field.name}>
                        <label htmlFor={field.name} className="formLabel">{field.label}</label>
                        <input 
                            id= {field.name}
                            type={field.type || "text"} 
                            value={values[field.name]}
                            required={field.required ?? true}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                        />
                    </div>
                ))
            }

            <button type="submit" disabled={submitting}>
                {submitting ? "Saving..": submitLabel}
            </button>

        </form>

    );

}