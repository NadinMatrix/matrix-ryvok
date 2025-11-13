// components/ArcanaMatrixWeb.js
import React, { useMemo } from 'react';

const COLORS = {
  bg: '#031827',
  gold: '#E1CB92',
  accent: '#18C3CB',
  line: 'rgba(225,203,146,0.45)',
  dot: '#FF6B81',
};

export default function ArcanaMatrixWeb({ size = 520, values = [] }) {
  const cx = size / 2;
  const cy = size / 2;

  // зовнішній радіус восьмикутника
  const rOuter = size * 0.42;
  // внутрішній квадрат (для родових / духовних енергій)
  const rInner = size * 0.33;

  // 8 вершин восьмикутника
  const points = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 8; i++) {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 8;
      arr.push({
        x: cx + rOuter * Math.cos(a),
        y: cy + rOuter * Math.sin(a),
        ang: a,
      });
    }
    return arr;
  }, [cx, cy, rOuter]);

  // 4 вершини ВНУТРІШНЬОГО ПРЯМОГО квадрата
  const square = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 4; i++) {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 4; // 0°, 90°, 180°, 270°
      arr.push({
        x: cx + rInner * Math.cos(a),
        y: cy + rInner * Math.sin(a),
      });
    }
    return arr;
  }, [cx, cy, rInner]);

  // орбіти для глибин (для майбутніх 22 енергій)
  const orbits = [0.18, 0.30, 0.42];

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        margin: '40px auto 0',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          display: 'block',
          margin: '0 auto',
          background:
            'radial-gradient(circle at 50% 35%, rgba(255,255,255,0.06), transparent 70%)',
          borderRadius: 24,
          border: `1px solid ${COLORS.line}`,
        }}
      >
        {/* орбіти */}
        {orbits.map((k, i) => (
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

        {/* головний хрест: небо / земля, ліва / права півсфера */}
        {/* вертикаль */}
        <line
          x1={cx}
          y1={cy - rOuter}
          x2={cx}
          y2={cy + rOuter}
          stroke={COLORS.line}
          strokeDasharray="4 6"
        />
        {/* горизонталь */}
        <line
          x1={cx - rOuter}
          y1={cy}
          x2={cx + rOuter}
          y2={cy}
          stroke={COLORS.line}
          strokeDasharray="4 6"
        />

        {/* діагоналі: чоловічий / жіночий рід */}
        {/* чоловічий рід — ліва діагональ */}
        <line
          x1={cx - rOuter}
          y1={cy + rOuter}
          x2={cx + rOuter}
          y2={cy - rOuter}
          stroke={COLORS.line}
          strokeDasharray="4 6"
        />
        {/* жіночий рід — права діагональ */}
        <line
          x1={cx - rOuter}
          y1={cy - rOuter}
          x2={cx + rOuter}
          y2={cy + rOuter}
          stroke={COLORS.line}
          strokeDasharray="4 6"
        />

        {/* підписи НЕБО / ЗЕМЛЯ */}
        <text
          x={cx}
          y={cy - rOuter - 10}
          textAnchor="middle"
          fill={COLORS.gold}
          fontSize="11"
        >
          Небо
        </text>
        <text
          x={cx}
          y={cy + rOuter + 18}
          textAnchor="middle"
          fill={COLORS.gold}
          fontSize="11"
        >
          Земля
        </text>

        {/* підписи РОДОВИХ ЛІНІЙ (акуратно, без «наляпано») */}
        <text
          x={cx - rInner - 40}
          y={cy + rInner + 16}
          fill={COLORS.gold}
          fontSize="10"
        >
          Чоловічий рід
        </text>
        <text
          x={cx + rInner - 10}
          y={cy + rInner + 16}
          fill={COLORS.gold}
          fontSize="10"
        >
          Жіночий рід
        </text>

        {/* ВНУТРІШНІЙ ПРЯМИЙ КВАДРАТ */}
        <polygon
          points={square.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={COLORS.gold}
          strokeWidth="1.4"
        />

        {/* ЦЕНТР – ЯДРО */}
        <circle cx={cx} cy={cy} r={9} fill={COLORS.gold} />
        <text
          x={cx}
          y={cy - 18}
          textAnchor="middle"
          fill={COLORS.gold}
          fontSize="12"
          style={{ opacity: 0.9 }}
        >
          Ядро
        </text>

        {/* 8 зовнішніх арканів по восьмикутнику */}
        <polygon
          points={points.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={COLORS.line}
          strokeWidth="1.5"
        />

        {points.map((p, i) => {
          // поки заглушки 1..8 — потім сюди заведемо реальні значення
          const v = values[i] ?? i + 1;
          return (
            <g key={i}>
              {/* промінь до центру */}
              <line
                x1={cx}
                y1={cy}
                x2={p.x}
                y2={p.y}
                stroke={COLORS.line}
                strokeDasharray="3 5"
              />
              {/* подвійне коло */}
              <circle cx={p.x} cy={p.y} r={16} fill={COLORS.bg} />
              <circle
                cx={p.x}
                cy={p.y}
                r={22}
                fill="none"
                stroke={COLORS.dot}
              />
              {/* номер аркану */}
              <text
                x={p.x}
                y={p.y + 4}
                textAnchor="middle"
                fill={COLORS.dot}
                fontWeight="700"
                fontSize="13"
              >
                {v}
              </text>
            </g>
          );
        })}

        {/* МІСЦЯ ДЛЯ АВТОРСЬКИХ ІКОНОК (❤️, $, ⚡) – акуратно, без перевантаження */}
        {/* приклад: іконка любові трохи нижче центру */}
        <text
          x={cx + rInner * 0.35}
          y={cy + rInner * 0.15}
          fontSize="14"
          fill={COLORS.dot}
        >
          ❤
        </text>
        {/* приклад: фінанси правіше від центру */}
        <text
          x={cx + rInner * 0.6}
          y={cy}
          fontSize="14"
          fill={COLORS.gold}
        >
          $
        </text>
        {/* приклад: енергія / трансформація вище центру */}
        <text
          x={cx - rInner * 0.55}
          y={cy - rInner * 0.1}
          fontSize="14"
          fill={COLORS.accent}
        >
          ⚡
        </text>
      </svg>
    </div>
  );
}
