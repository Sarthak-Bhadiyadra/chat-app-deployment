// Importing required modules and libraries
import express, { Express, Request, Response, Router } from "express"; // Express framework for building the server
const bp = require("body-parser"); // Exporting Body Parser
import dotenv from "dotenv"; // dotenv for loading environment variables
import { API_ENDPOINTS } from "./Types/Server"; // Importing API endpoints
import { router as userRouter } from "./Routes/User"; // Importing the router for handling routes
import { router as chatRouter } from "./Routes/Chats"; // Importing the router for handling routes
import { nsql_db } from "./Utils/Database/db.client"; // Importing the database client
// import { router as loginRouter } from "./Routes/Login";

import cors from "cors";
import path from "path";
const jwt = require("jsonwebtoken");

dotenv.config(); // Loading environment variables from .env file

const app: Express = express(); // Creating an instance of the Express application
const port = process.env.PORT; // Fetching the port number from environment variables

app.use(bp.json());
app.use(cors({}));
app.use(bp.urlencoded({ extended: true }));

app.use("/", userRouter); // Registering the router for handling routes
app.use("/users/:user_id", chatRouter); // Registering the router for handling routes
// app.use("/login", loginRouter);

app.get("/", (req, res) => {
  res.send("API is Running Successfully");
});

// Starting the server
const server = app.listen(port, async () => {
  await initializeDataSources(); // Initializing data sources before starting the server
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

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
    if (!chat.Chatusers) return console.log("chat.users not defined");
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
async function initializeDataSources() {
  try {
    console.log("Initializing datasources.");
    await nsql_db.$connect(); // Connecting to the database
    console.log("Datasources initialised");
  } catch (err) {
    console.log("DataSource initialisation failed. Details: ", err);
    process.exit(1); // Exiting the process with an error code if data source initialization fails
  }
}
