// components/ArcanaMatrixWeb.js
import React, { useMemo } from 'react';
import { ARCANA22, getArcana } from '../lib/arcana22';
import { COLORS } from '../lib/colors-matrix'; // створимо трохи нижче або замінимо вручну

// Якщо в тебе вже є COLORS в index.js – можемо або:
// 1) винести його в /lib/colors-matrix.js
// або
// 2) замінити тут COLORS на свої значення напряму.

export function ArcanaMatrixWeb({
  size = 520,
  points = [],
  centerArcana,
}) {
  const svgSize = size;
  const rOuter = svgSize * 0.4;
  const cx = svgSize / 2;
  const cy = svgSize / 2;

  // 8 вершин октагона (початок зверху, як компас)
  const octaPoints = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 8; i++) {
      const a = -Math.PI / 2 + (i * Math.PI / 4); // крок 45°
      arr.push({
        x: cx + rOuter * Math.cos(a),
        y: cy + rOuter * Math.sin(a),
        ang: a,
        index: i,
      });
    }
    return arr;
  }, [svgSize, rOuter, cx, cy]);

  // Обʼєднуємо геометрію + дані
  const enriched = octaPoints.map((p, i) => {
    const slot = points[i] || {}; // {label, arcana, energy, tail}
    const arc = slot.arcana ? getArcana(slot.arcana) : null;
    const color = arc?.color || COLORS.gold;

    const energy = Number(slot.energy ?? 0);
    const maxRef = 9;
    const eNorm = Math.max(0, Math.min(1, energy / maxRef));
    const tail = typeof slot.tail === 'number' ? slot.tail : 1 - eNorm; // дефіцит

    return {
      p,
      slot,
      arc,
      color,
      eNorm,
      tail,
    };
  });

  const TAIL_MAX = rOuter * 0.25;

  return (
    <svg
      width={svgSize}
      height={svgSize}
      viewBox={`0 0 ${svgSize} ${svgSize}`}
      style={{
        background:
          'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.08), transparent 65%)',
        borderRadius: 0,
        border: `1px solid rgba(225,203,146,0.45)`,
      }}
    >
      {/* сітка: кола */}
      {[0.18, 0.3, 0.42].map((k, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={(svgSize * k) / 2}
          fill="none"
          stroke="rgba(225,203,146,0.35)"
          strokeDasharray="4 6"
        />
      ))}

      {/* октагон – лінія по вершинах */}
      {enriched.length > 1 && (
        <polyline
          points={
            enriched
              .map(e => `${e.p.x},${e.p.y}`)
              .join(' ') + ` ${enriched[0].p.x},${enriched[0].p.y}`
          }
          fill="none"
          stroke="rgba(225,203,146,0.7)"
          strokeWidth="1.5"
        />
      )}

      {/* центральний квадрат (ядро по арканах) */}
      {centerArcana && (
        <>
          <rect
            x={cx - 40}
            y={cy - 40}
            width={80}
            height={80}
            rx={8}
            fill="rgba(3, 24, 39, 0.9)"
            stroke={COLORS.gold}
            strokeWidth="1.5"
          />
          <text
            x={cx}
            y={cy - 8}
            textAnchor="middle"
            fill={COLORS.gold}
            fontSize="22"
            fontWeight="700"
          >
            {centerArcana}
          </text>
          <text
            x={cx}
            y={cy + 18}
            textAnchor="middle"
            fill={COLORS.text}
            fontSize="11"
            style={{ opacity: 0.9 }}
          >
            Ядро / Дух
          </text>
        </>
      )}

      {/* вершини + хвости */}
      {enriched.map((e, idx) => {
        const { p, color, tail, slot, arc } = e;

        const tailLen = tail * TAIL_MAX;
        const tx = p.x - Math.cos(p.ang) * tailLen;
        const ty = p.y - Math.sin(p.ang) * tailLen;

        return (
          <g key={idx}>
            {/* Кармічний хвіст */}
            {tail > 0.02 && (
              <line
                x1={p.x}
                y1={p.y}
                x2={tx}
                y2={ty}
                stroke={color}
                strokeWidth="2"
                strokeDasharray="3 4"
                opacity="0.9"
              />
            )}

            {/* кільце вершини */}
            <circle
              cx={p.x}
              cy={p.y}
              r={18}
              fill="none"
              stroke={color}
              strokeWidth={1.6}
              opacity={0.8}
            />

            {/* заповнення */}
            <circle
              cx={p.x}
              cy={p.y}
              r={12}
              fill={color}
              opacity={0.95}
            />

            {/* число аркана */}
            <text
              x={p.x}
              y={p.y + 4}
              textAnchor="middle"
              fill="#031827"
              fontWeight="700"
              fontSize="12"
            >
              {slot.arcana ?? arc?.code ?? idx + 1}
            </text>

            {/* назва/сфера під вузлом */}
            <text
              x={p.x}
              y={p.y + 30}
              textAnchor="middle"
              fill={color}
              fontSize="11"
              style={{ opacity: 0.95 }}
            >
              {slot.label || arc?.name || ''}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
