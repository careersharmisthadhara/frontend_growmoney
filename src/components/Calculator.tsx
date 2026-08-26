import { useState, useEffect, useRef } from 'react'

// ─────────────────────────────────────────────
// SIP FORMULA
// M = P × {[(1 + r)^n – 1] / r} × (1 + r)
// P = monthly amount
// r = monthly rate (annual rate / 12 / 100)
// n = total months (years × 12)
// ─────────────────────────────────────────────
function calculateSIP(monthly: number, rate: number, years: number) {
  const r = rate / 12 / 100
  const n = years * 12
  const maturity = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
  const invested = monthly * n
  const returns  = maturity - invested

  return {
    maturity:  Math.round(maturity),
    invested:  Math.round(invested),
    returns:   Math.round(returns),
  }
}

// ─────────────────────────────────────────────
// FORMAT NUMBER AS INDIAN RUPEE
// 1000000 → ₹10,00,000
// ─────────────────────────────────────────────
function formatINR(value: number): string {
  return '₹' + value.toLocaleString('en-IN')
}

// ─────────────────────────────────────────────
// YEAR BY YEAR DATA
// returns array of { year, maturity, invested }
// ─────────────────────────────────────────────
function getYearlyData(monthly: number, rate: number, years: number) {
  const data = []
  const step = Math.max(1, Math.floor(years / 5))

  for (let y = step; y <= years; y += step) {
    const result = calculateSIP(monthly, rate, y)
    data.push({
      year:     y,
      maturity: result.maturity,
      invested: result.invested,
    })
  }
  return data
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function Calculator() {

  // STATE — these values change when user moves sliders
  const [monthly, setMonthly] = useState(5000)
  const [rate,    setRate]    = useState(12)
  const [years,   setYears]   = useState(10)
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')

  // CALCULATED RESULTS
  const { maturity, invested, returns } = calculateSIP(monthly, rate, years)

  // YEARLY DATA for bar chart
  const yearlyData = getYearlyData(monthly, rate, years)

  // MAX VALUE for bar width calculation
  // const maxMaturity = yearlyData[yearlyData.length - 1]?.maturity || 1

  // CANVAS REF for donut chart
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // DRAW DONUT CHART whenever values change
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx    = canvas.getContext('2d')
    if (!ctx) return

    const W  = canvas.width
    const H  = canvas.height
    const cx = W / 2
    const cy = H / 2
    const R  = 55   // outer radius
    const ri = 34   // inner radius (hole)

    ctx.clearRect(0, 0, W, H)

    const total     = invested + returns
    const invAngle  = (invested / total) * Math.PI * 2
    const retAngle  = (returns  / total) * Math.PI * 2

    // Draw invested slice — sky blue
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + invAngle)
    ctx.closePath()
    ctx.fillStyle = '#4FC3F7'
    ctx.fill()

    // Draw returns slice — gold
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, R, -Math.PI / 2 + invAngle, -Math.PI / 2 + invAngle + retAngle)
    ctx.closePath()
    ctx.fillStyle = '#C9A84C'
    ctx.fill()

    // Draw centre hole — navy
    ctx.beginPath()
    ctx.arc(cx, cy, ri, 0, Math.PI * 2)
    ctx.fillStyle = '#0D1F3C'
    ctx.fill()

    // Draw percentage text in centre
    const pct = Math.round((returns / total) * 100)
    ctx.fillStyle    = '#F0D080'
    ctx.font         = 'bold 14px sans-serif'
    ctx.textAlign    = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(pct + '%', cx, cy - 6)

    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.font      = '10px sans-serif'
    ctx.fillText('gains', cx, cy + 10)

  }, [invested, returns])  // re-runs when values change

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <div style={{
      maxWidth:  '960px',
      margin:    '-2rem auto 0',
      padding:   '0 1rem 3rem',
      position:  'relative',
      zIndex:    1,
    }}>
      <div style={{
        display:             'grid',
        gridTemplateColumns: '1fr 1fr',
        gap:                 '1.25rem',
      }}>

        {/* ── LEFT PANEL — Inputs ── */}
        <div style={{
          background:   '#FFFFFF',
          borderRadius: '16px',
          padding:      '1.5rem',
          border:       '1px solid #E5DFD3',
        }}>

          {/* Panel heading */}
          <div style={{
            display:      'flex',
            alignItems:   'center',
            gap:          '10px',
            marginBottom: '1.5rem',
            paddingBottom:'1rem',
            borderBottom: '1px solid #F0EBE0',
          }}>
            <div style={{
              width: '34px', height: '34px',
              background: '#FFF6E0', borderRadius: '8px',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
            }}>💰</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#0D1F3C' }}>
                Investment details
              </div>
              <div style={{ fontSize: '11px', color: '#9E8E70' }}>
                Move sliders to update results instantly
              </div>
            </div>
          </div>

          {/* SLIDER 1 — Monthly Amount */}
          <SliderField
            label="Monthly investment"
            value={monthly}
            min={500}
            max={100000}
            step={500}
            prefix="₹"
            display={formatINR(monthly)}
            onChange={setMonthly}
          />

          {/* SLIDER 2 — Return Rate */}
          <SliderField
            label="Expected annual return"
            value={rate}
            min={1}
            max={30}
            step={0.5}
            suffix="% per year"
            display={rate + '%'}
            onChange={setRate}
          />

          {/* SLIDER 3 — Duration */}
          <SliderField
            label="Investment duration"
            value={years}
            min={1}
            max={40}
            step={1}
            suffix="years"
            display={years + (years === 1 ? ' year' : ' years')}
            onChange={setYears}
          />

          {/* Divider */}
          <div style={{ height: '1px', background: '#F0EBE0', margin: '1.25rem 0' }} />

          {/* Optional fields */}
          <div style={{
            fontSize: '11px', fontWeight: 600,
            color: '#9E8E70', letterSpacing: '0.06em',
            textTransform: 'uppercase', marginBottom: '10px',
          }}>
            Your details — optional
          </div>

          <div style={{ display: 'grid', gap: '8px' }}>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              style={inputStyle}
            />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ fontSize: '11px', color: '#B8A88A', marginTop: '6px' }}>
            We save your calculation securely. No spam, ever.
          </div>

          {/* Calculate button */}
          <button
            onClick={() => alert('Coming soon — API integration next!')}
            style={{
              width:        '100%',
              padding:      '13px',
              borderRadius: '10px',
              border:       'none',
              background:   '#0D1F3C',
              color:        '#C9A84C',
              fontSize:     '14px',
              fontWeight:   700,
              cursor:       'pointer',
              marginTop:    '1.25rem',
              fontFamily:   'inherit',
              letterSpacing:'0.2px',
            }}
          >
            Calculate my returns
          </button>

        </div>

        {/* ── RIGHT PANEL — Results ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Dark results card */}
          <div style={{
            background:   '#0D1F3C',
            borderRadius: '16px',
            padding:      '1.5rem',
          }}>

            <div style={{
              fontSize: '11px', fontWeight: 600,
              color: '#C9A84C', letterSpacing: '0.07em',
              textTransform: 'uppercase', marginBottom: '1rem',
            }}>
              Your SIP projection
            </div>

            {/* 3 result cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '8px',
              marginBottom: '1.25rem',
            }}>
              <ResultCard label="Invested"  value={formatINR(invested)}  color="#4FC3F7" />
              <ResultCard label="Returns"   value={formatINR(returns)}   color="#81C784" />
              <ResultCard label="Maturity"  value={formatINR(maturity)}  color="#F0D080" />
            </div>

            {/* Donut + Stats */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>

              {/* Donut chart */}
              <canvas
                ref={canvasRef}
                width={120}
                height={120}
                style={{ flexShrink: 0 }}
              />

              {/* Stats beside donut */}
              <div style={{ flex: 1 }}>
                <StatRow dot="#4FC3F7" label="Amount invested" value={formatINR(invested)} />
                <StatRow dot="#C9A84C" label="Wealth gained"   value={formatINR(returns)}  />
                <StatRow
                  dot="#F0D080"
                  label="Return ratio"
                  value={Math.round((returns / maturity) * 100) + '% growth'}
                  last
                />
              </div>

            </div>
          </div>

          {/* Year-by-year bar chart card */}
          <div style={{
            background:   '#FFFFFF',
            borderRadius: '16px',
            padding:      '1.25rem',
            border:       '1px solid #E5DFD3',
          }}>

            {/* Bar chart header */}
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
            }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0D1F3C' }}>
                📈 Year-by-year growth
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <LegendDot color="#1A3A6B" label="Invested" />
                <LegendDot color="#C9A84C" label="Returns"  />
              </div>
            </div>

            {/* Bars */}
            {yearlyData.map(row => {
              const investedPct = (row.invested  / row.maturity) * 100
              const returnsPct  = (row.maturity - row.invested) / row.maturity * 100

              return (
                <div key={row.year} style={{
                  display:     'flex',
                  alignItems:  'center',
                  gap:         '8px',
                  marginBottom:'6px',
                  fontSize:    '11px',
                }}>
                  {/* Year label */}
                  <span style={{
                    width: '36px', textAlign: 'right',
                    color: '#9E8E70', flexShrink: 0,
                  }}>
                    Yr {row.year}
                  </span>

                  {/* Bar track */}
                  <div style={{
                    flex: 1, height: '10px',
                    background: '#F5F3EE',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    display: 'flex',
                  }}>
                    <div style={{
                      width: investedPct + '%',
                      background: '#1A3A6B',
                      height: '100%',
                    }} />
                    <div style={{
                      width: returnsPct + '%',
                      background: '#C9A84C',
                      height: '100%',
                    }} />
                  </div>

                  {/* Amount */}
                  <span style={{
                    width: '80px', textAlign: 'right',
                    fontWeight: 600, color: '#0D1F3C',
                    flexShrink: 0,
                  }}>
                    {formatINR(row.maturity)}
                  </span>
                </div>
              )
            })}

          </div>
        </div>

      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// SMALL REUSABLE COMPONENTS
