'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function ProjectsNav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: '18px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '92%',
          maxWidth: '1400px',
          height: '56px',
          borderRadius: '999px',
          background: scrolled
            ? 'linear-gradient(180deg,rgba(22,28,45,0.92),rgba(14,18,30,0.88))'
            : 'linear-gradient(180deg,rgba(33,41,62,0.72),rgba(18,23,38,0.65))',
          backdropFilter: 'blur(28px) saturate(150%)',
          WebkitBackdropFilter: 'blur(28px) saturate(150%)',
          border: '1px solid rgba(255,255,255,0.09)',
          boxShadow: '0 18px 50px rgba(0,0,0,0.22)',
          zIndex: 1000,
          padding: '0 16px 0 34px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'background 0.4s ease',
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.1rem',
            fontWeight: 500,
            letterSpacing: '0.24em',
            color: '#f5f0e8',
            textTransform: 'uppercase',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          INTER <em style={{ color: '#c7a86d', fontStyle: 'normal', fontWeight: 400 }}>DESIGNS</em>
        </Link>

        {/* Desktop links */}
        <ul
          style={{
            display: 'flex',
            gap: '40px',
            listStyle: 'none',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
          className="hidden md:flex"
        >
          {[
            { label: 'Home', href: '/' },
            { label: 'Residential', href: '/projects/residential' },
            { label: 'Commercial', href: '/projects/commercial' },
            { label: 'Retail', href: '/projects/retail' },
            { label: 'Kitchens', href: '/projects/modular-kitchen' },
          ].map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '11px',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.74)',
                  fontWeight: 400,
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                }}
                className="hover:text-yellow-400"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/#contact"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#c7a86d',
            border: '1px solid rgba(199,168,109,0.45)',
            borderRadius: '999px',
            padding: '10px 22px',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap',
          }}
          className="hidden md:inline-flex hover:bg-yellow-400 hover:text-black transition-all"
        >
          Enquire →
        </Link>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden ml-3"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
          aria-label="Menu"
        >
          <div style={{ width: 22, height: 2, background: '#f5f0e8', marginBottom: 5, transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translate(5px,5px)' : 'none' }} />
          <div style={{ width: 22, height: 2, background: '#f5f0e8', marginBottom: 5, opacity: menuOpen ? 0 : 1, transition: 'opacity 0.3s' }} />
          <div style={{ width: 22, height: 2, background: '#f5f0e8', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(10,11,14,0.97)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '36px',
          }}
        >
          <button
            onClick={() => setMenuOpen(false)}
            style={{ position: 'absolute', top: 28, right: 28, background: 'none', border: 'none', color: '#f5f0e8', fontSize: '1.5rem', cursor: 'pointer' }}
          >✕</button>
          {[
            { label: 'Home', href: '/' },
            { label: 'Residential', href: '/projects/residential' },
            { label: 'Commercial', href: '/projects/commercial' },
            { label: 'Retail', href: '/projects/retail' },
            { label: 'Modular Kitchen', href: '/projects/modular-kitchen' },
            { label: 'Enquire', href: '/#contact' },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '2rem',
                fontWeight: 400,
                color: '#f5f0e8',
                textDecoration: 'none',
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
