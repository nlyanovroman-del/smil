import express from "express";

const app = express();
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { input, messages, system } = req.body;

  const r = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini", // pick your model
      input: [
        ...(system ? [{ role: "system", content: system }] : []),
        ...(messages || []),
        ...(input ? [{ role: "user", content: input }] : []),
      ],
    }),
  });

  if (!r.ok) {
    const err = await r.text();
    return res.status(500).send(err);
  }

  const data = await r.json();
  // Responses API returns output in structured form; simplest extraction:
  const text =
    data.output_text ??
    data.output?.map(o => o.content?.map(c => c.text).join("")).join("") ??
    "";
  res.json({ text });
});

app.listen(5174, () => console.log("API server on http://localhost:5174"));
