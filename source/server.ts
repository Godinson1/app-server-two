import app from "./app";
import * as amqp from "amqplib/callback_api";

const PORT = process.env.PORT || 4000;
let myChannel;

amqp.connect(`${process.env.AMPQ_URI}`, (error0, connection) => {
  if (error0) throw error0;
  connection.createChannel((error1, channel) => {
    if (error1) throw error1;
    myChannel = channel;
    app.listen(PORT, () => console.log(`Server is running at PORT: ${PORT}`));
  });
  process.on("beforeExit", () => connection.close());
});
