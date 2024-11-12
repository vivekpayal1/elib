import app from "./src/app";
import { config } from "./src/config/config";
import connetDB from "./src/config/db";

const startServer = async () => {
  // connect DB
  await connetDB();
  const port = config.port;
  app.listen(port, () => {
    console.log(`Listening on Port ${port}`);
  });
};
startServer();
