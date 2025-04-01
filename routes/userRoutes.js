const { getCurrentUser, getUsers } = require("../controllers/userController");
const { auth, admin } = require("../middleware/auth");

const router = require("express").Router();

router.get("/profile", auth, getCurrentUser);
router.get("/", auth, admin, getUsers);

module.exports = router;
