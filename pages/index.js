import { useState } from "react";
import Head from "next/head";

export default function Home() {
  const [dob, setDob] = useState("");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  function miniMd(html) {
    // міні-рендер для ### заголовків та нових рядків
    return html
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\n/g, "<br/>");
  }

  async function handleAnalyze(e) {
    e.preventDefault();
    setErr("");
    setOut("");
    const v = dob?.trim();

    // валідація DD.MM.YYYY
    if (!/^\d{2}\.\d{2}\.\d{4}$/.test(v)) {
      setErr("Введи дату у форматі ДД.ММ.ПППП");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dob: v }),
      });
      const data = await res.json();
      if (!res.ok || !data?.text) throw new Error(data?.error || "Помилка запиту");
      setOut(data.text);
    } catch (e) {
      setErr(e.message || "Невідома помилка");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(out);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <>
      <Head>
        <title>Матриця долі — AI версія</title>
        <meta name="description" content="Швидка AI-розшифровка матриці долі у твоєму стилі RYVOK." />
        <meta property="og:title" content="Матриця долі — AI" />
        <meta property="og:description" content="Введи дату і отримай значення, енергію, практику та афірмацію." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="page">
        <div className="card">
          <h1>🪶 Матриця долі — AI версія</h1>
          <p className="hint">
            Введи дату народження у форматі <b>ДД.ММ.ПППП</b> і натисни «Розшифрувати».
          </p>

          <form onSubmit={handleAnalyze} className="row">
            <input
              id="dob"
              name="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              placeholder="наприклад 13.10.1987"
              inputMode="numeric"
              className="input"
            />
            <button type="submit" disabled={loading} className="btn">
              {loading ? "Обробка…" : "Розшифрувати"}
            </button>
          </form>

          {err && <p className="error">Помилка: {err}</p>}

          {out && (
            <div className="result">
              <div
                className="md"
                dangerouslySetInnerHTML={{ __html: miniMd(out) }}
              />
              <div className="actions">
                <button onClick={handleCopy} className="ghost">
                  {copied ? "Скопійовано ✓" : "Скопіювати текст"}
                </button>
              </div>
            </div>
          )}
        </div>

        <footer className="foot">
          <span>powered by <b>RYVOK.AI</b></span>
        </footer>
      </main>

      <style jsx global>{`
        :root{
          --bg:#293947;         /* темно-синій фон */
          --panel:#32425d;      /* трохи світліше */
          --text:#f7f8fb;       /* майже білий */
          --muted:#c8d0e0;
          --brand:#FFC700;      /* твій жовтий акцент */
          --brand-2:#FFCB00;
          --ok:#27ae60;
          --err:#ff6b6b;
          --radius:14px;
          --shadow:0 10px 30px rgba(0,0,0,.25);
        }
        html,body,#__next{height:100%}
        body{
          margin:0;
          background: radial-gradient(1200px 1200px at 20% -10%, #3B4763 0%, #293947 40%, #1f2a3c 100%);
          color:var(--text);
          font-family: ui-sans-serif, -apple-system, Segoe UI, Roboto, Inter, "Montserrat", system-ui;
        }
        h1,h2,h3{margin:0 0 14px}
        h1{font-weight:800; letter-spacing:.2px}
        h3{margin-top:18px; color:var(--brand)}
        .page{
          min-height:100%;
          display:flex;
          flex-direction:column;
          align-items:center;
          padding:48px 16px 32px;
        }
        .card{
          width:100%;
          max-width:860px;
          background: linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02));
          border:1px solid rgba(255,255,255,.08);
          box-shadow:var(--shadow);
          border-radius:var(--radius);
          padding:28px;
          backdrop-filter: blur(6px);
        }
        .hint{color:var(--muted)}
        .row{
          display:flex; gap:12px; align-items:center; margin:16px 0 8px;
          flex-wrap:wrap;
        }
        .input{
          flex:1; min-width:260px;
          font-size:16px;
          padding:14px 14px;
          border-radius:10px;
          border:1px solid rgba(255,255,255,.15);
          background:#223149;
          color:var(--text);
          outline:none;
        }
        .input::placeholder{color:#96a3ba}
        .btn{
          background:linear-gradient(180deg, var(--brand), var(--brand-2));
          border:none; padding:14px 18px; border-radius:10px;
          font-weight:700; cursor:pointer;
          box-shadow:0 6px 16px rgba(255,199,0,.35);
        }
        .btn:disabled{opacity:.6; cursor:default}
        .error{
          margin:8px 0 0; color:var(--err); font-weight:600;
        }
        .result{
          margin-top:20px;
          border:1px solid rgba(255,255,255,.12);
          background:#203049;
          border-radius:12px;
          padding:18px;
        }
        .md{line-height:1.65; white-space:normal}
        .md p{margin:10px 0}
        .actions{margin-top:12px; display:flex; gap:10px}
        .ghost{
          background:transparent; color:var(--brand);
          border:1px dashed var(--brand);
          padding:10px 14px; border-radius:10px; cursor:pointer;
        }
        .foot{opacity:.7; margin-top:18px; font-size:14px}
        @media (max-width:480px){
          .page{padding:28px 12px}
          .card{padding:20px}
        }
      `}</style>
    </>
  );
}
