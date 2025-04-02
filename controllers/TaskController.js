const Task = require("../models/Task");
const User = require("../models/User");

const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      dueDate,
      assignedTo,
      attachments,
      todoChecklist,
    } = req.body;

    if (!Array.isArray(assignedTo)) {
      return res.status(400).json({
        message: "assignedTo field must be required, array of user id",
      });
    }

    const tasks = await Task.create({
      title,
      description,
      dueDate,
      assignedTo,
      createdBy: req.user._id,
      attachments,
      todoChecklist,
    });

    res.status(201).json({
      message: "task created successfully",
      tasks,
    });
  } catch (error) {
    res.status(400).json({ message: "server error", error: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { createdBy: req.user._id };
    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email profileImage")
      .populate("createdBy", "name email profileImage");
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ message: "server error", error: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImage"
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({ message: "server error", error: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (
      req.user.role !== "admin" &&
      task.createdBy.toString() != req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    const { status } = req.body;

    task.status = status;

    if (task.status === "completed") {
      task.todoChecklist.forEach((item) => item.completed === true);
      task.progress = 100;
    }

    await task.save();

    res.json({
      message: "task created successfully",
      task,
    });
  } catch (error) {
    res.status(400).json({ message: "server error", error: error.message });
  }
};

const updateTodoCheckList = async (req, res) => {
  try {
    const { todoChecklist } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (
      req.user.role !== "admin" &&
      task.assignedTo.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    task.todoChecklist = todoChecklist;

    if (task.todoChecklist.length > 0) {
      const completedItems = task.todoChecklist.filter(
        (item) => item.completed
      ).length;
      task.progress = Math.round(
        (completedItems / task.todoChecklist.length) * 100
      );
    }

    await task.save();

    const updateTask = await Task.findById(task._id).populate(
      "assignedTo",
      "name email profileImage"
    );

    res.json(updateTask);
  } catch (error) {
    res.status(400).json({ message: "server error", error: error.message });
  }
};

const getDashboardData = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({ status: "pending" });
    const inProgressTasks = await Task.countDocuments({
      status: "in-progress",
    });
    const completedTasks = await Task.countDocuments({ status: "completed" });
    const overdueTasks = await Task.countDocuments({
      status: { $ne: "completed" },
      dueDate: { $lt: new Date() },
    });

    const taskDistributionRaw = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskDistribution = taskDistributionRaw.map((item) => ({
      status: item._id,
      count: item.count,
    }));

    const recentUsers = await User.find({ role: "user" })
      .select("-password")
      .sort({ createAt: -1 })
      .limit(5);

    const recentTasks = await Task.find()
      .populate("assignedTo", "name email profileImage")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      data: {
        userStats: {
          totalUsers,
        },
        taskStats: {
          total: totalTasks,
          pending: pendingTasks,
          inProgress: inProgressTasks,
          completed: completedTasks,
          overdue: overdueTasks,
        },
        recentUsers,
        recentTasks,
        charts: {
          taskDistribution,
        },
      },
    });
  } catch (error) {
    res.status(400).json({ message: "server error", error: error.message });
  }
};

const getUserDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalTasks = await Task.countDocuments({ assignedTo: userId });
    const pendingTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "pending",
    });
    const inProgressTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "in-progress",
    });
    const completedTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "completed",
    });
    const overdueTasks = await Task.countDocuments({
      assignedTo: userId,
      status: { $ne: "completed" },
      dueDate: { $lt: new Date() },
    });

    const recentTasks = await Task.find({ assignedTo: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      data: {
        taskStats: {
          total: totalTasks,
          pending: pendingTasks,
          inProgress: inProgressTasks,
          completed: completedTasks,
          overdue: overdueTasks,
        },
        recentTasks,
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          profileImage: req.user.profileImage,
        },
      },
    });
  } catch (error) {
    res.status(400).json({ message: "server error", error: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTaskStatus,
  updateTodoCheckList,
  getDashboardData,
  getUserDashboardData,
};