// These are used inside Calculator only
// ─────────────────────────────────────────────

// Slider field — label + slider + number input
function SliderField({
  label, value, min, max, step,
  prefix, suffix, display, onChange
}: {
  label:    string
  value:    number
  min:      number
  max:      number
  step:     number
  prefix?:  string
  suffix?:  string
  display:  string
  onChange: (val: number) => void
}) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>

      {/* Label + current value */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '8px',
      }}>
        <span style={{ fontSize: '12px', fontWeight: 500, color: '#5C4E38' }}>
          {label}
        </span>
        <span style={{
          fontSize: '13px', fontWeight: 700, color: '#8B6914',
          background: '#FFF6E0', border: '1px solid #E8D8A0',
          padding: '3px 11px', borderRadius: '20px',
        }}>
          {display}
        </span>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: '#C9A84C', cursor: 'pointer' }}
      />

      {/* Number input */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
        {prefix && (
          <span style={{
            fontSize: '13px', color: '#9E8E70',
            background: '#F8F4ED', border: '1px solid #E5DFD3',
            borderRadius: '6px', padding: '5px 9px', fontWeight: 500,
          }}>{prefix}</span>
        )}
        <input
          type="number"
          min={min} max={max} step={step}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value) || min)}
          style={{
            fontSize: '13px', padding: '5px 9px',
            border: '1px solid #E5DFD3', borderRadius: '6px',
            background: '#fff', color: '#0D1F3C',
            width: '92px', textAlign: 'right',
            fontFamily: 'inherit',
          }}
        />
        {suffix && (
          <span style={{ fontSize: '12px', color: '#9E8E70' }}>{suffix}</span>
        )}
      </div>

    </div>
  )
}

