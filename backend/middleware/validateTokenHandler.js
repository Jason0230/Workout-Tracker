const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Not authorizes
    if (!authHeader?.startsWith("Bearer ")) {
        res.status(401);
        return next(new Error("User is not authorized or token is missing"));
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // { id, username, email }
        next();
    } catch (err) {
        res.status(401);
        next(new Error("Token is invalid or expired"));
    }
};