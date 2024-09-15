import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import amqplib from "amqplib";
import { loginUser, registerUser } from "./utils";

// setup dotenv
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/user-db";

// connect to mongodb
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("connected to mongodb"))
  .catch((err) => console.error("mongodb connection error:", err));

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
  await channel.assertQueue("user_queue");
  await channel.assertQueue("response_queue");
  console.log("rabbitMQ connected");
};

// start consumer and listen
async function startConsumer() {
  await connectRabbitMQ();

  channel.consume("user_queue", async (msg) => {
    if (msg !== null) {
      const { action, data } = JSON.parse(msg.content.toString());
      const correlationId = msg.properties.correlationId;

      try {
        let response;
        // register user
        if (action === "register") {
          const user = await registerUser(data);
          console.log("user reistered");
          response = { success: true, data: user };

          // login user
        } else if (action === "login") {
          const token = await loginUser(data);
          console.log("user logged in");
          response = { success: true, data: token };
        }
        // unknown action
        else {
          console.log("unknown action:", action);
        }

        // send response back to queue
        channel.sendToQueue(
          "response_queue",
          Buffer.from(JSON.stringify(response)),
          { correlationId }
        );

        // acknowledge message
        channel.ack(msg);
      } catch (error) {
        channel.sendToQueue(
          "response_queue",
          Buffer.from(JSON.stringify(error)),
          { correlationId }
        );
        channel.ack(msg);
        console.error("error processing message:", error);
      }
    }
  });
}

startConsumer()
  .catch((error) => {
    console.log("error starting consumer: ", error);
  })
  .then(() => {
    console.log("user service running");
  });
