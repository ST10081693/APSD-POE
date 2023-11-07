const app = require("./app");
const debug = require("debug")("node-angular");
const https = require("https");
const fs = require("fs");

const port = 3000;

const server = https.createServer(
  {
    key: fs.readFileSync("./keys/privatekey.pem"),
    cert: fs.readFileSync("./keys/certificate.pem"),
  },
  app
);

server.listen(port);
console.log(`Sever listening on Port ${port}`);