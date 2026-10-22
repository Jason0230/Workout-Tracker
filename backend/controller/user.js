const asyncHandler = require("express-async-handler");
const { prisma } = require("../config/dbConnection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//@desc Gets all Users on the api, excludes their password
//@route GET /api/user
//@access private
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

//@desc Creates a new User (Register)
//@route POST /api/user
//@access public
//@param {string} username
//@param {string} email - Must be unique to other users
//@param {string} password
const createUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are Mandatory");
    }

    const existingUser = await prisma.user.findFirst({
        where: {email}
    });

    if (existingUser) {
        res.status(400);
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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

//@desc Get a User based on Id
//@route GET /api/user/:id
//@access private
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

//@desc Updates a User
//@route PUT /api/user/:id
//@access private
//@param {string} username
//@param {string} email - Must be unique to other users
//@param {string} password
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
        hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
        where: { id: Number(req.params.id) },
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

//@desc Deletes a User
//@route DELETE /api/user/:id
//@access private
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

//@desc Login User
//@route POST /api/user/login
//@access public
//@param {string} email
//@param {string} password
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are Mandatory");
    }

    const user = await prisma.user.findFirst({ where: {email} });

    if (!user) {
        res.status(401);
        throw new Error("Invalid Email or Password");
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
        res.status(401);
        throw new Error("Invalid Email or Password");
    }

    const accessToken = jwt.sign({ user: { id: user.id, username: user.username, email: user.email } }, 
                                    process.env.JWT_SECRET,
                                    { expiresIn: "15m" }
                                );
    
    const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    );

    // set the first refresh token
    await prisma.user.update({where: {id: user.id}, data: {refreshToken}});
    
    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // only HTTPS in prod
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    })

    res.status(200).json({ accessToken });
});

//@desc Refreshes Access Token
//@route POST /api/user/refresh
//@access public
const refreshToken = asyncHandler(async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        res.status(401);
        throw new Error("No refresh token provided")
    }

    const incomingRefreshToken = cookies.jwt;

    const user = await prisma.user.findFirst(
        { where: { refreshToken: incomingRefreshToken } }
    );

    if (!user) {
        jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
            if (err) {
                // token is garbage/expired and not tied to anyone — nothing more to do
                res.status(403);
                throw new Error("Invalid refresh token");
            }

            // Token was valid/signed correctly but not found in DB → REUSE DETECTED.
            // Someone used an old, already-rotated-out token. Revoke that user's session entirely.
            await prisma.user.update({
                where: { id: decoded.id },
                data: { refreshToken: null },
            });

            res.status(403);
            throw new Error("Refresh token reuse detected — session revoked");
        });
        return;
    }

    jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
        if (err || user.id !== decoded.id) {
            res.status(403);
            throw new Error("Invalid or expired refresh token");
        }

        const newAccessToken = jwt.sign(
            { user: { id: user.id, username: user.username, email: user.email } },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        const newRefreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        // set the first refresh token
        await prisma.user.update({ where: { id: user.id }, data: { refreshToken: newRefreshToken } });

        res.cookie("jwt", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({ accessToken: newAccessToken });
    });
});

//@desc Log outs a User
//@route POST /api/user/logout
//@access public
const logoutUser = asyncHandler(async (req, res) => {

    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.sendStatus(204); // no content, nothing to do
    }

    const incomingRefreshToken = cookies.jwt;

    const user = await prisma.user.findFirst({
        where: { refreshToken: incomingRefreshToken },
    });

    if (user) {
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: null },
        });
    }

    res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    res.sendStatus(204);

});

module.exports = { getUsers, createUser, getUser, updateUser, deleteUser, loginUser, refreshToken, logoutUser };