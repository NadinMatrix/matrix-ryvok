// components/ArcanaMatrixWeb.js
import React, { useMemo } from 'react';

const COLORS = {
  bg: '#031827',
  gold: '#E1CB92',
  line: 'rgba(225,203,146,0.45)',
  lineStrong: '#E1CB92',
  circle: '#192B3A',
  accentCircle: '#1F3144',
  text: '#F5F5F5',
  pink: '#FF6B81',
};

function polar(cx, cy, r, angle) {
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  };
}

/**
 * Матриця долі (метод Ладіні, веб-версія RYVOK)
 * - 1 енергія строго ЗЛІВА
 * - енергії 1–8 йдуть ЗА годинниковою
 * - роки по колу 0–75 з кроком 5 років
 * - зовнішній квадрат — РОДОВИЙ
 * - внутрішній квадрат + ромб — ОСОБИСТИЙ рівень
 */
export default function ArcanaMatrixWeb({ size = 520 }) {
  const cx = size / 2;
  const cy = size / 2;

  // геометрія
  const rOuter = size * 0.30;            // радіус вершин восьмикутника
  const rRodSquare = size * 0.23;        // великий родовий квадрат
  const rInnerSquare = rRodSquare * 0.6; // внутрішній квадрат (особистий рівень)
  const rAge = rOuter + 22;              // кільце років
  const rEnergy = (rOuter + rRodSquare) / 2; // кружечки енергій
  const rIcons = (rRodSquare + rOuter) / 2;  // радіус для іконок $ та ❤️

  // 8 вершин восьмикутника:
  // 1 — строго зліва, далі за годинниковою
  const octagon = useMemo(() => {
  const pts = [];
  const base = Math.PI;        // 180° — ліво, тут стоїть 1
  const step = Math.PI / 4;    // +45° => ЗА годинниковою
  for (let i = 0; i < 8; i++) {
    const angle = base + i * step;
    pts.push({
      angle,
      ...polar(cx, cy, rOuter, angle),
    });
  }
  return pts;
}, [cx, cy, rOuter]);

  // точки для енергій (по тому самому куту, тільки ближче до центру)
  const energyPoints = useMemo(
    () =>
      octagon.map(p => ({
        angle: p.angle,
        ...polar(cx, cy, rEnergy, p.angle),
      })),
    [octagon, cx, cy, rEnergy],
  );

  // поділки років: 0,5,10,…,75 (16 штук) — між енергіями
  const ageMarks = useMemo(() => {
  const list = [];
  const step = Math.PI / 8; // 22.5°
  for (let i = 0; i < 16; i++) {
    const age = i * 5;
    // 0 років строго зліва, далі ЗА годинниковою
    const angle = Math.PI + i * step;   // ← тут міняємо «-» на «+»
    list.push({
      age,
      angle,
      ...polar(cx, cy, rAge, angle),
    });
  }
  return list;
}, [cx, cy, rAge]);

  // родовий квадрат (великий, осьовий)
  const rodSquare = [
    { x: cx - rRodSquare, y: cy - rRodSquare },
    { x: cx + rRodSquare, y: cy - rRodSquare },
    { x: cx + rRodSquare, y: cy + rRodSquare },
    { x: cx - rRodSquare, y: cy + rRodSquare },
  ];

  // внутрішній квадрат (особистий рівень)
  const innerSquare = [
    { x: cx - rInnerSquare, y: cy - rInnerSquare },
    { x: cx + rInnerSquare, y: cy - rInnerSquare },
    { x: cx + rInnerSquare, y: cy + rInnerSquare },
    { x: cx - rInnerSquare, y: cy + rInnerSquare },
  ];

  // ромб, вписаний у внутрішній квадрат (через середини його сторін)
  const personalDiamond = (() => {
    const [tl, tr, br, bl] = innerSquare;
    const topMid = { x: (tl.x + tr.x) / 2, y: (tl.y + tr.y) / 2 };
    const rightMid = { x: (tr.x + br.x) / 2, y: (tr.y + br.y) / 2 };
    const bottomMid = { x: (br.x + bl.x) / 2, y: (br.y + bl.y) / 2 };
    const leftMid = { x: (bl.x + tl.x) / 2, y: (bl.y + tl.y) / 2 };
    return [topMid, rightMid, bottomMid, leftMid];
  })();

  // позиції іконок (сегмент 45–55 років: нижній-правий сектор)
  const moneyPos = polar(cx, cy, rIcons, Math.PI / 6);     // $ трохи нижче-праворуч
  const heartPos = polar(cx, cy, rIcons, Math.PI / 2.5);   // ❤️ ще нижче-правіше

  // параметри дуги НЕБО
  const arcW = rOuter * 1.25;

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          borderRadius: 24,
          background: COLORS.bg,
        }}
      >
        {/* зовнішня рамка */}
        <rect
          x={18}
          y={18}
          width={size - 36}
          height={size - 36}
          rx={24}
          fill="none"
          stroke={COLORS.lineStrong}
          strokeWidth={1.2}
        />

        <defs>
          {/* м'яке затемнення по краях */}
          <radialGradient id="matrixGlow" cx="50%" cy="45%" r="70%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.04)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>

          {/* вектор-heart */}
          <symbol id="icon-heart" viewBox="0 0 24 24">
            <path
              d="M12 21s-5.5-3.2-8.3-6C1.5 12.8 1 10.6 2.1 8.9 3.1 7.3 5 6.7 6.7 7.3 7.6 7.6 8.4 8.3 9 9.1c.6-.8 1.4-1.5 2.3-1.8 1.7-.6 3.6 0 4.6 1.6 1.1 1.7.6 3.9-1.6 6.1C17.5 17.8 12 21 12 21z"
              fill={COLORS.pink}
            />
          </symbol>

          {/* вектор-$ */}
          <symbol id="icon-money" viewBox="0 0 24 24">
            <path
              d="M12 3v18m-3-4.5c0 1.4 1.3 2.5 3 2.5s3-.8 3-2.3c0-1.7-1.4-2.2-3-2.7s-3-.9-3-2.7C9 7.8 10.3 7 12 7s3 .9 3 2.5"
              fill="none"
              stroke={COLORS.gold}
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </symbol>
        </defs>

        <rect
          x={0}
          y={0}
          width={size}
          height={size}
          fill="url(#matrixGlow)"
          rx={24}
        />

        {/* ДУГА НЕБО (за годинниковою) */}
        <path
          d={`
            M ${cx + arcW} ${cy - rOuter + 35}
            A ${arcW} ${rOuter * 1.1} 0 0 1 ${cx - arcW} ${cy - rOuter + 35}
          `}
          stroke={COLORS.lineStrong}
          strokeWidth={1.4}
          fill="none"
        />
        {/* вертикаль від дуги до вершини НЕБО */}
        <line
          x1={cx}
          y1={cy - rOuter - 35}
          x2={cx}
          y2={cy - rOuter}
          stroke={COLORS.lineStrong}
          strokeWidth={1.2}
        />

        {/* концентричні орбіти в центрі */}
        {[0.16, 0.23, 0.30].map((k, idx) => (
          <circle
            key={idx}
            cx={cx}
            cy={cy}
            r={(size * k) / 2}
            fill="none"
            stroke={COLORS.line}
            strokeDasharray="4 7"
            strokeWidth={0.9}
          />
        ))}

        {/* восьмикутник */}
        <polygon
          points={octagon.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={COLORS.lineStrong}
          strokeWidth={1.2}
        />

        {/* родовий квадрат (великий) */}
        <polygon
          points={rodSquare.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={COLORS.line}
          strokeWidth={1.2}
        />

        {/* внутрішній квадрат */}
        <polygon
          points={innerSquare.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={COLORS.line}
          strokeWidth={1.1}
        />

        {/* ромб, вписаний у внутрішній квадрат */}
        <polygon
          points={personalDiamond.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={COLORS.gold}
          strokeWidth={1.4}
        />

        {/* вертикальна та горизонтальна осі */}
        <line
          x1={cx}
          y1={cy - rRodSquare * 1.15}
          x2={cx}
          y2={cy + rRodSquare * 1.15}
          stroke={COLORS.line}
          strokeWidth={1}
          strokeDasharray="4 6"
        />
        <line
          x1={cx - rRodSquare * 1.15}
          y1={cy}
          x2={cx + rRodSquare * 1.15}
          y2={cy}
          stroke={COLORS.line}
          strokeWidth={1}
          strokeDasharray="4 6"
        />

        {/* діагоналі роду */}
        <line
          x1={cx - rRodSquare}
          y1={cy - rRodSquare}
          x2={cx + rRodSquare}
          y2={cy + rRodSquare}
          stroke={COLORS.line}
          strokeWidth={1}
        />
        <line
          x1={cx + rRodSquare}
          y1={cy - rRodSquare}
          x2={cx - rRodSquare}
          y2={cy + rRodSquare}
          stroke={COLORS.line}
          strokeWidth={1}
        />

        {/* ЯДРО */}
        <circle
          cx={cx}
          cy={cy}
          r={7}
          fill={COLORS.gold}
          stroke={COLORS.bg}
          strokeWidth={2}
        />
        <text
          x={cx}
          y={cy + 22}
          fill={COLORS.text}
          fontSize={11}
          textAnchor="middle"
        >
          Ядро
        </text>

        {/* іконка $ */}
        <use
          href="#icon-money"
          x={moneyPos.x - 11}
          y={moneyPos.y - 11}
          width={22}
          height={22}
        />

        {/* іконка ❤️ */}
        <use
          href="#icon-heart"
          x={heartPos.x - 10}
          y={heartPos.y - 10}
          width={20}
          height={20}
        />

        {/* кружечки енергій 1–8 */}
        {energyPoints.map((p, i) => (
          <g key={`en-${i}`}>
            <circle
              cx={p.x}
              cy={p.y}
              r={15}
              fill={COLORS.bg}
              stroke="#FF6B81"
              strokeWidth={2}
            />
            <text
              x={p.x}
              y={p.y + 4}
              fill={COLORS.text}
              fontSize={14}
              fontWeight="600"
              textAnchor="middle"
            >
              {i + 1}
            </text>
          </g>
        ))}

        {/* роки 0–75 по 5 років */}
        {ageMarks.map((m, i) => (
          <text
            key={`age-${i}`}
            x={m.x}
            y={m.y}
            fill={i % 2 === 0 ? COLORS.lineStrong : COLORS.line}
            fontSize={i % 2 === 0 ? 11 : 9}
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {m.age}
          </text>
        ))}

        {/* підписи сторін світу / роду */}
        <text
          x={cx}
          y={cy - rRodSquare - 24}
          fill={COLORS.text}
          fontSize={11}
          textAnchor="middle"
        >
          НЕБО
        </text>
        <text
          x={cx}
          y={cy + rRodSquare + 76}
          fill={COLORS.text}
          fontSize={11}
          textAnchor="middle"
        >
          ЗЕМЛЯ
        </text>
        <text
          x={cx - rRodSquare - 20}
          y={cy + 4}
          fill={COLORS.text}
          fontSize={11}
          textAnchor="middle"
        >
          РІД БАТЬКА
        </text>
        <text
          x={cx + rRodSquare + 64}
          y={cy + 4}
          fill={COLORS.text}
          fontSize={11}
          textAnchor="middle"
        >
          РІД МАТЕРІ
        </text>
            {/* духовний центр над НЕБО */}
<circle
  cx={cx}
  cy={cy - (rOuter + 60)}
  r={22}
  fill="none"
  stroke={COLORS.lineStrong}
  strokeWidth={1.6}
/>

{/* 2 енергії зліва на дузі */}
{[ -130,-150 ].map((deg, i) => {
  const rad = (Math.PI / 180) * deg;
  const x = cx + (rOuter + 60) * Math.cos(rad);
  const y = cy + (rOuter + 60) * Math.sin(rad);
  return (
    <circle
      key={`left-${i}`}
      cx={x}
      cy={y}
      r={16}
      fill="none"
      stroke={COLORS.lineStrong}
      strokeWidth={1.4}
    />
  );
})}

{/* 2 енергії справа на дузі */}
{[ -50 ,-30 ].map((deg, i) => {
  const rad = (Math.PI / 180) * deg;
  const x = cx + (rOuter + 60) * Math.cos(rad);
  const y = cy + (rOuter + 60) * Math.sin(rad);
  return (
    <circle
      key={`right-${i}`}
      cx={x}
      cy={y}
      r={16}
      fill="none"
      stroke={COLORS.lineStrong}
      strokeWidth={1.4}
    />
  );
})}
      </svg>
    </div>
  );
}
