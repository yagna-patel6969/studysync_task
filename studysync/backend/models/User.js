const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  initials: { type: String },
  level: { type: Number, default: 1 },
  score: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  tasksCompleted: { type: Number, default: 0 },
  tasksMissed: { type: Number, default: 0 },
  daysActive: { type: Number, default: 0 },
  badges: [{ type: String }],
  googleRefreshToken: { type: String }
}, { timestamps: true });

// Pre-save to generate initials if not provided
userSchema.pre('save', function() {
  if (this.isModified('name') || this.isNew) {
    const names = this.name.split(' ');
    this.initials = names.length > 1 
      ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      : this.name.substring(0, 2).toUpperCase();
  }
});

module.exports = mongoose.model('User', userSchema);
