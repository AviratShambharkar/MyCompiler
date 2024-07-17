import express from "express";
import cors from "cors";
import generateFile from "./generateFile.js";
import executeCpp from "./executeCpp.js";

const app = express();
const port = 5000;

//middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

app.post("/run", async (req, res) => {
  const { language = "cpp", code } = req.body;

  if (code === undefined) {
    return res.status(404).json({ success: false, error: "Empty code!" });
  }

  try {
    const filePath = await generateFile(language, code);
    const output = await executeCpp(filePath);
    res.json({ filePath, output });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