// Single result card — label + colored value
function ResultCard({
  label, value, color
}: {
  label: string
  value: string
  color: string
}) {
  return (
    <div style={{
      background:   'rgba(255,255,255,0.07)',
      borderRadius: '10px',
      padding:      '10px 12px',
      border:       '1px solid rgba(201,168,76,0.15)',
    }}>
      <div style={{
        fontSize: '10px', color: 'rgba(255,255,255,0.5)',
        textTransform: 'uppercase', letterSpacing: '0.05em',
        marginBottom: '5px',
      }}>{label}</div>
      <div style={{ fontSize: '13px', fontWeight: 700, color }}>{value}</div>
    </div>
  )
}

// Stat row beside the donut chart
function StatRow({
  dot, label, value, last
}: {
  dot:   string
  label: string
  value: string
  last?: boolean
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      gap: '8px', marginBottom: last ? 0 : '10px',
    }}>
      <div style={{
        width: '10px', height: '10px',
        borderRadius: '50%', background: dot, flexShrink: 0,
      }} />
      <div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>{label}</div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>{value}</div>
      </div>
    </div>
  )
}

// Legend dot for bar chart
function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <div style={{
        width: '8px', height: '8px',
        borderRadius: '2px', background: color,
      }} />
      <span style={{ fontSize: '10px', color: '#9E8E70' }}>{label}</span>
    </div>
  )
}

// Shared input style
const inputStyle: React.CSSProperties = {
  width:        '100%',
  fontSize:     '13px',
  padding:      '8px 12px',
  border:       '1px solid #E5DFD3',
  borderRadius: '8px',
  color:        '#0D1F3C',
  background:   '#fff',
  fontFamily:   'inherit',
  outline:      'none',
}