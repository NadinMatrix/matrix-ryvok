// pages/index.js
import React, { useMemo, useState } from 'react';

const COLORS = {
  bg: '#031827',
  gold: '#E1CB92',
  text: '#F5F5F5',
  accent: '#18C3CB',
  error: '#b00020',
  panel: 'rgba(255,255,255,0.04)',
  line: 'rgba(225,203,146,0.45)',
};

export default function Home() {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('female');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [out, setOut] = useState(null);

  function onDob(e) {
    let v = e.target.value.replace(/[^\d]/g, '').slice(0, 8);
    if (v.length > 4) v = v.replace(/^(\d{2})(\d{2})(\d{0,4})$/, (_, a, b, c) => (c ? `${a}.${b}.${c}` : `${a}.${b}`));
    else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,2})$/, (_, a, b) => (b ? `${a}.${b}` : `${a}.`));
    setDob(v);
  }

  async function handleAnalyze(e) {
    e.preventDefault();
    setErr('');
    setOut(null);
    if (!name.trim()) { setErr('Введи ім’я.'); return; }
    if (!/^\d{2}\.\d{2}\.\d{4}$/.test(dob)) { setErr('Формат дати: ДД.ММ.РРРР'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), dob, gender }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Помилка запиту');
      setOut(data);
    } catch (e) {
      setErr(e.message || 'Серверна помилка');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg, color: COLORS.text }}>
      <header style={{ padding: '40px 16px 16px', textAlign: 'center' }}>
        <LogoMark />
        <h1 style={{ margin: '14px 0 6px', fontWeight: 600, letterSpacing: 1 }}>MATRIX RYVOK</h1>
        <p style={{ opacity: 0.85, maxWidth: 820, margin: '0 auto', lineHeight: 1.7 }}>
          Тут відкриваються глибини самопізнання, оживають сакральні знання і розкриваються езотеричні концепції.
          Досліджуй, розширюй свідомість і знаходь гармонію між собою та Всесвітом. Відчуй натхнення на шляху до особистого й духовного розвитку.
        </p>
      </header>

      <main style={{ maxWidth: 980, margin: '28px auto 80px', padding: '0 16px' }}>
        {/* Форма */}
        <form onSubmit={handleAnalyze} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Ім’я</label>
            <input
              placeholder="Напр., Надія"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Дата народження</label>
            <input
              placeholder="ДД.ММ.РРРР"
              inputMode="numeric"
              value={dob}
              onChange={onDob}
              style={styles.input}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Стать</label>
            <div style={{ display: 'flex', gap: 16, paddingTop: 8 }}>
              <label><input type="radio" name="g" checked={gender === 'female'} onChange={() => setGender('female')} /> Жінка</label>
              <label><input type="radio" name="g" checked={gender === 'male'} onChange={() => setGender('male')} /> Чоловік</label>
            </div>
          </div>
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Обробка…' : 'Розшифрувати матрицю'}
          </button>
        </form>

        {/* Матриця (по центру, без верхнього скруглення) */}
        <div style={styles.webWrap}>
          <ChakraWeb
  core={out?.core}
  chakras={out?.chakras || []}
  showNumbers={true}
  chakraColors={[
    '#E53935', // 1 Муладхара (червоний)
    '#FB8C00', // 2 Свадхістана (помаранчевий)
    '#FDD835', // 3 Маніпура (жовтий)
    '#43A047', // 4 Анахата (зелений)
    '#1E88E5', // 5 Вішудха (блакитний/синій)
    '#5E35B1', // 6 Аджна (індиго)
    '#8E24AA', // 7 Сахасрара (фіолетовий)
  ]}
