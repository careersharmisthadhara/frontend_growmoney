export default function Navbar() {
  return (
    <nav style={{
      background: '#0D1F3C',
      borderBottom: '2.5px solid #C9A84C',
      height: '64px',
      padding: '0 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>

      {/* Logo + Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '40px', height: '40px',
          background: '#C9A84C',
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '21px', fontWeight: 800, color: '#0D1F3C',
        }}>G</div>
        <div>
          <div style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF' }}>
            GrowMoney
          </div>
          <div style={{
            fontSize: '10px', color: '#C9A84C',
            textTransform: 'uppercase', letterSpacing: '0.5px'
          }}>
            Smart Investment Tools
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {['Calculators', 'About'].map(link => (
          <button key={link} style={{
            fontSize: '14px', fontWeight: 600,
            color: '#FFFFFF',
            padding: '7px 16px',
            borderRadius: '6px',
            border: '1.5px solid rgba(255,255,255,0.25)',
            background: 'rgba(255,255,255,0.08)',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}>{link}</button>
        ))}
      </div>

      {/* Sign up */}
      <button style={{
        fontSize: '14px', fontWeight: 700,
        color: '#0D1F3C', background: '#C9A84C',
        border: 'none', borderRadius: '8px',
        padding: '9px 22px', cursor: 'pointer',
        fontFamily: 'inherit',
      }}>Sign up</button>

    </nav>
  )
}