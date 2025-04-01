const User = require("../models/User");
const Task = require("../models/Task");

const getCurrentUser = async (req, res) => {
  const user = await User.findOne(req.email);
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
    },
  });
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");

    const userTaskCount = await Promise.all(
      users.map(async (user) => {
        const countPendingTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "pending",
        });

        const countProgressTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "in-progress",
        });

        const countCompletedTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "completed",
        });

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
          profileImage: user.profileImage,
          pending: countPendingTasks,
          inProgress: countProgressTasks,
          completed: countCompletedTasks,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      })
    );

    res.json(userTaskCount);
  } catch (error) {
    res.status(400).json({ message: "server error", error: error.message });
  }
};

module.exports = {
  getCurrentUser,
  getUsers,
};
