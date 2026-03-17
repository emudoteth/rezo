import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

const CATEGORIES = ['Health','Skills','Finance','Habits','Custom'];
const CAT_ICONS  = ['💪','🎓','💰','🌱','⚡'];

const MOCK_GOALS = [
  { id:'0x1', title:'Complete all 13 Anthropic AI courses', category:1, handle:'kmarek', stake:500, yesPool:1240, noPool:380, deadline: Date.now()+12*86400e3, yesPct:72 },
  { id:'0x2', title:'Run a marathon in under 4 hours', category:0, handle:'sarah_runs', stake:200, yesPool:890, noPool:720, deadline: Date.now()+45*86400e3, yesPct:55 },
  { id:'0x3', title:'Save $10,000 in 6 months', category:2, handle:'budgetbro', stake:1000, yesPool:2100, noPool:1900, deadline: Date.now()+180*86400e3, yesPct:48 },
  { id:'0x4', title:'Quit smoking for 90 days', category:0, handle:'quitter2026', stake:300, yesPool:450, noPool:680, deadline: Date.now()+90*86400e3, yesPct:40 },
  { id:'0x5', title:'Ship a production AI agent from scratch', category:1, handle:'buildervibes', stake:750, yesPool:3200, noPool:600, deadline: Date.now()+30*86400e3, yesPct:83 },
  { id:'0x6', title:'Meditate every morning for 60 days', category:3, handle:'mindfulmax', stake:100, yesPool:220, noPool:180, deadline: Date.now()+60*86400e3, yesPct:55 },
];

function daysLeft(deadline) {
  const d = Math.ceil((deadline - Date.now()) / 86400e3);
  return d === 1 ? '1 day left' : `${d} days left`;
}

function GoalCard({ g, onBet }) {
  const totalPool = g.yesPool + g.noPool + g.stake;
  return (
    <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:14,
      overflow:'hidden',transition:'border-color 0.2s,transform 0.15s',cursor:'pointer'}}
      onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(99,102,241,0.4)';e.currentTarget.style.transform='translateY(-2px)'}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform='none'}}>

      <div style={{padding:'1.1rem 1.1rem 0.75rem'}}>
        {/* Header row */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.65rem'}}>
          <span style={{fontSize:'0.62rem',fontWeight:700,color:'var(--purple-lt)',
            background:'rgba(99,102,241,0.1)',padding:'2px 8px',borderRadius:99,textTransform:'uppercase',letterSpacing:'0.06em'}}>
            {CAT_ICONS[g.category]} {CATEGORIES[g.category]}
          </span>
          <span style={{fontSize:'0.65rem',color:'var(--muted)',fontWeight:600}}>{daysLeft(g.deadline)}</span>
        </div>

        {/* Title */}
        <p style={{fontWeight:700,fontSize:'0.92rem',lineHeight:1.35,marginBottom:'0.35rem',color:'var(--text)'}}>
          {g.title}
        </p>
        <p style={{fontSize:'0.7rem',color:'var(--muted)',marginBottom:'0.85rem'}}>
          by <strong style={{color:'var(--text)'}}>{g.handle}</strong> · <span style={{color:'var(--amber)'}}>
          ${g.stake} on the line
          </span>
        </p>

        {/* Confidence bar */}
        <div style={{marginBottom:'0.55rem'}}>
          <div style={{height:7,borderRadius:99,background:'rgba(255,255,255,0.07)',overflow:'hidden'}}>
            <div style={{height:'100%',width:`${g.yesPct}%`,
              background:'linear-gradient(90deg,#6366f1,#22c55e)',borderRadius:99}}/>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:5,fontSize:'0.7rem',fontWeight:800}}>
            <span style={{color:'var(--green)'}}>✓ They'll do it — {g.yesPct}%</span>
            <span style={{color:'var(--red)'}}>✗ They won't — {100-g.yesPct}%</span>
          </div>
        </div>
      </div>

      {/* Bet row */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',borderTop:'1px solid var(--border)'}}>
        <button onClick={()=>onBet(g,'YES')}
          style={{padding:'0.6rem',background:'rgba(34,197,94,0.08)',border:'none',
            color:'var(--green)',fontWeight:800,fontSize:'0.78rem',cursor:'pointer',
            borderRight:'1px solid var(--border)'}}>
          ✓ Bet Yes
        </button>
        <button onClick={()=>onBet(g,'NO')}
          style={{padding:'0.6rem',background:'rgba(239,68,68,0.08)',border:'none',
            color:'var(--red)',fontWeight:800,fontSize:'0.78rem',cursor:'pointer'}}>
          ✗ Bet No
        </button>
      </div>
    </div>
  );
}

