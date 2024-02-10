import mongoose from 'mongoose';

const dbUrl = process.env.MONGO_URL; // config.util.getEnv('dbUrl');
const connectDB = async () => {
  try {
    await mongoose.connect(config.util.getEnv('dbUrl'));
    console.log('DB Connected Successfully ✅');
  } catch (error) {
    console.log(error.message);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
