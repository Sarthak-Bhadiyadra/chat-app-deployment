"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing required modules and libraries
const express_1 = __importDefault(require("express")); // Express framework for building the server
const bp = require("body-parser"); // Exporting Body Parser
const dotenv_1 = __importDefault(require("dotenv")); // dotenv for loading environment variables
const User_1 = require("./Routes/User"); // Importing the router for handling routes
const Chats_1 = require("./Routes/Chats"); // Importing the router for handling routes
const db_client_1 = require("./Utils/Database/db.client"); // Importing the database client
// import { router as loginRouter } from "./Routes/Login";
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const jwt = require("jsonwebtoken");
dotenv_1.default.config(); // Loading environment variables from .env file
const app = (0, express_1.default)(); // Creating an instance of the Express application
const port = process.env.PORT; // Fetching the port number from environment variables
app.use(bp.json());
app.use((0, cors_1.default)({}));
app.use(bp.urlencoded({ extended: true }));
app.use("/", User_1.router); // Registering the router for handling routes
app.use("/users/:user_id", Chats_1.router); // Registering the router for handling routes
// app.use("/login", loginRouter);
//--------------------deployment---------------------
const __dirname1 = path_1.default.resolve();
const mode = process.env.NODE_ENV;
if (mode === null || mode === void 0 ? void 0 : mode.includes("production")) {
    console.log("Here");
    app.use(express_1.default.static(path_1.default.join(__dirname1, "../", "/frontend/build")));
    console.log('path.join(__dirname1, "../", "/frontend/build"): ', path_1.default.join(__dirname1, "../", "/frontend/build"));
    app.get("*", (req, res) => {
        res.sendFile(path_1.default.resolve(__dirname1, "../", "frontend", "build", "index.html"));
    });
}
else {
    console.log("Not here");
    app.get("/", (req, res) => {
        res.send("API is Running Successfully");
    });
}
// Starting the server
const server = app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    yield initializeDataSources(); // Initializing data sources before starting the server
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
}));
const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
    },
    pingTimeOut: 60000,
});
//@ts-ignore
io.on("connection", (socket) => {
    //@ts-ignore
    socket.on("setup", (userData) => {
        socket.join(userData.id);
        socket.emit("connected");
    });
    //@ts-ignore
    socket.on("join-chat", (room) => {
        socket.join(room.id);
    });
    //@ts-ignore
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    //@ts-ignore
    socket.on("stop-typing", (room) => socket.in(room).emit("stop-typing"));
    //@ts-ignore
    socket.on("new-message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
        if (!chat.Chatusers)
            return console.log("chat.users not defined");
        //@ts-ignore
        chat.Chatusers.forEach((user) => {
            if (user.user_id !== newMessageRecieved.sender_id) {
                socket.in(user.user_id).emit("message-received", newMessageRecieved);
            }
        });
    });
    //@ts-ignore
    socket.off("setup", (userData) => {
        console.log("USER DISCONNECTED");
        socket.leave(userData.id);
    });
});
// Function to initialize data sources
function initializeDataSources() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Initializing datasources.");
            yield db_client_1.nsql_db.$connect(); // Connecting to the database
            console.log("Datasources initialised");
        }
        catch (err) {
            console.log("DataSource initialisation failed. Details: ", err);
            process.exit(1); // Exiting the process with an error code if data source initialization fails
        }
    });
}
