// components/ArcanaMatrixWeb.js
import React, { useMemo } from 'react';

const COLORS = {
  bg: '#031827',
  gold: '#E1CB92',
  accent: '#18C3CB',
  line: 'rgba(225,203,146,0.45)',
  lineStrong: '#E1CB92',
  dot: '#FF6B81',
  ageDot: 'rgba(225,203,146,0.55)',
};

// налаштування вікових точок
const AGE_FROM = 0;
const AGE_TO = 75;
const AGE_STEP = 5;
// старт кута для нуля років (у градусах, 0° — вправо, 90° — вниз)
// 210° ≈ сектор біля енергії 6 (зліва знизу)
const AGE_START_DEG = 210;

export default function ArcanaMatrixWeb({ size = 520, values = [] }) {
  const cx = size / 2;
  const cy = size / 2;

  const rOuter = size * 0.42;      // радіус 8-кутника
  const rDiamond = size * 0.23;    // ромб (повернутий квадрат)
  const rAxisSquare = size * 0.18; // прямий квадрат усередині
  const rOrbitsMax = size * 0.23;  // макс радіус орбіт
  const rAges = size * 0.46;       // коло років

  // 8 вершин восьмикутника
  const points = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 8; i++) {
      const a = (-Math.PI / 2) + (i * 2 * Math.PI) / 8; // починаємо з верху
      arr.push({
        x: cx + rOuter * Math.cos(a),
        y: cy + rOuter * Math.sin(a),
        angle: a,
      });
    }
    return arr;
  }, [cx, cy, rOuter]);

  // ромб (повернутий квадрат)
  const diamond = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 4; i++) {
      const a = (-Math.PI / 2) + (i * 2 * Math.PI) / 4;
      arr.push({
        x: cx + rDiamond * Math.cos(a),
        y: cy + rDiamond * Math.sin(a),
      });
    }
    return arr;
  }, [cx, cy, rDiamond]);

  // прямий квадрат по осях
  const axisSquare = useMemo(() => {
    const r = rAxisSquare;
    return [
      { x: cx - r, y: cy - r },
      { x: cx + r, y: cy - r },
      { x: cx + r, y: cy + r },
      { x: cx - r, y: cy + r },
    ];
  }, [cx, cy, rAxisSquare]);

  // вікові точки по колу
  const ageMarks = useMemo(() => {
    const res = [];
    const count = (AGE_TO - AGE_FROM) / AGE_STEP + 1;
    const stepDeg = 360 / count;

    for (let i = 0; i < count; i++) {
      const age = AGE_FROM + i * AGE_STEP;
      const deg = AGE_START_DEG + stepDeg * i;
      const rad = (deg * Math.PI) / 180;

      res.push({
        age,
        x: cx + rAges * Math.cos(rad),
        y: cy + rAges * Math.sin(rad),
      });
    }
    return res;
  }, [cx, cy, rAges]);

  // допоміжна функція для стрілки
  const arrowHead = (x1, y1, x2, y2, sizeArrow = 10) => {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const a1 = angle + Math.PI * 0.8;
    const a2 = angle - Math.PI * 0.8;
    return [
      x2,
      y2,
      x2 + sizeArrow * Math.cos(a1),
      y2 + sizeArrow * Math.sin(a1),
      x2 + sizeArrow * Math.cos(a2),
      y2 + sizeArrow * Math.sin(a2),
    ];
  };

  // координати для ліній роду (від центру до низу ліворуч / праворуч)
  const maleEnd = {
    x: cx - rDiamond * 0.85,
    y: cy + rDiamond * 0.85,
  };
  const femaleEnd = {
    x: cx + rDiamond * 0.85,
    y: cy + rDiamond * 0.85,
  };

  // позиції іконок (усередині внутрішнього квадрата)
  const iconEnergy = {
    x: cx - rAxisSquare * 0.7,
    y: cy,
  }; // ⚡ – зліва по горизонталі
  const iconMoney = {
    x: cx + rAxisSquare * 0.75,
    y: cy + rAxisSquare * 0.05,
  }; // $ – справа трохи нижче горизонталі
  const iconHeart = {
    x: cx + rAxisSquare * 0.3,
    y: cy + rAxisSquare * 0.9,
  }; // ♥ – правий нижній сектор

  const valuesSafe = [...values];
  while (valuesSafe.length < 8) valuesSafe.push(valuesSafe.length + 1);

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
        {/* фонова темна панель */}
        <rect
          x={size * 0.04}
          y={size * 0.04}
          width={size * 0.92}
          height={size * 0.92}
          rx={26}
          ry={26}
          fill="none"
          stroke={COLORS.line}
          strokeWidth="1.2"
        />

        {/* радіальні хвилі */}
        {[0.26, 0.32, 0.38, 0.44].map((k, i) => (
          <circle
            key={`bg-${i}`}
            cx={cx}
            cy={cy}
            r={size * k * 0.9}
            fill="none"
            stroke={COLORS.line}
            strokeOpacity={0.12}
          />
        ))}

        {/* орбіти */}
        {[0.25, 0.40, 0.55].map((ratio, i) => (
          <circle
            key={`orbit-${i}`}
            cx={cx}
            cy={cy}
            r={rOrbitsMax * ratio}
            fill="none"
            stroke={COLORS.line}
            strokeDasharray="4 6"
          />
        ))}

        {/* осі (вертикаль / горизонталь) */}
        <line
          x1={cx}
          y1={cy - rOrbitsMax * 1.05}
          x2={cx}
          y2={cy + rOrbitsMax * 1.05}
          stroke={COLORS.line}
          strokeDasharray="6 6"
        />
        <line
          x1={cx - rOrbitsMax * 1.05}
          y1={cy}
          x2={cx + rOrbitsMax * 1.05}
          y2={cy}
          stroke={COLORS.line}
          strokeDasharray="6 6"
        />

        {/* ромб (повернутий квадрат) */}
        <polygon
          points={diamond.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={COLORS.lineStrong}
          strokeWidth="1.5"
        />

        {/* внутрішній прямий квадрат (штриховий) */}
        <polygon
          points={axisSquare.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={COLORS.line}
          strokeDasharray="8 6"
        />

        {/* лінії роду: чоловічий (зліва вниз) */}
        <g>
          <line
            x1={cx}
            y1={cy}
            x2={maleEnd.x}
            y2={maleEnd.y}
            stroke={COLORS.line}
            strokeWidth="1.4"
          />
          {(() => {
            const [x2, y2, x3, y3, x4, y4] = arrowHead(
              cx,
              cy,
              maleEnd.x,
              maleEnd.y,
              9
            );
            return (
              <polygon
                points={`${x2},${y2} ${x3},${y3} ${x4},${y4}`}
                fill={COLORS.line}
              />
            );
          })()}
          <text
            x={cx - rOuter * 0.55}
            y={cy + rOuter * 0.12}
            textAnchor="middle"
            fill={COLORS.gold}
            fontSize="11"
          >
            Чоловічий рід
          </text>
        </g>

        {/* лінії роду: жіночий (справа вниз) */}
        <g>
          <line
            x1={cx}
            y1={cy}
            x2={femaleEnd.x}
            y2={femaleEnd.y}
            stroke={COLORS.line}
            strokeWidth="1.4"
          />
          {(() => {
            const [x2, y2, x3, y3, x4, y4] = arrowHead(
              cx,
              cy,
              femaleEnd.x,
              femaleEnd.y,
              9
            );
            return (
              <polygon
                points={`${x2},${y2} ${x3},${y3} ${x4},${y4}`}
                fill={COLORS.line}
              />
            );
          })()}
          <text
            x={cx + rOuter * 0.55}
            y={cy + rOuter * 0.12}
            textAnchor="middle"
            fill={COLORS.gold}
            fontSize="11"
          >
            Жіночий рід
          </text>
        </g>

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

        {/* векторна іконка енергії ⚡ */}
        <g transform={`translate(${iconEnergy.x}, ${iconEnergy.y})`}>
          <polygon
            points="-6,-2 0,-10 -2,-2 4,-4 0,6 2,-2"
            fill={COLORS.accent}
            stroke={COLORS.gold}
            strokeWidth="0.6"
          />
        </g>

        {/* векторна іконка грошей $ */}
        <g transform={`translate(${iconMoney.x}, ${iconMoney.y})`}>
          <circle
            cx="0"
            cy="0"
            r="11"
            fill="none"
            stroke={COLORS.gold}
            strokeWidth="1"
          />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fontSize="12"
            fill={COLORS.gold}
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          >
            $
          </text>
        </g>

        {/* векторна іконка серця ❤️ */}
        <g transform={`translate(${iconHeart.x}, ${iconHeart.y}) scale(0.9)`}>
          <path
            d="M0 4 C -5 -2, -4 -7, 0 -5 C 4 -7, 5 -2, 0 4 Z"
            fill={COLORS.dot}
            stroke={COLORS.dot}
            strokeWidth="0.5"
          />
        </g>

        {/* 8-кутник + лінії від центру до вершин */}
        <polygon
          points={points.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={COLORS.line}
          strokeWidth="1.3"
        />

        {points.map((p, i) => {
          const v = valuesSafe[i];
          return (
            <g key={`arc-${i}`}>
              {/* промені від центру */}
              <line
                x1={cx}
                y1={cy}
                x2={p.x}
                y2={p.y}
                stroke={COLORS.line}
                strokeDasharray="3 5"
              />
              {/* зовнішнє кільце точки */}
              <circle cx={p.x} cy={p.y} r={22} fill="none" stroke={COLORS.dot} />
              {/* внутрішній круг */}
              <circle cx={p.x} cy={p.y} r={16} fill={COLORS.bg} />
              {/* цифра аркана */}
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

        {/* вікові точки по колу */}
        {ageMarks.map((m, idx) => (
          <g key={`age-${idx}`}>
            <circle cx={m.x} cy={m.y} r={3} fill={COLORS.ageDot} />
            <text
              x={m.x}
              y={m.y + 11}
              textAnchor="middle"
              fill={COLORS.ageDot}
              fontSize="9"
            >
              {m.age}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
