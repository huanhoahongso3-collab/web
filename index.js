const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const compression = require('compression');
const fs = require("fs/promises");

app.use(compression());
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

const DATA_FILE = "data.json"; // JSON file to store data

app.get("/", (req, res) => {
  res.send(`Up for ${Math.floor(process.uptime())} seconds`);
});

app.post("/input", async (req, res) => {
  const apiKey = req.get("apiKey");
  const inp = req.body.input;
  const hd = req.body.hd;

  if (apiKey !== process.env.KEY) {
    res.status(401).send("Unauthorized");
    return;
  }

  try {
    const data = await readData();
    data.inp = inp;
    data.hd = hd;
    await writeData(data);

    res.send("Success");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/click", async (req, res) => {
  try {
    const data = await readData();
    let num = data.num || 0;
    num += 1;
    data.num = num;
    await writeData(data);

    console.log(num);
    res.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/click", async (req, res) => {
  try {
    const data = await readData();
    const num = data.num || 0;
    res.json({ num });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/output", async (req, res) => {
  try {
    const data = await readData();
    const obj = { hd: data.hd, input: data.inp };
    res.json(obj);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.all('*', (req, res) => {
  res.status(404).sendFile(__dirname + "/404.html");
});

app.use((_, res) => {});

const port = 7867;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on port ${port}`);
});

async function readData() {
  try {
    const content = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    return {};
  }
}

async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}
