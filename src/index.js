import express from "express";
import { StatusCodes } from "http-status-codes";
import dns from "node:dns";
import connectDB from "./config/dbConfig.js";
import { PORT } from "./config/serverConfig.js";
import apiRouter from "./routes/apiRoutes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dns.setServers(["1.1.1.1", "8.8.8.8"]);
app.use("/api", apiRouter);

app.get("/ping", (req, res) => {
  return res.status(StatusCodes.OK).json({
    message: "pong"
  });
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
