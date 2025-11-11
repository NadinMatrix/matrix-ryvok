// pages/api/analyze.js
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { name, dob, gender } = req.body || {};

if (!dob || !name) {
  return res.status(400).json({
    error: 'Заповни ім’я та дату народження у форматі ДД.ММ.РРРР'
  });
}
    if (!dob) {
      return res.status(400).json({ error: "Вкажи дату народження у форматі ДД.ММ.ПППП" });
    }

    const sys = `Ти експерт-нумеролог. Відповідай українською. Формат відповіді — чотири блоки:
### Значення
(2–3 речення про ключові числа дати)

### Енергія
(1–2 речення про загальний вектор)

### Практика
(3 короткі прикладні поради у вигляді зв’язного тексту)

### Афірмація
(1 речення від першої особи)`;

    const usr = `Дата народження: ${dob}. Зроби стислу розшифровку у 4 блоках, як у форматі вище.`;

    const r = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: sys },
        { role: "user", content: usr }
      ],
      temperature: 0.7
    });

    const text = r.choices?.[0]?.message?.content?.trim() || "Не вдалося згенерувати відповідь.";
    return res.status(200).json({ ok: true, text });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: e.message || "Помилка сервера" });
  }
}
