import mongoose from "mongoose";

//function to conect to mongodb database
const connectDB= async()=>{
    mongoose.connection.on('connected',()=>console.log('Database Connected'))

    await mongoose.connect(`${process.env.MONGODB_URI}/Job-Portal`)
}

export default connectDB;