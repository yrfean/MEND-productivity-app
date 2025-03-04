import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDb = async () => {
  const { connection } = await mongoose.connect(process.env.MONGO_URI);
//   console.log(connection);
};

export default connectDb;
