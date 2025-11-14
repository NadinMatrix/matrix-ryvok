// components/ArcanaMatrixWeb.js
import React, { useMemo } from 'react';

const COLORS = {
  bg: '#031827',
  gold: '#E1CB92',
  accent: '#18C3CB',
  line: 'rgba(225,203,146,0.45)',
  dot: '#FF6B81',
  money: '#E1CB92',
  power: '#E1CB92',
  heart: '#FF6B81',
};

/**
 * Авторська арканна матриця RYVOK:
 *  - восьмикутник із числами 1–8
 *  - ромб + внутрішній квадрат
 *  - роки життя по колу (0–75, крок 5)
 *  - іконки: ⚡ (сила волі), $ (фінанси), ❤️ (стосунки)
 *
 * size – розмір SVG, values – масив чисел арканів (довжина до 8)
 */
export default function ArcanaMatrixWeb({ size = 520, values = [] }) {
  const cx = size / 2;
  const cy = size / 2;

  const rOuter = size * 0.40;      // радіус восьмикутника (кружечки 1–8)
  const rAges = rOuter + 28;       // коло з роками
  const rDiamond = size * 0.17;    // великий ромб
  const rSquare = rDiamond * 0.70; // внутрішній квадрат
  const rCore1 = size * 0.08;
  const rCore2 = size * 0.12;
  const rCore3 = size * 0.16;

  // 8 вершин восьмикутника (енергії 1–8)
  const octPoints = useMemo(() => {
    const baseAngle = -Math.PI / 2; // 1 зверху
    const arr = [];
    for (let i = 0; i < 8; i++) {
      const a = baseAngle + (i * 2 * Math.PI) / 8;
      arr.push({
        x: cx + rOuter * Math.cos(a),
        y: cy + rOuter * Math.sin(a),
        angle: a,
      });
    }
    return arr;
  }, [cx, cy, rOuter]);

  // Коло років: 0–75 з кроком 5
  const ageMarks = useMemo(() => {
    const baseAngle = -Math.PI / 2; // 0 років над 1-ю енергією
    const step = (2 * Math.PI) / 16; // 16 точок по 5 років
    const arr = [];
    for (let i = 0; i <= 15; i++) {
      const age = i * 5;
      const a = baseAngle + i * step;
      arr.push({
        age,
        x: cx + rAges * Math.cos(a),
        y: cy + rAges * Math.sin(a),
      });
    }
    return arr;
  }, [cx, cy, rAges]);

  // Ромб (4 вершини, повернутий)
  const diamondPoints = useMemo(() => {
    const arr = [];
    const baseAngle = -Math.PI / 2; // верхня вершина ромба
    for (let i = 0; i < 4; i++) {
      const a = baseAngle + (i * 2 * Math.PI) / 4;
      arr.push({
        x: cx + rDiamond * Math.cos(a),
        y: cy + rDiamond * Math.sin(a),
      });
    }
    return arr;
  }, [cx, cy, rDiamond]);

  // Внутрішній квадрат (осьовий)
  const squarePoints = useMemo(() => {
    return [
      { x: cx - rSquare, y: cy - rSquare },
      { x: cx + rSquare, y: cy - rSquare },
      { x: cx + rSquare, y: cy + rSquare },
      { x: cx - rSquare, y: cy + rSquare },
    ];
  }, [cx, cy, rSquare]);

  // Позиції іконок (винесені за ромб, але всередині восьмикутника)
  const moneyPos = useMemo(() => {
    // правий нижній сегмент (330°)
    const a = (330 * Math.PI) / 180;
    const k = 1.32;
    return {
      x: cx + rDiamond * k * Math.cos(a),
      y: cy + rDiamond * k * Math.sin(a),
    };
  }, [cx, cy, rDiamond]);

  const powerPos = useMemo(() => {
    // лівий нижній сегмент (210°)
    const a = (210 * Math.PI) / 180;
    const k = 1.32;
    return {
      x: cx + rDiamond * k * Math.cos(a),
      y: cy + rDiamond * k * Math.sin(a),
    };
  }, [cx, cy, rDiamond]);

  const heartPos = useMemo(() => {
    // нижче ромба, на вертикалі
    const k = 1.55;
    return {
      x: cx,
      y: cy + rDiamond * k,
    };
  }, [cx, cy, rDiamond]);

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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
        {/* Орбіти (концентричні кола) */}
        {[rCore1, rCore2, rCore3].map((r, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={COLORS.line}
            strokeDasharray="6 8"
            strokeWidth="1"
          />
        ))}

        {/* Вертикальна й горизонтальна осі */}
        <line
          x1={cx}
          y1={cy - rDiamond * 1.6}
          x2={cx}
          y2={cy + rDiamond * 1.6}
          stroke={COLORS.line}
          strokeDasharray="6 10"
          strokeWidth="1"
        />
        <line
          x1={cx - rDiamond * 1.6}
          y1={cy}
          x2={cx + rDiamond * 1.6}
          y2={cy}
          stroke={COLORS.line}
          strokeDasharray="6 10"
          strokeWidth="1"
        />

        {/* Діагоналі (канали роду) */}
        <line
          x1={cx - rDiamond * 1.4}
          y1={cy + rDiamond * 1.4}
          x2={cx + rDiamond * 1.4}
          y2={cy - rDiamond * 1.4}
          stroke={COLORS.line}
          strokeDasharray="6 10"
          strokeWidth="1"
        />
        <line
          x1={cx - rDiamond * 1.4}
          y1={cy - rDiamond * 1.4}
          x2={cx + rDiamond * 1.4}
          y2={cy + rDiamond * 1.4}
          stroke={COLORS.line}
          strokeDasharray="6 10"
          strokeWidth="1"
        />

        {/* Підписи роду */}
        <text
          x={cx - rDiamond * 1.4}
          y={cy + rDiamond * 1.55}
          fill={COLORS.gold}
          fontSize="12"
        >
          Чоловічий рід
        </text>
        <text
          x={cx + rDiamond * 0.9}
          y={cy + rDiamond * 1.55}
          fill={COLORS.gold}
          fontSize="12"
        >
          Жіночий рід
        </text>

        {/* Ромб */}
        <polygon
          points={diamondPoints.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={COLORS.gold}
          strokeWidth="1.8"
        />

        {/* Внутрішній квадрат */}
        <polygon
          points={squarePoints.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={COLORS.line}
          strokeWidth="1"
          strokeDasharray="6 8"
        />

        {/* Центр / Ядро */}
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

        {/* Восьмикутник – лінії між енергіями */}
        <polygon
          points={octPoints.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={COLORS.gold}
          strokeWidth="1.4"
        />

        {/* Розтяжки від ромба до восьмикутника (допоміжні діагоналі) */}
        {octPoints.map((p, i) => (
          <line
            key={`diag-${i}`}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke={COLORS.line}
            strokeDasharray="4 8"
            strokeWidth="1"
          />
        ))}

        {/* Енергії 1–8 (кружечки) */}
        {octPoints.map((p, i) => {
          const v = values[i] ?? i + 1;
          return (
            <g key={`arc-${i}`}>
              <circle cx={p.x} cy={p.y} r={20} fill={COLORS.bg} />
              <circle
                cx={p.x}
                cy={p.y}
                r={24}
                fill="none"
                stroke={COLORS.dot}
                strokeWidth="2"
              />
              <text
                x={p.x}
                y={p.y + 4}
                textAnchor="middle"
                fill={COLORS.dot}
                fontWeight="700"
                fontSize="14"
              >
                {v}
              </text>
            </g>
          );
        })}

        {/* Коло років */}
        {ageMarks.map((m, i) => (
          <g key={`age-${i}`}>
            <circle cx={m.x} cy={m.y} r={3} fill={COLORS.line} />
            {/* Підпис тільки кожні 10 років (0,10,20,...,70) */}
            {m.age % 10 === 0 && (
              <text
                x={m.x}
                y={m.y - 8}
                textAnchor="middle"
                fill={COLORS.gold}
                fontSize="11"
              >
                {m.age}
              </text>
            )}
          </g>
        ))}

        {/* ⚡ – іконка сили / проявлення */}
        <g transform={`translate(${powerPos.x}, ${powerPos.y}) scale(1.1)`}>
          <polyline
            points="0,-10 5,-2 1,-2 6,7 -4,0 0,0"
            fill={COLORS.power}
            stroke={COLORS.power}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </g>

        {/* $ – фінанси */}
        <text
          x={moneyPos.x}
          y={moneyPos.y + 4}
          textAnchor="middle"
          fill={COLORS.money}
          fontSize="22"
          fontWeight="600"
        >
          $
        </text>

        {/* ❤️ – стосунки */}
        <g transform={`translate(${heartPos.x}, ${heartPos.y}) scale(0.9)`}>
          <path
            d="M 0 6 C -4 3 -8 1 -8 -3 C -8 -6 -6 -8 -4 -8 C -2 -8 0 -6 0 -4 C 0 -6 2 -8 4 -8 C 6 -8 8 -6 8 -3 C 8 1 4 3 0 6 Z"
            fill={COLORS.heart}
          />
        </g>
      </svg>
    </div>
  );
}
