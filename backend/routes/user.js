const express = require("express");
const router = express.Router();
const {
    getUsers,
    createUser,
    getUser, 
    updateUser,
    deleteUser,
    loginUser
    } = require("../controller/user");

router.route("/").get(getUsers).post(createUser);
router.route("/login").post(loginUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;    