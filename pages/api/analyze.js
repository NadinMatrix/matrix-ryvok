// pages/api/analyze.js
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { dob } = req.body || {};
    if (!dob) {
      return res.status(400).json({ ok: false, error: "Дата відсутня" });
    }

    const prompt = `Зроби стислу розшифровку матриці долі для дати народження ${dob}.
Дай 4 блоки:
• Значення
• Енергія
• Практика
• Афірмація
Пиши українською, без зайвої містики.`;

    const resp = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Ти експерт з нумерології, пишеш стисло й практично."},
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const text = resp.choices?.[0]?.message?.content?.trim() || "Немає відповіді";
    return res.status(200).json({ ok: true, text });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message || "Помилка сервера" });
  }
}
