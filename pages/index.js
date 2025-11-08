import React, { useState } from "react";

export default function Home() {
  const [date, setDate] = useState("");
  const [result, setResult] = useState("");

  const handleClick = async () => {
    const res = await fetch("/api/matrix", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date }),
    });
    const data = await res.json();
    setResult(data.result);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🪶 Матриця долі — AI версія</h1>
      <input
        type="text"
        placeholder="ДД.ММ.РРРР"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{ padding: "10px", fontSize: "16px" }}
      />
      <button onClick={handleClick} style={{ marginLeft: "10px", padding: "10px" }}>
        Розшифрувати
      </button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>Результат:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}
