import mongoose from "mongoose";

const connectMongo= async(url)=>{
    try {
        if (!url) {
            throw new Error("Mongoose Error:",url);
        }

        await mongoose.connect(url);
        console.log("Connected To The Databases");
    } catch (error) {
        console.log(error);
    }
}


export default connectMongo;