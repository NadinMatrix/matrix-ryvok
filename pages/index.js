// pages/index.js
import React, { useMemo, useState } from 'react';
import { ArcanaMatrixWeb } from '../components/ArcanaMatrixWeb';

const COLORS = {
  bg: '#031827',         // темний індіго
  gold: '#E1CB92',       // світло-золотий
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
  
  // тестові дані, щоб побачити 8-кутник
  const demoArcanaPoints = [
    { label: 'Місія', arcana: 7, energy: 7 },
    { label: 'Характер', arcana: 11, energy: 6 },
    { label: 'Доля', arcana: 19, energy: 8 },
    { label: 'Карма роду', arcana: 16, energy: 3 },
    { label: 'Партнерство', arcana: 6, energy: 5 },
    { label: 'Гроші', arcana: 10, energy: 4 },
    { label: 'Соц.реалізація', arcana: 21, energy: 9 },
    { label: 'Дар душі', arcana: 22, energy: 7 },
  ];

  function onDob(e) {
    // авто-крапки: ДД.ММ.РРРР
    let v = e.target.value.replace(/[^\d]/g, '').slice(0, 8);
    if (v.length > 4) {
      v = v.replace(
        /^(\d{2})(\d{2})(\d{0,4})$/,
        (_, a, b, c) => (c ? `${a}.${b}.${c}` : `${a}.${b}`)
      );
    } else if (v.length > 2) {
      v = v.replace(
        /^(\d{2})(\d{0,2})$/,
        (_, a, b) => (b ? `${a}.${b}` : `${a}.`)
      );
    }
    setDob(v);
  }

  async function handleAnalyze(e) {
    e.preventDefault();
    setErr('');
    setOut(null);

    if (!name.trim()) {
      setErr('Введи ім’я.');
      return;
    }
    if (!/^\d{2}\.\d{2}\.\d{4}$/.test(dob)) {
      setErr('Формат дати: ДД.ММ.РРРР');
      return;
    }

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
    } catch (e2) {
      setErr(e2.message || 'Серверна помилка');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: COLORS.bg,
        color: COLORS.text,
      }}
    >
      <header style={{ padding: '40px 16px 16px', textAlign: 'center' }}>
        <LogoMark />
        <h1
          style={{
            margin: '14px 0 6px',
            fontWeight: 600,
            letterSpacing: 1,
          }}
        >
          MATRIX RYVOK
        </h1>
        <p
          style={{
            opacity: 0.85,
            maxWidth: 820,
            margin: '0 auto',
            lineHeight: 1.7,
          }}
        >
          Тут відкриваються глибини самопізнання, оживають сакральні знання і
          розкриваються езотеричні концепції. Досліджуй, розширюй свідомість і
          знаходь гармонію між собою та Всесвітом. Відчуй натхнення на шляху до
          особистого й духовного розвитку.
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
              onChange={e => setName(e.target.value)}
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
              <label>
                <input
                  type="radio"
                  name="g"
                  checked={gender === 'female'}
                  onChange={() => setGender('female')}
                />{' '}
                Жінка
              </label>
              <label>
                <input
                  type="radio"
                  name="g"
                  checked={gender === 'male'}
                  onChange={() => setGender('male')}
                />{' '}
                Чоловік
              </label>
            </div>
          </div>

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Обробка…' : 'Розшифрувати матрицю'}
          </button>
        </form>

        {/* Матриця (по центру, без верхнього скруглення) */}
        <div style={styles.webWrap}>
          {/* <ChakraWeb core={out?.core} chakras={out?.chakras || []}/> */}
        </div>

        {/* Таблиця */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Чакра</th>
              <th style={styles.th}>Фізика</th>
              <th style={styles.th}>Енергія</th>
              <th style={styles.th}>Емоції</th>
            </tr>
          </thead>
          <tbody>
            {out?.chakras?.map((c, i) => (
              <tr key={i}>
                <td style={styles.td}>{c.name}</td>
                <td style={styles.td}>{c.physical}</td>
                <td style={styles.td}>{c.energy}</td>
                <td style={styles.td}>{c.emotion}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {err && (
          <div style={styles.error}>
            {err}
          </div>
        )}

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <a href="#buy" style={styles.cta}>
            Отримати повний PDF
          </a>
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
              ✦ РЕЗУЛЬТАТ ✦
            </div>
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                lineHeight: 1.6,
                marginTop: 8,
                fontFamily: 'inherit',
                textAlign: 'justify',
              }}
{/* НОВА АРКАННА МАТРИЦЯ */}
<div style={{ display:'flex', justifyContent:'center', marginTop:40 }}>
  <ArcanaMatrixWeb
    size={520}
    points={demoArcanaPoints}
    centerArcana={11}
  />
</div>
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
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: 12,
          background: 'linear-gradient(130deg,#E1CB92,#18C3CB)',
        }}
      />
      <div
        style={{
          height: 1,
          width: 96,
          background:
            'linear-gradient(90deg, transparent, #E1CB92, transparent)',
        }}
      />
    </div>
  );
}

