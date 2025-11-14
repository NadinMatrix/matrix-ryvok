// components/ArcanaMatrixWeb.js
import React, { useMemo } from 'react';

const ARC_COLORS = {
  bg: '#031827',
  gold: '#E1CB92',
  accent: '#18C3CB',
  line: 'rgba(225,203,146,0.45)',
  dot: '#FF6B81',
  text: '#F5F5F5',
};

/**
 * Авторська арканна матриця на каноні Ладіні:
 *  - 1 енергія строго зліва
 *  - 3 зверху, 5 знизу
 *  - 8-кутник + квадрат-ядро
 *  - кільце віків 0–70
 */
export default function ArcanaMatrixWeb({
  size = 520,
  values = [],        // масив 8 енергій (якщо буде)
  ages = [],          // масив 8 віків, за замовч. [0,10,...,70]
}) {
  const cx = size / 2;
  const cy = size / 2;

  const rOuter = size * 0.40;  // радіус вершини 8-кутника
  const rInner = size * 0.28;  // квадрат-ядро
  const rAges  = rOuter + 26;  // кільце віків
  const rEnergy = (rInner + rOuter) / 2; // де стоять кружечки енергій
  const rIcons = (rOuter + rEnergy) / 2; // радіус для ❤️ та $

  const ageLabels = ages.length === 8 ? ages : [0, 10, 20, 30, 40, 50, 60, 70];

  // 8 точок 8-кутника (1 – строго зліва, далі проти годинникової)
  const points = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 8; i++) {
      const angle = Math.PI - i * (Math.PI / 4); // 1=180°, 2=135°, 3=90° ...
      arr.push({
        angle,
        x: cx + rOuter * Math.cos(angle),
        y: cy + rOuter * Math.sin(angle),
      });
    }
    return arr;
  }, [cx, cy, rOuter]);

  // точки для енергій (трохи ближче до центру)
  const energyPoints = useMemo(
    () =>
      points.map(p => ({
        x: cx + rEnergy * Math.cos(p.angle),
        y: cy + rEnergy * Math.sin(p.angle),
        angle: p.angle,
      })),
    [points, cx, cy, rEnergy]
  );

  // точки для підпису віків (зовні)
  const agePoints = useMemo(
    () =>
      points.map(p => ({
        x: cx + rAges * Math.cos(p.angle),
        y: cy + rAges * Math.sin(p.angle),
      })),
    [points, cx, cy, rAges]
  );

  // квадрат-ядро (особистий рівень)
  const innerSquare = useMemo(() => {
    const r = rInner;
    return [
      { x: cx - r, y: cy - r }, // зліва-горі
      { x: cx + r, y: cy - r }, // справа-горі
      { x: cx + r, y: cy + r }, // справа-низу
      { x: cx - r, y: cy + r }, // зліва-низу
    ];
  }, [cx, cy, rInner]);

  // зовнішній квадрат (родовий рівень) – трохи більший за внутрішній
  const outerSquare = useMemo(() => {
    const r = rOuter * 0.78;
    return [
      { x: cx - r, y: cy - r },
      { x: cx + r, y: cy - r },
      { x: cx + r, y: cy + r },
      { x: cx - r, y: cy + r },
    ];
  }, [cx, cy, rOuter]);

  // позиції іконок: $ – нижня ліва чверть, ❤️ – нижня права чверть
  const moneyAngle = Math.PI + Math.PI / 4;      // 225°
  const heartAngle = -Math.PI / 4;               // 315°

  const moneyPos = {
    x: cx + rIcons * Math.cos(moneyAngle),
    y: cy + rIcons * Math.sin(moneyAngle),
  };

  const heartPos = {
    x: cx + rIcons * Math.cos(heartAngle),
    y: cy + rIcons * Math.sin(heartAngle),
  };

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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
          border: `1px solid ${ARC_COLORS.line}`,
        }}
      >
        {/* Легкі орбіти */}
        {[0.20, 0.30, 0.42].map((k, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={(size * k) / 2}
            fill="none"
            stroke={ARC_COLORS.line}
            strokeDasharray="4 6"
          />
        ))}

        {/* Зовнішній квадрат (рід) */}
        <polygon
          points={outerSquare.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={ARC_COLORS.line}
          strokeWidth="1.2"
        />

        {/* Внутрішній квадрат (ядро / особистий рівень) */}
        <polygon
          points={innerSquare.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={ARC_COLORS.gold}
          strokeWidth="1.4"
        />

        {/* 8-кутник (енергетичні сектори) */}
        <polygon
          points={points.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={ARC_COLORS.line}
          strokeWidth="1.4"
        />

        {/* Лінії між сусідніми вершинами (щоб не загубились) */}
        {points.map((p, i) => {
          const next = points[(i + 1) % points.length];
          return (
            <line
              key={i}
              x1={p.x}
              y1={p.y}
              x2={next.x}
              y2={next.y}
              stroke={ARC_COLORS.line}
              strokeWidth="1"
            />
          );
        })}

        {/* Вертикальна вісь: Небо–Земля */}
        <line
          x1={cx}
          y1={cy - rOuter}
          x2={cx}
          y2={cy + rOuter}
          stroke={ARC_COLORS.line}
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />
        {/* Горизонтальна вісь: Ліва / Права сторони */}
        <line
          x1={cx - rOuter}
          y1={cy}
          x2={cx + rOuter}
          y2={cy}
          stroke={ARC_COLORS.line}
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />

        {/* Діагоналі роду */}
        {/* Чоловічий рід – ліва діагональ */}
        <line
          x1={cx - rOuter}
          y1={cy + rOuter}
          x2={cx + rOuter}
          y2={cy - rOuter}
          stroke={ARC_COLORS.line}
          strokeWidth="1"
          strokeDasharray="4 5"
        />
        {/* Жіночий рід – права діагональ */}
        <line
          x1={cx - rOuter}
          y1={cy - rOuter}
          x2={cx + rOuter}
          y2={cy + rOuter}
          stroke={ARC_COLORS.line}
          strokeWidth="1"
          strokeDasharray="4 5"
        />

        {/* Підписи осей */}
        <text
          x={cx}
          y={cy - rOuter - 18}
          textAnchor="middle"
          fill={ARC_COLORS.gold}
          fontSize="11"
        >
          НЕБО
        </text>
        <text
          x={cx}
          y={cy + rOuter + 26}
          textAnchor="middle"
          fill={ARC_COLORS.gold}
          fontSize="11"
        >
          ЗЕМЛЯ
        </text>
        <text
          x={cx - rOuter - 26}
          y={cy - 12}
          textAnchor="middle"
          fill={ARC_COLORS.gold}
          fontSize="11"
        >
          ♂ РІД БАТЬКА
        </text>
        <text
          x={cx + rOuter + 30}
          y={cy - 12}
          textAnchor="middle"
          fill={ARC_COLORS.gold}
          fontSize="11"
        >
          ♀ РІД МАТЕРІ
        </text>

        {/* Центр – ядро */}
        <circle cx={cx} cy={cy} r={9} fill={ARC_COLORS.gold} />
        <text
          x={cx}
          y={cy - 18}
          textAnchor="middle"
          fill={ARC_COLORS.gold}
          fontSize="12"
          style={{ opacity: 0.9 }}
        >
          ЯДРО
        </text>

        {/* Вікове кільце 0–70 */}
        {agePoints.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={p.y + 4}
            textAnchor="middle"
            fill={ARC_COLORS.gold}
            fontSize="11"
          >
            {ageLabels[i]}
          </text>
        ))}

        {/* Кружечки енергій у середині сегментів */}
        {energyPoints.map((p, i) => {
          const v = values[i] ?? i + 1; // поки що 1..8
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={16} fill={ARC_COLORS.bg} />
              <circle
                cx={p.x}
                cy={p.y}
                r={21}
                fill="none"
                stroke={ARC_COLORS.gold}
              />
              <text
                x={p.x}
                y={p.y + 4}
                textAnchor="middle"
                fill={ARC_COLORS.gold}
                fontWeight="700"
                fontSize="13"
              >
                {v}
              </text>
            </g>
          );
        })}

        {/* Іконка грошей – нижня ліва чверть */}
        <g transform={`translate(${moneyPos.x}, ${moneyPos.y})`}>
          <circle r={14} fill={ARC_COLORS.bg} stroke={ARC_COLORS.accent} />
          <text
            x={0}
            y={4}
            textAnchor="middle"
            fill={ARC_COLORS.accent}
            fontWeight="700"
            fontSize="14"
          >
            $
          </text>
        </g>

        {/* Іконка любові – нижня права чверть */}
        <g transform={`translate(${heartPos.x}, ${heartPos.y})`}>
          <HeartIcon />
        </g>
      </svg>
    </div>
  );
}

// Мінімалістичне контурне сердечко у стилі RYVOK
function HeartIcon() {
  return (
    <g>
      <circle
        r={14}
        fill={ARC_COLORS.bg}
        stroke={ARC_COLORS.dot}
        strokeWidth="1.4"
      />
      <path
        d="
          M 0 -5
          C -3 -9, -10 -8, -10 -2
          C -10 3, -5 7, 0 10
          C 5 7, 10 3, 10 -2
          C 10 -8, 3 -9, 0 -5
          Z
        "
        fill="none"
        stroke={ARC_COLORS.dot}
        strokeWidth="1.4"
      />
    </g>
  );
}
