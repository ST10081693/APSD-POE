const express = require("express");
const app = express();
const helmet = require("helmet");const urlPrefix = "/api";
const mongoose = require("mongoose");
const fs = require("fs");
const cert = fs.readFileSync("keys/certificate.pem");
const options = { server: { sslCA: cert } };
const connectionString ="mongodb+srv://ST10081693:Blueants30@cluster0.l3kww.mongodb.net/?retryWrites=true&w=majority";
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/users");
const path = require("path");
const morgan = require("morgan");

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(helmet());

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Db connected...");
  })
  .catch(() => {
    console.log("Not connected to db");
  }, options);

app.use(express.json());

let accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});

morgan.token("tbody", (req) => {
  let string = "";
  if (req.body) {
    string += `REQ BODY -> ${JSON.stringify(req.body)}`;
  }
  return string;
});

app.use(
  morgan(
    "REQ\t| DATE -> :date[clf]\t| METHOD -> :method| URL -> :url\t| STATUS -> :status\t| RESPONSE TIME -> :response-time ms\t|BODY -> :tbody",
    {
      immediate: true,
      stream: accessLogStream,
    }
  )
);

app.use(
  morgan(
    "RES\t| DATE -> :date[clf]\t| METHOD -> :method| URL -> :url\t| STATUS -> :status\t| RESPONSE TIME -> :response-time ms",
    {
      stream: accessLogStream,
    }
  )
);

app.use((reg, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "*");
  next();
});

app.use(urlPrefix + "/posts", postRoutes);
app.use(urlPrefix + "/user", userRoutes);

module.exports = app;