// components/ArcanaMatrixWeb.js
import React, { useMemo } from 'react';

const COLORS = {
  bg: '#031827',
  gold: '#E1CB92',
  accent: '#18C3CB',
  line: 'rgba(225,203,146,0.45)',
  lineBold: 'rgba(225,203,146,0.9)',
  dot: '#FF6B81',
  yearDot: 'rgba(225,203,146,0.55)',
};

/**
 * Авторська арканна матриця (8-кутник + ромб + квадрат)
 * size – розмір SVG, values – масив чисел арканів (до 8)
 */
export default function ArcanaMatrixWeb({ size = 520, values = [] }) {
  const cx = size / 2;
  const cy = size / 2;

  // Радіуси
  const rArcana = size * 0.38;         // коло 1–8
  const rDiamond = size * 0.26;        // зовнішній ромб
  const rSquare = size * 0.30 / 2;     // «30 радіус» – внутрішній квадрат
  const orbitRadii = [0.18, 0.30, 0.42].map(k => (size * k) / 2);
  const rYears = size * 0.46;          // коло років (0–75)

  // 8 вершин восьмикутника (арканів)
  const arcanaPoints = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 8; i++) {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 8;
      arr.push({
        x: cx + rArcana * Math.cos(a),
        y: cy + rArcana * Math.sin(a),
        angle: a,
      });
    }
    return arr;
  }, [cx, cy, rArcana]);

  // Ромб (квадрат, повернутий на 45°)
  const diamondPoints = useMemo(() => {
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

  // Прямий квадрат (осьовий), радіус ~30
  const squarePoints = useMemo(() => {
    return [
      { x: cx - rSquare, y: cy - rSquare },
      { x: cx + rSquare, y: cy - rSquare },
      { x: cx + rSquare, y: cy + rSquare },
      { x: cx - rSquare, y: cy + rSquare },
    ];
  }, [cx, cy, rSquare]);

  // Роки по колу (0–75, крок 5) — старт з кута, де стоїть аркан 6
  const yearMarks = useMemo(() => {
    const ages = [];
    for (let age = 0; age <= 75; age += 5) {
      ages.push(age);
    }

    const angleFor6 =
      -Math.PI / 2 + (5 * 2 * Math.PI) / 8; // той самий кут, що й для вершини 6
    const step = (2 * Math.PI) / ages.length;

    return ages.map((age, index) => {
      const a = angleFor6 + step * index;
      return {
        age,
        x: cx + rYears * Math.cos(a),
        y: cy + rYears * Math.sin(a),
      };
    });
  }, [cx, cy, rYears]);

  // Координати для іконок
  const energyIcon = {
    x: cx - rSquare * 0.9,
    y: cy + rSquare * 0.05,
  };

  const moneyIcon = {
    x: cx + rSquare * 0.9,
    y: cy + rSquare * 0.1,
  };

  const heartIcon = {
    x: cx + rSquare * 0.1,
    y: cy + rSquare * 0.95,
  };

  const heartPath = `
    M ${heartIcon.x} ${heartIcon.y}
    c -4 -6 -12 -6 -16 0
    c -4 6 -1 14 8 18
    c 9 -4 12 -12 8 -18
    z
  `;

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
            'radial-gradient(circle at 50% 35%, rgba(255,255,255,0.04), transparent 70%)',
          borderRadius: 24,
        }}
      >
        {/* мінімалістичний фон – тонкі концентричні кола */}
        {orbitRadii.map((r, i) => (
          <circle
            key={`orbit-${i}`}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={COLORS.line}
            strokeDasharray={i === 2 ? '6 10' : '4 8'}
          />
        ))}

        {/* Вертикаль / горизонталь */}
        <line
          x1={cx}
          y1={cy - rDiamond * 1.4}
          x2={cx}
          y2={cy + rDiamond * 1.4}
          stroke={COLORS.line}
          strokeDasharray="4 6"
        />
        <line
          x1={cx - rDiamond * 1.4}
          y1={cy}
          x2={cx + rDiamond * 1.4}
          y2={cy}
          stroke={COLORS.line}
          strokeDasharray="4 6"
        />

        {/* Діагоналі роду */}
        {/* Чоловічий рід — зліва вгору ↘ вправо вниз (синя умовна лінія) */}
        <line
          x1={cx - rDiamond * 1.4}
          y1={cy + rDiamond * 1.4}
          x2={cx + rDiamond * 1.4}
          y2={cy - rDiamond * 1.4}
          stroke={COLORS.line}
          strokeDasharray="4 6"
        />
        {/* Жіночий рід — справа вгору ↙ вліво вниз */}
        <line
          x1={cx - rDiamond * 1.4}
          y1={cy - rDiamond * 1.4}
          x2={cx + rDiamond * 1.4}
          y2={cy + rDiamond * 1.4}
          stroke={COLORS.line}
          strokeDasharray="4 6"
        />

        {/* Підписи роду */}
        <text
          x={cx - rDiamond * 1.1}
          y={cy + rDiamond * 1.1}
          fill={COLORS.gold}
          fontSize="11"
        >
          Чоловічий рід
        </text>
        <text
          x={cx + rDiamond * 0.6}
          y={cy + rDiamond * 1.1}
          fill={COLORS.gold}
          fontSize="11"
        >
          Жіночий рід
        </text>

        {/* Ромб */}
        <polygon
          points={diamondPoints.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={COLORS.lineBold}
          strokeWidth="1.4"
        />

        {/* Внутрішній квадрат (осьовий) */}
        <polygon
          points={squarePoints.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={COLORS.line}
          strokeWidth="1"
          strokeDasharray="4 6"
        />

        {/* Ядро */}
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

        {/* 8-кутник – орбіта арканів */}
        <polygon
          points={arcanaPoints.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={COLORS.lineBold}
          strokeWidth="1.2"
        />

        {/* Іконка енергії (блискавка) */}
        <polyline
          points={[
            [energyIcon.x - 6, energyIcon.y - 4],
            [energyIcon.x + 1, energyIcon.y - 4],
            [energyIcon.x - 3, energyIcon.y + 6],
            [energyIcon.x + 4, energyIcon.y + 6],
          ]
            .map(p => p.join(','))
            .join(' ')}
          fill="none"
          stroke="#FFC400"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Іконка грошей (₴ / $) */}
        <text
          x={moneyIcon.x}
          y={moneyIcon.y}
          fill={COLORS.gold}
          fontSize="20"
          fontWeight="600"
          textAnchor="middle"
        >
          $
        </text>

        {/* Іконка серця (векторний path) */}
        <path d={heartPath} fill={COLORS.dot} />

        {/* Роки по колу */}
        {yearMarks.map(({ age, x, y }, i) => (
          <g key={`age-${age}-${i}`}>
            <circle cx={x} cy={y} r={3} fill={COLORS.yearDot} />
            <text
              x={x}
              y={y - 6}
              textAnchor="middle"
              fill={COLORS.yearDot}
              fontSize="9"
            >
              {age}
            </text>
          </g>
        ))}

        {/* 8 точок арканів */}
        {arcanaPoints.map((p, i) => {
          const v = values[i] ?? i + 1; // поки заглушка 1..8
          return (
            <g key={`arcana-${i}`}>
              <circle cx={p.x} cy={p.y} r={18} fill={COLORS.bg} />
              <circle
                cx={p.x}
                cy={p.y}
                r={22}
                fill="none"
                stroke={COLORS.dot}
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
      </svg>
    </div>
  );
}
