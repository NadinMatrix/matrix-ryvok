// pages/api/matrix.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { dob } = req.body || {};
    if (!dob) return res.status(400).json({ error: "Дата народження відсутня" });

    const messages = [
      {
        role: "system",
        content: "Ти експерт-нумеролог. Розшифровуєш матрицю долі коротко, структуровано і зрозуміло.",
      },
      {
        role: "user",
        content: `Зроби стислий аналіз для дати народження ${dob}. 
Дай 4 блоки:
• Значення
• Енергія
• Практика
• Афірмація`,
      },
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    const text = completion.choices?.[0]?.message?.content || "Немає відповіді";
    res.status(200).json({ ok: true, text });
  } catch (e) {
    res.status(500).json({ error: e.message || "Помилка сервера" });
  }
}