// Lightweight login prompt modal
function LoginPrompt({ onClose }) {
  return (
    <div style={{position:'fixed',inset:0,zIndex:200,background:'rgba(0,0,0,0.7)',
      backdropFilter:'blur(8px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem'}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:'#13111f',border:'1px solid rgba(99,102,241,0.3)',borderRadius:16,
        padding:'2rem',maxWidth:360,width:'100%',textAlign:'center',
        boxShadow:'0 0 60px rgba(99,102,241,0.15)'}}>
        <div style={{fontSize:'2.5rem',marginBottom:'0.75rem'}}>🎯</div>
        <h2 style={{fontSize:'1.2rem',fontWeight:900,marginBottom:'0.5rem'}}>Sign in to continue</h2>
        <p style={{fontSize:'0.82rem',color:'var(--muted)',marginBottom:'1.5rem',lineHeight:1.5}}>
          No wallet needed. Sign in with Google and we handle everything else — including a secure account that holds your funds.
        </p>
        <button
          onClick={()=>alert('Privy app ID required — see setup instructions')}
          style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:'0.6rem',
            background:'white',color:'#1a1a2e',fontWeight:700,fontSize:'0.9rem',
            padding:'0.75rem 1rem',borderRadius:10,border:'none',cursor:'pointer',marginBottom:'0.75rem'}}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>
        <button onClick={onClose}
          style={{width:'100%',background:'transparent',border:'1px solid var(--border)',
            color:'var(--muted)',fontWeight:600,fontSize:'0.82rem',
            padding:'0.65rem',borderRadius:10,cursor:'pointer'}}>
          Maybe later
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [filter,     setFilter]     = useState(-1);
  const [showLogin,  setShowLogin]  = useState(false);
  // In production: replace with usePrivy() — { authenticated, login, user }
  const [authed,     setAuthed]     = useState(false);

  function requireAuth(cb) {
    if (authed) { cb(); }
    else        { setShowLogin(true); }
  }

  function handleBet(goal, side) {
    requireAuth(() => {
      window.location.href = `/goal/${goal.id}?side=${side}`;
    });
  }

  const goals = filter === -1 ? MOCK_GOALS : MOCK_GOALS.filter(g=>g.category===filter);

  return (
    <>
      <Head>
        <title>Rezo — Make a promise. Put money behind it.</title>
        <meta name="description" content="Set a goal, stake money on yourself, and let your community bet on whether you'll pull it off." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {showLogin && <LoginPrompt onClose={()=>setShowLogin(false)}/>}

      {/* Nav */}
      <nav style={{position:'sticky',top:0,zIndex:100,background:'rgba(9,9,15,0.92)',
        backdropFilter:'blur(14px)',borderBottom:'1px solid var(--border)',
        display:'flex',alignItems:'center',justifyContent:'space-between',
        padding:'0 1.5rem',height:56}}>
        <span style={{fontWeight:900,fontSize:'1.3rem',letterSpacing:'-0.02em',
          background:'linear-gradient(90deg,#6366f1,#a78bfa)',
          WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
          rezo
        </span>
        <div style={{display:'flex',gap:'0.5rem',alignItems:'center'}}>
          {authed
            ? <Link href="/create" style={{background:'var(--purple)',color:'white',fontWeight:700,
                fontSize:'0.82rem',padding:'0.45rem 1rem',borderRadius:8,border:'none',cursor:'pointer'}}>
                + New Goal
              </Link>
            : <button onClick={()=>setShowLogin(true)}
                style={{background:'white',color:'#1a1a2e',fontWeight:700,fontSize:'0.82rem',
                  padding:'0.45rem 1rem',borderRadius:8,border:'none',cursor:'pointer',
                  display:'flex',alignItems:'center',gap:5}}>
                <svg width="14" height="14" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Sign in with Google
              </button>
          }
        </div>
      </nav>

      {/* Hero */}
      <section style={{textAlign:'center',padding:'5rem 1.5rem 3.5rem',
        background:'radial-gradient(ellipse 80% 55% at 50% -5%, rgba(99,102,241,0.18), transparent)'}}>
        <div style={{maxWidth:580,margin:'0 auto'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:6,
            background:'rgba(99,102,241,0.1)',border:'1px solid rgba(99,102,241,0.25)',
            borderRadius:99,padding:'4px 14px',marginBottom:'1.5rem',
            fontSize:'0.72rem',fontWeight:700,color:'var(--purple-lt)',letterSpacing:'0.05em'}}>
            🔥 LIVE GOALS · BET ON REAL PEOPLE
          </div>

          <h1 style={{fontSize:'clamp(2rem,5vw,3.4rem)',fontWeight:900,lineHeight:1.1,
            letterSpacing:'-0.03em',marginBottom:'1rem',
            background:'linear-gradient(135deg,#f1f0ff 0%,#a78bfa 55%)',
            WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
            Make a promise.<br/>Put money behind it.
          </h1>

          <p style={{fontSize:'1.05rem',color:'var(--muted)',lineHeight:1.65,marginBottom:'2rem'}}>
            Set a goal and stake money on yourself. Your friends — and strangers — can bet on whether you'll pull it off. Win and you get everything back. Fail and they take your stake.
          </p>

          <div style={{display:'flex',gap:'0.75rem',justifyContent:'center',flexWrap:'wrap'}}>
            <button onClick={()=>requireAuth(()=>window.location.href='/create')}
              style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'white',
                fontWeight:800,fontSize:'1rem',padding:'0.8rem 1.75rem',borderRadius:10,
                border:'none',cursor:'pointer',boxShadow:'0 4px 24px rgba(99,102,241,0.35)'}}>
              🎯 I want to make a resolution
            </button>
            <a href="#goals"
              style={{background:'rgba(255,255,255,0.07)',color:'var(--text)',
                fontWeight:700,fontSize:'1rem',padding:'0.8rem 1.75rem',borderRadius:10,
                border:'1px solid var(--border)',cursor:'pointer',textDecoration:'none'}}>
              Browse goals ↓
            </a>
          </div>
        </div>
      </section>

      {/* How it works — plain English */}
      <section style={{maxWidth:860,margin:'0 auto',padding:'0 1.5rem 3.5rem'}}>
        <h2 style={{textAlign:'center',fontSize:'0.75rem',fontWeight:800,color:'var(--muted)',
          textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'1.75rem'}}>How it works</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:'1rem'}}>
          {[
            ['🎯','Set your goal','Describe exactly what you\'re committing to and when you\'ll be done.'],
            ['💵','Put money on it','You stake money that gets held in an interest-bearing account while you work.'],
            ['🌍','The world watches','Anyone can bet on whether you succeed or fail. Real money, real stakes.'],
            ['⚖️','Someone judges','You pick a trusted person to verify your evidence and give the final verdict.'],
            ['🏆','Win or learn','Succeed and you get your money back plus the interest it earned. Fail and it goes to the people who doubted you.'],
          ].map(([icon,title,desc])=>(
            <div key={title} style={{background:'var(--surface)',border:'1px solid var(--border)',
              borderRadius:12,padding:'1.25rem',textAlign:'center'}}>
              <div style={{fontSize:'1.75rem',marginBottom:'0.5rem'}}>{icon}</div>
              <div style={{fontWeight:800,fontSize:'0.85rem',marginBottom:'0.4rem'}}>{title}</div>
              <div style={{fontSize:'0.73rem',color:'var(--muted)',lineHeight:1.55}}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Goal feed */}
      <section id="goals" style={{maxWidth:900,margin:'0 auto',padding:'0 1.5rem 5rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',
          marginBottom:'1.25rem',flexWrap:'wrap',gap:'0.75rem'}}>
          <div>
            <h2 style={{fontSize:'1.15rem',fontWeight:800}}>Active Resolutions</h2>
            <p style={{fontSize:'0.73rem',color:'var(--muted)',marginTop:3}}>
              Real people, real money, real stakes. Sign in to bet.
            </p>
          </div>
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            {[['All',-1],...CATEGORIES.map((c,i)=>[c,i])].map(([label,val])=>(
              <button key={val} onClick={()=>setFilter(val)}
                style={{fontSize:'0.7rem',fontWeight:700,padding:'4px 12px',borderRadius:99,
                  border:'1px solid',cursor:'pointer',
                  borderColor: filter===val?'var(--purple)':'var(--border)',
                  background: filter===val?'rgba(99,102,241,0.15)':'transparent',
                  color: filter===val?'var(--purple-lt)':'var(--muted)'}}>
                {val===-1 ? 'All' : `${CAT_ICONS[val]} ${label}`}
              </button>
            ))}
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))',gap:'1rem'}}>
          {goals.map(g=><GoalCard key={g.id} g={g} onBet={handleBet}/>)}
        </div>
      </section>
    </>
  );
}
