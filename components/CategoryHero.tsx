import Link from 'next/link'

const SUBTITLES: Record<string, string> = {
  Residential: 'Homes crafted to reflect the lives lived within them — intimate, considered, enduring.',
  Commercial: 'Spaces that articulate brand identity through material, light, and spatial intelligence.',
  Retail: 'Retail environments designed to attract, immerse, and convert through curated atmosphere.',
  'Modular Kitchen': 'Precision-engineered kitchens where functionality meets refined aesthetic.',
}

interface Props {
  title: string
  categoryLabel: string
  count: number
}

export default function CategoryHero({ title, categoryLabel, count }: Props) {
  const subtitle = SUBTITLES[categoryLabel] ?? ''

  return (
    <section
      className="relative flex flex-col justify-end"
      style={{
        minHeight: '52vh',
        background: 'linear-gradient(180deg, #0a0b0e 0%, #0f1115 60%, #13181f 100%)',
        padding: '0 6%',
        paddingTop: '120px',
        paddingBottom: '64px',
        borderBottom: '1px solid rgba(199,168,109,0.12)',
      }}
    >
      {/* Gold line top */}
      <div style={{ position: 'absolute', top: 0, left: '6%', right: '6%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(199,168,109,0.35), transparent)' }} />

      <div style={{ maxWidth: '900px' }}>
        {/* Breadcrumb */}
        <div
          className="flex items-center gap-3 mb-6"
          style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.68rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(199,168,109,0.6)' }}
        >
          <Link href="/#portfolio" style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-yellow-400 transition-colors">
            Portfolio
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
          <span>{categoryLabel}</span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
            fontWeight: 400,
            lineHeight: 1.08,
            color: 'var(--white)',
            marginBottom: '28px',
          }}
        >
          {title.split(' ').map((word, i, arr) =>
            i === arr.length - 1 ? (
              <em key={i} style={{ color: 'var(--gold)', fontStyle: 'italic' }}>{word}</em>
            ) : (
              <span key={i}>{word} </span>
            )
          )}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              fontWeight: 300,
              lineHeight: 1.7,
              color: 'rgba(245,240,232,0.55)',
              maxWidth: '580px',
              marginBottom: '20px',
            }}
          >
            {subtitle}
          </p>
        )}

        {/* Count */}
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.62rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(199,168,109,0.45)',
          }}
        >
          {count} {count === 1 ? 'Project' : 'Projects'}
        </p>
      </div>
    </section>
  )
}
