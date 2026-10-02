const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/task");

const router = express.Router();

// task list 
router.get("/", async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
});

// create task
router.post("/", async (req, res, next) => {
  try {
    const { title } = req.body;

    if (
      !title ||
      typeof title !== "string" ||
      !title.trim()
    ) {
      return res.status(400).json({
        success: false,
        error: "Task title is required",
      });
    }

    const task = await Task.create({
      title: title.trim(),
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
});

// update task
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

    const task = await Task.findByIdAndUpdate(
      id,
      { completed },
      {
        new: true,
        runValidators: true,
      }
    );


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

// delete task
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    const task = await Task.findByIdAndDelete(id);

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