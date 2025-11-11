// pages/index.js
import { useEffect, useMemo, useState } from 'react';

const COLORS = {
  bg: '#031827',         // темний індіго
  gold: '#E1CB92',       // світло-золотий
  text: '#F5F5F5',
  accent: '#18C3CB',
  error: '#b00020',
  panel: 'rgba(255,255,255,0.04)',
  line: 'rgba(225,203,146,0.45)',
};

export default function Home() {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('female');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [out, setOut] = useState(null);

  function onDob(e){
    // авто-крапки: ДД.ММ.РРРР
    let v = e.target.value.replace(/[^\d]/g,'').slice(0,8);
    if (v.length > 4) v = v.replace(/^(\d{2})(\d{2})(\d{0,4})$/, (_,a,b,c)=> c? `${a}.${b}.${c}`:`${a}.${b}`);
    else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,2})$/, (_,a,b)=> b? `${a}.${b}`:`${a}.`);
    setDob(v);
  }

  async function handleAnalyze(e){
    e.preventDefault();
    setErr(''); setOut(null);
    if (!name.trim()) { setErr('Введи ім’я.'); return; }
    if (!/^\d{2}\.\d{2}\.\d{4}$/.test(dob)) { setErr('Формат дати: ДД.ММ.РРРР'); return; }
    setLoading(true);
    try{
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ name: name.trim(), dob, gender })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Помилка запиту');
      setOut(data);
    }catch(e){ setErr(e.message || 'Серверна помилка'); }
    finally{ setLoading(false); }
  }

  return (
    <div style={{minHeight:'100vh', background: COLORS.bg, color: COLORS.text}}>
      <header style={{padding:'40px 16px 16px', textAlign:'center'}}>
        <LogoMark/>
        <h1 style={{margin:'14px 0 6px', fontWeight:600, letterSpacing:1}}>MATRIX RYVOK</h1>
        <p style={{opacity:0.85, maxWidth:820, margin:'0 auto', lineHeight:1.7}}>
          Тут відкриваються глибини самопізнання, оживають сакральні знання і розкриваються езотеричні концепції.
          Досліджуй, розширюй свідомість і знаходь гармонію між собою та Всесвітом. Відчуй натхнення на шляху до особистого й духовного розвитку.
        </p>
      </header>

      <main style={{maxWidth:980, margin:'28px auto 80px', padding:'0 16px'}}>
        {/* Форма */}
        <form onSubmit={handleAnalyze} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Ім’я</label>
            <input
              placeholder="Напр., Надія"
              value={name}
              onChange={e=>setName(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Дата народження</label>
            <input
              placeholder="ДД.ММ.РРРР"
              inputMode="numeric"
              value={dob}
              onChange={onDob}
              style={styles.input}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Стать</label>
            <div style={{display:'flex', gap:16, paddingTop:8}}>
              <label><input type="radio" name="g" checked={gender==='female'} onChange={()=>setGender('female')}/> Жінка</label>
              <label><input type="radio" name="g" checked={gender==='male'} onChange={()=>setGender('male')}/> Чоловік</label>
            </div>
          </div>
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Обробка…' : 'Розшифрувати матрицю'}
          </button>
        </form>
{/* Результат від API */}
{out?.text && (
  <div
    style={{
      background: 'rgba(25, 35, 45, 0.8)',
      border: `1px solid ${COLORS.gold}`,
      borderRadius: 14,
      padding: '24px 20px',
      marginTop: 28,
      boxShadow: '0 0 28px rgba(225, 203, 146, 0.25)',
      color: COLORS.text,
      transition: 'all 0.6s ease-in-out',
      animation: 'fadeIn 1s ease-in-out',
    }}
  >
    <div
      style={{
        fontSize: 22,
        fontWeight: 600,
        color: COLORS.gold,
        letterSpacing: '0.5px',
        marginBottom: 12,
        textAlign: 'center',
        textTransform: 'uppercase',
      }}
    >
      ✦ Результат ✦
    </div>
    <pre
      style={{
        whiteSpace: 'pre-wrap',
        lineHeight: 1.6,
        marginTop: 8,
        fontFamily: 'inherit',
        textAlign: 'justify',
      }}
    >
      {out.text}
    </pre>
  </div>
)}
        {err && <div style={{color:COLORS.error, margin:'10px 4px 0'}}>{err}</div>}

        {/* Результат від API */}
{out?.text && (
  <div style={styles.card}>
    <div style={styles.big}>Результат</div>
    <pre style={{whiteSpace:'pre-wrap', lineHeight:1.6, marginTop:12}}>
      {out.text}
    </pre>
  </div>
)}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CTA на повну PDF */}
            <div style={{marginTop:24, textAlign:'center'}}>
              <a href="#buy" style={styles.cta}>Отримати повну PDF-розшифровку</a>
            </div>
          </section>
        )}
          <div className="matrix-wrap">
          <ChakraWeb
  core={out?.core}
  chakras={out?.chakras || []}
