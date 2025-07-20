import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => console.log("Connected With MongoDB"));
    await mongoose.connect(`${process.env.MONGODB_URI}/passiondb`);
  } catch (error) {
    console.log("ERROR WHILE CONNECTING WITH PASSION DB : ", error);
    throw error;
  }
};
