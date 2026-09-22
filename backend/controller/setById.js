const asyncHandler = require("express-async-handler");
const { prisma } = require("../config/dbConnection");

//@desc Get a Single Set by ID
//@route GET /api/set/:id
//@access public
const getSet = asyncHandler(async (req, res) => {
    const set = await prisma.set.findUnique({
        where: {id: Number(req.params.id)}
    });

    if (!set) {
        res.status(404);
        throw new Error("Set not Found");
    }

    res.status(200).json(set);
});

//@desc Update a Set
//@route PUT /api/set/:id
//@access public
const updateSet = asyncHandler(async (req, res) => {
    const set = await prisma.set.findUnique({
        where: {id: Number(req.params.id)}
    });

    if (!set) {
        res.status(404);
        throw new Error("Set not Found");
    }

    const { exerciseId, reps, weight, weight_unit } = req.body;

    if (!reps || !weight || !weight_unit) {
        res.status(400);
        throw new Error("All Fields are mandatory");
    }

    const updatedSet = await prisma.set.update({
        where: { id: Number(req.params.id) },
        data: {
            reps,
            weight,
            weight_unit,
            ...(exerciseId && { exerciseId: Number(exerciseId) }),
        },
        include: { exercise: true },
    });

    res.status(200).json(updatedSet);
});

//@desc Delete a Set
//@route DELETE /api/set/:id
//@access public
const deleteSet = asyncHandler(async (req, res) => {
    const set = await prisma.set.findUnique({
        where: { id: Number(req.params.id) },
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