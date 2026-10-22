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


//@desc Get All Workouts
//@route GET /api/workout
//@access public
const getWorkouts = asyncHandler(async (req, res) => {
    const workouts = await prisma.workout.findMany({
            include: workoutInclude});

    res.status(200).json(workouts);
});

//@desc Create a Workouts
//@route POST /api/workout
//@access public
const createWorkout = asyncHandler(async (req, res) => {

    const { userId, date } = req.body;

    if (!userId || !date) {
        res.status(400);
        throw new Error("All fields are Mandatory");
    }

    const user = await prisma.user.findUnique({
        where: {id: Number(userId)}
    });

    if (!user) {
        res.status(404);
        throw new Error("User not Found");
    }

    const workout = await prisma.workout.create({
        data: {
            date: new Date(date),
            userId: Number(userId)
        }
    });

    res.status(201).json(workout);
});

const getWorkout = asyncHandler(async (req, res) => {
    const workout = await prisma.workout.findUnique({
        where: { id: Number(req.params.id) },
    });

    if (!workout) {
        res.status(404);
        throw new Error("Workout not Found");
    }

    res.status(200).json(workout);
});

const updateWorkout = asyncHandler(async (req, res) => {
    const workout = await prisma.workout.findUnique({
        where: {id: Number(req.params.id)},
    });

    if (!workout) {
        res.status(404);
        throw new Error("Workout not Found");
    }

    const { date } = req.body;

    const updatedWorkout = await prisma.workout.update({
        where: {id: Number(req.params.id)},
        data: {
            date: new Date(date)
        }
    })

    res.status(200).json(updatedWorkout);
});

const deleteWorkout = asyncHandler(async (req, res) => {
    const workout = await prisma.workout.findUnique({
        where: {id: Number(req.params.id)},
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