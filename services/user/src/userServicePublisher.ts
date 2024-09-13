import * as amqplib from "amqplib";
import * as dotenv from "dotenv";

dotenv.config();

export const publisher = async (
  data: object,
  queueName: string,
  messagePattern: string
) => {
  try {
    const connection = await amqplib.connect({
      password: process.env.RABBITMQ_PASSWORD,
      username: process.env.RABBITMQ_USERNAME,
      hostname: process.env.RABBITMQ_HOSTNAME,
      port: Number(process.env.RABBITMQ_PORT),
    });
    const channel = await connection.createChannel();

    const payload = {
      pattern: messagePattern,
      data: data,
    };

    await channel.assertQueue(queueName);
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(payload)));
  } catch (error) {
    console.log(error);
    throw error;
  }
};
