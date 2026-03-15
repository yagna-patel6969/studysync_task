const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  priority: { 
    type: String, 
    enum: ['critical', 'high', 'medium', 'low'], 
    default: 'medium' 
  },
  status: { 
    type: String, 
    enum: ['todo', 'in-progress', 'done'], 
    default: 'todo' 
  },
  deadline: { type: Date },
  category: { type: String, default: 'study' },
  tags: [{ type: String }],
  assignee: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
