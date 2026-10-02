const Task = require("../models/task");

const getTasks = async () => {
  return await Task.find().sort({
    createdAt: -1,
  });
};

const createTask = async (title) => {
  return await Task.create({
    title
  });
};

const updateTask = async (id, completed) => {
  return await Task.findByIdAndUpdate(
    id,
    { completed },
    {
      new: true,
      runValidators: true,
    }
  );
};

const deleteTask = async (id) => {
  return await Task.findByIdAndDelete(id);
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};