import "dotenv/config";
import cors from "cors";
import express from "express";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);


app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const { default: OpenAi } = await import("openai");
    const { input } = req.body;

    const client = new OpenAi({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const result = await client.responses.create({
      model: "gpt-5-nano",
      input: input,
    });

    res.json({ output_text: result.output_text });
  } catch (error) {
    console.error("Chat API error:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

app.get("/", (_req, res) => {
  res.status(200).send("OK");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
