export default function Hero() {
  return (
    <div style={{
      background: '#0D1F3C',
      padding: '2.5rem 1.5rem 3.5rem',
      textAlign: 'center',
    }}>
      <h1 style={{
        fontSize: '32px', fontWeight: 700,
        color: '#FFFFFF', marginBottom: '10px', lineHeight: 1.3,
      }}>
        Grow your wealth with{' '}
        <span style={{ color: '#C9A84C' }}>smart SIP planning</span>
      </h1>

      <p style={{
        fontSize: '15px',
        color: 'rgba(255,255,255,0.6)',
        marginBottom: '1.5rem',
      }}>
        Calculate how your monthly investments compound into real wealth
      </p>

      <div style={{
        display: 'flex', gap: '8px',
        justifyContent: 'center', flexWrap: 'wrap'
      }}>
        {['Free to use', 'No login needed', 'Instant results'].map(pill => (
          <span key={pill} style={{
            fontSize: '12px', padding: '5px 16px',
            borderRadius: '20px',
            border: '1px solid rgba(201,168,76,0.4)',
            color: '#C9A84C',
            background: 'rgba(201,168,76,0.08)',
          }}>{pill}</span>
        ))}
      </div>
    </div>
  )
}