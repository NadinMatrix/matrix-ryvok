// уривок із pages/index.js
async function handleAnalyze() {
  const dob = document.getElementById("dob").value.trim();
  const btn = document.getElementById("go");
  const out = document.getElementById("out");

  if (!dob) {
    out.textContent = "Введи дату у форматі ДД.ММ.РРРР";
    return;
  }

  btn.disabled = true;
  out.textContent = "Генерую розшифровку...";

  try {
    const resp = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dob }),
    });

    const data = await resp.json();
    out.textContent = data.text || `Помилка: ${data.error || "невідома"}`;
  } catch (e) {
    out.textContent = `Мережна помилка: ${e}`;
  } finally {
    btn.disabled = false;
  }
}
