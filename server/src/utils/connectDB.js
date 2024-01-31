import config from 'config';
import mongoose from 'mongoose';

const dbUrl = config.get('dbUrl');
const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log('Database connected...');
  } catch (error) {
    console.log(error.message);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
