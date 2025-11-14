// components/ArcanaMatrixWeb.js
import React, { useMemo } from 'react';

const COLORS = {
  bg: '#031827',
  gold: '#E1CB92',
  line: 'rgba(225,203,146,0.45)',
  lineStrong: '#E1CB92',
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
 * Матриця долі RYVOK (метод Ладіні):
 * - 1 енергія строго ЗЛІВА
 * - далі 2–3–4–5–6–7–8 йдуть ЗА годинниковою
 * - зовнішній квадрат — РІД
 * - внутрішній ромб — ОСОБИСТЕ (личное)
 */
export default function ArcanaMatrixWeb({
  size = 520,
  ages = [0, 5, 10, 15, 20, 25, 30, 35], // тимчасово 8 точок: потім можна змінити під 0,5,10,...75
}) {
  const cx = size / 2;
  const cy = size / 2;

  // геометрія
  const rOuter = size * 0.38;          // вершини восьмикутника
  const rRodSquare = size * 0.30;      // родовий квадрат
  const rPersonalDiamond = size * 0.28; // внутрішній ромб
  const rAge = rOuter + 26;            // кільце віків
  const rEnergy = (rOuter + rRodSquare) / 2; // кружечки енергій
  const rIcons = (rRodSquare + rOuter) / 2;  // радіус для $ і ❤️

  // 8 вершин восьмикутника:
  // 1 — зліва, далі за годинниковою: низ-ліво, низ, низ-право, право, верх-право, верх, верх-ліво
  const octagon = useMemo(() => {
    const pts = [];
    const step = Math.PI / 4;   // +45° -> за годинниковою
    const base = Math.PI;       // 180° — строго зліва (1)
    for (let i = 0; i < 8; i++) {
      const angle = (base + i * step) % (2 * Math.PI);
      pts.push({
        angle,
        ...polar(cx, cy, rOuter, angle),
      });
    }
    return pts;
  }, [cx, cy, rOuter]);

  const energyPoints = useMemo(
    () =>
      octagon.map((p) => ({
        angle: p.angle,
        ...polar(cx, cy, rEnergy, p.angle),
      })),
    [octagon, cx, cy, rEnergy]
  );

  const agePoints = useMemo(
    () =>
      octagon.map((p) => ({
        ...polar(cx, cy, rAge, p.angle),
      })),
    [octagon, cx, cy, rAge]
  );

  // родовий квадрат (осьовий)
  const rodSquare = [
    { x: cx - rRodSquare, y: cy - rRodSquare },
    { x: cx + rRodSquare, y: cy - rRodSquare },
    { x: cx + rRodSquare, y: cy + rRodSquare },
    { x: cx - rRodSquare, y: cy + rRodSquare },
  ];

  // особистий ромб (квадрат під 45°)
  const personalDiamond = (() => {
    const r = rPersonalDiamond;
    const pts = [];
    for (let i = 0; i < 4; i++) {
      const angle = Math.PI / 4 + i * (Math.PI / 2); // 45°,135°...
      pts.push(polar(cx, cy, r, angle));
    }
    return pts;
  })();

  // іконка $ — СЕКТОР ВНИЗ (від горизонталі)
  const moneyAngle = Math.PI / 2; // 90° — прямо вниз
  const moneyPos = polar(cx, cy, rIcons, moneyAngle);

  // іконка ❤️ — НИЖНЯ ПРАВА ЧАСТИНА (від вертикалі)
  const heartAngle = (7 * Math.PI) / 4; // 315° — низ-право
  const heartPos = polar(cx, cy, rIcons, heartAngle);

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
          border: `1px solid ${COLORS.line}`, // тонка рамка як ти хотіла
          background: COLORS.bg,
        }}
      >
        <defs>
          <radialGradient id="matrixGlow" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
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

        {/* легке сяйво */}
        <rect
          x={0}
          y={0}
          width={size}
          height={size}
          fill="url(#matrixGlow)"
          rx={24}
        />

        {/* орбіти в центрі */}
        {[0.18, 0.26, 0.34].map((k, idx) => (
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
          points={octagon.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={COLORS.lineStrong}
          strokeWidth={1.2}
        />

        {/* родовий квадрат */}
        <polygon
          points={rodSquare.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={COLORS.line}
          strokeWidth={1.2}
        />

        {/* особистий ромб */}
        <polygon
          points={personalDiamond.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={COLORS.gold}
          strokeWidth={1.4}
        />

        {/* осі НЕБО / ЗЕМЛЯ */}
        <line
          x1={cx}
          y1={cy - rRodSquare * 1.1}
          x2={cx}
          y2={cy + rRodSquare * 1.1}
          stroke={COLORS.line}
          strokeWidth={1}
          strokeDasharray="4 6"
        />
        <line
          x1={cx - rRodSquare * 1.1}
          y1={cy}
          x2={cx + rRodSquare * 1.1}
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

        {/* $ — сектор ВНИЗ (фінанси) */}
        <use
          href="#icon-money"
          x={moneyPos.x - 11}
          y={moneyPos.y - 11}
          width={22}
          height={22}
        />

        {/* ❤️ — нижня права частина (емоції / родина) */}
        <use
          href="#icon-heart"
          x={heartPos.x - 10}
          y={heartPos.y - 10}
          width={20}
          height={20}
        />

        {/* кружечки енергій (поки 1..8 як заглушки) */}
        {energyPoints.map((p, i) => (
          <g key={`en-${i}`}>
            <circle
              cx={p.x}
              cy={p.y}
              r={15}
              fill={COLORS.bg}
              stroke={COLORS.pink}
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

        {/* роки — разом з енергіями по годинниковій */}
        {agePoints.map((p, i) => (
          <text
            key={`age-${i}`}
            x={p.x}
            y={p.y}
            fill={COLORS.lineStrong}
            fontSize={11}
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {ages[i]}
          </text>
        ))}

        {/* НЕБО / ЗЕМЛЯ */}
        <text
          x={cx}
          y={cy - rRodSquare - 18}
          fill={COLORS.text}
          fontSize={11}
          textAnchor="middle"
        >
          НЕБО
        </text>
        <text
          x={cx}
          y={cy + rRodSquare + 26}
          fill={COLORS.text}
          fontSize={11}
          textAnchor="middle"
        >
          ЗЕМЛЯ
        </text>

        {/* рід батька / матері */}
        <text
          x={cx - rRodSquare - 40}
          y={cy + 4}
          fill={COLORS.text}
          fontSize={11}
          textAnchor="middle"
        >
          РІД БАТЬКА
        </text>
        <text
          x={cx + rRodSquare + 40}
          y={cy + 4}
          fill={COLORS.text}
          fontSize={11}
          textAnchor="middle"
        >
          РІД МАТЕРІ
        </text>
      </svg>
    </div>
  );
}
