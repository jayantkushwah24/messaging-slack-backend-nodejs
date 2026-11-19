import dns from "node:dns";
import express from "express";
import { StatusCodes } from "http-status-codes";
import bullServerAdapter from "./config/bullBoardConfig.js";
import connectDB from "./config/dbConfig.js";
import { PORT } from "./config/serverConfig.js";
import apiRouter from "./routes/apiRoutes.js";
import { createServer } from "node:http";
import { Server } from "socket.io";
import messageHandler from "./controllers/messageSocketController.js";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dns.setServers(["1.1.1.1", "8.8.8.8"]);

app.use("/api", apiRouter);
app.use("/ui", bullServerAdapter.getRouter());

app.get("/ping", (req, res) => {
  return res.status(StatusCodes.OK).json({
    message: "pong"
  });
});

io.on("connection", (socket) => {
  messageHandler(io, socket);
});

const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
