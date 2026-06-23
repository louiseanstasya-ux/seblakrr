import mongoose from "mongoose"

mongoose.Promise = Promise;

const mongoServer = async (): Promise<void> => {
    try {
        if (mongoose.connection.readyState === 1) {
            console.log("Mongodb is Alreay Connected");
            return ;
        } 

        if (!process.env.MONGO_URI) {
            console.log("Please Check Env + ${process.env.MONGO_URI} ");
            return ;
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongodb is connected successfully");
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        throw error; // Let the API route handle the error instead of crashing the process
    }
}

export default mongoServer;