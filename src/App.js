import React, { useState } from 'react';

const App = () => {
  const [tab, setTab] = useState('home');
  const [msg, setMsg] = useState('');
  const [chat, setChat] = useState([{role:'ai',text:'¡Hola! Soy Dr. Smoothie 🌿 ¿Qué ingredientes tienes hoy?'}]);

  const sendMsg = async () => {
    if (!msg.trim()) return;
    const userMsg = msg;
    setChat(c => [...c, {role:'user',text:userMsg}]);
    setMsg('');
    setChat(c => [...c, {role:'ai',text:'Analizando tu consulta... 🔬'}]);
  };

  return (
    <div style={{fontFamily:'sans-serif',maxWidth:430,margin:'0 auto',background:'#f0faf4',minHeight:'100vh'}}>
      <div style={{background:'#1a5c38',color:'white',padding:'20px',textAlign:'center'}}>
        <h1 style={{margin:0,fontSize:24}}>🌿 Dr. Smoothie AI</h1>
        <p style={{margin:'4px 0 0',fontSize:13,opacity:0.8}}>PureLife Wellness Club</p>
      </div>
      <div style={{display:'flex',background:'white',borderBottom:'2px solid #e0f0e8'}}>
        {['home','chat','plans','rewards'].map(t => (
          <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:'12px 4px',border:'none',background:tab===t?'#1a5c38':'white',color:tab===t?'white':'#555',fontWeight:tab===t?700:400,cursor:'pointer',fontSize:12,textTransform:'capitalize'}}>
            {t==='home'?'🏠 Home':t==='chat'?'💬 Chat':t==='plans'?'🌱 Plans':'⭐ Rewards'}
          </button>
        ))}
      </div>
      <div style={{padding:20}}>
        {tab==='home' && (
          <div>
            <h2 style={{color:'#1a5c38'}}>Welcome back! 👋</h2>
            <div style={{background:'white',borderRadius:16,padding:20,boxShadow:'0 2px 12px rgba(0,0,0,0.08)',marginBottom:16}}>
              <p style={{margin:'0 0 8px',fontWeight:700,color:'#1a5c38'}}>Daily Streak 🔥</p>
              <p style={{margin:0,fontSize:36,fontWeight:900,color:'#f59e0b'}}>7 days</p>
            </div>
            <div style={{background:'white',borderRadius:16,padding:20,boxShadow:'0 2px 12px rgba(0,0,0,0.08)'}}>
              <p style={{margin:'0 0 8px',fontWeight:700,color:'#1a5c38'}}>Today's Tip 🌿</p>
              <p style={{margin:0,color:'#555'}}>Add spirulina to your morning smoothie for an energy boost without caffeine!</p>
            </div>
          </div>
        )}
        {tab==='chat' && (
          <div>
            <div style={{background:'white',borderRadius:16,padding:16,minHeight:300,maxHeight:400,overflowY:'auto',marginBottom:12,boxShadow:'0 2px 12px rgba(0,0,0,0.08)'}}>
              {chat.map((m,i) => (
                <div key={i} style={{marginBottom:12,textAlign:m.role==='user'?'right':'left'}}>
                  <span style={{display:'inline-block',background:m.role==='user'?'#1a5c38':'#e8f5ee',color:m.role==='user'?'white':'#333',padding:'10px 14px',borderRadius:16,maxWidth:'80%',fontSize:14}}>
                    {m.text}
                  </span>
                </div>
              ))}
            </div>
            <div style={{display:'flex',gap:8}}>
              <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMsg()} placeholder="Ask about ingredients..." style={{flex:1,padding:'12px 16px',borderRadius:24,border:'2px solid #1a5c38',outline:'none',fontSize:14}}/>
              <button onClick={sendMsg} style={{background:'#1a5c38',color:'white',border:'none',borderRadius:24,padding:'12px 20px',cursor:'pointer',fontWeight:700}}>Send</button>
            </div>
          </div>
        )}
        {tab==='plans' && (
          <div>
            <h2 style={{color:'#1a5c38',marginTop:0}}>Choose Your Plan</h2>
            {[{name:'Seed',price:29,color:'#e8f5ee',features:['AI Chat Basic','5 recipes/month','Community access']},{name:'Bloom',price:49,color:'#d4edda',features:['AI Chat Advanced','Unlimited recipes','Video consultations','Priority support']},{name:'Canopy',price:79,color:'#1a5c38',features:['Everything in Bloom','Personal health coach','Custom meal plans','VIP community']}].map(p => (
              <div key={p.name} style={{background:p.name==='Canopy'?p.color:'white',border:`2px solid ${p.name==='Bloom'?'#1a5c38':'#e0f0e8'}`,borderRadius:16,padding:20,marginBottom:12,boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                  <h3 style={{margin:0,color:p.name==='Canopy'?'white':'#1a5c38'}}>{p.name==='Seed'?'🌱':p.name==='Bloom'?'🌸':'🌳'} {p.name}</h3>
                  <span style={{fontWeight:900,fontSize:22,color:p.name==='Canopy'?'#f9e79f':'#1a5c38'}}>${p.price}/mo</span>
                </div>
                {p.features.map(f => <p key={f} style={{margin:'4px 0',fontSize:13,color:p.name==='Canopy'?'#d4edda':'#555'}}>✓ {f}</p>)}
                <button style={{width:'100%',marginTop:12,padding:'12px',background:p.name==='Canopy'?'#f9e79f':'#1a5c38',color:p.name==='Canopy'?'#1a5c38':'white',border:'none',borderRadius:12,fontWeight:700,cursor:'pointer',fontSize:15}}>
                  {p.name==='Bloom'?'Most Popular — ':''}Join {p.name}
                </button>
              </div>
            ))}
          </div>
        )}
        {tab==='rewards' && (
          <div>
            <h2 style={{color:'#1a5c38',marginTop:0}}>Your Rewards ⭐</h2>
            <div style={{background:'linear-gradient(135deg,#1a5c38,#2d8653)',borderRadius:16,padding:24,color:'white',textAlign:'center',marginBottom:16}}>
              <p style={{margin:'0 0 4px',opacity:0.8}}>Total Points</p>
              <p style={{margin:0,fontSize:48,fontWeight:900}}>1,250</p>
              <p style={{margin:'4px 0 0',opacity:0.8}}>PureLife Points</p>
            </div>
            {[{badge:'🏆',name:'7-Day Streak',desc:'Check in 7 days in a row'},{badge:'🥤',name:'Smoothie Master',desc:'Log 10 smoothies'},{badge:'🌿',name:'Green Enthusiast',desc:'Use 5 green ingredients'}].map(b => (
              <div key={b.name} style={{background:'white',borderRadius:12,padding:16,marginBottom:8,display:'flex',alignItems:'center',gap:12,boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
                <span style={{fontSize:32}}>{b.badge}</span>
                <div><p style={{margin:0,fontWeight:700,color:'#1a5c38'}}>{b.name}</p><p style={{margin:0,fontSize:12,color:'#888'}}>{b.desc}</p></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
