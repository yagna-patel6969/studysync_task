require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    const users = await User.find({}, 'name email score');
    if (users.length === 0) {
      console.log('No users found in the database. (The database is fresh!)');
    } else {
      console.log('List of users in the database:');
      users.forEach((u, i) => {
        console.log(`${i + 1}. Name: ${u.name}, Email: ${u.email}, Score: ${u.score}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking users:', error);
    process.exit(1);
  }
}

checkUsers();
