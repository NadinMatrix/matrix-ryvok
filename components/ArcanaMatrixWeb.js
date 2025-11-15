// components/ArcanaMatrixWeb.js
import React, { useMemo } from 'react';

const COLORS = {
  bg: '#031827',
  gold: '#E1CB92',
  line: 'rgba(225,203,146,0.45)',
  lineStrong: '#E1CB92',
  circle: '#192B3A',
  accentCircle: '#1F3144',
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
 * Матриця долі (метод Ладіні, веб-версія RYVOK)
 * - 1 енергія строго ЗЛІВА
 * - енергії 1–8 йдуть ЗА годинниковою
 * - роки по колу 0–75 з кроком 5 років
 * - зовнішній квадрат — РОДОВИЙ, внутрішній ромб — ОСОБИСТИЙ
 * - зверху дуга НЕБО з 3+3 колами і центральним великим подвійним колом
 */
export default function ArcanaMatrixWeb({ size = 520 }) {
  const cx = size / 2;
  const cy = size / 2;

  // геометрія основної матриці
  const rOuter = size * 0.30;            // вершини восьмикутника
  const rRodSquare = size * 0.23;        // великий родовий квадрат
  const rPersonalDiamond = size * 0.17;  // внутрішній особистий ромб
  const rAge = rOuter + 22;              // кільце років
  const rEnergy = (rOuter + rRodSquare) / 2; // кружечки енергій
  const rIcons = (rRodSquare + rOuter) / 2;  // радіус для іконок $ та ❤️

  // геометрія верхньої дуги (НЕБО-рівень)
  const topArcRadius = rOuter * 1.45;            // радіус дуги
  const topArcCenterY = cy - rOuter * 1.05;      // центр дуги трохи над матрицею
  const topArcCenterX = cx;
  const topArcAngleSpan = Math.PI * 0.8;         // ~144°
  const topArcStart = -Math.PI / 2 - topArcAngleSpan / 2; // лівий кінець дуги
  const topArcEnd = -Math.PI / 2 + topArcAngleSpan / 2;   // правий кінець дуги

  // 8 вершин восьмикутника:
  // 1 — строго зліва, далі за годинниковою
  const octagon = useMemo(() => {
    const pts = [];
    const base = Math.PI;        // 180° — ліво
    const step = -Math.PI / 4;   // 45° за годинниковою
    for (let i = 0; i < 8; i++) {
      const angle = base + i * step;
      pts.push({
        angle,
        ...polar(cx, cy, rOuter, angle),
      });
    }
    return pts;
  }, [cx, cy, rOuter]);

  // точки для енергій
  const energyPoints = useMemo(
    () =>
      octagon.map(p => ({
        angle: p.angle,
        ...polar(cx, cy, rEnergy, p.angle),
      })),
    [octagon, cx, cy, rEnergy],
  );

  // поділки років: 0,5,10,…,75 (16 штук) — між енергіями, 0 строго зліва
  const ageMarks = useMemo(() => {
    const list = [];
    const step = Math.PI / 8; // 22.5°
    for (let i = 0; i < 16; i++) {
      const age = i * 5;
      const angle = Math.PI - i * step; // за годинниковою
      list.push({
        age,
        angle,
        ...polar(cx, cy, rAge, angle),
      });
    }
    return list;
  }, [cx, cy, rAge]);

  // родовий квадрат (великий, осьовий)
  const rodSquare = [
    { x: cx - rRodSquare, y: cy - rRodSquare },
    { x: cx + rRodSquare, y: cy - rRodSquare },
    { x: cx + rRodSquare, y: cy + rRodSquare },
    { x: cx - rRodSquare, y: cy + rRodSquare },
  ];

  // особистий ромб (менший, повернутий на 45°)
  const personalDiamond = (() => {
    const pts = [];
    const r = rPersonalDiamond;
    for (let i = 0; i < 4; i++) {
      const angle = Math.PI / 4 + i * (Math.PI / 2); // 45°,135°,...
      pts.push(polar(cx, cy, r, angle));
    }
    return pts;
  })();

  // позиції іконок (сегмент 45–55 років: нижній-правий сектор)
  const moneyPos = polar(cx, cy, rIcons, -Math.PI / 6);   // $ трохи нижче-праворуч
  const heartPos = polar(cx, cy, rIcons, -Math.PI / 2.5); // ❤️ ще нижче-правіше

  // точки для 7 кіл на верхній дузі: 3 ліворуч, 3 праворуч, 1 центральне (велике)
  const topArcCircles = (() => {
    const result = [];
    const centerAngle = -Math.PI / 2;      // строго вверх
    const step = Math.PI / 18;            // ~10° між сусідніми
    const offsets = [-3, -2, -1, 0, 1, 2, 3];
    offsets.forEach(idx => {
      const angle = centerAngle + idx * step;
      const pos = polar(topArcCenterX, topArcCenterY, topArcRadius, angle);
      result.push({
        angle,
        x: pos.x,
        y: pos.y,
        isCenter: idx === 0,
      });
    });
    return result;
  })();

  // координати кінців самої дуги
  const topArcStartPos = polar(
    topArcCenterX,
    topArcCenterY,
    topArcRadius,
    topArcStart,
  );
  const topArcEndPos = polar(
    topArcCenterX,
    topArcCenterY,
    topArcRadius,
    topArcEnd,
  );

  // вершина восьмикутника "НЕБО" (зверху) — для вертикальної лінії
  const topOctVertex = octagon.find(p => Math.abs(p.angle + Math.PI / 2) < 1e-3);

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
          background: COLORS.bg,
        }}
      >
        {/* зовнішня рамка */}
        <rect
          x={18}
          y={18}
          width={size - 36}
          height={size - 36}
          rx={24}
          fill="none"
          stroke={COLORS.lineStrong}
          strokeWidth={1.2}
        />

        {/* м'яке затемнення по краях + SVG-символи */}
        <defs>
          <radialGradient id="matrixGlow" cx="50%" cy="45%" r="70%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.04)" />
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

        <rect
          x={0}
          y={0}
          width={size}
          height={size}
          fill="url(#matrixGlow)"
          rx={24}
        />

        {/* концентричні орбіти в центрі */}
        {[0.16, 0.23, 0.30].map((k, idx) => (
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
          points={octagon.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={COLORS.lineStrong}
          strokeWidth={1.2}
        />

        {/* родовий квадрат */}
        <polygon
          points={rodSquare.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={COLORS.line}
          strokeWidth={1.2}
        />

        {/* особистий ромб */}
        <polygon
          points={personalDiamond.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={COLORS.gold}
          strokeWidth={1.4}
        />

        {/* вертикальна та горизонтальна осі */}
        <line
          x1={cx}
          y1={cy - rRodSquare * 1.15}
          x2={cx}
          y2={cy + rRodSquare * 1.15}
          stroke={COLORS.line}
          strokeWidth={1}
          strokeDasharray="4 6"
        />
        <line
          x1={cx - rRodSquare * 1.15}
          y1={cy}
          x2={cx + rRodSquare * 1.15}
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

        {/* іконка $ */}
        <use
          href="#icon-money"
          x={moneyPos.x - 11}
          y={moneyPos.y - 11}
          width={22}
          height={22}
        />

        {/* іконка ❤️ */}
        <use
          href="#icon-heart"
          x={heartPos.x - 10}
          y={heartPos.y - 10}
          width={20}
          height={20}
        />

        {/* кружечки енергій 1–8 */}
        {energyPoints.map((p, i) => (
          <g key={`en-${i}`}>
            <circle
              cx={p.x}
              cy={p.y}
              r={15}
              fill={COLORS.bg}
              stroke="#FF6B81"
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

        {/* роки 0–75 по 5 років */}
        {ageMarks.map((m, i) => (
          <text
            key={`age-${i}`}
            x={m.x}
            y={m.y}
            fill={i % 2 === 0 ? COLORS.lineStrong : COLORS.line}
            fontSize={i % 2 === 0 ? 11 : 9} // кожні 10 років трохи більші
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {m.age}
          </text>
        ))}

        {/* підписи сторін світу / роду */}
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
          x={cx + rRodSquare + 44}
          y={cy + 4}
          fill={COLORS.text}
          fontSize={11}
          textAnchor="middle"
        >
          РІД МАТЕРІ
        </text>

        {/* ===== ВЕРХНЯ ДУГА НЕБО ===== */}

        {/* сама дуга */}
        <path
          d={`
            M ${topArcStartPos.x} ${topArcStartPos.y}
            A ${topArcRadius} ${topArcRadius} 0 0 1 ${topArcEndPos.x} ${topArcEndPos.y}
          `}
          fill="none"
          stroke={COLORS.lineStrong}
          strokeWidth={1.2}
        />

        {/* кола на дузі */}
        {topArcCircles.map((c, idx) => {
          if (c.isCenter) {
            // центральний ДУХОВНИЙ — більший радіус + подвійний обвід
            const rOuterBig = 20;
            const rInnerBig = 14;
            return (
              <g key={`arc-circle-${idx}`}>
                {/* вертикальна лінія вниз до вершини НЕБО */}
                {topOctVertex && (
                  <line
                    x1={c.x}
                    y1={c.y + rOuterBig}
                    x2={topOctVertex.x}
                    y2={topOctVertex.y}
                    stroke={COLORS.lineStrong}
                    strokeWidth={1.1}
                  />
                )}

                <circle
                  cx={c.x}
                  cy={c.y}
                  r={rOuterBig}
                  fill={COLORS.bg}
                  stroke={COLORS.gold}
                  strokeWidth={2}
                />
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={rInnerBig}
                  fill="none"
                  stroke="#FF6B81"
                  strokeWidth={1.8}
                />
              </g>
            );
          }

          // бічні — менші, одинарні/подвійні
          const rOuterSmall = 14;
          const rInnerSmall = 9;
          return (
            <g key={`arc-circle-${idx}`}>
              <circle
                cx={c.x}
                cy={c.y}
                r={rOuterSmall}
                fill={COLORS.bg}
                stroke={COLORS.gold}
                strokeWidth={1.6}
              />
              <circle
                cx={c.x}
                cy={c.y}
                r={rInnerSmall}
                fill="none"
                stroke="#FF6B81"
                strokeWidth={1.3}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
