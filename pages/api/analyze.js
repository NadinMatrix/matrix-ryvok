// pages/api/analyze.js
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function countEnergies(dob) {
  // Рахуємо частоти цифр 1..9 у даті (ДД.ММ.РРРР) — простий старт для "кола енергій"
  const digits = dob.replace(/\D/g, "").split("").map(Number);
  const counts = {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0};
  for (const d of digits) if (d>=1 && d<=9) counts[d]++;
  return counts; // {1:n,2:n,...,9:n}
}

function chakrasFromCounts(counts){
  // Дуже проста базова модель (MVP). Потім підженемо під твою методику.
  // Для кожної чакри даємо 3 показники: фізика / енергія / емоції (0-22)
  // Мапінг зроблений так, щоб були "живі" числа і різниця між полями.
  const pick = (...ks)=>ks.reduce((s,k)=>s+(counts[k]||0),0);

  return [
    { name:"Сахасрара • місія",      phys:  pick(7,8),   en: pick(1,7),   emo: pick(5)   *2+1 },
    { name:"Аджна • доля/егрегори",  phys:  pick(2,7),   en: pick(8),     emo: pick(3,6) *2   },
    { name:"Вішудха • оцінка мин.",  phys:  pick(5,1),   en: pick(1,
