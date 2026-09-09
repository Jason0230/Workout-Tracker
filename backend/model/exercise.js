const mongoose = require("mongoose");

const exerciseSchema = mongoose.Schema({
    name: String,
    category: [String]
});

module.exports = mongoose.model("Exercise", exerciseSchema);