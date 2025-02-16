const Task = require("../models/taskModel");


// Create a new task
exports.createTask = async (req, res) => {
    try {
        const { title, description, dueDate, status } = req.body;

        const newTask = new Task({
            userId: req.user._id,
            title,
            description,
            dueDate,
            status,
        });

        await newTask.save();
        res.status(201).json({ message: "Task created successfully", task: newTask });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all tasks for a user
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user._id });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get a single task by ID
exports.getSingleTask = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

        if (!task) return res.status(404).json({ message: "Task not found" });

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update a task
exports.updateTask = async (req, res) => {
    try {
        const { title, description, dueDate, status } = req.body;
        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { title, description, dueDate, status },
            { new: true, runValidators: true }
        );

        if (!updatedTask) return res.status(404).json({ message: "Task not found" });

        res.status(200).json({ message: "Task updated successfully", task: updatedTask });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

        if (!deletedTask) return res.status(404).json({ message: "Task not found" });

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
