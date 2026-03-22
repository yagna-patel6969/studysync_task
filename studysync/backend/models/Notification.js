const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['deadline', 'achievement', 'group', 'ai', 'leaderboard', 'task'],
    default: 'task'
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  taskRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
