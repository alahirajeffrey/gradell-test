import amqplib from "amqplib";
import { v4 as uuidv4 } from "uuid";

let channel: amqplib.Channel;

// send message to microservice with response
export const sendMessageWithResponse = async (
  message: Object,
  queue_name: string
) => {
  return new Promise((resolve, reject) => {
    const correlationId = uuidv4();

    // Send the message to the queue
    channel.sendToQueue(queue_name, Buffer.from(JSON.stringify(message)), {
      correlationId,
    });

    // listen for eesponse
    channel.consume(
      "response_queue",
      (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          const response = JSON.parse(msg.content.toString());
          resolve(response);
        }
      },
      { noAck: true }
    );
  });
};
