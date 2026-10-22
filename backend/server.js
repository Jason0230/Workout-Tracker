const express = require("express");
const env = require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");
const app = express();
const connectDb = require("./config/dbConnection")
const cookieParser = require("cookie-parser");
const cors = require("cors");

const port = process.env.PORT || 5000;

connectDb();
app.use(express.json());
app.use(cookieParser());
app.use("/api/exercise", require("./routes/exercise"));
app.use("/api/workout/:workoutId/set", require("./routes/set"));
app.use("/api/set", require("./routes/setById"));
app.use("/api/workout/", require("./routes/workout"));
app.use("/api/user", require("./routes/user"));
app.use(errorHandler);
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))


app.listen(port, () => {
    console.log("Port Connected, ", port);
});

