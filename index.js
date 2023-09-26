const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const Database = require("@replit/database");
const db = new Database();

const compression = require('compression');
app.use(compression());

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

app.all('*', (req, res) => {
  res.status(404).sendFile(__dirname + "/404.html");
});

app.use((_, res) => {});

app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log("Live on port" + process.env.PORT);
});
