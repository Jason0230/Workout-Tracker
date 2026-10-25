const asyncHandler = require("express-async-handler");
const { prisma } = require("../config/dbConnection");

//@desc Get a Single Set using Id
//@route GET /api/set/:id
//@access private
const getSet = asyncHandler(async (req, res) => {
    const set = await prisma.set.findFirst({
        where: { 
            id: Number(req.params.id),
            workoutExercise: { workout: { userId: req.user.id } } 
        }
    });

    if (!set) {
        res.status(404);
        throw new Error("Set not Found");
    }

    res.status(200).json(set);
});

//@desc Update a Set using Id
//@route PUT /api/set/:id
//@access private
//@param {Number} reps - Number of repeitions in that set
//@param {Number} weight - Weight of that set 
//@param {string} weight_unit - Unit of weight that was used in that set
const updateSet = asyncHandler(async (req, res) => {
    const set = await prisma.set.findFirst({
        where: {
            id: Number(req.params.id), 
            workoutExercise: { workout: { userId: req.user.id } }
        }
    });

    if (!set) {
        res.status(404);
        throw new Error("Set not Found");
    }

    const { reps, weight, weight_unit } = req.body;

    if (!reps || !weight || !weight_unit) {
        res.status(400);
        throw new Error("All Fields are mandatory");
    }

    const updatedSet = await prisma.set.update({
        where: { id: Number(req.params.id) },
        data: { reps, weight, weight_unit }
    });

    res.status(200).json(updatedSet);
});

//@desc Delete a Set
//@route DELETE /api/set/:id
//@access private
const deleteSet = asyncHandler(async (req, res) => {
    const set = await prisma.set.findFirst({
        where: { 
            id: Number(req.params.id),
            workoutExercise: { workout: { userId: req.user.id } }
        },
    });

    if (!set) {
        res.status(404);
        throw new Error("Set not Found");
    }

    const deletedSet = await prisma.set.delete({
        where: { id: Number(req.params.id) },
    });

    res.status(200).json(deletedSet);
});

module.exports = { getSet, updateSet, deleteSet };