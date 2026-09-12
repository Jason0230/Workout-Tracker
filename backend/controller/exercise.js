const asyncHandler = require("express-async-handler");
const { prisma } = require("../config/dbConnection");

//@desc Get All Exercises
//@route GET /api/exercise
//@access public
const getExercises = asyncHandler(async (req, res) => {
    const exercises = await prisma.exercise.findMany();

    res.status(200).json(exercises);
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

    const exercise = await prisma.exercise.create({
        data: {
            name, category
        }
    })

    res.status(201).json(exercise);
});

//@desc Get an Exercise
//@route GET /api/exercise/:id
//@access public
const getExercise = asyncHandler(async (req, res) => {
    const exercise = await prisma.exercise.findUnique({where: {id: Number(req.params.id)}});

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

//@desc Delete Exercise
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