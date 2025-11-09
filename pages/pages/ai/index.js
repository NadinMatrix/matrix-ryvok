// components/PricingAI.jsx
export default function PricingAI() {
  const tiers = [
    { id: 'start',     name: 'Старт',          price: 149,  credits: 1,   badge: '✔' },
    { id: 'popular',   name: 'Найпопулярніший',price: 579,  credits: 5,   badge: '🚀' },
    { id: 'deep',      name: 'Глибока робота', price: 1799, credits: 20,  badge: '✨' },
    { id: 'pro',       name: 'Профі',          price: 2999, credits: 50,  badge: '💎' },
  ];

  async function buy(id){
    const res = await fetch('/api/checkout', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ tierId:id })
    });
    const { url, error } = await res.json();
    if (error) alert(error);
    else window.location.href = url;
  }

  return (
    <section style={{maxWidth:980, margin:'40px auto', padding:16}}>
      <h2>AI-нумеролог — обери тариф</h2>
      <div style={{display:'grid', gap:16, gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))'}}>
        {tiers.map(t=>(
          <div key={t.id} style={{background:'#1f2937', color:'#fff', borderRadius:12, padding:20}}>
            <div style={{opacity:.85}}>{t.name}</div>
            <div style={{fontSize:34, margin:'8px 0'}}>{t.price}<small> грн</small></div>
            <ul style={{fontSize:14, lineHeight:1.5, opacity:.9, margin:'8px 0 16px'}}>
              <li>Повна AI-відповідь</li>
              <li>Кредитів: <b>{t.credits}</b></li>
              <li>Доступ у кабінеті</li>
            </ul>
            <button onClick={()=>buy(t.id)}
              style={{width:'100%', padding:'10px 14px', border:'none', borderRadius:8, background:'#a78bfa', color:'#000', fontWeight:700}}>
              Обрати {t.badge}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
