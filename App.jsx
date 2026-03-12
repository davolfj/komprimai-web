import { useState, useEffect, useRef } from 'react'

// ── Inline styles (no Tailwind needed — zero config for Vercel) ──
const C = {
  bg: '#0a0e1a', card: '#131827', cardHover: '#1a2035', border: '#1e2a42',
  primary: '#6366f1', primaryGlow: '#818cf8', accent: '#f43f5e', accentGlow: '#fb7185',
  success: '#10b981', warning: '#f59e0b',
  t1: '#f1f5f9', t2: '#94a3b8', t3: '#64748b', t4: '#475569',
}

const font = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"

// ── Global CSS ──
const GlobalStyle = () => (
  <style>{`
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: ${C.bg}; color: ${C.t1}; font-family: ${font}; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
    input, textarea, select { font-family: ${font}; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
    .fade-in { animation: fadeIn 0.3s ease-out; }
    .pulse { animation: pulse 2s ease-in-out infinite; }
    button { cursor: pointer; border: none; font-family: ${font}; }
    button:active { transform: scale(0.97); }
  `}</style>
)

// ══════════════════════════════════════════════
// MOCK DATA
// ══════════════════════════════════════════════

const MODELS = [
  { id: 1, name: 'Sophia Laurent', tag: 'SL', color: '#f43f5e', username: 'sophia_of', auto: true, fans: 847, rev: 12450, rate: 94, avgResp: '2.1s',
    persona: 'Flirty, confident, uses lots of emojis. Short playful sentences. Always ends with 💋 or 💕',
    traits: { tone: 'playful, flirty', emoji: 'high', length: 'short', style: 'soft-tease' } },
  { id: 2, name: 'Luna Vega', tag: 'LV', color: '#8b5cf6', username: 'luna_vega', auto: true, fans: 623, rev: 8920, rate: 91, avgResp: '3.4s',
    persona: 'Sweet GF vibe. Uses pet names like babe/honey. Asks about their day. Intimate tone.',
    traits: { tone: 'sweet, caring', emoji: 'medium', length: 'medium', style: 'intimate' } },
  { id: 3, name: 'Aria Stone', tag: 'AS', color: '#06b6d4', username: 'aria_stone', auto: false, fans: 1102, rev: 15780, rate: 87, avgResp: '5.2s',
    persona: 'Dominant and mysterious. Short commanding sentences. Rarely uses emojis.',
    traits: { tone: 'dominant, mysterious', emoji: 'low', length: 'short', style: 'direct' } },
]

const FANS = [
  { id: 1, name: 'BigSpender_X', tier: 'whale', spent: 2100, msgs: 521, score: 0.95, mood: 0.8, risk: false, lastMsg: '1m ago', notes: 'Buys everything. VIP.' },
  { id: 2, name: 'Mike_92', tier: 'whale', spent: 1250, msgs: 342, score: 0.92, mood: 0.7, risk: false, lastMsg: '3m ago', notes: 'Loves lingerie content' },
  { id: 3, name: 'DarkKnight', tier: 'high', spent: 480, msgs: 156, score: 0.78, mood: 0.5, risk: false, lastMsg: '8m ago', notes: '' },
  { id: 4, name: 'JohnnyBoy', tier: 'mid', spent: 85, msgs: 67, score: 0.55, mood: 0.4, risk: false, lastMsg: '20m ago', notes: '' },
  { id: 5, name: 'CoolGuy99', tier: 'low', spent: 18, msgs: 12, score: 0.30, mood: 0.2, risk: true, lastMsg: '5d ago', notes: 'Might churn' },
  { id: 6, name: 'NewFan_23', tier: 'new', spent: 0, msgs: 3, score: 0.60, mood: 0.5, risk: false, lastMsg: '30m ago', notes: '' },
]

