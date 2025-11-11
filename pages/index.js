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
function ChakraWeb({ svgSize=520, data=[], core=0 }){
  const size = svgSize;
  const rOuter = size*0.40;
  const cx = size/2, cy = size/2;

  const points = React.useMemo(()=>{
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
         style={{
           background: 'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.04), transparent 65%)',
           borderRadius: 16, border: '1px solid var(--line)'
         }}>
      {[0.18,0.30,0.42].map((k,i)=>(
        <circle key={i} cx={cx} cy={cy} r={size*k/2}
                fill="none" stroke="var(--line)" strokeDasharray="4 6"
                className="mx-stroke" style={{animationDelay:`${0.15*i}s`}}/>
      ))}
      {points.map((p,i)=>(
        <line key={i}
          x1={p.x} y1={p.y}
          x2={points[(i+1)%points.length].x}
          y2={points[(i+1)%points.length].y}
          stroke="var(--line)" strokeWidth="1"
          className="mx-stroke" style={{animationDelay:`${0.2+0.05*i}s`}}/>
      ))}
      <circle cx={cx} cy={cy} r={34} fill="rgba(225,203,146,0.10)" stroke="var(--line)" className="mx-stroke" style={{animationDelay:'.35s'}}/>
      <text x={cx} y={cy-18} textAnchor="middle" fill="var(--gold)" fontSize="12" style={{opacity:0.85}}>
        Енергія ядра
      </text>
      <text x={cx} y={cy+8} textAnchor="middle" fill="var(--gold)" fontWeight={700} fontSize="24">
        {core || ''}
      </text>
      {points.map((p,i)=>(
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={10} fill="var(--gold)" className="mx-stroke" style={{animationDelay:`${.5+.03*i}s`}}/>
          <circle cx={p.x} cy={p.y} r={16} fill="none" stroke="var(--line)" className="mx-stroke" style={{animationDelay:`${.6+.03*i}s`}}/>
          <text x={p.x} y={p.y+4} textAnchor="middle" fill="#031827" fontWeight={700} fontSize="12">
            {(data[i]?.energy ?? i+1)}
          </text>
          <text x={p.x} y={p.y-22} textAnchor="middle" fill="var(--gold)" fontSize="11" style={{opacity:0.85}}>
            {data[i]?.name || ''}
          </text>
        </g>
      ))}
    </svg>
  );
}

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

        {err && <div style={{color:COLORS.error, margin:'10px 4px 0'}}>{err}</div>}

        {/* Результат */}
        {out && (
          <section style={styles.panel}>
            <h2 style={{marginTop:0}}>Твоя Матриця</h2>

            <div style={styles.gridWrap}>
              <ChakraWeb svgSize={520} data={out.chakras} core={out.summary.coreEnergy} />
              <div style={{minWidth:280}}>
                <div style={styles.card}>
                  <div style={styles.kv}>
                    <span style={{opacity:0.8}}>Головна енергія</span>
                    <b style={styles.big}>{out.summary.coreEnergy}</b>
                  </div>
                  <div style={styles.kv}>
                    <span style={{opacity:0.8}}>Число імені</span>
                    <b style={styles.big}>{out.summary.nameNumber}</b>
                  </div>
                  <p style={{marginTop:8, lineHeight:1.6}}>{out.summary.text}</p>
                </div>

                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={{textAlign:'left'}}>Чакра</th>
                      <th>Фізика</th><th>Енергія</th><th>Емоції</th>
                    </tr>
                  </thead>
                  <tbody>
                    {out.chakras.map((c,i)=>(
                      <tr key={i}>
                        <td>{c.name}</td>
                        <td>{c.physical}</td>
                        <td>{c.energy}</td>
                        <td>{c.emotion}</td>
                      </tr>
                    ))}
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
          <ChakraWeb
  core={out?.core}
  chakras={out?.chakras || []}
/>
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
    display:'grid',
    gap:16,
    gridTemplateColumns:'1.1fr 0.9fr 1fr auto',
    alignItems:'end',
    background: COLORS.panel,
    padding:'16px',
    borderRadius:12,
    border:`1px solid ${COLORS.line}`
  },
  field:{ display:'flex', flexDirection:'column' },
  label:{ fontSize:12, opacity:0.85, marginBottom:6 },
  input:{
    height:42, borderRadius:10, border:`1px solid ${COLORS.line}`,
    background:'rgba(255,255,255,0.06)', color: COLORS.text, padding:'0 12px', outline:'none'
  },
  btn:{
    height:42, minWidth:210, borderRadius:12, border:'none',
    background: COLORS.gold, color:'#1B1B1B', fontWeight:700, cursor:'pointer',
    boxShadow:'0 6px 24px rgba(225,203,146,0.25)'
  },
  panel:{
    marginTop:24, padding:20, borderRadius:14, background: COLORS.panel,
    border:`1px solid ${COLORS.line}`
  },
  gridWrap:{
    display:'grid', gridTemplateColumns:'minmax(280px, 1fr) 1fr', gap:20, alignItems:'start'
  },
  card:{
    border:`1px solid ${COLORS.line}`, borderRadius:12, padding:14, marginBottom:14,
    background:'rgba(255,255,255,0.03)'
  },
  kv:{ display:'flex', alignItems:'baseline', justifyContent:'space-between' },
  big:{ fontSize:24, color: COLORS.gold },
  table:{
    width:'100%', borderCollapse:'collapse', marginTop:6,
    border:`1px solid ${COLORS.line}`
  }
};

// Адаптив
styles['@media'] = `
  @media (max-width: 860px){
    .gridWrap { grid-template-columns: 1fr !important; }
    .form { grid-template-columns: 1fr; }
    .btn { width:100%; }
  }
`;
