const asyncHandler = require("express-async-handler");
const { prisma } = require("../config/dbConnection");
const bcrypt = require("bcrypt");

const getUsers = asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            username: true,
            email: true,
            createdAt: true,
            // exclude password
        }
    });

    res.status(200).json(users);
}); 

const createUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are Mandatory");
    }

    const existingUser = await prisma.user.findUnique({
        where: {email}
    });

    if (existingUser) {
        res.status(400);
        throw new Error("User already exists");
    }

    const hashedPassword = bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword
        },
        select: {
            id: true,
            username: true,
            email: true,
            createdAt: true,
        },
    });

    res.status(200).json(user);
});

const getUser = asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
        where: {id: Number(req.params.id)},
        select: {
            id: true,
            username: true,
            email: true,
            createdAt: true,
        }
    });

    if (!user) {
        res.status(404);
        throw new Error("User not Found");
    }

    res.status(200).json(user);
})

const updateUser = asyncHandler(async (req, res) => {

    const user = await prisma.user.findUnique({
        where: {id: Number(req.params.id)},
        select: {
            id: true,
            username: true,
            email: true,
            createdAt: true,
        }
    });

    if (!user) {
        res.status(404);
        throw new Error("User not Found");
    }

    const { username, email, password } = req.body;
        
    let hashedPassword;
    if (password) {
        hashedPassword = bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
        data: {
            ...(username && { username }),
            ...(email && { email }),
            ...(hashedPassword && { password: hashedPassword }),
        },
        select: {
            id: true,
            username: true,
            email: true,
            createdAt: true,
        },
    });

    res.status(200).json(updatedUser);
});

const deleteUser = asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: Number(req.params.id) },
    });

    if (!user) {
        res.status(404);
        throw new Error("User not Found");
    }

    const deletedUser = await prisma.user.delete({
        where: { id: Number(req.params.id) },
        select: {
            id: true,
            username: true,
            email: true,
        },
    });

    res.status(200).json(deletedUser);
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are Mandatory");
    }

    const user = await prisma.user.findFirst({ where: email });

    if (!user) {
        res.status(401);
        throw new Error("Invalid Email or Password");
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
        res.status(401);
        throw new Error("Invalid Email or Password");
    }

    //!TODO ADD JWT
    res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
    });
})

module.exports = { getUsers, createUser, getUser, updateUser, deleteUser };