const CONVOS = {
  1: [
    { from: 'fan', text: 'Good morning beautiful! 🌅', time: '8:00 AM' },
    { from: 'ai', text: 'good morning baby! 💕 omg i literally just opened my eyes... you\'re always my first message 🥰', time: '8:03 AM' },
    { from: 'fan', text: 'I want something exclusive today, just for me', time: '8:04 AM', intent: 'buying_signal' },
    { from: 'ai', text: 'mmm i love when you get demanding 😏 i have something nobody else has seen... $25 and it\'s all yours 🔥💋', time: '8:06 AM', ppv: 25 },
    { from: 'fan', text: 'Done. Sent. 💰', time: '8:06 AM' },
    { from: 'ai', text: 'you spoil me 😍 check your DMs in 2 min... you\'re gonna love it 💕', time: '8:08 AM' },
  ],
  2: [
    { from: 'fan', text: 'Hey gorgeous, how\'s your day going? 😍', time: '10:32 AM' },
    { from: 'ai', text: 'hiii babe! 💕 just woke up feeling amazing... had the craziest dream 🏖️ wbu?', time: '10:34 AM' },
    { from: 'fan', text: 'Just at work thinking about you honestly 🔥', time: '10:35 AM', intent: 'flirting' },
    { from: 'ai', text: 'omg stoppp you\'re making me blush 🙈💕 i just took new pics... wanna see? 😏', time: '10:37 AM', ppv: 18 },
    { from: 'fan', text: 'Yes please!! Take my money!', time: '10:37 AM', intent: 'buying_signal' },
  ],
  3: [
    { from: 'fan', text: 'You\'re so beautiful, I can\'t stop thinking about you', time: '2:15 PM', intent: 'flirting' },
    { from: 'ai', text: 'aww that\'s so sweet 🥰 what do you like most about me? 💕', time: '2:17 PM' },
    { from: 'fan', text: 'Everything, your smile is amazing', time: '2:18 PM' },
    { from: 'ai', text: 'you always know what to say 😘 shot something special today... sneak peek? 📸✨', time: '2:20 PM', ppv: 15 },
  ],
  6: [
    { from: 'fan', text: 'Hey! Just subscribed, first message!', time: '6:45 PM', intent: 'greeting' },
    { from: 'ai', text: 'hiii welcome babe!! 🎉💖 so happy you\'re here! tell me about yourself 😊', time: '6:47 PM' },
    { from: 'fan', text: 'I\'m Jake, 28, found you on Twitter', time: '6:48 PM' },
  ],
}

const UPSELLS = [
  { fan: 'BigSpender_X', type: 'PPV', amount: 25, status: 'purchased', time: '2m' },
  { fan: 'Mike_92', type: 'Custom', amount: 50, status: 'purchased', time: '15m' },
  { fan: 'DarkKnight', type: 'PPV', amount: 15, status: 'opened', time: '1h' },
  { fan: 'JohnnyBoy', type: 'Tip', amount: 10, status: 'purchased', time: '2h' },
  { fan: 'CoolGuy99', type: 'PPV', amount: 20, status: 'declined', time: '3h' },
  { fan: 'NewFan_23', type: 'PPV', amount: 8, status: 'purchased', time: '5h' },
]

const FLAGS = [
  { fan: 'CoolGuy99', type: 'negative', reason: 'Negative sentiment detected (score: -0.65)', time: '1h ago' },
]

const genBars = (n, min, max) => Array.from({ length: n }, () => min + Math.random() * (max - min) | 0)
const EARNINGS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => ({
  m, subs: 2000 + i * 200 + Math.random() * 2000 | 0, tips: 500 + i * 80 + Math.random() * 1000 | 0,
  ppv: 800 + i * 150 + Math.random() * 1500 | 0, msgs: 300 + i * 40 + Math.random() * 500 | 0,
}))
const HOURLY = genBars(24, 5, 120)

// ══════════════════════════════════════════════
// COMPONENTS
// ══════════════════════════════════════════════

const s = { // style helpers
  row: { display: 'flex', alignItems: 'center', gap: 10 },
  col: { display: 'flex', flexDirection: 'column' },
  card: { background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: 24 },
  input: { width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, color: C.t1, fontSize: 13, outline: 'none' },
  btn: (color = C.primary) => ({ padding: '8px 18px', borderRadius: 10, background: color, color: '#fff', fontWeight: 600, fontSize: 13 }),
}

const Avatar = ({ name, color, size = 38 }) => (
  <div style={{ width: size, height: size, borderRadius: '50%', background: `linear-gradient(135deg, ${color}, ${color}88)`,
    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: size * 0.33, flexShrink: 0 }}>
    {(name || '??').split(/[\s_]/).map(w => w[0]).join('').slice(0, 2).toUpperCase()}
  </div>
)

const Badge = ({ children, color = C.primary }) => (
  <span style={{ padding: '2px 9px', borderRadius: 10, background: `${color}20`, color, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{children}</span>
)

const StatCard = ({ label, value, change, icon }) => (
  <div style={{ ...s.card, flex: 1, minWidth: 180 }} className="fade-in">
    <div style={{ ...s.row, justifyContent: 'space-between', marginBottom: 10 }}>
      <span style={{ color: C.t3, fontSize: 13, fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 18 }}>{icon}</span>
    </div>
    <div style={{ fontSize: 26, fontWeight: 700, color: C.t1 }}>{value}</div>
    {change !== undefined && <span style={{ fontSize: 12, fontWeight: 600, color: change >= 0 ? C.success : C.accent }}>{change >= 0 ? '↑' : '↓'} {Math.abs(change)}%</span>}
  </div>
)

const Toggle = ({ on, onToggle, label }) => (
  <div style={{ ...s.row, cursor: 'pointer', gap: 8 }} onClick={onToggle}>
    <div style={{ width: 40, height: 22, borderRadius: 11, background: on ? C.success : C.border, padding: 2, transition: 'background 0.2s' }}>
      <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'transform 0.2s', transform: on ? 'translateX(18px)' : 'translateX(0)' }} />
    </div>
    <span style={{ color: C.t2, fontSize: 13, fontWeight: 500 }}>{label}</span>
  </div>
)

