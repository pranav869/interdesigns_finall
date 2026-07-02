'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import type { ImageCaption } from '@/lib/projects'

interface Props {
  images: string[]         // full URLs
  filenames: string[]      // original filenames matching images[]
  captions?: Record<string, ImageCaption>
  altPrefix?: string
}

export default function GalleryLightbox({ images, filenames, captions = {}, altPrefix = 'Project image' }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [loaded, setLoaded] = useState<Record<number, boolean>>({})
  const imgRefs = useRef<(HTMLImageElement | null)[]>([])

  const close = useCallback(() => setLightboxIndex(null), [])
  const prev = useCallback(() => setLightboxIndex(i => i !== null ? (i - 1 + images.length) % images.length : null), [images.length])
  const next = useCallback(() => setLightboxIndex(i => i !== null ? (i + 1) % images.length : null), [images.length])

  useEffect(() => {
    // Check for already-cached images on mount
    imgRefs.current.forEach((img, i) => {
      if (img?.complete) setLoaded(prev => ({ ...prev, [i]: true }))
    })
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIndex, close, prev, next])

  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxIndex])

  return (
    <>
      {/* Masonry grid */}
      <div
        style={{
          columns: 'clamp(320px, 33%, 500px)',
          gap: '16px',
        }}
      >
        {images.map((url, i) => {
          const filename = filenames[i] ?? ''
          const caption = captions[filename]
          return (
          <div key={i} style={{ breakInside: 'avoid', marginBottom: '16px' }}>
            {/* Caption block above image */}
            {caption && (
              <div style={{ marginBottom: '14px', padding: '16px 20px', background: 'linear-gradient(135deg, rgba(199,168,109,0.08) 0%, rgba(199,168,109,0.03) 100%)', borderRadius: '4px', borderLeft: '3px solid rgba(199,168,109,0.4)' }}>
                {caption.heading && (
                  <p style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                    fontWeight: 500,
                    color: '#f5f0e8',
                    marginBottom: '14px',
                    letterSpacing: '0.08em',
                    textShadow: '0 0 30px rgba(199,168,109,0.15)',
                  }}>{caption.heading}</p>
                )}
                {caption.text && caption.text.split('\n\n').map((para, pi) => (
                  <p key={pi} style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.88rem',
                    lineHeight: 1.85,
                    color: 'rgba(245,240,232,0.72)',
                    marginBottom: pi < caption.text!.split('\n\n').length - 1 ? '12px' : 0,
                    letterSpacing: '0.02em',
                  }}>{para}</p>
                ))}
              </div>
            )}
            <div
            onClick={() => setLightboxIndex(i)}
            style={{
              overflow: 'hidden',
              cursor: 'pointer',
              position: 'relative',
              background: '#0f1115',
              borderRadius: '2px',
            }}
            className="group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={el => { imgRefs.current[i] = el }}
              src={url}
              alt={`${altPrefix} ${i + 1}`}
              loading="lazy"
              onLoad={() => setLoaded(prev => ({ ...prev, [i]: true }))}
              style={{
                width: '100%',
                display: 'block',
                transition: 'transform 0.5s ease',
              }}
              className="group-hover:scale-[1.03] transition-transform duration-500"
            />
            {/* Skeleton overlay — fades out once image loads */}
            {!loaded[i] && (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(110deg,#1a1f2e 30%,#242b3d 50%,#1a1f2e 70%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.6s infinite',
                transition: 'opacity 0.4s ease',
              }} />
            )}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(10,11,14,0.35)',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              className="group-hover:opacity-100"
            >
              <span style={{ color: '#fff', fontSize: '1.5rem', lineHeight: 1 }}>⤢</span>
            </div>
          </div>
          </div>
        )})}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          onClick={close}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(5,5,8,0.96)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Close */}
          <button
            onClick={close}
            style={{
              position: 'absolute',
              top: 24,
              right: 28,
              background: 'none',
              border: 'none',
              color: '#f5f0e8',
              fontSize: '1.8rem',
              cursor: 'pointer',
              zIndex: 10,
            }}
          >✕</button>

          {/* Prev */}
          <button
            onClick={e => { e.stopPropagation(); prev() }}
            style={{
              position: 'absolute',
              left: 24,
              background: 'rgba(199,168,109,0.12)',
              border: '1px solid rgba(199,168,109,0.25)',
              borderRadius: '50%',
              width: 48,
              height: 48,
              color: '#c7a86d',
              fontSize: '1.2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >←</button>

          {/* Image */}
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '90vh' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[lightboxIndex]}
              alt={`${altPrefix} ${lightboxIndex + 1}`}
              style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: '2px' }}
            />
            <p style={{
              textAlign: 'center',
              marginTop: 12,
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(199,168,109,0.5)',
            }}>
              {lightboxIndex + 1} / {images.length}
            </p>
          </div>

          {/* Next */}
          <button
            onClick={e => { e.stopPropagation(); next() }}
            style={{
              position: 'absolute',
              right: 24,
              background: 'rgba(199,168,109,0.12)',
              border: '1px solid rgba(199,168,109,0.25)',
              borderRadius: '50%',
              width: 48,
              height: 48,
              color: '#c7a86d',
              fontSize: '1.2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >→</button>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </>
  )
}
