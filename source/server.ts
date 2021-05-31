import app from "./app";
import * as amqp from "amqplib/callback_api";
import pool from "./database/db";
import { createPost, editPost, deletePost } from "./Post";

const PORT = process.env.PORT || 4000;
let myChannel: amqp.Channel;

pool.connect((err, done) => {
  if (err) throw err;
  console.log("Database connected successfully.");
  amqp.connect(`${process.env.AMPQ_URI}`, (error0, connection) => {
    if (error0) throw error0;
    connection.createChannel((error1, channel) => {
      if (error1) throw error1;

      //Assert queues
      channel.assertQueue("create_post", { durable: false });
      channel.assertQueue("update_post", { durable: false });
      channel.assertQueue("delete_post", { durable: false });

      channel.consume(
        "create_post",
        (msg) => {
          const data = JSON.parse(msg?.content.toString() as string);
          createPost(data);
        },
        { noAck: true }
      );

      channel.consume(
        "update_post",
        (msg) => {
          const data = JSON.parse(msg?.content.toString() as string);
          editPost(data);
        },
        { noAck: true }
      );

      channel.consume(
        "delete_post",
        (msg) => {
          const data = JSON.parse(msg?.content.toString() as string);
          deletePost(data);
        },
        { noAck: true }
      );

      myChannel = channel;

      app.listen(PORT, () => console.log(`Server is running at PORT: ${PORT}`));
    });
    process.on("beforeExit", () => connection.close());
  });
});

export { myChannel };
