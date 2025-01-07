import mongoose from "mongoose";

// Define the schema with some example fields (you can modify these based on your needs)
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"],default: "user" },
  },
  { timestamps: true }
);

// Create a model based on the schema
const User = mongoose.model("User", UserSchema);

// Export the model (so it can be used to interact with the MongoDB collection)
export default User;
