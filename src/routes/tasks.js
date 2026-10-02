const express = require("express");
const mongoose = require("mongoose");

const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../services/taskService");

const router = express.Router();

// Get task list
router.get("/", async (req, res, next) => {
  try {
    const tasks = await getTasks();

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
});

// Create task
router.post("/", async (req, res, next) => {
  try {
    const { title } = req.body;

    if (
      !title ||
      typeof title !== "string"
    ) {
      return res.status(400).json({
        success: false,
        error: "Task title is required",
      });
    }

    const task = await createTask(title);

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
});

// Update task
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    if (typeof completed !== "boolean") {
      return res.status(400).json({
        success: false,
        error: "completed must be a boolean",
      });
    }

    const task = await updateTask(id, completed);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
});

// Delete task
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    const task = await deleteTask(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;