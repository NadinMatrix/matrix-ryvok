// pages/index.js
import React from "react";

export default function Home() {
  const [dob, setDob] = React.useState("");
  const [out, setOut] = React.useState("");
  const [err, setErr] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function handleAnalyze(e) {
    e.preventDefault();
    setErr("");
    setOut("");
    const v = dob?.trim();

    // валідація формату ДД.ММ.РРРР
    if (!/^\d{2}\.\d{2}\.\d{4}$/.test(v)) {
      setErr("Введи дату у форматі ДД.ММ.РРРР");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/matrix", {          // ← або "/api/analyze" якщо хочеш
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dob: v }),
      });

      const data = await res.json();
      if (!res.ok || !data?.text) {
        throw new Error(data?.error || "Помилка запиту");
      }
      setOut(data.text);
    } catch (e) {
      setErr(e.message || "Невідома помилка");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: "60px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1>🔮 Матриця долі — AI версія</h1>
      <p>Введи дату народження у форматі <b>ДД.ММ.РРРР</b> і натисни «Розшифрувати».</p>

      <form onSubmit={handleAnalyze} style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <input
          id="dob" name="dob"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          placeholder="наприклад 13.10.1987"
          inputMode="numeric"
          style={{ flex: 1, minWidth: 260, padding: 12, fontSize: 16, border: "1px solid #ccc", borderRadius: 8 }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ padding: "12px 18px", fontSize: 16, border: "none", borderRadius: 8, background: "#FFC700" }}
        >
          {loading ? "Обробка..." : "Розшифрувати"}
        </button>
      </form>

      {err && <p style={{ color: "#b00020", marginTop: 16 }}>Помилка: {err}</p>}

      {out && (
        <div style={{ marginTop: 24, padding: 16, border: "1px solid #eee", borderRadius: 12, background: "#fff" }}>
          <h3>Результат</h3>
          <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{out}</div>
        </div>
      )}
    </main>
  );
}
