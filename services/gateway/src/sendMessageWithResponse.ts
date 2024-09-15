import amqplib from "amqplib";
import { v4 as uuidv4 } from "uuid";
import { connectRabbitMQ } from "./producer";

// send message to microservice with response
export const sendMessageWithResponse = async (
  message: Object,
  queue_name: string
): Promise<any> => {
  try {
    const channel = await connectRabbitMQ();

    if (!channel) {
      throw new Error("RabbitMQ channel does not exist");
    }

    const correlationId = uuidv4();

    return new Promise((resolve, reject) => {
      // Send the message to the queue
      channel.sendToQueue(queue_name, Buffer.from(JSON.stringify(message)), {
        correlationId,
      });

      // Consume the response from the response queue
      channel.consume(
        "response_queue",
        (msg) => {
          if (msg && msg.properties.correlationId === correlationId) {
            const response = JSON.parse(msg.content.toString());
            console.log(
              "Received response with correlation id:",
              correlationId
            );

            // Acknowledge the message and resolve the promise with the response
            channel.ack(msg);
            resolve(response);
          }
        },
        { noAck: false }
      );

      // set a timeout to reject the promise if no response is received within a reasonable time
      setTimeout(() => {
        reject(
          new Error(
            "Timeout: No response received within the expected timeframe."
          )
        );
      }, 10000); // Set the timeout (e.g., 5 seconds)
    });
  } catch (error) {
    console.error("error:", error);
    throw error;
  }
};
