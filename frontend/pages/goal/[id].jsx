import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

// Goal detail + betting page
// TODO: load from contract via id

const MOCK = {
  id: '0x1', title: 'Complete all 13 Anthropic AI courses',
  description: 'I want to become genuinely AI fluent — not just prompt-literate. Completing the full Anthropic course catalog is my public commitment.',
  category: 1, resolver: '0xabc...def', resolverHandle: 'kmarek.base.eth',
  stake: 500, yesPool: 1240, noPool: 380,
  deadline: Date.now() + 12 * 86400e3,
  successCriteria: 'All 13 Anthropic courses completed and certificates shared via learn.anthropic.com. No partial credit.',
  evidenceRequired: 'Screenshot of each course completion certificate with timestamp.',
  validator: 'mentor@example.com',
  aaveYield: 18.40,
};

export default function GoalPage() {
  const g = MOCK;
  const [betSide, setBetSide]     = useState('YES');
  const [amount, setAmount]       = useState('20');
  const totalPool = g.yesPool + g.noPool + g.stake;
  const yesPct    = Math.round((g.yesPool / totalPool) * 100);
  const daysLeft  = Math.ceil((g.deadline - Date.now()) / 86400e3);

  function potentialWin(side) {
    const bet = parseFloat(amount) || 0;
    if (side === 'YES') {
      const newYes = g.yesPool + bet;
      return ((bet / newYes) * g.noPool).toFixed(2);
    } else {
      const newNo = g.noPool + bet;
      return ((bet / newNo) * (g.yesPool + g.stake)).toFixed(2);
    }
  }

  return (
    <>
      <Head><title>{g.title} — Rezo</title></Head>
      <nav style={{position:'sticky',top:0,zIndex:100,background:'rgba(9,9,15,0.92)',
        backdropFilter:'blur(14px)',borderBottom:'1px solid var(--border)',
        display:'flex',alignItems:'center',justifyContent:'space-between',
        padding:'0 1.5rem',height:56}}>
        <Link href="/" style={{fontWeight:900,fontSize:'1.25rem',letterSpacing:'-0.02em',
          background:'linear-gradient(90deg,#6366f1,#a78bfa)',
          WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Rezo</Link>
        <span style={{fontSize:'0.75rem',color:'var(--muted)'}}>🎯 Goal Detail</span>
      </nav>

      <div style={{maxWidth:780,margin:'0 auto',padding:'2rem 1.25rem',display:'grid',
        gridTemplateColumns:'1fr min(340px,100%)',gap:'1.5rem',alignItems:'start'}}>

        {/* Left: goal info */}
        <div>
          <div style={{fontSize:'0.65rem',fontWeight:700,color:'var(--purple-lt)',
            background:'rgba(99,102,241,0.12)',padding:'2px 9px',borderRadius:99,
            display:'inline-block',marginBottom:'0.85rem',textTransform:'uppercase',letterSpacing:'0.06em'}}>
            🎓 Skills & Learning
          </div>

          <h1 style={{fontSize:'1.6rem',fontWeight:900,lineHeight:1.2,marginBottom:'0.75rem'}}>
            {g.title}
          </h1>

          <p style={{color:'var(--muted)',fontSize:'0.88rem',lineHeight:1.6,marginBottom:'1.5rem'}}>
            {g.description}
          </p>

          {/* Stats row */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'0.75rem',marginBottom:'1.5rem'}}>
            {[
              ['⏱️ Time Left', `${daysLeft} days`, '#f1f0ff'],
              ['🏦 Staked (Aave)', `$${g.stake} USDC`, 'var(--amber)'],
              ['📈 Yield Earned', `$${g.aaveYield}`, 'var(--green)'],
            ].map(([label,val,color])=>(
              <div key={label} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:10,padding:'0.85rem',textAlign:'center'}}>
                <div style={{fontSize:'0.65rem',color:'var(--muted)',marginBottom:4,fontWeight:600}}>{label}</div>
                <div style={{fontWeight:800,color,fontSize:'1rem'}}>{val}</div>
              </div>
            ))}
          </div>

          {/* Odds bar */}
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:10,padding:'1rem',marginBottom:'1.25rem'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.5rem',fontSize:'0.78rem',fontWeight:700}}>
              <span style={{color:'var(--green)'}}>✓ YES {yesPct}%</span>
              <span style={{color:'var(--red)'}}>✗ NO {100-yesPct}%</span>
            </div>
            <div style={{height:10,borderRadius:99,background:'rgba(239,68,68,0.2)',overflow:'hidden'}}>
              <div style={{height:'100%',width:`${yesPct}%`,background:'linear-gradient(90deg,var(--purple),var(--green))',borderRadius:99}}/>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.7rem',color:'var(--muted)',marginTop:'0.5rem'}}>
              <span>${g.yesPool.toLocaleString()} in YES pool</span>
              <span>${g.noPool.toLocaleString()} in NO pool</span>
            </div>
            <div style={{fontSize:'0.7rem',color:'var(--amber)',marginTop:4,textAlign:'center'}}>
              + ${g.stake} resolver stake backs the NO side
            </div>
          </div>

          {/* Resolution criteria */}
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:10,padding:'1rem',marginBottom:'1.25rem'}}>
            <h3 style={{fontSize:'0.8rem',fontWeight:800,marginBottom:'0.75rem',color:'var(--muted)',
              textTransform:'uppercase',letterSpacing:'0.06em'}}>Resolution Criteria</h3>
            <div style={{marginBottom:'0.75rem'}}>
              <p style={{fontSize:'0.7rem',fontWeight:700,color:'var(--purple-lt)',marginBottom:3}}>Success Criteria</p>
              <p style={{fontSize:'0.82rem',color:'var(--text)',lineHeight:1.5}}>{g.successCriteria}</p>
            </div>
            <div style={{marginBottom:'0.75rem'}}>
              <p style={{fontSize:'0.7rem',fontWeight:700,color:'var(--purple-lt)',marginBottom:3}}>Evidence Required</p>
              <p style={{fontSize:'0.82rem',color:'var(--text)',lineHeight:1.5}}>{g.evidenceRequired}</p>
            </div>
            <div style={{paddingTop:'0.75rem',borderTop:'1px solid var(--border)',display:'flex',justifyContent:'space-between',fontSize:'0.72rem',color:'var(--muted)'}}>
              <span>⚖️ Validator: <strong style={{color:'var(--text)'}}>{g.validator}</strong></span>
              <span>Deadline: <strong style={{color:'var(--text)'}}>{new Date(g.deadline).toLocaleDateString()}</strong></span>
            </div>
          </div>
        </div>

        {/* Right: bet panel */}
        <div style={{position:'sticky',top:68}}>
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'1.25rem'}}>
            <h3 style={{fontWeight:800,marginBottom:'1rem',fontSize:'0.95rem'}}>Place your bet</h3>

            {/* Side toggle */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:'1rem'}}>
              {['YES','NO'].map(s=>(
                <button key={s} onClick={()=>setBetSide(s)}
                  style={{padding:'0.6rem',borderRadius:8,fontWeight:800,fontSize:'0.88rem',cursor:'pointer',
                    background: betSide===s ? (s==='YES'?'rgba(34,197,94,0.2)':'rgba(239,68,68,0.2)') : 'var(--surface2)',
                    border: `2px solid ${betSide===s ? (s==='YES'?'var(--green)':'var(--red)') : 'var(--border)'}`,
                    color: betSide===s ? (s==='YES'?'var(--green)':'var(--red)') : 'var(--muted)'}}>
                  {s==='YES'?'✓ YES':'✗ NO'}
                </button>
              ))}
            </div>

            {/* Amount */}
            <div style={{marginBottom:'0.85rem'}}>
              <label style={{fontSize:'0.7rem',fontWeight:700,color:'var(--muted)',
                textTransform:'uppercase',letterSpacing:'0.05em',display:'block',marginBottom:'0.4rem'}}>Amount (USDC)</label>
              <div style={{position:'relative'}}>
                <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--muted)'}}>$</span>
                <input type="number" min="1" step="1" value={amount} onChange={e=>setAmount(e.target.value)}
                  style={{width:'100%',background:'var(--surface2)',border:'1px solid var(--border)',
                    borderRadius:8,padding:'0.65rem 0.85rem 0.65rem 1.75rem',
                    color:'var(--text)',fontSize:'0.95rem',fontWeight:700,outline:'none'}}/>
              </div>
              <div style={{display:'flex',gap:5,marginTop:5}}>
                {['5','10','25','50'].map(v=>(
                  <button key={v} onClick={()=>setAmount(v)}
                    style={{flex:1,fontSize:'0.65rem',fontWeight:700,padding:'3px 0',borderRadius:5,
                      background:'rgba(255,255,255,0.06)',border:'none',color:'var(--muted)',cursor:'pointer'}}>
                    ${v}
                  </button>
                ))}
              </div>
            </div>

            {/* Payout estimate */}
            <div style={{background:'var(--surface2)',borderRadius:8,padding:'0.7rem',marginBottom:'1rem',border:'1px solid var(--border)'}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.72rem',marginBottom:3}}>
                <span style={{color:'var(--muted)'}}>Potential profit</span>
                <span style={{fontWeight:800,color:betSide==='YES'?'var(--green)':'var(--red)'}}>
                  +${potentialWin(betSide)}
                </span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.7rem'}}>
                <span style={{color:'var(--muted)'}}>Current odds</span>
                <span style={{color:'var(--text)',fontWeight:700}}>
                  {betSide==='YES' ? `${yesPct}¢ YES` : `${100-yesPct}¢ NO`}
                </span>
              </div>
            </div>

            <button onClick={()=>alert('Connect wallet to bet — Privy integration coming next')}
              style={{width:'100%',padding:'0.8rem',borderRadius:9,border:'none',
                background: betSide==='YES' ? 'linear-gradient(135deg,#16a34a,#22c55e)' : 'linear-gradient(135deg,#dc2626,#ef4444)',
                color:'white',fontWeight:800,fontSize:'0.9rem',cursor:'pointer'}}>
              Bet {betSide} — ${amount || 0}
            </button>

            <p style={{fontSize:'0.62rem',color:'var(--muted)',textAlign:'center',marginTop:'0.65rem',lineHeight:1.5}}>
              Non-custodial · Base · USDC<br/>
              Platform fee: 2% on winnings
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
