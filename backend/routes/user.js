const express = require("express");
const router = express.Router();
const {
    getUsers,
    createUser,
    getUser, 
    updateUser,
    deleteUser,
    loginUser, 
    refreshToken, 
    logoutUser
    } = require("../controller/user");

router.route("/").get(getUsers).post(createUser);
router.route("/login").post(loginUser);
router.route("/refresh").post(refreshToken);
router.route("/logout").post(logoutUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;    