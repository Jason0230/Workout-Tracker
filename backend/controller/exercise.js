const asyncHandler = require("express-async-handler");
const prisma = require("../config/dbConnection")

//@desc Get All Exercises
//@route GET /api/exercise
//@access public
const getExercises = asyncHandler(async (req, res) => {
    const exercises = await prisma.exericse.all();

    return exercises;
});

//@decs Add an Exercise
//@route POST /api/exercise
//@access public
const createExercise = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { name, category } = req.body;

    if (!name || ! category) {
        res.status(400);
        throw new Error("All Fields are mandatory")
    }

    const exercise = await Exercise.create({
        name, category
    })

    res.status(201).json(exercise);
});

//desc Get an Exercise
const getExercise = asyncHandler(async (req, res) => {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
        res.status(404);
        throw new Error("Exercise not Found");
    }

    res.status(200).json(exercise);
})

//@desc Update Exercise
//@route PUT /api/exercise/:id
//@access public
const updateExercise = asyncHandler(async (req, res) => {
    console.log(req.body);
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
        res.status(404);
        throw new Error("Exercise not Found");
    }

    const {name, category} = req.body;

    if (!name || !category) {
        res.status(400);
        throw new Error("All Fields are mandatory");
    }

    const updatedExercise = await Exercise.findByIdAndUpdate(
        req.params.id,
        req.body,
        { returnDocument: 'after', runValidators: true }
    );

    res.status(200).json(updatedExercise);
});

//@desc Delete Exercise
//@route DELETE /api/exercise/:id
//@access public
const deleteExercise = asyncHandler(async (req, res) => {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
        res.status(404);
        throw new Error("Exercise not Found")
    }

    await Exercise.deleteOne();

    res.status(200).json(exercise);

});

module.exports = { getExercises, createExercise, getExercise, updateExercise, deleteExercise }