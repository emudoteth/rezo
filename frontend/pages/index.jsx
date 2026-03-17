import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const CATEGORIES = ['Health','Skills','Finance','Habits','Custom'];
const CAT_ICONS  = ['💪','🎓','💰','🌱','⚡'];

// Mock goals for landing demo — replace with contract reads
const MOCK_GOALS = [
  { id:'0x1', title:'Complete all 12 Anthropic AI courses', category:1, resolver:'0xabc...def', stake:500, yesPool:1240, noPool:380, deadline: Date.now()+12*86400e3, yesPct:72 },
  { id:'0x2', title:'Run a marathon in under 4 hours', category:0, resolver:'0xbee...f00', stake:200, yesPool:890, noPool:720, deadline: Date.now()+45*86400e3, yesPct:55 },
  { id:'0x3', title:'Save $10,000 in 6 months', category:2, resolver:'0xca3...b12', stake:1000, yesPool:2100, noPool:1900, deadline: Date.now()+180*86400e3, yesPct:48 },
  { id:'0x4', title:'Quit smoking for 90 days', category:0, resolver:'0xd3f...a99', stake:300, yesPool:450, noPool:680, deadline: Date.now()+90*86400e3, yesPct:40 },
  { id:'0x5', title:'Ship a production AI agent', category:1, resolver:'0xe11...c04', stake:750, yesPool:3200, noPool:600, deadline: Date.now()+30*86400e3, yesPct:83 },
  { id:'0x6', title:'Meditate every day for 60 days', category:3, resolver:'0xf88...d21', stake:100, yesPool:220, noPool:180, deadline: Date.now()+60*86400e3, yesPct:55 },
];

