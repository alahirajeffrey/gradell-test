import * as dotenv from "dotenv";
import amqplib from "amqplib";

// setup dotenv
dotenv.config();

let channel: amqplib.Channel | null = null;

// connect to rabbitmq
export const connectRabbitMQ = async () => {
  if (!channel) {
    const connection = await amqplib.connect({
      password: process.env.RABBITMQ_PASSWORD,
      username: process.env.RABBITMQ_USERNAME,
      hostname: process.env.RABBITMQ_HOSTNAME,
      port: Number(process.env.RABBITMQ_PORT),
    });
    const channel: amqplib.Channel = await connection.createChannel();
    await channel.assertQueue("user_queue");
    await channel.assertQueue("product_queue");
    await channel.assertQueue("payment_queue");
    await channel.assertQueue("order_queue");
    console.log("rabbitMQ connected");
    return channel;
  } else {
    return channel;
  }
};
