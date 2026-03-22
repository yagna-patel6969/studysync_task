const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    if (!uri) {
      console.log('No MONGO_URI found in .env, starting In-Memory MongoDB Server...');
      mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    if (!process.env.MONGO_URI) {
      console.log(`(In-Memory Server active at ${uri})`);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
