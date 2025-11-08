// pages/api/analyze.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { date } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Ти — експерт з нумерології та матриці долі. Відповідай українською мовою.",
        },
        {
          role: "user",
          content: `Проаналізуй дату народження ${date} і зроби коротку розшифровку.`,
        },
      ],
    });

    const result = completion.choices[0].message.content;
    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Помилка при запиті до OpenAI API" });
  }
}