function GoalCard({ g }) {
  const totalPool = g.yesPool + g.noPool + g.stake;
  const daysLeft  = Math.ceil((g.deadline - Date.now()) / 86400e3);
  return (
    <Link href={`/goal/${g.id}`} style={{display:'block',textDecoration:'none'}}>
      <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius)',
        padding:'1.25rem',cursor:'pointer',transition:'border-color 0.2s, transform 0.15s'}}
        onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(99,102,241,0.4)';e.currentTarget.style.transform='translateY(-2px)'}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform='none'}}>

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.75rem'}}>
          <span style={{fontSize:'0.65rem',fontWeight:700,color:'var(--purple-lt)',
            background:'rgba(99,102,241,0.12)',padding:'2px 8px',borderRadius:99,textTransform:'uppercase',letterSpacing:'0.06em'}}>
            {CAT_ICONS[g.category]} {CATEGORIES[g.category]}
          </span>
          <span style={{fontSize:'0.68rem',color:'var(--muted)',fontWeight:600}}>{daysLeft}d left</span>
        </div>

        <h3 style={{fontSize:'0.95rem',fontWeight:700,color:'var(--text)',marginBottom:'0.85rem',lineHeight:1.4}}>
          {g.title}
        </h3>

        {/* Odds bar */}
        <div style={{marginBottom:'0.65rem'}}>
          <div style={{height:6,borderRadius:99,background:'rgba(239,68,68,0.25)',overflow:'hidden'}}>
            <div style={{height:'100%',width:`${g.yesPct}%`,background:'linear-gradient(90deg,#6366f1,#22c55e)',borderRadius:99,transition:'width 0.5s'}}/>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:4}}>
            <span style={{fontSize:'0.7rem',fontWeight:800,color:'var(--green)'}}>✓ {g.yesPct}¢ Yes</span>
            <span style={{fontSize:'0.7rem',fontWeight:800,color:'var(--red)'}}>✗ {100-g.yesPct}¢ No</span>
          </div>
        </div>

        <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.68rem',color:'var(--muted)',paddingTop:'0.5rem',borderTop:'1px solid var(--border)'}}>
          <span>🏦 <strong style={{color:'var(--amber)'}}>${g.stake}</strong> staked (in Aave)</span>
          <span>💰 <strong style={{color:'var(--text)'}}>${totalPool.toLocaleString()}</strong> total pool</span>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [filter, setFilter] = useState(-1); // -1 = all

  const goals = filter === -1 ? MOCK_GOALS : MOCK_GOALS.filter(g=>g.category===filter);

  return (
    <>
      <Head>
        <title>Rezo — Put Skin in the Game</title>
        <meta name="description" content="Stake USDC on your goals. Let the world bet on you. Earn yield while you grind." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Nav */}
      <nav style={{position:'sticky',top:0,zIndex:100,background:'rgba(9,9,15,0.92)',
        backdropFilter:'blur(14px)',borderBottom:'1px solid var(--border)',
        display:'flex',alignItems:'center',justifyContent:'space-between',
        padding:'0 1.5rem',height:56}}>
        <span style={{fontWeight:900,fontSize:'1.25rem',letterSpacing:'-0.02em',
          background:'linear-gradient(90deg,#6366f1,#a78bfa)',
          WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
          Rezo
        </span>
        <div style={{display:'flex',gap:'0.5rem',alignItems:'center'}}>
          <Link href="/create" style={{background:'var(--purple)',color:'white',fontWeight:700,fontSize:'0.82rem',
            padding:'0.45rem 1rem',borderRadius:8,border:'none'}}>
            + Create Goal
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{textAlign:'center',padding:'5rem 1.5rem 3rem',
        background:'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.15), transparent)'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:6,
          background:'rgba(99,102,241,0.1)',border:'1px solid rgba(99,102,241,0.25)',
          borderRadius:99,padding:'4px 14px',marginBottom:'1.5rem',
          fontSize:'0.72rem',fontWeight:700,color:'var(--purple-lt)',letterSpacing:'0.05em'}}>
          ⚡ POWERED BY BASE + AAVE
        </div>
        <h1 style={{fontSize:'clamp(2.2rem,5vw,3.5rem)',fontWeight:900,
          lineHeight:1.1,letterSpacing:'-0.03em',marginBottom:'1rem',
          background:'linear-gradient(135deg,#f1f0ff 0%,#a78bfa 60%)',
          WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
          Put skin in the game.<br/>Prove it to the world.
        </h1>
        <p style={{fontSize:'1.05rem',color:'var(--muted)',maxWidth:520,margin:'0 auto 2rem',lineHeight:1.6}}>
          Stake USDC on your resolutions. Your stake earns Aave yield while you grind.
          Fail — and the No bettors take your principal. Win — you get everything back.
        </p>
        <div style={{display:'flex',gap:'0.75rem',justifyContent:'center',flexWrap:'wrap'}}>
          <Link href="/create" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
            color:'white',fontWeight:800,fontSize:'1rem',padding:'0.75rem 1.75rem',
            borderRadius:10,boxShadow:'0 4px 24px rgba(99,102,241,0.35)'}}>
            🎯 Set a Goal →
          </Link>
          <a href="#markets" style={{background:'var(--surface2)',color:'var(--text)',
            fontWeight:700,fontSize:'1rem',padding:'0.75rem 1.75rem',borderRadius:10,
            border:'1px solid var(--border)'}}>
            Browse Markets
          </a>
        </div>
      </section>

      {/* How it works */}
      <section style={{maxWidth:900,margin:'0 auto',padding:'2rem 1.5rem 3rem'}}>
        <h2 style={{textAlign:'center',fontSize:'1.1rem',fontWeight:800,
          color:'var(--muted)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'2rem'}}>
          How it works
        </h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'1rem'}}>
          {[
            ['🎯','Set Your Goal','Define a binary-resolvable goal with clear success criteria and a deadline.'],
            ['🏦','Stake on Yourself','Lock USDC — it goes into Aave and earns yield the whole time you\'re grinding.'],
            ['🌍','Let the World Bet','Anyone can bet Yes or No on whether you\'ll achieve it. Your stake backs the No side.'],
            ['⚖️','Validator Attests','Your chosen validator reviews your evidence and resolves the market on-chain.'],
            ['💸','Collect or Lose','Win: get your stake back + yield + bragging rights. Fail: yield is yours, principal funds No bettors.'],
          ].map(([icon, title, desc], i) => (
            <div key={i} style={{background:'var(--surface)',border:'1px solid var(--border)',
              borderRadius:'var(--radius)',padding:'1.25rem',textAlign:'center'}}>
              <div style={{fontSize:'1.75rem',marginBottom:'0.5rem'}}>{icon}</div>
              <div style={{fontWeight:800,marginBottom:'0.4rem',fontSize:'0.88rem'}}>{title}</div>
              <div style={{fontSize:'0.75rem',color:'var(--muted)',lineHeight:1.5}}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Markets */}
      <section id="markets" style={{maxWidth:900,margin:'0 auto',padding:'0 1.5rem 4rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.25rem',flexWrap:'wrap',gap:'0.75rem'}}>
          <h2 style={{fontSize:'1.2rem',fontWeight:800}}>Active Goals</h2>
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            {[['All',-1],...CATEGORIES.map((c,i)=>[c,i])].map(([label,val])=>(
              <button key={val} onClick={()=>setFilter(val)}
                style={{fontSize:'0.7rem',fontWeight:700,padding:'4px 12px',borderRadius:99,border:'1px solid',
                  borderColor: filter===val ? 'var(--purple)' : 'var(--border)',
                  background: filter===val ? 'rgba(99,102,241,0.15)' : 'transparent',
                  color: filter===val ? 'var(--purple-lt)' : 'var(--muted)'}}>
                {val===-1 ? '⚡ All' : `${CAT_ICONS[val]} ${label}`}
              </button>
            ))}
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'1rem'}}>
          {goals.map(g=><GoalCard key={g.id} g={g}/>)}
        </div>
      </section>
    </>
  );
}
