import { error } from "console";
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
    throw new error("Please define the mongodb url");

}

async function dbConnect() {
    if (mongoose.connection.readyState !== 1) {
        try {
            await mongoose.connect(MONGO_URI);
            console.log("DB is connected");
        }
        catch (error) {
            console.log(error);
            throw error
        }
    }
    else {
        console.log("DB is already connected")

    }
}

export default dbConnect;