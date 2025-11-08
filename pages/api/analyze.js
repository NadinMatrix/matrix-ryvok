// pages/api/analyze.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { date } = req.body;

  try {
    const completion = await client.responses.create({
      model: "gpt-5",
      input: `Зроби коротку духовно-нумерологічну розшифровку для дати народження ${date}. 
      Опиши ключову енергію, талант і призначення цієї душі у 3-4 реченнях.`,
    });

    res.status(200).json({ result: completion.output_text });
  } catch (error) {
    console.error("Помилка:", error);
    res.status(500).json({ error: "Помилка при зверненні до OpenAI API" });
  }
}
