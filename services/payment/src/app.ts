import mongoose from "mongoose";
import * as dotenv from "dotenv";
import amqplib from "amqplib";
import { makePayment } from "./utils";

// setup dotenv
dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27020/payment-db";

// connect to mongodb
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("connected to mongodb"))
  .catch((err) => console.error("mongodb connection error:", err));

let channel: amqplib.Channel;

// connect to rabbitmq
async function connectRabbitMQ() {
  const connection = await amqplib.connect({
    password: process.env.RABBITMQ_PASSWORD,
    username: process.env.RABBITMQ_USERNAME,
    hostname: process.env.RABBITMQ_HOSTNAME,
    port: Number(process.env.RABBITMQ_PORT),
  });
  channel = await connection.createChannel();
  await channel.assertQueue("payment_queue");
  console.log("rabbitMQ connected");
}

// start consumer and listen
async function startConsumer() {
  await connectRabbitMQ();

  channel.consume("payment_queue", async (msg) => {
    if (msg !== null) {
      const { action, data } = JSON.parse(msg.content.toString());
      const correlationId = msg.properties.correlationId;
      console.log("received message:", { action, data, correlationId });

      try {
        let response;

        // make payment
        if (action === "create") {
          const newPayment = await makePayment(data);
          console.log("payment completed");
          response = { success: true, data: newPayment };

          // unknown action
        } else {
          console.log("unknown action:", action);
        }

        channel.sendToQueue(
          "response_queue",
          Buffer.from(JSON.stringify(response)),
          { correlationId }
        );

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
    console.log("payment service running");
  });
