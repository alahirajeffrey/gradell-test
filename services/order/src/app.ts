import mongoose from "mongoose";
import * as dotenv from "dotenv";
import amqplib from "amqplib";
import { createOrder, getSingleOrder } from "./utils";

// setup dotenv
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27019/order-db";

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
  await channel.assertQueue("order_queue");
  console.log("rabbitMQ connected");
}

// start consumer and listen
async function startConsumer() {
  await connectRabbitMQ();

  channel.consume("order_queue", async (msg) => {
    if (msg !== null) {
      const { action, data, correlationId } = JSON.parse(
        msg.content.toString()
      );
      console.log("received message:", { action, data, correlationId });

      try {
        let response;

        // create order
        if (action === "create") {
          const newOrder = await createOrder(data);
          console.log("order created");
          response = { success: true, data: newOrder };

          // get single order
        } else if (action === "getSingleOrder") {
          const order = await getSingleOrder(data);
          console.log("order requested");
          response = { success: true, data: order };

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
    console.log("order consumer running");
  });
