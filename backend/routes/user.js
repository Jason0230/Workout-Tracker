const express = require("express");
const router = express.Router();
const {
    createUser,
    getUser, 
    updateUser,
    deleteUser,
    loginUser, 
    refreshToken, 
    logoutUser,
    getMe,
    demoUserLogin
    } = require("../controller/user");

const validateToken = require("../middleware/validateTokenHandler");

router.route("/").post(createUser);
router.route("/login").post(loginUser);
router.route("/refresh").post(refreshToken);
router.route("/logout").post(logoutUser);
router.route("/demo").post(demoUserLogin);

router.route("/me").get(validateToken, getMe)
router.route("/:id").all(validateToken).get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;    