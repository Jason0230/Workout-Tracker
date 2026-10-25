const asyncHandler = require("express-async-handler");
const { prisma } = require("../config/dbConnection");


const workoutInclude = {
    workoutExercises: {
        include: {
            exercise: true,
            sets: true,
        },
    },
};


//@desc Get all Workouts of a User
//@route GET /api/workout
//@access private
const getWorkouts = asyncHandler(async (req, res) => {
    const workouts = await prisma.workout.findMany({
            where: { userId: req.user.id },
            include: workoutInclude,
            orderBy: { date: "desc" },
        });

    res.status(200).json(workouts);
});

//@desc Create a Workouts
//@route POST /api/workout
//@access private
//@param {DateTime} date
const createWorkout = asyncHandler(async (req, res) => {

    const { date } = req.body;

    if (!date) {
        res.status(400);
        throw new Error("All fields are Mandatory");
    }

    const workout = await prisma.workout.create({
        data: {
            date: new Date(date),
            userId: Number(req.user.id)
        }
    });

    res.status(201).json(workout);
});

//@desc Gets a Workout based on workout Id
//@route GET /api/workout/:id
//@access private
const getWorkout = asyncHandler(async (req, res) => {
    const workout = await prisma.workout.findFirst({
        where: { 
            id: Number(req.params.id),
            userId: Number(req.user.id)
        },
    });

    if (!workout) {
        res.status(404);
        throw new Error("Workout not Found");
    }

    res.status(200).json(workout);
});


//@desc Updates a Workout based on Id
//@route PUT /api/workout/:id
//@access private
//@param {DateTime} date
const updateWorkout = asyncHandler(async (req, res) => {
    const workout = await prisma.workout.findFirst({
        where: {
            id: Number(req.params.id),
            userId: Number(req.user.id)
        },
    });

    if (!workout) {
        res.status(404);
        throw new Error("Workout not Found");
    }

    const { date } = req.body;

    const updatedWorkout = await prisma.workout.update({
        where: { id: Number(req.params.id) },
        data: {
            date: new Date(date)
        }
    })

    res.status(200).json(updatedWorkout);
});

//@desc Deletes a Workout based on Id
//@route DELETE /api/workout/:id
//@access private
const deleteWorkout = asyncHandler(async (req, res) => {
    const workout = await prisma.workout.findFirst({
        where: {
            id: Number(req.params.id),
            userId: Number(req.user.id)
        },
    });

    if (!workout) {
        res.status(404);
        throw new Error("Workout not Found");
    }

    const deletedWorkout = await prisma.workout.delete({
        where: {id: Number(req.params.id)},
    });

    res.status(200).json(deletedWorkout);
});



module.exports = { getWorkouts, createWorkout, getWorkout,  updateWorkout, deleteWorkout };