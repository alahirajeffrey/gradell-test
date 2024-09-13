import mongoose from "mongoose";
import * as dotenv from "dotenv";
import amqplib from "amqplib";
import {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProductQuantity,
} from "./utils";

// setup dotenv
dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27018/product-db";

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
  await channel.assertQueue("product_queue");
  console.log("rabbitMQ connected");
}

// start consumer and listen
async function startConsumer() {
  await connectRabbitMQ();

  channel.consume("product_queue", async (msg) => {
    if (msg !== null) {
      const { action, data, correlationId } = JSON.parse(
        msg.content.toString()
      );
      console.log("received message:", { action, data, correlationId });

      try {
        let response;

        // create product
        if (action === "create") {
          const newProduct = await createProduct(data);
          console.log("product created");
          response = { success: true, data: newProduct };

          // get all products
        } else if (action === "getAll") {
          const products = await getProducts();
          console.log("products requested");
          response = { success: true, data: products };

          // get single product
        } else if (action === "getSingle") {
          const product = await getSingleProduct(data);
          console.log("product requested");
          response = { success: true, data: product };

          // update product
        } else if (action === "update") {
          const updatedProduct = await updateProductQuantity(data);
          console.log("product quantity updated");
          response = { success: true, data: updatedProduct };

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
    console.log("product consumer running");
  });
