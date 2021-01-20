import express from "express";
import cors from "cors";
import userRouter from "./routes/userRouter.js"
import transactionRouter from "./routes/transactionRouter.js"
import publicInfoRouter from "./routes/publicInfoRouter.js"
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001

// * Body Parser MiddleWare
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// * Cors MiddleWare
app.use(cors())


app.get("/", (req, res) => {
    res.send("Welcome to GPay Clone Backend API");
})

app.use("/user", userRouter);
app.use("/transaction", transactionRouter);
app.use("/publicInfo", publicInfoRouter);

// * Listen on Port
const server = createServer(app);
const io = new Server(server);

io.of("/test").on('connection', socket => {
    console.log(`A User Connected with Socket ID: ${socket.id}`);
    socket.on('disconnect', () => {
        console.log(`User with Socket id '${socket.id}' disconnected`);
    })
});

// * Connect to MongoDB
mongoose.connect(`${process.env.MONGO_CONNECTION_URI}`, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

// * Create a Connection
const connection = mongoose.connection;

connection.once("open", function () {
    console.log("MongoDB database connection established successfully");
    const usersStream = connection.collection('users').watch();
    usersStream.on('change', change => {
        switch (change.operationType) {
            case 'insert':
            case 'update':
            case 'delete':
                const users = change.fullDocument
                io.of('/test').emit("changes", users);
                break;
        }
    })
});

server.listen(PORT, () => console.log(`Server Started running at port ${PORT}`));