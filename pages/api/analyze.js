// pages/api/analyze.js
// pages/api/analyze.js
import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { dob } = req.body || {};
    if (!dob) return res.status(400).json({ error: "Missing dob" });

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await client.responses.create({
      model: "gpt-5-mini",
      input: `Зроби коротку, дружню українську розшифровку матриці долі для дати ${dob}. Дай 5–7 маркерів: головні енергії, сильні сторони, виклики, порада на рік.`,
    });

    const text =
      completion.output_text ||
      completion.output?.[0]?.content?.[0]?.text ||
      "Не вдалося розпарсити відповідь моделі.";

    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
