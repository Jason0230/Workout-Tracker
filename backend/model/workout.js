const moongoose = require("mongoose");

const workoutSchema = mongoose.Schema({
    _id: 'UUID',
    user_id: 'UUID', 
    date: Date,
    workout_type: String
});

module.exports = mongoose.model(("Workout"), workoutSchema);