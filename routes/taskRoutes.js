const {
  createTask,
  getTasks,
  getTaskById,
  updateTaskStatus,
  updateTodoCheckList,
  getDashboardData,
  getUserDashboardData
} = require("../controllers/TaskController");
const { auth, admin } = require("../middleware/auth");

const router = require("express").Router();

router.post("/create", auth, admin, createTask);
router.get("/", auth, admin, getTasks);
router.get("/:id", auth, getTaskById);
router.put("/status/:id", auth, updateTaskStatus);
router.put("/:id/todo", auth, updateTodoCheckList);
router.get("/admin/dashboard", auth, admin, getDashboardData);
router.get("/user/dashboard", auth, getUserDashboardData);

module.exports = router;
