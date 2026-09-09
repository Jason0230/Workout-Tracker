const mongoose = require(mongoose);

const userSchema = mongoose.Schema({
    _id : 'UUID',
    username : String
});

module.exports = mongoose.model("User", userSchema);