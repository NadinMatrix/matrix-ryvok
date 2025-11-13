// components/ArcanaMatrixWeb.js
import React, { useMemo } from 'react';

const COLORS = {
  bg: '#031827',
  gold: '#E1CB92',
  accent: '#18C3CB',
  line: 'rgba(225,203,146,0.45)',
  dot: '#FF6B81',
  axis: 'rgba(225,203,146,0.35)',
};

/** Векторна блискавка (ресурс / енергія) */
function LightningIcon({ x, y, size = 20, color = COLORS.gold }) {
  const s = size / 24;
  return (
    <g transform={`translate(${x}, ${y}) scale(${s})`}>
      <polygon
        points="0,-10 6,-1 1,-1 5,10 -6,0 -2,0"
        fill={color}
      />
    </g>
  );
}

/** Векторне сердечко (любов / відносини) */
function HeartIcon({ x, y, size = 20, color = COLORS.dot }) {
  const s = size / 24;
  return (
    <g transform={`translate(${x}, ${y}) scale(${s})`}>
      <path
        d="
          M 0 6
          L -5 1
          C -7 -1 -7 -4 -5 -6
          C -3 -8 -1 -7 0 -5.5
          C 1 -7 3 -8 5 -6
          C 7 -4 7 -1 5 1
          Z
        "
        fill={color}
      />
    </g>
  );
}

/** Знак $ (фінансова вісь) */
function DollarIcon({ x, y, color = COLORS.gold }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize="18"
      fontWeight="600"
      fill={color}
    >
      $
    </text>
  );
}

/**
 * MATRIX RYVOK – авторська арканна матриця
 * size – розмір SVG
 * values – масив арканів для 8 вершин (поки що демо)
 */
