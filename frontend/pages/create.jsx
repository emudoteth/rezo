import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';

// Goal creation wizard with guardrails to ensure binary-resolvable goals

const CATEGORIES = [
  { id:0, label:'Health & Wellness',    icon:'💪', examples:['Quit smoking for 90 days','Run a marathon','Lose 20 lbs by July'] },
  { id:1, label:'Skills & Learning',    icon:'🎓', examples:['Complete all Anthropic AI courses','Get AWS certified','Ship a production project'] },
  { id:2, label:'Finance',              icon:'💰', examples:['Save $10,000 in 6 months','Pay off credit card debt','Invest $500/month for a year'] },
  { id:3, label:'Habits',               icon:'🌱', examples:['Meditate every day for 60 days','Read 24 books this year','Journal every morning'] },
  { id:4, label:'Custom',               icon:'⚡', examples:['Define your own resolution'] },
];

const ANTHROPIC_COURSES = [
  'Claude 101 — Learn to use Claude for everyday work tasks',
  'Claude Code in Action — Integrate Claude Code into your dev workflow',
  'AI Fluency: Framework & Foundations',
  'Building with the Claude API',
  'Introduction to Model Context Protocol',
  'Model Context Protocol: Advanced Topics',
  'Claude with Amazon Bedrock',
  'Claude with Google Cloud Vertex AI',
  'AI Fluency for Educators',
  'AI Fluency for Students',
  'Teaching AI Fluency',
  'AI Fluency for Nonprofits',
  'Introduction to Agent Skills',
];

const STEPS = ['Goal','Criteria','Validator','Stake','Review'];

function StepIndicator({ step }) {
  return (
    <div style={{display:'flex',justifyContent:'center',gap:'0.5rem',marginBottom:'2rem',flexWrap:'wrap'}}>
      {STEPS.map((s, i) => (
        <div key={s} style={{display:'flex',alignItems:'center',gap:'0.35rem'}}>
          <div style={{width:26,height:26,borderRadius:'50%',display:'flex',alignItems:'center',
            justifyContent:'center',fontSize:'0.7rem',fontWeight:800,
            background: i < step ? 'var(--purple)' : i === step ? 'rgba(99,102,241,0.25)' : 'var(--surface2)',
            border: i === step ? '2px solid var(--purple)' : '2px solid transparent',
            color: i <= step ? 'white' : 'var(--muted)'}}>
            {i < step ? '✓' : i+1}
          </div>
          <span style={{fontSize:'0.7rem',fontWeight:700,
            color: i === step ? 'var(--text)' : 'var(--muted)'}}>{s}</span>
          {i < STEPS.length-1 && <span style={{color:'var(--border)',fontSize:'0.7rem',margin:'0 0.15rem'}}>›</span>}
        </div>
      ))}
    </div>
  );
}

function Input({ label, hint, ...props }) {
  return (
    <div style={{marginBottom:'1.25rem'}}>
      <label style={{display:'block',fontSize:'0.75rem',fontWeight:700,color:'var(--muted)',
        textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:'0.4rem'}}>{label}</label>
      {hint && <p style={{fontSize:'0.72rem',color:'var(--muted)',marginBottom:'0.4rem',lineHeight:1.4}}>{hint}</p>}
      {props.type === 'textarea'
        ? <textarea {...props} type={undefined} rows={props.rows||3} style={{width:'100%',background:'var(--surface2)',
            border:'1px solid var(--border)',borderRadius:8,padding:'0.65rem 0.85rem',
            color:'var(--text)',fontSize:'0.88rem',resize:'vertical',outline:'none',lineHeight:1.5,...props.style}}/>
        : <input {...props} style={{width:'100%',background:'var(--surface2)',
            border:'1px solid var(--border)',borderRadius:8,padding:'0.65rem 0.85rem',
            color:'var(--text)',fontSize:'0.88rem',outline:'none',...props.style}}/>
      }
    </div>
  );
}

