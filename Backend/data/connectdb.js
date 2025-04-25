import mongoose from "mongoose";


 export const dbconn = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { dbName: "busbooking" });
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
    }
};

 