/>
        </div>

        {/* Таблиця */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Чакра</th>
              <th>Фізика</th>
              <th>Енергія</th>
              <th>Емоції</th>
            </tr>
          </thead>
          <tbody>
            {out?.chakras?.map((c, i) => (
              <tr key={i}>
                <td>{c.name}</td>
                <td>{c.physical}</td>
                <td>{c.energy}</td>
                <td>{c.emotion}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {err && <div style={styles.error}>{err}</div>}

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <a href="#buy" style={styles.cta}>Отримати повний PDF</a>
        </div>

        {/* Результат від API */}
        {out?.text && (
          <div
            style={{
              background: 'rgba(25, 35, 45, 0.8)',
              border: `1px solid ${COLORS.gold}`,
              borderRadius: 14,
              padding: '24px 20px',
              marginTop: 28,
              boxShadow: '0 0 28px rgba(225, 203, 146, 0.25)',
              color: COLORS.text,
              transition: 'all 0.6s ease-in-out',
              animation: 'fadeIn 1s ease-in-out',
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: COLORS.gold,
                letterSpacing: '0.5px',
                marginBottom: 12,
                textAlign: 'center',
                textTransform: 'uppercase',
              }}
            >
              ✦ Результат ✦
            </div>
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                lineHeight: 1.6,
                marginTop: 8,
                fontFamily: 'inherit',
                textAlign: 'justify',
              }}
            >
              {out.text}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}

/** Лого-розділювач */
function LogoMark() {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <span style={{
        width: 12, height: 12, borderRadius: 12,
        background: 'linear-gradient(130deg,#E1CB92,#18C3CB)'
      }} />
      <div style={{ height: 1, width: 96, background: 'linear-gradient(90deg, transparent, #E1CB92, transparent)' }} />
    </div>
  );
}

/** SVG-схема “сітка чакр” */
function ChakraWeb({
  svgSize = 520,
  chakras = [],
  showNumbers = true,
  chakraColors = [],
  core,
}) {
  const size   = svgSize;
  const rOuter = size * 0.40;
  const cx = size / 2, cy = size / 2;

  // 7 точок по колу (початок зверху)
  const points = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 7; i++) {
      const a = -Math.PI / 2 + i * (2 * Math.PI / 7);
      arr.push({
        x: cx + rOuter * Math.cos(a),
        y: cy + rOuter * Math.sin(a),
        ang: a,
      });
    }
    return arr;
  }, [size]);

  // Нормалізація енергії (0..1) для підсвічування та "хвостів".
  // Якщо бекенд вже дає поля eNorm / tail — просто використай їх тут.
  const enriched = points.map((p, i) => {
    const c = chakras[i] || {};
    const energy = Number(c.energy ?? 0);       // твоя фактична "сила" вузла
    const maxRef = 9;                           // референс для нормалізації (підлаштуй)
    const eNorm = Math.max(0, Math.min(1, energy / maxRef));
    // "кармічний хвіст": довший, якщо мало енергії (дефіцит)
    const tail = 1 - eNorm; // 0..1
    return {
      i, p, c, eNorm, tail,
      color: chakraColors[i] || COLORS.gold,
      number: c.number ?? (i + 1), // що показувати як цифру на вузлі
    };
  });

  // Довжина хвоста у пікселях (макс)
  const TAIL_MAX = rOuter * 0.25;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{
        background: 'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.04), transparent 65%)',
        borderRadius: 0, // було 16 — прибрав скруглення зверху/скрізь
        border: `1px solid ${COLORS.line}`,
      }}
    >
      {/* орбіти */}
      {[0.18, 0.30, 0.42].map((k, i) => (
        <circle key={i} cx={cx} cy={cy} r={size * k / 2}
          fill="none" stroke={COLORS.line} strokeDasharray="4 6" />
      ))}

      {/* лінії полігона між сусідніми чакрами */}
      <polyline
        fill="none"
        stroke={COLORS.line}
        strokeWidth="1.5"
        points={enriched.map(e => `${e.p.x},${e.p.y}`).join(' ') + ` ${enriched[0].p.x},${enriched[0].p.y}`}
      />

      {/* центр */}
      <circle cx={cx} cy={cy} r={8} fill={COLORS.gold} />
      <text x={cx} y={cy - 16} textAnchor="middle" fill={COLORS.gold} fontSize="12" style={{ opacity: 0.85 }}>
        Енергія ядра
      </text>

      {enriched.map(e => {
        // координати хвоста (всередину, по радіусу до центру)
        const tailLen = e.tail * TAIL_MAX;
        const tx = e.p.x - Math.cos(e.p.ang) * tailLen;
        const ty = e.p.y - Math.sin(e.p.ang) * tailLen;

        return (
          <g key={e.i}>
            {/* "кармічний хвіст" — штрихована лінія до центру */}
            {e.tail > 0.02 && (
              <line
                x1={e.p.x} y1={e.p.y} x2={tx} y2={ty}
                stroke={e.color} strokeWidth="2" strokeDasharray="3 4" opacity="0.9"
              />
            )}

            {/* кільце (рівень) — товщина/прозорість за енергією */}
            <circle cx={e.p.x} cy={e.p.y} r={16} fill="none"
                    stroke={e.color} strokeWidth={1.5} opacity={0.7}/>
            {/* заповнення */}
            <circle cx={e.p.x} cy={e.p.y} r={10}
                    fill={e.color} opacity={0.85}/>

            {/* число (цифра вузла) */}
            {showNumbers && (
              <text x={e.p.x} y={e.p.y + 4}
                    textAnchor="middle"
                    fill={COLORS.bg}
                    fontWeight={700}
                    fontSize="12">
                {e.number}
              </text>
            )}

            {/* назва чакри під вузлом */}
            <text x={e.p.x} y={e.p.y - 22}
                  textAnchor="middle"
                  fill={e.color}
                  fontSize="11"
                  style={{ opacity: 0.95 }}>
              {e.c?.name || ''}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

