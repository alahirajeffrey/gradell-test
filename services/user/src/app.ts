import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./routers";
import amqplib from "amqplib";

// setup dotenv
dotenv.config();

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/user-db";

// setup express app
const app = express();
app.use(express.json());
app.use("/api", router);

// connect to mongodb
mongoose.connect(MONGO_URI).then(() => console.log("connected to mongodb"));

let channel: amqplib.Channel;

// connect to rabbitmq
const connectRabbitMQ = async () => {
  const connection = await amqplib.connect({
    password: process.env.RABBITMQ_PASSWORD,
    username: process.env.RABBITMQ_USERNAME,
    hostname: process.env.RABBITMQ_HOSTNAME,
    port: Number(process.env.RABBITMQ_PORT),
  });
  channel = await connection.createChannel();
  await channel.assertQueue("product_queue");
  await channel.assertQueue("response_queue");
  console.log("rabbitMQ connected");
};

// listen for connections
app.listen(PORT, () => {
  console.log(`user service running on port ${PORT}`);
});
