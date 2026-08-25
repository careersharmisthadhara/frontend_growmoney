export default function Footer() {
  return (
    <footer style={{
      background: '#0D1F3C',
      borderTop: '1px solid rgba(201,168,76,0.25)',
      padding: '1.25rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '8px',
      marginTop: '2rem',
    }}>
      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
        © 2026{' '}
        <span style={{ color: '#C9A84C', fontWeight: 600 }}>GrowMoney</span>
        {' '}· All rights reserved
      </span>

      <div style={{ display: 'flex', gap: '16px' }}>
        {['Privacy', 'Terms', 'Disclaimer', 'Contact'].map(link => (
          <a key={link} href="#" style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.45)',
            textDecoration: 'none',
          }}>{link}</a>
        ))}
      </div>
    </footer>
  )
}