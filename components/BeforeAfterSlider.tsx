'use client'
import { useState, useRef, useCallback, useEffect } from 'react'

interface Pair {
  beforeUrl: string
  afterUrl: string
  label?: string
}

interface Props {
  pairs: Pair[]
}

function SingleSlider({ beforeUrl, afterUrl, label }: Pair) {
  const [position, setPosition] = useState(50)
  const [dragging, setDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    setPosition((x / rect.width) * 100)
  }, [])

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setDragging(true)
    updatePosition(e.clientX)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    setDragging(true)
    updatePosition(e.touches[0].clientX)
  }

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => { if (dragging) updatePosition(e.clientX) }
    const onMouseUp = () => setDragging(false)
    const onTouchMove = (e: TouchEvent) => { if (dragging) updatePosition(e.touches[0].clientX) }
    const onTouchEnd = () => setDragging(false)

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('touchmove', onTouchMove)
    window.addEventListener('touchend', onTouchEnd)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [dragging, updatePosition])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {label && (
        <p style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '1.1rem',
          color: '#c7a86d',
          letterSpacing: '0.08em',
          textAlign: 'center',
        }}>{label}</p>
      )}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4/3',
          overflow: 'hidden',
          borderRadius: '4px',
          cursor: dragging ? 'grabbing' : 'col-resize',
          userSelect: 'none',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* BEFORE — full width background */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeUrl}
          alt="Before"
          draggable={false}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* AFTER — clipped to right portion */}
        <div style={{
          position: 'absolute',
          inset: 0,
          clipPath: `inset(0 0 0 ${position}%)`,
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={afterUrl}
            alt="After"
            draggable={false}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>

        {/* Divider line */}
        <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${position}%`,
          transform: 'translateX(-50%)',
          width: 2,
          background: 'rgba(199,168,109,0.9)',
          pointerEvents: 'none',
        }} />

        {/* Handle */}
        <div
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          style={{
            position: 'absolute',
            top: '50%',
            left: `${position}%`,
            transform: 'translate(-50%, -50%)',
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'rgba(15,15,20,0.85)',
            border: '2px solid rgba(199,168,109,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'grab',
            zIndex: 10,
            boxShadow: '0 2px 16px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <span style={{ color: '#c7a86d', fontSize: '0.9rem', letterSpacing: '-2px', fontWeight: 700 }}>‹ ›</span>
        </div>

        {/* BEFORE label */}
        <div style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          background: 'rgba(10,11,14,0.75)',
          border: '1px solid rgba(199,168,109,0.25)',
          borderRadius: 2,
          padding: '4px 10px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.55rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: '#f5f0e8',
          backdropFilter: 'blur(4px)',
        }}>BEFORE</div>

        {/* AFTER label */}
        <div style={{
          position: 'absolute',
          bottom: 12,
          right: 12,
          background: 'rgba(10,11,14,0.75)',
          border: '1px solid rgba(199,168,109,0.4)',
          borderRadius: 2,
          padding: '4px 10px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.55rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: '#c7a86d',
          backdropFilter: 'blur(4px)',
        }}>AFTER</div>
      </div>
    </div>
  )
}

export default function BeforeAfterSlider({ pairs }: Props) {
  return (
    <section style={{ padding: '72px 6% 80px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Section header */}
      <p style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '0.6rem',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        color: '#c7a86d',
        marginBottom: 8,
        textAlign: 'center',
      }}>TRANSFORMATIONS</p>
      <h2 style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: 'clamp(2rem, 5vw, 3.2rem)',
        fontWeight: 400,
        color: '#f5f0e8',
        textAlign: 'center',
        marginBottom: 12,
        lineHeight: 1.15,
      }}>
        Before &amp; <em style={{ color: '#c7a86d', fontStyle: 'italic' }}>After</em>
      </h2>
      <div style={{
        width: 48,
        height: 2,
        background: 'linear-gradient(90deg, transparent, #c7a86d, transparent)',
        margin: '0 auto 16px',
      }} />
      <p style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '0.78rem',
        color: 'rgba(245,240,232,0.4)',
        textAlign: 'center',
        marginBottom: 52,
        letterSpacing: '0.05em',
      }}>Drag the slider to reveal the transformation</p>

      {/* Grid of sliders */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: pairs.length === 1 ? '1fr' : 'repeat(auto-fit, minmax(380px, 1fr))',
        gap: '32px',
      }}>
        {pairs.map((pair, i) => (
          <SingleSlider key={i} {...pair} />
        ))}
      </div>
    </section>
  )
}
