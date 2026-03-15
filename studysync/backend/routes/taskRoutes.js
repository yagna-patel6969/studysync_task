const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');

const router = express.Router();

// Middleware to verify token (simplified for now)
const protect = require('./middleware/authMiddleware');

// Get all tasks for the logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ assignee: req.user.id }).sort({ deadline: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new task
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, priority, deadline, groupId, category, tags, assignee } = req.body;
    
    const taskData = {
      title,
      description,
      priority,
      deadline,
      category,
      tags,
      assignee: assignee || req.user.id
    };

    // Only add groupId if it's a valid non-empty string
    if (groupId && groupId.trim() !== '') {
      taskData.groupId = groupId;
    }

    const task = new Task(taskData);
    const savedTask = await task.save();
    
    // Populate assignee for the response
    const populatedTask = await Task.findById(savedTask._id).populate('assignee', 'name initials id');
    
    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Task Creation Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update task status (and handle gamification scoring)
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findOne({ _id: req.params.id, assignee: req.user.id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const previousStatus = task.status;
    task.status = status;
    await task.save();

    // Gamification Logic: Update User Score
    if (previousStatus !== 'done' && status === 'done') {
      const user = await User.findById(req.user.id);
      user.tasksCompleted += 1;
      user.score += 5; // +5 points for completing a task
      await user.save();
    } else if (previousStatus === 'done' && status !== 'done') {
      const user = await User.findById(req.user.id);
      user.tasksCompleted -= 1;
      user.score -= 5; // Revert points if accidentally marked done
      await user.save();
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a task (edit details)
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, description, priority, deadline, category, tags } = req.body;
    let task = await Task.findOne({ _id: req.params.id, assignee: req.user.id });

    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.title = title || task.title;
    task.description = description !== undefined ? description : task.description;
    task.priority = priority || task.priority;
    task.deadline = deadline || task.deadline;
    task.category = category || task.category;
    task.tags = tags || task.tags;

    const savedTask = await task.save();
    res.json(savedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a task
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, assignee: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await Task.deleteOne({ _id: req.params.id });

    // Deduct points if it was a completed task
    if (task.status === 'done') {
      const user = await User.findById(req.user.id);
      user.tasksCompleted = Math.max(0, user.tasksCompleted - 1);
      user.score = Math.max(0, user.score - 5);
      await user.save();
    }

    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
