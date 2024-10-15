import express from "express";
import userRoutes from "./routes/userRoutes.js";
import { connection } from "./database/connection.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const PORT = "8000";

const app = express();

const server = http.createServer(app);
// Create a global variable to store the Socket.IO instance
global.io = new Server(server, {
    cors: {
      origin: "*",
      credentials: true
    }
  });

await connection();

app.use(express.json({ limit: "Infinity" }));

app.use(cors({ origin: "*", credentials: true }));
app.use("/user", userRoutes);



// Middleware to attach io to req object
app.use((req, res, next) => {
    req.io = req.app.get('io');
    next();
  });


// Socket.IO connection handling
global.io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });

// app.listen(PORT, () => {
//   console.log(`Server s started on ${PORT}`);
// });
