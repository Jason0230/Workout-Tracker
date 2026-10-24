const express = require("express");
const env = require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");
const app = express();
const connectDb = require("./config/dbConnection")
const cookieParser = require("cookie-parser");
const cors = require("cors");

const port = process.env.PORT || 5200;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

const validateToken = require("./middleware/validateTokenHandler");

connectDb();
app.use(express.json());
app.use(cookieParser());
app.use("/api/exercise", validateToken, require("./routes/exercise"));
app.use("/api/workout-exercise/:workoutExerciseId/set", validateToken, require("./routes/set"));
app.use("/api/set", validateToken, require("./routes/setById"));
app.use("/api/workout", validateToken, require("./routes/workout"));
app.use("/api/workout-exercise", validateToken, require("./routes/workoutExerciseById"));
app.use("/api/user", require("./routes/user"));
app.use(errorHandler);



app.listen(port, () => {
    console.log("Port Connected, ", port);
});

