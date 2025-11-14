import React from "react";

const degToRad = (deg: number) => (deg * Math.PI) / 180;

const CENTER_X = 0;
const CENTER_Y = 0;

/**
 * Базові радіуси
 */
const R_OUTER_OCTAGON = 70;   // вершини 1–8 (енергії по колу)
const R_AGE_MARK = 76;        // точки / цифри років 0–75
const R_LABEL = 58;           // підписи Небо / Земля / Рід ...
const R_BIG_SQUARE = 32;      // зовнішній квадрат (родовий)
const R_SMALL_SQUARE = 20;    // внутрішній квадрат (особистий)
const R_ICONS = 34;           // радіус для іконок усередині секторів

/**
 * Допоміжна функція — координата за радіусом та кутом
 */
function polarToCartesian(radius: number, angleDeg: number) {
  const rad = degToRad(angleDeg);
  return {
    x: CENTER_X + radius * Math.cos(rad),
    y: CENTER_Y + radius * Math.sin(rad),
  };
}

/**
 * Основний компонент матриці Ладіні
 */
const LadiniMatrix: React.FC = () => {
  /**
   * 1. Восьмикутник з енергіями 1–8
   *
   * Орієнтація:
   * - 1  — строго зліва (0 років)
   * - 3  — внизу
   * - 5  — справа
   * - 7  — зверху
   * - 2,4,6,8 — на діагоналях між ними
   */
  const energyNodes = [
    { num: 1, angle: 180 },
    { num: 2, angle: 135 },
    { num: 3, angle: 90 },
    { num: 4, angle: 45 },
    { num: 5, angle: 0 },
    { num: 6, angle: 315 },
    { num: 7, angle: 270 },
    { num: 8, angle: 225 },
  ];

  /**
   * 2. Вік по колу: 0, 5, 10, …, 75.
   *
   * Старт з 0 на тій самій осі, де 1 (зліва) і далі
   * за годинниковою кожні 22.5° (16 позначок).
   */
  const ages = Array.from({ length: 16 }, (_, i) => i * 5);
  const ageMarks = ages.map((age, i) => {
    const angle = 180 + i * (360 / 16); // 0 років ліворуч → далі за годинниковою
    return {
      age,
      angle,
      ...polarToCartesian(R_AGE_MARK, angle),
    };
  });

  /**
   * 3. Квадрати всередині
   *    - великий: родовий (по осях)
   *    - малий: особистий (повернутий на 45°)
   */
  const bigSquarePoints = [0, 90, 180, 270].map((a) =>
    polarToCartesian(R_BIG_SQUARE, a)
  );

  const smallSquarePoints = [45, 135, 225, 315].map((a) =>
    polarToCartesian(R_SMALL_SQUARE, a)
  );

  /**
   * 4. Іконки:
   *    ⚡ – у лівому нижньому секторі
   *    $  – у правому верхньому секторі
   *    ❤️ – у нижньому секторі між центром і "Земля"
   *    Кути підібрані так, щоб вони були всередині сегментів, а не на лініях.
   */
  const lightningPos = polarToCartesian(R_ICONS, 210); // між 1–2–3
  const moneyPos = polarToCartesian(R_ICONS, 330);     // між 3–4–5
  const heartPos = polarToCartesian(R_ICONS, 90);      // між 2–3–4 (внизу)

  /**
   * 5. Підписи сторін світу / роду
   */
  const fatherLabelPos = polarToCartesian(R_LABEL, 180); // Рід батька
  const motherLabelPos = polarToCartesian(R_LABEL, 0);   // Рід матері
  const skyLabelPos = polarToCartesian(R_LABEL, 270);    // Небо
  const earthLabelPos = polarToCartesian(R_LABEL, 90);   // Земля

  /**
   * 6. Восьмикутник (лінія життя) — ламаємо по точках енергій
   */
  const octagonPath = energyNodes
    .map((node, index) => {
      const { x, y } = polarToCartesian(R_OUTER_OCTAGON, node.angle);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ") + " Z";

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 600,
        margin: "0 auto",
      }}
    >
      <svg
        viewBox="-110 -110 220 220"
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        {/* Фонова "карта" */}
        <defs>
          <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#112232" stopOpacity="1" />
            <stop offset="100%" stopColor="#0b1721" stopOpacity="1" />
          </radialGradient>
        </defs>

        <rect
          x={-100}
          y={-100}
          width={200}
          height={200}
          rx={18}
          ry={18}
          fill="url(#bgGrad)"
          stroke="#3b4b5d"
          strokeWidth={0.6}
        />

        {/* Додаткові концентричні кола (фон енергій років) */}
        {[30, 45, 60, 75, 90].map((r, idx) => (
          <circle
            key={idx}
            cx={CENTER_X}
            cy={CENTER_Y}
            r={r}
            fill="none"
            stroke="#1e2f40"
            strokeWidth={0.4}
          />
        ))}

        {/* Вертикальна та горизонтальна осі */}
        <line
          x1={CENTER_X - 90}
          y1={CENTER_Y}
          x2={CENTER_X + 90}
          y2={CENTER_Y}
          stroke="#444f5e"
          strokeWidth={0.4}
          strokeDasharray="2 2"
        />
        <line
          x1={CENTER_X}
          y1={CENTER_Y - 90}
          x2={CENTER_X}
          y2={CENTER_Y + 90}
          stroke="#444f5e"
          strokeWidth={0.4}
          strokeDasharray="2 2"
        />

        {/* Великий квадрат (родовий) */}
        <polygon
          points={bigSquarePoints.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="#f4d392"
          strokeWidth={1}
        />

        {/* Малий квадрат (особистий, ромб) */}
        <polygon
          points={smallSquarePoints.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="#f4d392"
          strokeWidth={1}
          strokeDasharray="3 2"
        />

        {/* Лінії від центру до вершин великого квадрата (діагоналі) */}
        {bigSquarePoints.map((p, idx) => (
          <line
            key={idx}
            x1={CENTER_X}
            y1={CENTER_Y}
            x2={p.x}
            y2={p.y}
            stroke="#444f5e"
            strokeWidth={0.4}
            strokeDasharray="2 2"
          />
        ))}

        {/* Восьмикутник (лінія життя) */}
        <path
          d={octagonPath}
          fill="none"
          stroke="#f4d392"
          strokeWidth={1.4}
        />

        {/* Вікові мітки 0,5,10…75 */}
        {ageMarks.map((m) => (
          <g key={m.age}>
            <circle cx={m.x} cy={m.y} r={1.2} fill="#d6ba7e" />
            <text
              x={m.x}
              y={m.y}
              dy={m.age === 0 ? -4 : 4}
              fontSize={4}
              fill="#d6ba7e"
              textAnchor="middle"
            >
              {m.age}
            </text>
          </g>
        ))}

        {/* Ноди енергій 1–8 */}
        {energyNodes.map((node) => {
          const pos = polarToCartesian(R_OUTER_OCTAGON, node.angle);
          return (
            <g key={node.num}>
              {/* Лінія від центру до ноди (штрихова) */}
              <line
                x1={CENTER_X}
                y1={CENTER_Y}
                x2={pos.x}
                y2={pos.y}
                stroke="#4d5a6c"
                strokeWidth={0.4}
                strokeDasharray="2 2"
              />
              {/* Коло енергії */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={6}
                fill="#07131e"
                stroke="#ff5b85"
                strokeWidth={1.2}
              />
              <text
                x={pos.x}
                y={pos.y + 1.5}
                textAnchor="middle"
                fontSize={5}
                fill="#ff5b85"
                fontWeight={600}
              >
                {node.num}
              </text>
            </g>
          );
        })}

        {/* Центр / Ядро */}
        <circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={4}
          fill="#f4d392"
          stroke="#1b2532"
          strokeWidth={0.8}
        />
        <text
          x={CENTER_X}
          y={CENTER_Y + 10}
          fontSize={5}
          fill="#f4d392"
          textAnchor="middle"
        >
          Ядро
        </text>

        {/* Підписи напрямків */}
        <text
          x={skyLabelPos.x}
          y={skyLabelPos.y - 3}
          fontSize={5}
          fill="#f4d392"
          textAnchor="middle"
        >
          НЕБО
        </text>

        <text
          x={earthLabelPos.x}
          y={earthLabelPos.y + 7}
          fontSize={5}
          fill="#f4d392"
          textAnchor="middle"
        >
          ЗЕМЛЯ
        </text>

        <text
          x={fatherLabelPos.x - 4}
          y={fatherLabelPos.y - 1}
          fontSize={5}
          fill="#f4d392"
          textAnchor="end"
        >
          РІД БАТЬКА
        </text>

        <text
          x={motherLabelPos.x + 4}
          y={motherLabelPos.y - 1}
          fontSize={5}
          fill="#f4d392"
          textAnchor="start"
        >
          РІД МАТЕРІ
        </text>

        {/* ⚡ Іконка енергії (лівий нижній сектор) */}
        <g
          transform={`translate(${lightningPos.x},${lightningPos.y}) scale(0.9)`}
        >
          <polyline
            points="-2,-7 2,-7 -1,-1 3,-1 -3,7 -1,1 -4,1"
            fill="none"
            stroke="#53e8ff"
            strokeWidth={1.2}
            strokeLinejoin="round"
          />
        </g>

        {/* $ Іконка грошей (правий верхній сектор) */}
        <g transform={`translate(${moneyPos.x},${moneyPos.y})`}>
          <text
            x={0}
            y={2}
            fontSize={10}
            fill="#ffe08a"
            textAnchor="middle"
            fontWeight={700}
          >
            $
          </text>
        </g>

        {/* ❤ Іконка кохання (нижній сектор) */}
        <g transform={`translate(${heartPos.x},${heartPos.y}) scale(0.8)`}>
          <path
            d="
              M 0 -3
              C -2 -6 -7 -5 -7 -1
              C -7 2 -4 5 0 7
              C 4 5 7 2 7 -1
              C 7 -5 2 -6 0 -3
              Z
            "
            fill="#ff5b85"
            stroke="#ff8cac"
            strokeWidth={0.5}
          />
        </g>
      </svg>
    </div>
  );
};

export default LadiniMatrix;
