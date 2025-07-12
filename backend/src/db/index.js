import { DB_NAME } from '../constant.js';
import mongoose from 'mongoose';
const connectDB = async () => {
  try {
    console.log('db name: ', DB_NAME);
    const uri = `${process.env.MONGODB_URI}/${DB_NAME}`;  // no extra slash after DB_NAME
    const connectInstance = await mongoose.connect(uri);
    console.log(`\nMongodb connected !! DB Host ${connectInstance.connection.host}`);
  } catch (err) {
    console.log('MONGODB CONNECTION FAILED(in src/db): ', err);
    process.exit(1);
  }
};

export default connectDB;