export default function ArcanaMatrixWeb({ size = 520, values = [] }) {
  const cx = size / 2;
  const cy = size / 2;

  const rOuter = size * 0.42;   // вершини восьмикутника
  const rDiamond = size * 0.24; // ромб (по діагоналі)
  const rSquare = size * 0.18;  // внутрішній квадрат (прямий)
  const rOrbits = [0.12, 0.20, 0.28].map(k => (size * k) / 2);
  const rAges = size * 0.47;    // кільце років по колу

  /** 8 вершин восьмикутника */
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

  /** Ромб (по діагоналі) */
  const diamond = useMemo(
    () => [
      { x: cx, y: cy - rDiamond }, // верх
      { x: cx + rDiamond, y: cy }, // право
      { x: cx, y: cy + rDiamond }, // низ
      { x: cx - rDiamond, y: cy }, // ліво
    ],
    [cx, cy, rDiamond]
  );

  /** Внутрішній квадрат (прямий) */
  const square = useMemo(
    () => [
      { x: cx - rSquare, y: cy - rSquare },
      { x: cx + rSquare, y: cy - rSquare },
      { x: cx + rSquare, y: cy + rSquare },
      { x: cx - rSquare, y: cy + rSquare },
    ],
    [cx, cy, rSquare]
  );

  /** Розмітка років по зовнішньому колу (0–75 через 5 років) */
  const ageMarks = useMemo(() => {
    const arr = [];
    const count = 16; // 0..75
    const step = (2 * Math.PI) / count;
    for (let i = 0; i < count; i++) {
      const age = i * 5;
      const a = -Math.PI / 2 + i * step; // початок зверху
      const x = cx + rAges * Math.cos(a);
      const y = cy + rAges * Math.sin(a);
      const lx = cx + (rAges + 20) * Math.cos(a);
      const ly = cy + (rAges + 20) * Math.sin(a);
      arr.push({ x, y, lx, ly, age });
    }
    return arr;
  }, [cx, cy, rAges]);

  // Координати для іконок (у своїх секторах)
  const lightningPos = {
    x: cx - rSquare * 0.7,  // зліва від вертикалі
    y: cy + rSquare * 0.05, // трохи нижче горизонталі
  };

  const dollarPos = {
    x: cx + rSquare * 0.7,  // справа
    y: cy + rSquare * 0.05, // сектор "горизонталь + вниз"
  };

  const heartPos = {
    x: cx + rSquare * 0.25, // нижня права частина
    y: cy + rSquare * 0.85,
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
        {/* Орбіти всередині */}
        {rOrbits.map((r, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={COLORS.line}
            strokeDasharray="4 6"
          />
        ))}

        {/* Вертикальна вісь (Небо–Земля) */}
        <line
          x1={cx}
          y1={cy - rDiamond * 1.2}
          x2={cx}
          y2={cy + rDiamond * 1.2}
          stroke={COLORS.axis}
          strokeDasharray="6 6"
        />

        {/* Горизонтальна вісь (ліва/права половина) */}
        <line
          x1={cx - rDiamond * 1.2}
          y1={cy}
          x2={cx + rDiamond * 1.2}
          y2={cy}
          stroke={COLORS.axis}
          strokeDasharray="6 6"
        />

        {/* Діагоналі роду */}
        {/* Чоловічий – зліва вгору -> вправо вниз */}
        <line
          x1={cx - rDiamond}
          y1={cy - rDiamond}
          x2={cx + rDiamond}
          y2={cy + rDiamond}
          stroke={COLORS.axis}
          strokeDasharray="6 6"
        />
        {/* Жіночий – справа вгору -> вліво вниз */}
        <line
          x1={cx + rDiamond}
          y1={cy - rDiamond}
          x2={cx - rDiamond}
          y2={cy + rDiamond}
          stroke={COLORS.axis}
          strokeDasharray="6 6"
        />

        {/* Підписи під кутами – чоловічий / жіночий рід */}
        <text
          x={cx - rOuter * 0.7}
          y={cy + rOuter * 0.35}
          textAnchor="middle"
          fill={COLORS.gold}
          fontSize="12"
        >
          Чоловічий рід
        </text>
        <text
          x={cx + rOuter * 0.7}
          y={cy + rOuter * 0.35}
          textAnchor="middle"
          fill={COLORS.gold}
          fontSize="12"
        >
          Жіночий рід
        </text>

        {/* Восьмикутник */}
        <polygon
          points={points.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={COLORS.line}
          strokeWidth="1.5"
        />

        {/* Ромб */}
        <polygon
          points={diamond.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={COLORS.gold}
          strokeWidth="1.4"
        />

        {/* Внутрішній квадрат */}
        <polygon
          points={square.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={COLORS.axis}
          strokeDasharray="5 5"
        />

        {/* Центр */}
        <circle cx={cx} cy={cy} r={9} fill={COLORS.gold} />
        <text
          x={cx}
          y={cy - 16}
          textAnchor="middle"
          fill={COLORS.gold}
          fontSize="12"
          style={{ opacity: 0.9 }}
        >
          Ядро
        </text>

        {/* 8 точок арканів на зовнішньому кільці */}
        {points.map((p, i) => {
          const v = values[i] ?? i + 1; // поки заглушка 1..8
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

        {/* Кільце років по колу (демо для розміщення енергій) */}
        {ageMarks.map(({ x, y, lx, ly, age }, idx) => (
          <g key={idx}>
            <circle cx={x} cy={y} r={3} fill={COLORS.axis} />
            <text
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="9"
              fill={COLORS.axis}
            >
              {age}
            </text>
          </g>
        ))}

        {/* Іконка ресурсу / сили */}
        <LightningIcon x={lightningPos.x} y={lightningPos.y} size={22} />

        {/* Іконка грошей – сектор від горизонталі вниз справа */}
        <DollarIcon x={dollarPos.x} y={dollarPos.y} />

        {/* Іконка кохання – нижня права частина від вертикалі */}
        <HeartIcon x={heartPos.x} y={heartPos.y} size={22} />
      </svg>
    </div>
  );
}
