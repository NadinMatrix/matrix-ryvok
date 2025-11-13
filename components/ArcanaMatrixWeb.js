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
 * Авторська арканна матриця (8-кутник + ромб + прямий квадрат)
 * size – розмір SVG, values – масив чисел арканів (довжина до 8)
 */
export default function ArcanaMatrixWeb({ size = 520, values = [] }) {
  const cx = size / 2;
  const cy = size / 2;

  const rOuter = size * 0.42;  // вершини 1–8
  const rDiamond = size * 0.30; // великий ромб
  const halfSquare = size * 0.20; // прямий квадрат усередині

  // 8 вершин восьмикутника
  const points = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 8; i++) {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 8;
      arr.push({
        x: cx + rOuter * Math.cos(a),
        y: cy + rOuter * Math.sin(a),
      });
    }
    return arr;
  }, [cx, cy, rOuter]);

  // 4 вершини ромба (по вертикалі/горизонталі)
  const diamond = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 4; i++) {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 4;
      arr.push({
        x: cx + rDiamond * Math.cos(a),
        y: cy + rDiamond * Math.sin(a),
      });
    }
    return arr;
  }, [cx, cy, rDiamond]);

  // 4 вершини прямого квадрата (сторони паралельні краям екрану)
  const square = useMemo(() => {
    return [
      { x: cx - halfSquare, y: cy - halfSquare },
      { x: cx + halfSquare, y: cy - halfSquare },
      { x: cx + halfSquare, y: cy + halfSquare },
      { x: cx - halfSquare, y: cy + halfSquare },
    ];
  }, [cx, cy, halfSquare]);

  // Позиції іконок (енергосектори)
  const POS_POWER = {
    // ⚡ ліва нижня частина від центру (сектор сили/ресурсу)
    x: cx - rDiamond * 0.45,
    y: cy + rDiamond * 0.05,
  };

  const POS_MONEY = {
    // $ – правий сектор вниз від горизонталі
    x: cx + rDiamond * 0.55,
    y: cy + rDiamond * 0.15,
  };

  const POS_LOVE = {
    // ❤️ – нижня частина справа від вертикалі
    x: cx + rDiamond * 0.20,
    y: cy + rDiamond * 0.55,
  };

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        margin: '40px auto',
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

        {/* вертикальна вісь (Небо–Земля, без написів) */}
        <line
          x1={cx}
          y1={cy - rOuter * 0.95}
          x2={cx}
          y2={cy + rOuter * 0.95}
          stroke={COLORS.line}
          strokeDasharray="4 6"
        />

        {/* горизонтальна вісь (лівий–правий світ) */}
        <line
          x1={cx - rOuter * 0.95}
          y1={cy}
          x2={cx + rOuter * 0.95}
          y2={cy}
          stroke={COLORS.line}
          strokeDasharray="4 6"
        />

        {/* діагоналі роду */}
        {/* чоловічий рід – зліва вгору ↙ ↗ */}
        <line
          x1={cx + rDiamond * 0.02}
          y1={cy - rDiamond * 0.02}
          x2={cx - rOuter * 0.80}
          y2={cy + rOuter * 0.80}
          stroke={COLORS.line}
          strokeDasharray="4 6"
        />
        {/* жіночий рід – справа вниз ↗ ↙ */}
        <line
          x1={cx - rDiamond * 0.02}
          y1={cy - rDiamond * 0.02}
          x2={cx + rOuter * 0.80}
          y2={cy + rOuter * 0.80}
          stroke={COLORS.line}
          strokeDasharray="4 6"
        />

        {/* підписи ліній роду */}
        <text
          x={cx - rOuter * 0.55}
          y={cy + rOuter * 0.55}
          textAnchor="middle"
          fill={COLORS.line}
          fontSize="11"
        >
          Чоловічий рід
        </text>
        <text
          x={cx + rOuter * 0.55}
          y={cy + rOuter * 0.55}
          textAnchor="middle"
          fill={COLORS.line}
          fontSize="11"
        >
          Жіночий рід
        </text>

        {/* восьмикутник */}
        <polygon
          points={points.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={COLORS.line}
          strokeWidth="1.5"
        />

        {/* ромб */}
        <polygon
          points={diamond.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={COLORS.gold}
          strokeWidth="1.4"
        />

        {/* прямий квадрат */}
        <polygon
          points={square.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={COLORS.gold}
          strokeWidth="1.2"
          strokeDasharray="5 6"
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
          const v = values[i] ?? i + 1; // тимчасова заглушка 1..8
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

        {/* ІКОНКИ ЕНЕРГІЙ */}
        {/* сила / ресурс */}
        <text
          x={POS_POWER.x}
          y={POS_POWER.y}
          textAnchor="middle"
          fontSize="16"
        >
          ⚡
        </text>

        {/* гроші */}
        <text
          x={POS_MONEY.x}
          y={POS_MONEY.y}
          textAnchor="middle"
          fontSize="18"
        >
          $
        </text>

        {/* любов / стосунки */}
        <text
          x={POS_LOVE.x}
          y={POS_LOVE.y}
          textAnchor="middle"
          fontSize="16"
        >
          ❤️
        </text>
      </svg>
    </div>
  );
}
