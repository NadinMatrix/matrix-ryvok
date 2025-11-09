// pages/index.js
import { useState } from "react";

export default function Home() {
  const [dob, setDob] = useState("");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAnalyze(e) {
    e.preventDefault();
    setErr("");
    setOut("");

    const v = dob?.trim();
    // валідація ДД.ММ.ПППП
    if (!/^\d{2}\.\d{2}\.\d{4}$/.test(v)) {
      setErr("Введи дату у форматі ДД.ММ.ПППП");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dob: v })
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
    <main style={{
      minHeight: "100vh",
      background: "#0f172a",
      color: "#e5e7eb",
      padding: "48px 16px",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Ubuntu"
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 34, marginBottom: 8 }}>
          <span>🍂</span> Матриця долі — AI версія
        </h1>
        <p style={{ opacity: .85, marginBottom: 18 }}>
          Введи дату народження у форматі <b>ДД.ММ.ПППП</b> і натисни «Розшифрувати».
        </p>

        <form onSubmit={handleAnalyze} style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <input
            id="dob" name="dob" value={dob}
            onChange={e => setDob(e.target.value)}
            placeholder="наприклад 13.10.1978"
            inputMode="numeric"
            style={{
              flex: 1, minWidth: 260, padding: 12, fontSize: 16,
              border: "1px solid #475569", borderRadius: 8, background: "#0b1220", color: "#e5e7eb"
            }}
          />
          <button type="submit" disabled={loading}
            style={{
              padding: "12px 18px", fontSize: 16, border: "none", borderRadius: 8,
              background: loading ? "#a3a3a3" : "#FFC700", color: "#111827", fontWeight: 700, cursor: "pointer"
            }}>
            {loading ? "Обробка…" : "Розшифрувати"}
          </button>
        </form>

        {err && (
          <div style={{
            marginTop: 16, padding: 12, border: "1px solid #ef4444",
            background: "#7f1d1d", color: "#fff", borderRadius: 8
          }}>
            Помилка: {err}
          </div>
        )}

        {out && (
          <div style={{
            marginTop: 24, padding: 16, border: "1px solid #374151",
            background: "#111827", borderRadius: 12
          }}>
            <h3 style={{ margin: "0 0 8px 0" }}>Результат</h3>
            <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{out}</div>
          </div>
        )}
      </div>
    </main>
  );
}
