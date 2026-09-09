const moongoose = require("mongoose");

const setSchema = mongoose.Schema({
    user_id: 'UUID',
    workout_id: 'UUID',
    weight: Number,
    weight_unit: String,
    reps: Number,
    set_number: Number,
    exercise_id: Number
}); 

module.exports = mongoose.model("Set", setSchema);