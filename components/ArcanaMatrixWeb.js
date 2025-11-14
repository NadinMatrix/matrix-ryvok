// components/ArcanaMatrixWeb.js
import React, { useMemo } from 'react';

const COLORS = {
  bg: '#031827',
  gold: '#E1CB92',
  accent: '#18C3CB',
  line: 'rgba(225,203,146,0.45)',
  lineSoft: 'rgba(225,203,146,0.25)',
  dot: '#FF6B81',
  years: 'rgba(225,203,146,0.6)',
};

export default function ArcanaMatrixWeb({ size = 520, values = [] }) {
  const cx = size / 2;
  const cy = size / 2;

  // зовнішній восьмикутник (кружечки 1–8)
  const rOuter = size * 0.36;

  // великий ромб (основна фігура)
  const rDiamond = size * 0.20; // трохи менший, щоб кружечки й іконки мали повітря

  // внутрішній квадрат-сітка (той, що має бути «на 28» умовно)
  const rInnerSquare = size * 0.135;

  // орбіти в центрі
  const orbitRadii = [0.10, 0.16, 0.22].map(k => (size * k) / 2);

  // 8 вершин восьмикутника
  const points = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 8; i++) {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 8;
      arr.push({
        x: cx + rOuter * Math.cos(a),
        y: cy + rOuter * Math.sin(a),
        angle: a,
      });
    }
    return arr;
  }, [cx, cy, rOuter]);

  // вершини ромба (повернути квадрат під 45°)
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

  // внутрішній квадрат (прямий, не ромб)
  const innerSquare = useMemo(() => {
    return [
      { x: cx - rInnerSquare, y: cy - rInnerSquare },
      { x: cx + rInnerSquare, y: cy - rInnerSquare },
      { x: cx + rInnerSquare, y: cy + rInnerSquare },
      { x: cx - rInnerSquare, y: cy + rInnerSquare },
    ];
  }, [cx, cy, rInnerSquare]);

  // роки по колу — 0,5,10,...,75
  // СТАРТ 0 — під першою енергією (над верхнім сегментом 1)
  const years = useMemo(() => {
    const list = [];
    const maxAge = 75;
    const step = 5;
    const totalMarks = maxAge / step + 1; // 0..75
    const radius = rOuter + size * 0.055;

    for (let i = 0; i < totalMarks; i++) {
      const age = i * step;

      // 8 секторів по 10 років, але ми їх пишемо дрібніше (по 5)
      // поворот такий, щоб age=0 був під вершиною 1
      const t = age / 80; // умовно, щоб не доходити рівно до 360°
      const angle = -Math.PI / 2 + t * 2 * Math.PI;

      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);

      list.push({ age, x, y });
    }
    return list;
  }, [cx, cy, rOuter, size]);

  // позиції іконок: робимо їх на тому ж радіусі, що й внутрішній квадрат,
  // але ТРОХИ ДАЛІ по променю, щоб «за ромбом»
  const iconRadius = rInnerSquare + size * 0.03;

  const moneyPos = {
    x: cx + iconRadius * Math.cos(0), // вправо по горизонталі
    y: cy + iconRadius * Math.sin(0),
  };

  const lovePos = {
    x: cx + iconRadius * Math.cos(Math.PI / 2), // вниз
    y: cy + iconRadius * Math.sin(Math.PI / 2),
  };

  const powerPos = {
    x: cx + iconRadius * Math.cos(Math.PI), // вліво
    y: cy + iconRadius * Math.sin(Math.PI),
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
          border: `1px solid ${COLORS.lineSoft}`, // мінімалістична рамка
        }}
      >
        {/* Мʼякі орбіти фону */}
        {orbitRadii.map((r, i) => (
          <circle
            key={`orbit-${i}`}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={COLORS.lineSoft}
            strokeDasharray="6 10"
          />
        ))}

        {/* направляючі по вертикалі / горизонталі */}
        <line
          x1={cx}
          y1={cy - rDiamond * 1.4}
          x2={cx}
          y2={cy + rDiamond * 1.4}
          stroke={COLORS.lineSoft}
          strokeDasharray="6 8"
        />
        <line
          x1={cx - rDiamond * 1.4}
          y1={cy}
          x2={cx + rDiamond * 1.4}
          y2={cy}
          stroke={COLORS.lineSoft}
          strokeDasharray="6 8"
        />

        {/* внутрішній квадрат (прямий) */}
        <polygon
          points={innerSquare.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={COLORS.lineSoft}
          strokeDasharray="6 8"
        />

        {/* діагоналі цього квадрата */}
        <line
          x1={innerSquare[0].x}
          y1={innerSquare[0].y}
          x2={innerSquare[2].x}
          y2={innerSquare[2].y}
          stroke={COLORS.lineSoft}
          strokeDasharray="6 8"
        />
        <line
          x1={innerSquare[1].x}
          y1={innerSquare[1].y}
          x2={innerSquare[3].x}
          y2={innerSquare[3].y}
          stroke={COLORS.lineSoft}
          strokeDasharray="6 8"
        />

        {/* великий ромб */}
        <polygon
          points={diamondPoints.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={COLORS.gold}
          strokeWidth="1.5"
        />

        {/* центральна точка (Ядро) */}
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

        {/* лінії роду */}
        {/* чоловічий рід: зліва вгору -> вправо вниз */}
        <line
          x1={cx - rInnerSquare}
          y1={cy + rInnerSquare}
          x2={cx + rInnerSquare}
          y2={cy - rInnerSquare}
          stroke={COLORS.lineSoft}
          strokeDasharray="6 8"
        />
        {/* жіночий рід: справа вгору -> вліво вниз */}
        <line
          x1={cx + rInnerSquare}
          y1={cy + rInnerSquare}
          x2={cx - rInnerSquare}
          y2={cy - rInnerSquare}
          stroke={COLORS.lineSoft}
          strokeDasharray="6 8"
        />

        {/* підписи роду */}
        <text
          x={cx - rInnerSquare - 8}
          y={cy + rInnerSquare + 16}
          textAnchor="end"
          fill={COLORS.gold}
          fontSize="11"
        >
          Чоловічий рід
        </text>
        <text
          x={cx + rInnerSquare + 8}
          y={cy + rInnerSquare + 16}
          textAnchor="start"
          fill={COLORS.gold}
          fontSize="11"
        >
          Жіночий рід
        </text>

        {/* 8 точок / енергій по колу */}
        {points.map((p, i) => {
          const v = values[i] ?? i + 1;
          return (
            <g key={`p-${i}`}>
              {/* радіальні лінії всередину */}
              <line
                x1={cx}
                y1={cy}
                x2={p.x}
                y2={p.y}
                stroke={COLORS.lineSoft}
                strokeDasharray="4 6"
              />
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
                fontSize="13"
              >
                {v}
              </text>
            </g>
          );
        })}

        {/* роки по колу */}
        {years.map(({ age, x, y }, i) => (
          <g key={`age-${i}`}>
            <circle cx={x} cy={y} r={3} fill={COLORS.years} />
            <text
              x={x}
              y={y - 6}
              textAnchor="middle"
              fill={COLORS.years}
              fontSize="9"
            >
              {age}
            </text>
          </g>
        ))}

        {/* іконки-сектори (всі за межами ромба, але в правильному секторі) */}
        {/* сила / енергія (зліва) */}
        <text
          x={powerPos.x}
          y={powerPos.y + 4}
          textAnchor="middle"
          fontSize="18"
          fill={COLORS.gold}
        >
          ⚡
        </text>

        {/* гроші (правий нижній сектор) */}
        <text
          x={moneyPos.x}
          y={moneyPos.y + 6}
          textAnchor="middle"
          fontSize="20"
          fill={COLORS.gold}
        >
          $
        </text>

        {/* стосунки / любов (нижній сектор праворуч від вертикалі) */}
        <text
          x={lovePos.x + size * 0.02}
          y={lovePos.y}
          textAnchor="middle"
          fontSize="18"
          fill={COLORS.dot}
        >
          ❤
        </text>
      </svg>
    </div>
  );
}
