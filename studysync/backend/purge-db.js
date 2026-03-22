require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Task = require('./models/Task');
const Group = require('./models/Group');
const Notification = require('./models/Notification');

async function purgeDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for purging...');

    const resultTasks = await Task.deleteMany({});
    console.log(`Deleted ${resultTasks.deletedCount} tasks.`);

    const resultGroups = await Group.deleteMany({});
    console.log(`Deleted ${resultGroups.deletedCount} groups.`);

    const resultNotifications = await Notification.deleteMany({});
    console.log(`Deleted ${resultNotifications.deletedCount} notifications.`);

    // Optional: Delete users except maybe a test admin? 
    // The user said "if new user comes in", implying we should keep the ability to register but clean up existing data.
    // I'll delete all users for a truly fresh start.
    const resultUsers = await User.deleteMany({});
    console.log(`Deleted ${resultUsers.deletedCount} users.`);

    console.log('Database purge complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error purging database:', error);
    process.exit(1);
  }
}

purgeDatabase();
