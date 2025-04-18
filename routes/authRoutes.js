const {
  register,
  login,
  logout,
  updateProfile,
  updatePassword,
} = require("../controllers/authController");
const { auth } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", auth, upload.single("image"), updateProfile);
router.put("/update-password", auth, updatePassword);

module.exports = router;
