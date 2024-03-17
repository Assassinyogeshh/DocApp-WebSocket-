import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'http';
import dotenv from "dotenv";
import connectMongo from './DB/connect.js';
import DocSchema from './Model/DocSchema.js';
dotenv.config({ path: './config.env' })

const port = process.env.PORT

const url = process.env.DATABASE_URL;

const app = express();

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173"
    },
})


app.use(cors({
    origin: "http://localhost:5173",
},
));

connectMongo(url)


app.use('/', (req, res) => {
    res.send("Successfully Connected to the Server");
});

io.on("connection", (socket) => {

    console.log("Connection Successfully Established With Client");


    socket.on("addDocument", async (docId, data) => {
        try {

            const userDoc = await DocSchema.findOne({ docId })
            if (!userDoc) {
                const document = new DocSchema({ docId, clientDoc: data });
                await document.save()
            }

            const updatedDoc = await DocSchema.findOneAndUpdate({ docId }, { $set: { clientDoc: data } }, { new: true });
            console.log("I am updated Data", updatedDoc);
            io.to(docId).emit("LoadDocument", updatedDoc);
        } catch (error) {
            console.error("Error finding or creating document:", error);
        }
    });

    socket.on("getUserDocuments", async (docId) => {
        try {
            const getDocuments = await DocSchema.findOne({docId});
            socket.join(docId);
            socket.emit("LoadDocument", getDocuments);
        } catch (error) {
            console.error("Error fetching document data:", error);
        }
    })



});


server.listen(port, () => {
    try {
        console.log("Successfully Connected");
    } catch (error) {
        console.log("Failed To Connect:", error);
    }
})