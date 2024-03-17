import mongoose from "mongoose";

const docsSchema = new mongoose.Schema({

    docId:{
        type:String,
        required:true,
    },
    clientDoc: {
        type: String,
        required:true
    }
});

export default mongoose.model('webSocketDoc', docsSchema);
