const asyncHandler = require("express-async-handler");
const { prisma } = require("../config/dbConnection");

//@desc Gets all Exercises in api
//@route GET /api/exercise
//@access private
const getExercises = asyncHandler(async (req, res) => {
    const exercises = await prisma.exercise.findMany( {
        where: {
            OR: [
            { userId: null },
            { userId: req.user.id },
            ],
        },
        orderBy: { name: "asc" },
    } );

    res.status(200).json(exercises);
});

//@decs Add a new Exercise to the api
//@route POST /api/exercise
//@access private
//@param {string} name - Name of new Exercise
//@param {string} category - Category for new Exercise
const createExercise = asyncHandler(async (req, res) => {
    const { name, category } = req.body;

    if (!name || ! category) {
        res.status(400);
        throw new Error("All Fields are mandatory")
    }

    try {
        const exercise = await prisma.exercise.create({
            data: {
                name, category, userId: req.user.id
            }
        })

        res.status(201).json(exercise);
    }
    // catch duplication error
    catch (err) {
        if (err.code == "P2002") {
            res.status(409);
            throw new Error("You already have an exercise with that name");
        }

        throw err;
    }
});

//@desc Get a single Exercise, with id
//@route GET /api/exercise/:id
//@access private
const getExercise = asyncHandler(async (req, res) => {

    const exercise = await prisma.exercise.findUnique({
        where: { 
            id: Number(req.params.id),
            OR: [ 
                { userId: Number(req.params.id) },
                { userId: null }]
        }
    });

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
    const exercise = await prisma.exercise.findUnique({ 
        where: {
            id: Number(req.params.id),
            userId: req.user.id         // can only edit own exercises
        }});

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
            where: { 
                id: Number(req.params.id),
                userId: req.user.id 
            },

            data: { name, category }
        }
    );

    res.status(200).json(updatedExercise);
});

//@desc Delete Exercise with id
//@route DELETE /api/exercise/:id
//@access private
const deleteExercise = asyncHandler(async (req, res) => {
    const exercise = await prisma.exercise.findUnique({
        where: {
            id: Number(req.params.id)
        }
    });

    if (!exercise) {
        res.status(404);
        throw new Error("Exercise not Found")
    }

    const deletedExercise = await prisma.exercise.delete({ 
        where: { 
            id: Number(req.params.id),
            userId: req.user.id
        } 
    });

    res.status(200).json(deletedExercise);

});

module.exports = { getExercises, createExercise, getExercise, updateExercise, deleteExercise }