const tierColor = { whale: C.accent, high: C.primary, mid: C.warning, low: C.t4, new: '#06b6d4' }
const statusColor = { purchased: C.success, opened: C.warning, declined: C.accent }

const MiniBar = ({ data, max, color = C.primary, h = 120 }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: h }}>
    {data.map((v, i) => <div key={i} style={{ flex: 1, height: `${(v / max) * 100}%`, background: `${color}70`, borderRadius: '3px 3px 0 0', transition: 'height 0.3s' }}
      onMouseEnter={e => e.target.style.background = color} onMouseLeave={e => e.target.style.background = `${color}70`} />)}
  </div>
)

// ══════════════════════════════════════════════
// SIDEBAR
// ══════════════════════════════════════════════

const Sidebar = ({ tab, setTab, models, selModel, setSelModel }) => {
  const nav = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'conversations', icon: '💬', label: 'Conversations' },
    { id: 'models', icon: '👤', label: 'Models' },
    { id: 'bot', icon: '🤖', label: 'Bot Config' },
    { id: 'analytics', icon: '📈', label: 'Analytics' },
    { id: 'upsell', icon: '💰', label: 'Upsell Engine' },
    { id: 'flags', icon: '🚩', label: 'Flags' },
  ]
  return (
    <nav style={{ width: 250, background: '#080c16', borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 50 }}>
      <div style={{ padding: '22px 18px', borderBottom: `1px solid ${C.border}` }}>
        <div style={s.row}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✨</div>
          <div><div style={{ color: C.t1, fontWeight: 700, fontSize: 15 }}>FanFlow AI</div><div style={{ color: C.t4, fontSize: 11 }}>Management Suite</div></div>
        </div>
      </div>
      <div style={{ padding: '12px 8px', flex: 1, overflowY: 'auto' }}>
        <div style={{ color: C.t4, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, padding: '0 10px', marginBottom: 6 }}>Navigation</div>
        {nav.map(n => (
          <button key={n.id} onClick={() => setTab(n.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', borderRadius: 10, background: tab === n.id ? `${C.primary}15` : 'transparent',
            color: tab === n.id ? C.primaryGlow : C.t3, fontWeight: tab === n.id ? 600 : 400, fontSize: 13.5, marginBottom: 1, textAlign: 'left', transition: 'all 0.15s' }}>
            <span style={{ fontSize: 15 }}>{n.icon}</span>{n.label}
          </button>
        ))}
        <div style={{ color: C.t4, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, padding: '14px 10px 6px', marginTop: 6, borderTop: `1px solid ${C.border}` }}>Models</div>
        {models.map((m, i) => (
          <button key={m.id} onClick={() => setSelModel(i)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '7px 12px', borderRadius: 10,
            background: selModel === i ? `${m.color}12` : 'transparent', marginBottom: 1, textAlign: 'left' }}>
            <Avatar name={m.name} color={m.color} size={26} />
            <span style={{ color: C.t1, fontSize: 13, fontWeight: 500, flex: 1 }}>{m.name}</span>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: m.auto ? C.success : C.t4 }} />
          </button>
        ))}
      </div>
      <div style={{ padding: '12px 14px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ ...s.row, padding: '6px 8px' }}>
          <Avatar name="Jakub V" color={C.primary} size={30} />
          <div><div style={{ color: C.t1, fontSize: 13, fontWeight: 500 }}>Jakub</div><div style={{ color: C.t4, fontSize: 11 }}>Manager</div></div>
        </div>
      </div>
    </nav>
  )
}

// ══════════════════════════════════════════════
// VIEWS
// ══════════════════════════════════════════════