export default function CreateGoal() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    category: -1, title: '', description: '',
    successCriteria: '', evidenceRequired: '',
    deadline: '', validatorEmail: '',
    stake: '100',
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({...f, [k]: v}));

  // ── Guardrail checks ───────────────────────────────────────────────────────

  function validateStep() {
    const e = {};
    if (step === 0) {
      if (form.category === -1) e.category = 'Pick a category';
      if (!form.title.trim())   e.title    = 'Goal title required';
      if (form.title.length > 120) e.title = 'Keep it under 120 characters';
    }
    if (step === 1) {
      if (form.successCriteria.trim().length < 20)
        e.successCriteria = 'Be specific — the validator needs to objectively determine yes or no';
      if (form.evidenceRequired.trim().length < 10)
        e.evidenceRequired = 'What will the validator review to decide?';
      if (!form.deadline) e.deadline = 'Deadline required';
      else if (new Date(form.deadline) < new Date(Date.now() + 86400000))
        e.deadline = 'Deadline must be at least 24h from now';
    }
    if (step === 2) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.validatorEmail))
        e.validatorEmail = 'Valid email required — they\'ll receive an on-chain attestation request via Privy';
    }
    if (step === 3) {
      const n = parseFloat(form.stake);
      if (isNaN(n) || n < 5) e.stake = 'Minimum stake is $5 USDC';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() { if (validateStep()) setStep(s => s+1); }
  function back() { setStep(s => s-1); }

  const cat = CATEGORIES[form.category];

  return (
    <>
      <Head>
        <title>Create Goal — Rezo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <nav style={{position:'sticky',top:0,zIndex:100,background:'rgba(9,9,15,0.92)',
        backdropFilter:'blur(14px)',borderBottom:'1px solid var(--border)',
        display:'flex',alignItems:'center',justifyContent:'space-between',
        padding:'0 1.5rem',height:56}}>
        <Link href="/" style={{fontWeight:900,fontSize:'1.25rem',letterSpacing:'-0.02em',
          background:'linear-gradient(90deg,#6366f1,#a78bfa)',
          WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Rezo</Link>
        <span style={{fontSize:'0.78rem',color:'var(--muted)',fontWeight:600}}>Create Resolution</span>
      </nav>

      <div style={{maxWidth:560,margin:'0 auto',padding:'2.5rem 1.25rem'}}>
        <StepIndicator step={step}/>

        {/* ── Step 0: Goal ───────────────────────────────────────────────── */}
        {step === 0 && (
          <div>
            <h2 style={{fontSize:'1.4rem',fontWeight:900,marginBottom:'0.4rem'}}>What's your goal?</h2>
            <p style={{color:'var(--muted)',fontSize:'0.82rem',marginBottom:'1.75rem'}}>
              Pick a category then name your resolution. Make it specific enough to be verifiable.
            </p>

            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'0.6rem',marginBottom:'1.5rem'}}>
              {CATEGORIES.map(c=>(
                <button key={c.id} onClick={()=>set('category',c.id)}
                  style={{padding:'0.75rem 0.5rem',borderRadius:10,textAlign:'center',
                    background: form.category===c.id ? 'rgba(99,102,241,0.18)' : 'var(--surface2)',
                    border: `2px solid ${form.category===c.id ? 'var(--purple)' : 'var(--border)'}`,
                    color: form.category===c.id ? 'white' : 'var(--muted)',
                    transition:'all 0.15s',cursor:'pointer'}}>
                  <div style={{fontSize:'1.4rem',marginBottom:'0.25rem'}}>{c.icon}</div>
                  <div style={{fontSize:'0.68rem',fontWeight:700,lineHeight:1.2}}>{c.label}</div>
                </button>
              ))}
            </div>
            {errors.category && <p style={{color:'var(--red)',fontSize:'0.72rem',marginBottom:'1rem'}}>{errors.category}</p>}

            {/* Skills pre-fill for Anthropic courses */}
            {form.category === 1 && (
              <div style={{marginBottom:'1.25rem'}}>
                <p style={{fontSize:'0.72rem',color:'var(--muted)',marginBottom:'0.5rem',fontWeight:600}}>
                  📚 Quick fill — Anthropic courses:
                </p>
                <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                  {ANTHROPIC_COURSES.slice(0,6).map(c=>(
                    <button key={c} onClick={()=>set('title',c)}
                      style={{fontSize:'0.65rem',fontWeight:600,padding:'3px 9px',borderRadius:99,
                        background:form.title===c?'rgba(99,102,241,0.25)':'rgba(255,255,255,0.06)',
                        border:`1px solid ${form.title===c?'var(--purple)':'var(--border)'}`,
                        color:form.title===c?'var(--purple-lt)':'var(--muted)',cursor:'pointer'}}>
                      {c.split('—')[0].trim()}
                    </button>
                  ))}
                  <button onClick={()=>set('title','Complete all 13 Anthropic AI courses')}
                    style={{fontSize:'0.65rem',fontWeight:700,padding:'3px 9px',borderRadius:99,
                      background:'rgba(99,102,241,0.15)',border:'1px solid var(--purple)',
                      color:'var(--purple-lt)',cursor:'pointer'}}>
                    📦 All 13 Anthropic courses
                  </button>
                </div>
              </div>
            )}

            <Input label="Goal Title" placeholder={cat?.examples?.[0] || 'e.g. Quit smoking for 90 days'}
              value={form.title} onChange={e=>set('title',e.target.value)}
              hint="One sentence. Make it specific and time-bound."/>
            {errors.title && <p style={{color:'var(--red)',fontSize:'0.72rem',marginTop:'-1rem',marginBottom:'1rem'}}>{errors.title}</p>}

            <Input label="Description (optional)" type="textarea" rows={2}
              placeholder="Any extra context about your goal..."
              value={form.description} onChange={e=>set('description',e.target.value)}/>
          </div>
        )}

        {/* ── Step 1: Criteria ───────────────────────────────────────────── */}
        {step === 1 && (
          <div>
            <h2 style={{fontSize:'1.4rem',fontWeight:900,marginBottom:'0.4rem'}}>Define success</h2>
            <p style={{color:'var(--muted)',fontSize:'0.82rem',marginBottom:'1.75rem'}}>
              Your validator needs to be able to answer YES or NO with certainty. Be precise.
            </p>

            <div style={{background:'rgba(99,102,241,0.08)',border:'1px solid rgba(99,102,241,0.2)',
              borderRadius:10,padding:'0.85rem 1rem',marginBottom:'1.5rem'}}>
              <p style={{fontSize:'0.75rem',fontWeight:700,color:'var(--purple-lt)',marginBottom:'0.35rem'}}>
                🎯 Guardrail: What makes a good success criteria?
              </p>
              <ul style={{fontSize:'0.72rem',color:'var(--muted)',paddingLeft:'1.25rem',lineHeight:1.8}}>
                <li>Binary — can be answered definitively YES or NO</li>
                <li>Measurable — has a specific number, date, or verifiable artifact</li>
                <li>Evidence-backed — validator can verify with a screenshot, link, or certificate</li>
              </ul>
            </div>

            <Input label="Success Criteria"
              hint='Complete this sentence: "The goal is achieved if and only if..."'
              type="textarea" rows={3}
              placeholder="e.g. All 13 Anthropic courses completed and certificates shared. No partial credit."
              value={form.successCriteria} onChange={e=>set('successCriteria',e.target.value)}/>
            {errors.successCriteria && <p style={{color:'var(--red)',fontSize:'0.72rem',marginTop:'-1rem',marginBottom:'1rem'}}>{errors.successCriteria}</p>}

            <Input label="Evidence Required"
              hint="What will the validator review? Be specific."
              placeholder="e.g. Screenshot of each course completion certificate from learn.anthropic.com"
              value={form.evidenceRequired} onChange={e=>set('evidenceRequired',e.target.value)}/>
            {errors.evidenceRequired && <p style={{color:'var(--red)',fontSize:'0.72rem',marginTop:'-1rem',marginBottom:'1rem'}}>{errors.evidenceRequired}</p>}

            <Input label="Deadline" type="date"
              hint="When will the validator be asked to attest? After this date, betting closes."
              min={new Date(Date.now()+86400000).toISOString().split('T')[0]}
              value={form.deadline} onChange={e=>set('deadline',e.target.value)}/>
            {errors.deadline && <p style={{color:'var(--red)',fontSize:'0.72rem',marginTop:'-1rem',marginBottom:'1rem'}}>{errors.deadline}</p>}
          </div>
        )}

        {/* ── Step 2: Validator ─────────────────────────────────────────── */}
        {step === 2 && (
          <div>
            <h2 style={{fontSize:'1.4rem',fontWeight:900,marginBottom:'0.4rem'}}>Assign your validator</h2>
            <p style={{color:'var(--muted)',fontSize:'0.82rem',marginBottom:'1.75rem'}}>
              The validator reviews your evidence and attests on-chain. They receive an email invitation
              — Privy creates an embedded wallet for them so they don't need crypto experience.
            </p>

            <Input label="Validator Email"
              type="email"
              placeholder="validator@example.com"
              hint="A friend, mentor, or third party who can honestly verify your evidence. They'll get an email with instructions."
              value={form.validatorEmail} onChange={e=>set('validatorEmail',e.target.value)}/>
            {errors.validatorEmail && <p style={{color:'var(--red)',fontSize:'0.72rem',marginTop:'-1rem',marginBottom:'1rem'}}>{errors.validatorEmail}</p>}

            <div style={{background:'rgba(245,158,11,0.08)',border:'1px solid rgba(245,158,11,0.2)',
              borderRadius:10,padding:'0.85rem 1rem'}}>
              <p style={{fontSize:'0.75rem',fontWeight:700,color:'var(--amber)',marginBottom:'0.35rem'}}>
                ⚠️ Choose carefully
              </p>
              <p style={{fontSize:'0.72rem',color:'var(--muted)',lineHeight:1.6}}>
                The validator has full authority to resolve this market. Their on-chain attestation is final.
                Pick someone honest who will review your evidence fairly — and who you trust with real money.
              </p>
            </div>
          </div>
        )}

        {/* ── Step 3: Stake ─────────────────────────────────────────────── */}
        {step === 3 && (
          <div>
            <h2 style={{fontSize:'1.4rem',fontWeight:900,marginBottom:'0.4rem'}}>Stake on yourself</h2>
            <p style={{color:'var(--muted)',fontSize:'0.82rem',marginBottom:'1.75rem'}}>
              Your USDC is deposited into <strong style={{color:'var(--amber)'}}>Aave V3 on Base</strong> and earns
              yield the entire time. Win or lose, the yield is yours.
            </p>

            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'0.5rem',marginBottom:'1rem'}}>
              {['25','50','100','250','500','1000'].map(v=>(
                <button key={v} onClick={()=>set('stake',v)}
                  style={{padding:'0.6rem',borderRadius:8,fontWeight:800,fontSize:'0.82rem',
                    background: form.stake===v ? 'rgba(99,102,241,0.2)' : 'var(--surface2)',
                    border: `2px solid ${form.stake===v ? 'var(--purple)' : 'var(--border)'}`,
                    color: form.stake===v ? 'var(--purple-lt)' : 'var(--muted)', cursor:'pointer'}}>
                  ${v}
                </button>
              ))}
            </div>

            <Input label="Custom Amount (USDC)" type="number" min="5" step="1"
              value={form.stake} onChange={e=>set('stake',e.target.value)}
              hint="Minimum $5 USDC. The more you stake, the stronger the signal — and the more you lose if you fail."/>
            {errors.stake && <p style={{color:'var(--red)',fontSize:'0.72rem',marginTop:'-1rem',marginBottom:'1rem'}}>{errors.stake}</p>}

            <div style={{background:'var(--surface2)',borderRadius:10,padding:'0.85rem 1rem',border:'1px solid var(--border)'}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.75rem',marginBottom:6}}>
                <span style={{color:'var(--muted)'}}>Your USDC stake</span>
                <span style={{fontWeight:800,color:'var(--amber)'}}>${form.stake || 0}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.75rem',marginBottom:6}}>
                <span style={{color:'var(--muted)'}}>Deposited to Aave V3</span>
                <span style={{fontWeight:700,color:'var(--green)'}}>Earns yield immediately</span>
              </div>
              <div style={{height:1,background:'var(--border)',margin:'8px 0'}}/>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.75rem'}}>
                <span style={{color:'var(--muted)'}}>If you succeed</span>
                <span style={{fontWeight:800,color:'var(--green)'}}>Get back ${form.stake || 0} + all yield ✓</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.75rem',marginTop:4}}>
                <span style={{color:'var(--muted)'}}>If you fail</span>
                <span style={{fontWeight:700,color:'var(--red)'}}>Yield only — principal funds No bettors</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 4: Review ────────────────────────────────────────────── */}
        {step === 4 && (
          <div>
            <h2 style={{fontSize:'1.4rem',fontWeight:900,marginBottom:'0.4rem'}}>Review & deploy</h2>
            <p style={{color:'var(--muted)',fontSize:'0.82rem',marginBottom:'1.75rem'}}>
              Once deployed, your stake is locked and the market opens for betting. This is on-chain and irreversible.
            </p>

            <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius)',overflow:'hidden',marginBottom:'1.25rem'}}>
              {[
                ['Goal',form.title],
                ['Category', `${CATEGORIES[form.category]?.icon} ${CATEGORIES[form.category]?.label}`],
                ['Success Criteria', form.successCriteria],
                ['Evidence Required', form.evidenceRequired],
                ['Deadline', form.deadline],
                ['Validator', form.validatorEmail],
                ['Stake', `$${form.stake} USDC (→ Aave V3 on Base)`],
              ].map(([label,val],i)=>(
                <div key={label} style={{display:'flex',gap:'1rem',padding:'0.7rem 1rem',
                  borderBottom: i < 6 ? '1px solid var(--border)' : 'none',flexWrap:'wrap'}}>
                  <span style={{fontSize:'0.7rem',fontWeight:700,color:'var(--muted)',
                    textTransform:'uppercase',letterSpacing:'0.05em',minWidth:130}}>{label}</span>
                  <span style={{fontSize:'0.8rem',color:'var(--text)',flex:1,lineHeight:1.5}}>{val}</span>
                </div>
              ))}
            </div>

            <div style={{background:'rgba(99,102,241,0.08)',border:'1px solid rgba(99,102,241,0.2)',
              borderRadius:10,padding:'0.85rem 1rem',marginBottom:'1.5rem'}}>
              <p style={{fontSize:'0.72rem',color:'var(--muted)',lineHeight:1.6}}>
                By deploying, you authorize the transfer of <strong style={{color:'var(--amber)'}}>${form.stake} USDC</strong> to
                the RezoGoal contract on Base, which will immediately supply it to Aave V3.
                Your validator at <strong style={{color:'var(--text)'}}>{form.validatorEmail}</strong> will receive
                an email invitation via Privy to create their on-chain identity.
              </p>
            </div>

            <button onClick={()=>alert('Connect wallet & sign — contract integration coming next')}
              style={{width:'100%',padding:'0.9rem',borderRadius:10,border:'none',
                background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
                color:'white',fontWeight:800,fontSize:'1rem',cursor:'pointer',
                boxShadow:'0 4px 24px rgba(99,102,241,0.35)'}}>
              🚀 Deploy Goal to Base
            </button>
          </div>
        )}

        {/* Nav buttons */}
        <div style={{display:'flex',justifyContent:'space-between',marginTop:'2rem'}}>
          {step > 0
            ? <button onClick={back} style={{background:'var(--surface2)',border:'1px solid var(--border)',
                color:'var(--text)',fontWeight:700,padding:'0.65rem 1.25rem',borderRadius:8}}>
                ← Back
              </button>
            : <Link href="/" style={{background:'var(--surface2)',border:'1px solid var(--border)',
                color:'var(--muted)',fontWeight:700,padding:'0.65rem 1.25rem',borderRadius:8}}>
                Cancel
              </Link>
          }
          {step < 4 && (
            <button onClick={next}
              style={{background:'var(--purple)',color:'white',fontWeight:800,
                padding:'0.65rem 1.5rem',borderRadius:8,border:'none'}}>
              Next →
            </button>
          )}
        </div>
      </div>
    </>
  );
}
