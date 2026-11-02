import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { transcribeAudio } from "./service/audioService.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type"],
  }),
);
app.use(express.json());

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = req.file.path;

    const transcript = await transcribeAudio(filePath);

    return res.status(200).json({
      transcript,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to process File" });
  }
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on PORT : ${PORT}`);
});
