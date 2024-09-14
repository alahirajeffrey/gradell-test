import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import router from "./routes";

// setup dotenv
dotenv.config();

const PORT = process.env.PORT || 3000;

// setup express app
const app = express();
app.use(express.json());
app.use("/api", router);

// listen for connections
app.listen(PORT, () => {
  console.log(`api gateway service running on port ${PORT}`);
});