const DashboardView = ({ models }) => {
  const totalRev = models.reduce((a, m) => a + m.rev, 0)
  const totalFans = models.reduce((a, m) => a + m.fans, 0)
  const maxE = Math.max(...EARNINGS.map(e => e.subs + e.tips + e.ppv + e.msgs))
  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>Dashboard</h1>
      <p style={{ color: C.t3, fontSize: 14, marginBottom: 24 }}>Overview of all models and performance</p>
      <div style={{ display: 'flex', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
        <StatCard label="Total Revenue" value={`$${totalRev.toLocaleString()}`} change={12.5} icon="💰" />
        <StatCard label="Active Fans" value={totalFans.toLocaleString()} change={8.3} icon="👥" />
        <StatCard label="Bot Messages (24h)" value="1,847" change={23.1} icon="🤖" />
        <StatCard label="Avg Response" value="2.3s" change={-15} icon="⚡" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14, marginBottom: 20 }}>
        <div style={s.card}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18 }}>Revenue Breakdown</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 180 }}>
            {EARNINGS.map((e, i) => { const t = e.subs + e.tips + e.ppv + e.msgs; const h = (t / maxE) * 100; return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: '100%', borderRadius: '4px 4px 0 0', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: `${h}%` }}>
                  <div style={{ height: `${e.subs/t*100}%`, background: `${C.primary}90` }} />
                  <div style={{ height: `${e.tips/t*100}%`, background: `${C.success}90` }} />
                  <div style={{ height: `${e.ppv/t*100}%`, background: `${C.accent}90` }} />
                  <div style={{ height: `${e.msgs/t*100}%`, background: `${C.warning}90` }} />
                </div>
                <span style={{ color: C.t4, fontSize: 10 }}>{e.m}</span>
              </div>
            )})}
          </div>
          <div style={{ display: 'flex', gap: 18, marginTop: 14, justifyContent: 'center' }}>
            {[['Subs', C.primary], ['Tips', C.success], ['PPV', C.accent], ['Msgs', C.warning]].map(([l, c]) => (
              <div key={l} style={{ ...s.row, gap: 5 }}><div style={{ width: 9, height: 9, borderRadius: 2, background: c }} /><span style={{ color: C.t4, fontSize: 11 }}>{l}</span></div>
            ))}
          </div>
        </div>
        <div style={s.card}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18 }}>Model Performance</h3>
          {models.map(m => (
            <div key={m.id} style={{ padding: 12, borderRadius: 12, border: `1px solid ${m.color}22`, background: `${m.color}06`, marginBottom: 12 }}>
              <div style={{ ...s.row, marginBottom: 8 }}><Avatar name={m.name} color={m.color} size={26} /><span style={{ fontWeight: 600, fontSize: 13 }}>{m.name}</span></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <div><div style={{ color: C.t4, fontSize: 11 }}>Earnings</div><div style={{ fontWeight: 700, fontSize: 14 }}>${m.rev.toLocaleString()}</div></div>
                <div><div style={{ color: C.t4, fontSize: 11 }}>Fans</div><div style={{ fontWeight: 700, fontSize: 14 }}>{m.fans}</div></div>
                <div><div style={{ color: C.t4, fontSize: 11 }}>Response</div><div style={{ fontWeight: 700, fontSize: 14, color: C.success }}>{m.rate}%</div></div>
                <div><div style={{ color: C.t4, fontSize: 11 }}>Mode</div><div style={{ fontWeight: 700, fontSize: 14, color: m.auto ? C.success : C.t4 }}>{m.auto ? 'AUTO' : 'MANUAL'}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const ConversationsView = ({ model }) => {
  const [sel, setSel] = useState(FANS[0])
  const [msgs, setMsgs] = useState(CONVOS[1] || [])
  const [input, setInput] = useState('')
  const chatRef = useRef(null)
  useEffect(() => { setMsgs(CONVOS[sel.id] || []) }, [sel])
  useEffect(() => { chatRef.current?.scrollTo(0, chatRef.current.scrollHeight) }, [msgs])
  const send = () => { if (!input.trim()) return; setMsgs(p => [...p, { from: 'model', text: input, time: 'Now' }]); setInput('') }

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>Conversations</h1>
      <p style={{ color: C.t3, fontSize: 14, marginBottom: 20 }}>Managing as <span style={{ color: model.color, fontWeight: 600 }}>{model.name}</span></p>
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 240px', gap: 14, height: 'calc(100vh - 150px)' }}>
        {/* Fan List */}
        <div style={{ ...s.card, padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: 12, borderBottom: `1px solid ${C.border}` }}><input placeholder="Search fans..." style={s.input} /></div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {FANS.map(f => (
              <div key={f.id} onClick={() => setSel(f)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', cursor: 'pointer',
                background: sel.id === f.id ? `${C.primary}10` : 'transparent', borderLeft: `3px solid ${sel.id === f.id ? C.primary : 'transparent'}`, borderBottom: `1px solid ${C.border}15` }}>
                <Avatar name={f.name} color={tierColor[f.tier]} size={32} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...s.row, justifyContent: 'space-between' }}>
                    <span style={{ color: C.t1, fontWeight: 500, fontSize: 13 }}>{f.name}</span>
                    <Badge color={tierColor[f.tier]}>{f.tier}</Badge>
                  </div>
                  <div style={{ color: C.t4, fontSize: 11, marginTop: 2 }}>{f.lastMsg}</div>
                </div>
                {f.risk && <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.warning }} />}
              </div>
            ))}
          </div>
        </div>
        {/* Chat */}
        <div style={{ ...s.card, padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '12px 18px', borderBottom: `1px solid ${C.border}`, ...s.row, justifyContent: 'space-between' }}>
            <div style={s.row}><Avatar name={sel.name} color={tierColor[sel.tier]} size={34} />
              <div><div style={{ fontWeight: 600, fontSize: 14 }}>{sel.name}</div><div style={{ color: C.t4, fontSize: 11 }}>{sel.lastMsg}</div></div>
            </div>
            <div style={{ ...s.row, gap: 8 }}><Badge color={C.success}>🤖 Bot Active</Badge><Badge color={tierColor[sel.tier]}>${sel.spent}</Badge></div>
          </div>
          <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: 18 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.from !== 'fan' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
                <div style={{ maxWidth: '72%', padding: '10px 14px',
                  borderRadius: m.from !== 'fan' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: m.from !== 'fan' ? `${model.color}18` : `${C.border}60`,
                  border: `1px solid ${m.from !== 'fan' ? `${model.color}35` : `${C.border}`}` }}>
                  <div style={{ color: C.t1, fontSize: 14, lineHeight: 1.5 }}>{m.text}</div>
                  <div style={{ ...s.row, gap: 5, marginTop: 4 }}>
                    <span style={{ color: C.t4, fontSize: 11 }}>{m.time}</span>
                    {m.from === 'ai' && <span style={{ color: C.success, fontSize: 10 }}>🤖</span>}
                    {m.from === 'model' && <span style={{ color: C.warning, fontSize: 10 }}>👤 manual</span>}
                    {m.ppv && <span style={{ color: C.warning, fontSize: 10 }}>💰 ${m.ppv}</span>}
                    {m.intent && <span style={{ color: C.primaryGlow, fontSize: 10 }}>⚡ {m.intent}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '10px 14px', borderTop: `1px solid ${C.border}`, ...s.row, gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)} placeholder={model.auto ? "Bot is handling this... (override)" : "Type a message..."}
              style={{ ...s.input, flex: 1, padding: '10px 14px', borderRadius: 10 }} onKeyDown={e => e.key === 'Enter' && send()} />
            <button onClick={send} style={{ ...s.btn(model.color), padding: '10px 20px', borderRadius: 10 }}>Send</button>
          </div>
        </div>
        {/* Fan Info */}
        <div style={{ ...s.card, overflowY: 'auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <Avatar name={sel.name} color={tierColor[sel.tier]} size={52} />
            <div style={{ fontWeight: 600, fontSize: 15, marginTop: 8 }}>{sel.name}</div>
            <Badge color={tierColor[sel.tier]}>{sel.tier.toUpperCase()}</Badge>
          </div>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
            {[['Total Spent', `$${sel.spent}`], ['Messages', sel.msgs], ['Engagement', `${(sel.score * 100).toFixed(0)}%`],
              ['Sentiment', sel.mood > 0.3 ? '😊 Positive' : sel.mood > -0.1 ? '😐 Neutral' : '😟 Negative'],
              ['At Risk', sel.risk ? '⚠️ Yes' : '✅ No']
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: `1px solid ${C.border}20` }}>
                <span style={{ color: C.t3, fontSize: 13 }}>{k}</span><span style={{ color: C.t1, fontSize: 13, fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
          {sel.notes && <div style={{ marginTop: 12, padding: 10, background: `${C.bg}`, borderRadius: 8 }}>
            <div style={{ color: C.t4, fontSize: 11, fontWeight: 600, marginBottom: 3 }}>Notes</div>
            <div style={{ color: C.t2, fontSize: 12 }}>{sel.notes}</div>
          </div>}
          <div style={{ marginTop: 14 }}>
            <div style={{ color: C.t4, fontSize: 11, fontWeight: 600, marginBottom: 8 }}>Quick Actions</div>
            {['Send PPV', 'Send Tip Menu', 'Add to VIP', 'Block User'].map((a, i) => (
              <button key={a} style={{ display: 'block', width: '100%', padding: '7px 10px', marginBottom: 4, borderRadius: 8, border: `1px solid ${i === 3 ? C.accent + '40' : C.border}`,
                background: 'transparent', color: i === 3 ? C.accent : C.t3, fontSize: 12, textAlign: 'left' }}>{a}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const ModelsView = ({ models, setModels }) => (
  <div className="fade-in">
    <div style={{ ...s.row, justifyContent: 'space-between', marginBottom: 24 }}>
      <div><h1 style={{ fontSize: 26, fontWeight: 700 }}>Models</h1><p style={{ color: C.t3, fontSize: 14, marginTop: 4 }}>Manage personas and configurations</p></div>
      <button style={{ ...s.btn(), background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`, padding: '10px 22px', borderRadius: 10 }}>+ Add Model</button>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
      {models.map((m, i) => (
        <div key={m.id} style={{ ...s.card, padding: 0, overflow: 'hidden' }}>
          <div style={{ height: 3, background: `linear-gradient(90deg, ${m.color}, ${m.color}66)` }} />
          <div style={{ padding: 24 }}>
            <div style={{ ...s.row, marginBottom: 14, gap: 14 }}>
              <Avatar name={m.name} color={m.color} size={48} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 17 }}>{m.name}</div>
                <div style={{ color: C.t4, fontSize: 13 }}>@{m.username}</div>
                <div style={{ marginTop: 6 }}><Toggle on={m.auto} onToggle={() => { const u = [...models]; u[i] = { ...m, auto: !m.auto }; setModels(u) }} label={m.auto ? 'Auto Mode' : 'Manual'} /></div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
              {[['Revenue', `$${m.rev.toLocaleString()}`], ['Fans', m.fans], ['Rate', `${m.rate}%`], ['Speed', m.avgResp]].map(([l, v]) => (
                <div key={l} style={{ background: C.bg, borderRadius: 10, padding: 10 }}>
                  <div style={{ color: C.t4, fontSize: 11 }}>{l}</div><div style={{ fontWeight: 700, fontSize: 14, marginTop: 2 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ color: C.t3, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Persona</div>
              <div style={{ padding: 10, borderRadius: 8, border: `1px dashed ${C.border}`, color: C.t3, fontSize: 13, lineHeight: 1.5 }}>{m.persona}</div>
            </div>
            <div style={{ ...s.row, gap: 6, flexWrap: 'wrap' }}>
              {Object.entries(m.traits).map(([k, v]) => (
                <span key={k} style={{ padding: '3px 8px', borderRadius: 6, background: `${m.color}12`, color: `${m.color}cc`, fontSize: 11 }}>{k}: {v}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const BotView = ({ model }) => (
  <div className="fade-in">
    <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>Bot Configuration</h1>
    <p style={{ color: C.t3, fontSize: 14, marginBottom: 24 }}>AI behavior for <span style={{ color: model.color, fontWeight: 600 }}>{model.name}</span></p>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
      <div style={s.card}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18 }}>🤖 General</h3>
        <div style={{ ...s.col, gap: 16 }}>
          <Toggle on={model.auto} label="Autonomous Mode (sends without approval)" />
          <div><div style={{ color: C.t2, fontSize: 13, marginBottom: 6 }}>Response Delay</div><div style={{ color: C.t1, fontSize: 14 }}>15 - 90 seconds (randomized)</div></div>
          <div><div style={{ color: C.t2, fontSize: 13, marginBottom: 6 }}>Max Response Length</div><div style={{ color: C.t1, fontSize: 14 }}>200 characters</div></div>
          <div><div style={{ color: C.t2, fontSize: 13, marginBottom: 8 }}>Emoji Level</div>
            <div style={{ ...s.row, gap: 6 }}>{['none', 'low', 'medium', 'high'].map(l => (
              <span key={l} style={{ padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500, border: `1px solid ${C.border}`,
                background: model.traits.emoji === l ? `${C.primary}20` : 'transparent', color: model.traits.emoji === l ? C.primaryGlow : C.t3 }}>{l}</span>
            ))}</div>
          </div>
        </div>
      </div>
      <div style={s.card}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18 }}>💰 PPV & Upsell</h3>
        <div style={{ ...s.col, gap: 14 }}>
          <div><div style={{ color: C.t2, fontSize: 13 }}>Min messages before PPV</div><div style={{ color: C.t1, fontSize: 20, fontWeight: 700, marginTop: 4 }}>5</div></div>
          <div><div style={{ color: C.t2, fontSize: 13 }}>Min hours between offers</div><div style={{ color: C.t1, fontSize: 20, fontWeight: 700, marginTop: 4 }}>4h</div></div>
          <div><div style={{ color: C.t2, fontSize: 13, marginBottom: 8 }}>Dynamic Pricing Tiers</div>
            {[['whale', '1.8-2.2x'], ['high', '1.4-1.7x'], ['mid', '0.9-1.2x'], ['low', '0.7-0.9x'], ['new', '0.5-0.7x']].map(([t, r]) => (
              <div key={t} style={{ ...s.row, marginBottom: 5 }}><Badge color={tierColor[t]}>{t}</Badge><span style={{ color: C.t3, fontSize: 12 }}>{r} base price</span></div>
            ))}
          </div>
        </div>
      </div>
      <div style={s.card}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18 }}>✉️ Auto Messages</h3>
        <div style={{ ...s.col, gap: 14 }}>
          <div><div style={{ color: C.t2, fontSize: 13, marginBottom: 6 }}>Welcome Message</div>
            <div style={{ padding: 10, borderRadius: 8, background: C.bg, color: C.t2, fontSize: 13, lineHeight: 1.5 }}>Hey babe! 💕 So happy you're here! I've been waiting for someone like you...</div>
          </div>
          <div><div style={{ color: C.t2, fontSize: 13, marginBottom: 6 }}>Offline Message</div>
            <div style={{ padding: 10, borderRadius: 8, background: C.bg, color: C.t2, fontSize: 13, lineHeight: 1.5 }}>Sorry babe, I'm sleeping rn 😴 I'll message you first thing in the morning! 💋</div>
          </div>
        </div>
      </div>
      <div style={s.card}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18 }}>🛡️ Safety & Escalation</h3>
        <div style={{ ...s.row, gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          {['refund', 'underage', 'minor', 'meet in person', 'address', 'phone number'].map(kw => (
            <span key={kw} style={{ padding: '3px 9px', borderRadius: 6, background: `${C.accent}15`, color: C.accent, fontSize: 11, fontWeight: 500 }}>{kw}</span>
          ))}
        </div>
        <div style={{ padding: 12, borderRadius: 10, background: `${C.warning}0c`, border: `1px solid ${C.warning}30` }}>
          <div style={{ color: C.warning, fontSize: 13, fontWeight: 600, marginBottom: 3 }}>⚠️ Safety</div>
          <div style={{ color: C.t3, fontSize: 12, lineHeight: 1.5 }}>When triggered, bot pauses immediately and notifies you. No automated response until you review.</div>
        </div>
      </div>
    </div>
  </div>
)

const AnalyticsView = () => {
  const maxH = Math.max(...HOURLY)
  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>Analytics</h1>
      <p style={{ color: C.t3, fontSize: 14, marginBottom: 24 }}>Performance deep-dive</p>
      <div style={{ display: 'flex', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
        <StatCard label="Conversion Rate" value="34.2%" change={5.8} icon="🎯" />
        <StatCard label="Avg Message Value" value="$2.84" change={11.2} icon="💵" />
        <StatCard label="PPV Open Rate" value="67%" change={-3.1} icon="📬" />
        <StatCard label="Retention (30d)" value="78%" change={2.4} icon="🔄" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14, marginBottom: 20 }}>
        <div style={s.card}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18 }}>Hourly Activity</h3>
          <MiniBar data={HOURLY} max={maxH} h={180} />
          <div style={{ ...s.row, justifyContent: 'space-between', marginTop: 6 }}>
            {[0, 6, 12, 18, 23].map(h => <span key={h} style={{ color: C.t4, fontSize: 10 }}>{h}:00</span>)}
          </div>
        </div>
        <div style={s.card}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18 }}>Revenue Sources</h3>
          {[['Subscriptions', 45, C.primary], ['PPV Sales', 25, C.accent], ['Tips', 18, C.success], ['Messages', 12, C.warning]].map(([n, p, c]) => (
            <div key={n} style={{ marginBottom: 12 }}>
              <div style={{ ...s.row, justifyContent: 'space-between', marginBottom: 4 }}><span style={{ color: C.t3, fontSize: 12 }}>{n}</span><span style={{ color: C.t1, fontSize: 12, fontWeight: 600 }}>{p}%</span></div>
              <div style={{ height: 6, background: C.bg, borderRadius: 3, overflow: 'hidden' }}><div style={{ height: '100%', width: `${p}%`, background: c, borderRadius: 3 }} /></div>
            </div>
          ))}
        </div>
      </div>
      <div style={s.card}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18 }}>Bot Performance</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {[['12,483', 'Total Bot Msgs', 'This month'], ['847', 'Upsells', '34.2% rate'], ['23', 'Escalated', '0.18%'], ['14 msgs', 'Avg Conv', 'Per session'], ['4.7/5', 'Satisfaction', 'Retention']].map(([v, l, sub]) => (
            <div key={l} style={{ textAlign: 'center', padding: 14, background: C.bg, borderRadius: 12 }}>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{v}</div><div style={{ color: C.t3, fontSize: 12, marginTop: 3 }}>{l}</div><div style={{ color: C.t4, fontSize: 11 }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const UpsellView = () => (
  <div className="fade-in">
    <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>Upsell Engine</h1>
    <p style={{ color: C.t3, fontSize: 14, marginBottom: 24 }}>Monetization intelligence</p>
    <div style={{ display: 'flex', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
      <StatCard label="Upsell Revenue (24h)" value="$1,245" change={18.3} icon="💰" />
      <StatCard label="Conversion Rate" value="34.2%" change={5.8} icon="🎯" />
      <StatCard label="Avg PPV Price" value="$22.50" change={8.1} icon="📸" />
      <StatCard label="Content Library" value="148" icon="📁" />
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
      <div style={s.card}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Recent Upsells</h3>
        {UPSELLS.map((u, i) => (
          <div key={i} style={{ ...s.row, padding: '10px 0', borderBottom: i < UPSELLS.length - 1 ? `1px solid ${C.border}20` : 'none' }}>
            <Avatar name={u.fan} color={statusColor[u.status]} size={30} />
            <div style={{ flex: 1 }}><div style={{ color: C.t1, fontSize: 13, fontWeight: 500 }}>{u.fan}</div><div style={{ color: C.t4, fontSize: 11 }}>{u.type} · {u.time} ago</div></div>
            <div style={{ textAlign: 'right' }}><div style={{ fontWeight: 600, fontSize: 14 }}>${u.amount}</div><Badge color={statusColor[u.status]}>{u.status}</Badge></div>
          </div>
        ))}
      </div>
      <div style={s.card}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>How It Works</h3>
        {[['1. Intent Detection', 'AI analyzes messages for buying signals, flirting, or interest.'],
          ['2. Timing Engine', 'Checks min messages, hours since last offer, fan sentiment.'],
          ['3. Content Matching', 'Semantic search finds most relevant PPV content.'],
          ['4. Dynamic Pricing', 'Price from fan tier (0.5x–2.2x), engagement, rejection rate.'],
          ['5. Natural Integration', 'AI weaves offer naturally into conversation. No spam.'],
        ].map(([t, d]) => (
          <div key={t} style={{ padding: 10, background: C.bg, borderRadius: 10, marginBottom: 8 }}>
            <div style={{ color: C.t1, fontSize: 13, fontWeight: 600 }}>{t}</div>
            <div style={{ color: C.t3, fontSize: 12, marginTop: 3, lineHeight: 1.4 }}>{d}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

const FlagsView = () => (
  <div className="fade-in">
    <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>Flags & Escalations</h1>
    <p style={{ color: C.t3, fontSize: 14, marginBottom: 24 }}>Conversations needing attention</p>
    <div style={s.card}>
      {FLAGS.length === 0
        ? <div style={{ textAlign: 'center', padding: 40 }}><div style={{ fontSize: 36, marginBottom: 8 }}>✅</div><div style={{ fontWeight: 600 }}>All clear!</div><div style={{ color: C.t4, fontSize: 13 }}>No active flags</div></div>
        : FLAGS.map((f, i) => (
          <div key={i} style={{ ...s.row, padding: 16, borderBottom: `1px solid ${C.border}30`, gap: 14 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: f.type === 'escalation' ? C.accent : C.warning }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: 14 }}>Fan: {f.fan}</div>
              <div style={{ color: C.t3, fontSize: 13 }}>{f.reason}</div>
              <div style={{ color: C.t4, fontSize: 11, marginTop: 3 }}>{f.time}</div>
            </div>
            <Badge color={f.type === 'escalation' ? C.accent : C.warning}>{f.type}</Badge>
            <button style={{ ...s.btn(C.success), fontSize: 12 }}>Review</button>
          </div>
        ))
      }
    </div>
  </div>
)

// ══════════════════════════════════════════════
// APP
// ══════════════════════════════════════════════

export default function App() {
  const [tab, setTab] = useState('dashboard')
  const [models, setModels] = useState(MODELS)
  const [selModel, setSelModel] = useState(0)
  const model = models[selModel]

  const views = {
    dashboard: <DashboardView models={models} />,
    conversations: <ConversationsView model={model} />,
    models: <ModelsView models={models} setModels={setModels} />,
    bot: <BotView model={model} />,
    analytics: <AnalyticsView />,
    upsell: <UpsellView />,
    flags: <FlagsView />,
  }

  return (
    <>
      <GlobalStyle />
      <Sidebar tab={tab} setTab={setTab} models={models} selModel={selModel} setSelModel={setSelModel} />
      <main style={{ marginLeft: 250, padding: '24px 30px', minHeight: '100vh' }}>{views[tab] || views.dashboard}</main>
    </>
  )
}
