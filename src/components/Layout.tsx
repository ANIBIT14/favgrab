import { Link, useRoute } from '@/lib/router'

const SOCIALS = [
  { label: 'Twitter', href: 'https://x.com/vanikyaai', icon: '𝕏' },
  { label: 'YouTube', href: 'https://www.youtube.com/@Vanikya', icon: '▶' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/vanikya-ai', icon: 'in' },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const path = useRoute()
  return (
    <>
      <div className="grid-bg" aria-hidden="true" />

      <header className="header">
        <Link to="/" className="logo">
          <svg className="logo-mark" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <polygon points="12,2 22,12 12,22 2,12" fill="hsl(38,96%,54%)" stroke="hsl(240,10%,8%)" strokeWidth="1.5" strokeLinejoin="round"/>
            <polygon points="12,7 17,12 12,17 7,12" fill="none" stroke="hsl(240,10%,8%)" strokeWidth="1.5" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="2" fill="hsl(240,10%,8%)"/>
          </svg>
          <span className="logo-name">FavGrab</span>
        </Link>

        <nav className="header-nav">
          <Link to="/" className={`nav-link${path === '/' ? ' active' : ''}`}>Favicon</Link>
          <Link to="/convert" className={`nav-link${path === '/convert' ? ' active' : ''}`}>Image Converter</Link>
        </nav>

        <div className="header-actions">
          <a
            href="https://github.com/ANIBIT14/favgrab"
            className="star-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="star-icon">★</span>
            Star
          </a>
          <a
            href="https://github.com/ANIBIT14/favgrab"
            className="header-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            github ↗
          </a>
        </div>
      </header>

      {children}

      <footer className="footer">
        <div className="footer-top">
          <a
            href="https://vanikya.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-vanikya"
          >
            vanikya.ai
          </a>
          <div className="footer-socials">
            {SOCIALS.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label={s.label}
                title={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          Free &amp; open source ·{' '}
          <a
            href="https://boldkit.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-boldkit"
          >
            UI by BoldKit
          </a>
        </div>
      </footer>
    </>
  )
}