/** SVG-схема “сітка чакр” з цифрами та "хвостами" */
function ChakraWeb({
  svgSize = 520,
  data = [],
  showNumbers = true,
  chakraColors = [],
  core,
}) {
  const size = svgSize;
  const rOuter = size * 0.4;
  const cx = size / 2;
  const cy = size / 2;

  const chakras = data || [];

  // 7 точок по колу (початок зверху)
  const points = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 7; i++) {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 7;
      arr.push({
        x: cx + rOuter * Math.cos(a),
        y: cy + rOuter * Math.sin(a),
        ang: a,
      });
    }
    return arr;
  }, [size, cx, cy, rOuter]);

  // Нормалізація енергії + "кармічні хвости"
  const enriched = points.map((p, i) => {
    const c = chakras[i] || {};
    const energy = Number(c.energy ?? 0);
    const maxRef = 9; // можна підлаштувати
    const eNorm = Math.max(0, Math.min(1, energy / maxRef));
    const tail = 1 - eNorm; // чим менше енергія, тим довший хвіст

    return {
      i,
      p,
      c,
      eNorm,
      tail,
      color:
        chakraColors[i] ||
        (eNorm >= 0.7
          ? COLORS.gold
          : eNorm >= 0.4
          ? COLORS.accent
          : '#FF7A7A'),
      number: c.number ?? i + 1,
    };
  });

  const TAIL_MAX = rOuter * 0.25;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{
        background:
          'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.04), transparent 65%)',
        borderRadius: 16,
        border: `1px solid ${COLORS.line}`,
      }}
    >
      {/* орбіти */}
      {[0.18, 0.3, 0.42].map((k, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={(size * k) / 2}
          fill="none"
          stroke={COLORS.line}
          strokeDasharray="4 6"
        />
      ))}

      {/* полігон між чакрами */}
      {enriched.length > 1 && (
        <polyline
          points={
            enriched
              .map(e => `${e.p.x},${e.p.y}`)
              .join(' ') + ` ${enriched[0].p.x},${enriched[0].p.y}`
          }
          fill="none"
          stroke={COLORS.line}
          strokeWidth="1.5"
        />
      )}

      {/* центр */}
      <circle cx={cx} cy={cy} r={8} fill={COLORS.gold} />
      <text
        x={cx}
        y={cy - 16}
        textAnchor="middle"
        fill={COLORS.gold}
        fontSize="12"
        style={{ opacity: 0.85 }}
      >
        Енергія ядра
      </text>

      {/* вузли чакр + хвости */}
      {enriched.map(e => {
        const tailLen = e.tail * TAIL_MAX;
        const tx = e.p.x - Math.cos(e.p.ang) * tailLen;
        const ty = e.p.y - Math.sin(e.p.ang) * tailLen;

        return (
          <g key={e.i}>
            {/* кармічний хвіст */}
            {e.tail > 0.02 && (
              <line
                x1={e.p.x}
                y1={e.p.y}
                x2={tx}
                y2={ty}
                stroke={COLORS.line}
                strokeWidth="1"
                strokeDasharray="2 4"
              />
            )}

            {/* кільце */}
            <circle
              cx={e.p.x}
              cy={e.p.y}
              r={16}
              fill="none"
              stroke={COLORS.line}
              strokeWidth={1 + e.eNorm}
              opacity={0.6 + 0.4 * e.eNorm}
            />

            {/* заповнення вузла */}
            <circle cx={e.p.x} cy={e.p.y} r={10} fill={e.color} />

            {/* цифра */}
            {showNumbers && (
              <text
                x={e.p.x}
                y={e.p.y + 4}
                textAnchor="middle"
                fill={COLORS.bg}
                fontWeight={700}
                fontSize="12"
              >
                {e.number}
              </text>
            )}

            {/* назва чакри */}
            <text
              x={e.p.x}
              y={e.p.y - 22}
              textAnchor="middle"
              fill={COLORS.gold}
              fontSize="11"
              style={{ opacity: 0.9 }}
            >
              {e.c?.name || ''}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

const styles = {
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 16,
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: '0 8px',
  },

  field: {
    flex: '1 1 260px',
    minWidth: 240,
  },

  label: {
    display: 'block',
    marginBottom: 6,
    fontSize: 12,
    opacity: 0.85,
    color: 'rgba(255,255,255,0.85)',
  },

  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 12,
    border: `1px solid ${COLORS.gold}55`,
    background: 'transparent',
    color: COLORS.text,
    fontSize: 16,
  },

  btn: {
    flex: '0 0 auto',
    padding: '14px 28px',
    borderRadius: 14,
    border: 'none',
    background: COLORS.gold,
    color: '#031827',
    fontWeight: 600,
    fontSize: 15,
    boxShadow: '0 0 22px rgba(225,203,146,0.25)',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
  },

  webWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 32,
  },

  table: {
    width: '100%',
    marginTop: 12,
    borderCollapse: 'collapse',
    fontSize: 14,
  },

  th: {
    padding: '8px 10px',
    borderBottom: `1px solid ${COLORS.line}`,
    textAlign: 'center',
    fontWeight: 600,
  },

  td: {
    padding: '6px 10px',
    borderBottom: `1px solid ${COLORS.line}`,
    textAlign: 'center',
  },

  error: {
    color: COLORS.error,
    margin: '10px 4px 0',
    textAlign: 'center',
  },

  cta: {
    display: 'inline-block',
    padding: '12px 28px',
    borderRadius: 14,
    border: `1px solid ${COLORS.gold}`,
    color: COLORS.gold,
    textDecoration: 'none',
    fontWeight: 500,
    marginTop: 8,
  },
};

// Адаптив
styles['@media'] = `
  @media (max-width: 860px){
    .form { flex-direction: column; align-items: stretch; }
    .btn { width: 100%; }
    .matrix-wrap svg { width: 100% !important; height: auto !important; }
  }
`;
