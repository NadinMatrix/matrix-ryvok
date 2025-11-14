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
 * Матриця долі RYVOK (метод Ладіні):
 * - 1 енергія строго ЗЛІВА
 * - далі 2-3-4-5-6-7-8 йдуть ЗА годинниковою стрілкою
 * - зовнішній квадрат — РОДОВИЙ
 * - внутрішній ромб — ОСОБИСТИЙ (личный)
 * - іконки $ та ❤️ в центрі відповідних сегментів (а не на лініях)
 */
export default function ArcanaMatrixWeb({
  size = 520,
  ages = [0, 10, 20, 30, 40, 50, 60, 70],
}) {
  const cx = size / 2;
  const cy = size / 2;

  // геометрія
  const rOuter = size * 0.38;        // вершини восьмикутника
  const rRodSquare = size * 0.28;    // родовий квадрат (осьовий)
  const rPersonalDiamond = size * 0.20; // особистий ромб (повернутий)
  const rAge = rOuter + 26;          // кільце віків (цифри)
  const rEnergy = (rOuter + rRodSquare) / 2; // кружечки енергій
  const rIcons = (rRodSquare + rOuter) / 2;  // радіус для $ і ❤️

  // 8 вершин восьмикутника:
  // 1 — зліва, далі ЗА годинниковою: низ-ліво, низ, низ-право, право, верх-право, верх, верх-ліво
  const octagon = useMemo(() => {
    const pts = [];
    const step = -Math.PI / 4; // мінус => рух за годинниковою
    const base = Math.PI;      // 180° — строго зліва
    for (let i = 0; i < 8; i++) {
      const angle = base + i * step;
      pts.push({
        angle,
        ...polar(cx, cy, rOuter, angle),
      });
    }
    return pts;
  }, [cx, cy, rOuter]);

  const energyPoints = useMemo(
    () =>
      octagon.map(p => ({
        angle: p.angle,
        ...polar(cx, cy, rEnergy, p.angle),
      })),
    [octagon, cx, cy, rEnergy],
  );

  const agePoints = useMemo(
    () =>
      octagon.map(p => ({
        ...polar(cx, cy, rAge, p.angle),
      })),
    [octagon, cx, cy, rAge],
  );

  // родовий квадрат (осьовий)
  const rodSquare = [
    { x: cx - rRodSquare, y: cy - rRodSquare },
    { x: cx + rRodSquare, y: cy - rRodSquare },
    { x: cx + rRodSquare, y: cy + rRodSquare },
    { x: cx - rRodSquare, y: cy + rRodSquare },
  ];

  // особистий ромб (квадрат під 45° всередині)
  const personalDiamond = (() => {
    const r = rPersonalDiamond;
    const pts = [];
    for (let i = 0; i < 4; i++) {
      const angle = Math.PI / 4 + i * (Math.PI / 2); // 45°,135°...
      pts.push(polar(cx, cy, r, angle));
    }
    return pts;
  })();

  // іконка $ — нижня права чверть
  const moneyAngle = Math.PI / 4 + Math.PI / 2; // 225°?  => вниз-право
  const moneyPos = polar(cx, cy, rIcons, moneyAngle);

  // іконка ❤️ — нижня центральна чверть
  const heartAngle = Math.PI / 2; // 90° — вниз від центру
  const heartPos = polar(cx, cy, rIcons, heartAngle);

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
        {/* м'яке затемнення по краях */}
        <defs>
          <radialGradient id="matrixGlow" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>

          {/* простий вектор-heart */}
          <symbol id="icon-heart" viewBox="0 0 24 24">
            <path
              d="M12 21s-5.5-3.2-8.3-6C1.5 12.8 1 10.6 2.1 8.9 3.1 7.3 5 6.7 6.7 7.3 7.6 7.6 8.4 8.3 9 9.1c.6-.8 1.4-1.5 2.3-1.8 1.7-.6 3.6 0 4.6 1.6 1.1 1.7.6 3.9-1.6 6.1C17.5 17.8 12 21 12 21z"
              fill={COLORS.pink}
            />
          </symbol>

          {/* простий вектор-$ */}
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

        {/* орбіти в центрі */}
        {[0.18, 0.26, 0.34].map((k, idx) => (
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

        {/* восьмикутник (енергетичні вершини) */}
        <polygon
          points={octagon.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={COLORS.lineStrong}
          strokeWidth={1.2}
        />

        {/* з'єднувальні лінії між вершинами (для чіткого восьмикутника) */}
        {octagon.map((p, i) => {
          const n = octagon[(i + 1) % 8];
          return (
            <line
              key={`oct-line-${i}`}
              x1={p.x}
              y1={p.y}
              x2={n.x}
              y2={n.y}
              stroke={COLORS.lineStrong}
              strokeWidth={1}
            />
          );
        })}

        {/* родовий квадрат (осьовий) */}
        <polygon
          points={rodSquare.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={COLORS.line}
          strokeWidth={1.2}
        />

        {/* личний (особистий) ромб */}
        <polygon
          points={personalDiamond.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={COLORS.gold}
          strokeWidth={1.4}
        />

        {/* вертикальна та горизонтальна осі */}
        <line
          x1={cx}
          y1={cy - rRodSquare * 1.1}
          x2={cx}
          y2={cy + rRodSquare * 1.1}
          stroke={COLORS.line}
          strokeWidth={1}
          strokeDasharray="4 6"
        />
        <line
          x1={cx - rRodSquare * 1.1}
          y1={cy}
          x2={cx + rRodSquare * 1.1}
          y2={cy}
          stroke={COLORS.line}
          strokeWidth={1}
          strokeDasharray="4 6"
        />

        {/* діагоналі роду (як на схемі a-b-c-d) */}
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

        {/* іконка $ — фінансова вісь */}
        <use
          href="#icon-money"
          x={moneyPos.x - 11}
          y={moneyPos.y - 11}
          width={22}
          height={22}
        />

        {/* іконка ❤️ — емоційно-родова вісь */}
        <use
          href="#icon-heart"
          x={heartPos.x - 10}
          y={heartPos.y - 10}
          width={20}
          height={20}
        />

        {/* кружечки енергій */}
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

        {/* роки — завжди ЗА годинниковою разом з енергіями */}
        {agePoints.map((p, i) => (
          <text
            key={`age-${i}`}
            x={p.x}
            y={p.y}
            fill={COLORS.lineStrong}
            fontSize={11}
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {ages[i]}
          </text>
        ))}

        {/* підписи сторін світу / роду */}
        {/* НЕБО — над центром, ЗЕМЛЯ — знизу */}
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

        {/* рід батька / матері — по горизонталі */}
        <text
          x={cx - rRodSquare - 36}
          y={cy + 4}
          fill={COLORS.text}
          fontSize={11}
          textAnchor="middle"
        >
          РІД БАТЬКА
        </text>
        <text
          x={cx + rRodSquare + 40}
          y={cy + 4}
          fill={COLORS.text}
          fontSize={11}
          textAnchor="middle"
        >
          РІД МАТЕРІ
        </text>
      </svg>
    </div>
  );
}