/>
  </div>
      </main>
    </div>
  );
}

/** Лого-розділювач */
function LogoMark(){
  return (
    <div style={{display:'inline-flex', alignItems:'center', gap:10}}>
      <span style={{
        width:12, height:12, borderRadius:12,
        background: 'linear-gradient(130deg,#E1CB92,#18C3CB)'
      }}/>
      <div style={{height:1, width:96, background:'linear-gradient(90deg, transparent, #E1CB92, transparent)'}}/>
    </div>
  );
}

/** SVG-схема “сітка чакр” (радіальна, 7 точок по колу) */
function ChakraWeb({ svgSize=520, data=[] }){
  const size = svgSize;
  const rOuter = size*0.40;
  const cx = size/2, cy = size/2;

  // 7 точок рівномірно по колу (початок зверху)
  const points = useMemo(()=>{
    const arr=[];
    for(let i=0;i<7;i++){
      const a = -Math.PI/2 + i*(2*Math.PI/7);
      arr.push({
        x: cx + rOuter*Math.cos(a),
        y: cy + rOuter*Math.sin(a)
      });
    }
    return arr;
  },[size]);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
         style={{background: 'radial-gradient( circle at 50% 45%, rgba(255,255,255,0.04), transparent 65%)',
                  borderRadius: 16, border: `1px solid ${COLORS.line}`}}>
      {/* кола-орбіти */}
      {[0.18,0.30,0.42].map((k,i)=>(
        <circle key={i} cx={cx} cy={cy} r={size*k/2}
                fill="none" stroke={COLORS.line} strokeDasharray="4 6"/>
      ))}

      {/* лінії між сусідніми чакрами */}
      {points.map((p,i)=>(
        <line key={i}
          x1={p.x} y1={p.y}
          x2={points[(i+1)%points.length].x}
          y2={points[(i+1)%points.length].y}
          stroke={COLORS.line} strokeWidth="1"/>
      ))}

      {/* центр */}
      <circle cx={cx} cy={cy} r={8} fill={COLORS.gold}/>
      <text x={cx} y={cy-16} textAnchor="middle" fill={COLORS.gold} fontSize="12" style={{opacity:0.85}}>
        Енергія ядра
      </text>

      {/* вузли чакр */}
      {points.map((p,i)=>(
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={10} fill={COLORS.gold} />
          <circle cx={p.x} cy={p.y} r={16} fill="none" stroke={COLORS.line}/>
          <text x={p.x} y={p.y+4} textAnchor="middle" fill={COLORS.bg} fontWeight={700} fontSize="12">
            {(data[i]?.energy ?? i+1)}
          </text>
          <text x={p.x} y={p.y-22} textAnchor="middle" fill={COLORS.gold} fontSize="11" style={{opacity:0.85}}>
            {data[i]?.name || ''}
          </text>
        </g>
      ))}
    </svg>
  );
}

const styles = {
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 16,
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: '0 8px',
  },

  field: {
    flex: '1 1 260px',
    minWidth: 240,
  },

  label: {
    display: 'block',
    marginBottom: 6,
    fontSize: 12,
    opacity: 0.85,
    color: 'rgba(255,255,255,0.85)',
  },

  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 12,
    border: `1px solid ${COLORS.gold}55`,
    background: 'transparent',
    color: COLORS.text,
    fontSize: 16,
  },

  radiosRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginTop: 10,
    justifyContent: 'center',
  },

  btn: {
    flex: '0 0 auto',
    padding: '14px 28px',
    borderRadius: 14,
    border: 'none',
    background: COLORS.gold,
    color: '#031827',
    fontWeight: 600,
    fontSize: 15,
    boxShadow: '0 0 22px rgba(225,203,146,0.25)',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
  },

  panel: {
    marginTop: 24,
    padding: 20,
    borderRadius: 14,
    border: `1px solid ${COLORS.line}`,
    background: 'rgba(255,255,255,0.03)',
  },

  gridWrap: {
    display: 'grid',
    gridTemplateColumns: 'minmax(280px, 1fr)',
    justifyItems: 'center',
    gap: 24,
  },

  card: {
    border: `1px solid ${COLORS.line}`,
    borderRadius: 12,
    padding: 16,
    background: 'rgba(255,255,255,0.03)',
  },

  error: {
    color: COLORS.error,
    margin: '10px 4px 0',
    textAlign: 'center',
  },
};

// Адаптив
styles['@media'] = `
  @media (max-width: 860px){
    .gridWrap { grid-template-columns: 1fr !important; }
    .form { grid-template-columns: 1fr; }
    .btn { width:100%; }
  }
`;
