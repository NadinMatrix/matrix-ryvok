// pages/api/analyze.js
import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { dob } = req.body || {};
  if (!dob) {
    return res.status(400).json({ error: "dob is required" });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `
Ти нумеролог-консультант RYVOK. Коротко і по суті (українською) зроби міні-розшифровку за датою народження ${dob}.
Структура:
- Ключові вібрації/числа (1–2 речення)
- Сильні сторони (3–5 маркерів)
- Зони росту (2–4 маркери)
- Рекомендації на місяць (2–3 поради)

Без містики «лякати», без діагнозів. Стиль — підтримуючий, практичний.
    `.trim();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Ти експерт з нумерології RYVOK." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    });

    const text = completion.choices?.[0]?.message?.content || "";
    return res.status(200).json({ text });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "AI error" });
  }
}
