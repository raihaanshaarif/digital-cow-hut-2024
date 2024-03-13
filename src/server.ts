import mongoose from "mongoose";

async function bootstrap() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/test");
    console.log("Database connection established");
  } catch (err) {
    console.log("Failed to connect database", err);
  }
}
bootstrap();
