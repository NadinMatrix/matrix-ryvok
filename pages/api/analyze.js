// pages/api/analyze.js
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { dob } = req.body || {};
    if (!dob) return res.status(400).json({ ok: false, error: "Missing dob" });

    const messages = [
      { role: "system", content: "Ти експерт з нумерології RYVOK. Відповідай українською, коротко й по суті." },
      { role: "user", content: `Зроби стислу розшифровку матриці долі для дати ${dob}.
Дай 4 блоки:
• Значення
• Енергія
• Практика
• Афірмація
Без містики й залякувань, підтримуючий тон, 5–8 речень загалом.` }
    ];

    // Використовуємо перевірену кінцеву точку chat.completions
    const r = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
    });

    const text = r.choices?.[0]?.message?.content?.trim() || "";
    if (!text) throw new Error("Empty AI response");

    return res.status(200).json({ ok: true, text });
  } catch (e) {
    console.error("ANALYZE_API_ERROR:", e);
    return res.status(500).json({ ok: false, error: e.message || "Server error" });
  }
}
  }
}
