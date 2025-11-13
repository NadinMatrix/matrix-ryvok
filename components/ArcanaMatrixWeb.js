// components/ArcanaMatrixWeb.js
import React, { useMemo } from 'react';

const COLORS = {
  bg: '#031827',
  gold: '#E1CB92',
  accent: '#18C3CB',
  line: 'rgba(225,203,146,0.45)',
  dot: '#FF6B81',
};

/**
 * Авторська арканна матриця (8-кутник + квадрат всередині)
 * size – розмір SVG, values – масив чисел арканів (довжина до 8)
 */
export default function ArcanaMatrixWeb({ size = 520, values = [] }) {
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = size * 0.42;
  const rInner = size * 0.22;

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

  // 4 вершини внутрішнього квадрата
  const square = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 4; i++) {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 4;
      arr.push({
        x: cx + rInner * Math.cos(a),
        y: cy + rInner * Math.sin(a),
      });
    }
    return arr;
  }, [cx, cy, rInner]);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: size,
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
        {[0.18, 0.30, 0.42].map((k, i) => (
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

        {/* восьмикутник */}
        <polygon
          points={points.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={COLORS.line}
          strokeWidth="1.5"
        />

        {/* квадрат */}
        <polygon
          points={square.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={COLORS.gold}
          strokeWidth="1.4"
        />

        {/* центр */}
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

        {/* 8 точок арканів */}
        {points.map((p, i) => {
          const v = values[i] ?? i + 1; // поки що – заглушка 1..8
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
              {/* кола */}
              <circle cx={p.x} cy={p.y} r={16} fill={COLORS.bg} />
              <circle cx={p.x} cy={p.y} r={22} fill="none" stroke={COLORS.dot} />
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
      </svg>
    </div>
  );
}
export default ArcanaMatrixWeb;
