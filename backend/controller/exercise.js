const asyncHandler = require("express-async-handler");
const { prisma } = require("../config/dbConnection");

//@desc Gets all Exercises in api
//@route GET /api/exercise
//@access private
const getExercises = asyncHandler(async (req, res) => {
    const exercises = await prisma.exercise.findMany();

    res.status(200).json(exercises);
});

//@decs Add a new Exercise to the api
//@route POST /api/exercise
//@access private
//@param {string} name - Name of new Exercise
//@param {string} category - Category for new Exercise
const createExercise = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { name, category } = req.body;

    if (!name || ! category) {
        res.status(400);
        throw new Error("All Fields are mandatory")
    }

    const exercise = await prisma.exercise.create({
        data: {
            name, category
        }
    })

    res.status(201).json(exercise);
});

//@desc Get a single Exercise, with id
//@route GET /api/exercise/:id
//@access private
const getExercise = asyncHandler(async (req, res) => {
    const exercise = await prisma.exercise.findUnique({where: {id: Number(req.params.id)}});

    if (!exercise) {
        res.status(404);
        throw new Error("Exercise not Found");
    }

    res.status(200).json(exercise);
})

//@desc Update an single Exercise, with id
//@route PUT /api/exercise/:id
//@access private
//@param {string} name - New Name of new Exercise
//@param {string} category - New category for new Exercise
const updateExercise = asyncHandler(async (req, res) => {
    console.log(req.body);
    const exercise = await prisma.exercise.findUnique({where: {id: Number(req.params.id)}});

    if (!exercise) {
        res.status(404);
        throw new Error("Exercise not Found");
    }

    const {name, category} = req.body;

    if (!name || !category) {
        res.status(400);
        throw new Error("All Fields are mandatory");
    }
    const updatedExercise = await prisma.exercise.update(
        {
            where: {id: Number(req.params.id)},
            data: {name, category}
        }
    );

    res.status(200).json(updatedExercise);
});

//@desc Delete Exercise with id
//@route DELETE /api/exercise/:id
//@access public
const deleteExercise = asyncHandler(async (req, res) => {
    const exercise = await prisma.exercise.findUnique({where: {id: Number(req.params.id)}});

    if (!exercise) {
        res.status(404);
        throw new Error("Exercise not Found")
    }

    const deletedExercise = await prisma.exercise.delete({ where: { id: Number(req.params.id) } });

    res.status(200).json(deletedExercise);

});

module.exports = { getExercises, createExercise, getExercise, updateExercise, deleteExercise }