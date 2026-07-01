import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  getProjectBySlug,
  getProjectsByCategory,
  getAllSlugs,
  type Category,
} from '@/lib/projects'
import GalleryLightbox from '@/components/GalleryLightbox'
import ProjectsNav from '@/components/ProjectsNav'

const VALID_CATEGORIES: Category[] = ['residential', 'commercial', 'retail', 'modular-kitchen']

export async function generateStaticParams() {
  return getAllSlugs().map(({ category, slug }) => ({ category, slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ category: string; slug: string }> }
): Promise<Metadata> {
  const { category, slug } = await params
  if (!VALID_CATEGORIES.includes(category as Category)) return {}
  const project = getProjectBySlug(category as Category, slug)
  if (!project) return {}

  const title = `${project.title} | ${project.categoryLabel} | Inter Designs`
  const description = project.description
    ? project.description.slice(0, 160)
    : `${project.title} — a luxury interior design project by Inter Designs, Chennai.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: project.thumbnail
        ? [`${project.publicImageBase}/${encodeURIComponent(project.thumbnail)}`]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function ProjectPage(
  { params }: { params: Promise<{ category: string; slug: string }> }
) {
  const { category, slug } = await params
  if (!VALID_CATEGORIES.includes(category as Category)) notFound()

  const cat = category as Category
  const project = getProjectBySlug(cat, slug)
  if (!project) notFound()

  // All projects in category for prev/next
  const categoryProjects = getProjectsByCategory(cat)
  const currentIndex = categoryProjects.findIndex(p => p.slug === slug)
  const prevProject = currentIndex > 0 ? categoryProjects[currentIndex - 1] : null
  const nextProject = currentIndex < categoryProjects.length - 1 ? categoryProjects[currentIndex + 1] : null

  // All images already exclude reference files — hero = first, gallery = all
  const allImageUrls = project.images.map(
    filename => `${project.publicImageBase}/${encodeURIComponent(filename)}`
  )
  const heroUrl = allImageUrls[0] ?? ''
  const galleryImages = project.images
  const imageUrls = allImageUrls

  const locationDisplay = project.location
    ? project.location.charAt(0).toUpperCase() + project.location.slice(1)
    : ''

  return (
    <>
      <ProjectsNav />
      <main style={{ minHeight: '100vh', background: 'var(--ink)' }}>

        {/* Hero */}
        <section
          style={{
            position: 'relative',
            height: '85vh',
            minHeight: 480,
            overflow: 'hidden',
            background: '#0a0b0e',
          }}
        >
          {heroUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroUrl}
              alt={project.title}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.55)',
              }}
            />
          )}
          {/* Gradient overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(10,11,14,0.95) 0%, rgba(10,11,14,0.3) 50%, transparent 100%)',
          }} />

          {/* Content */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '0 6% 60px',
            maxWidth: '1400px',
            margin: '0 auto',
          }}>
            {/* Breadcrumb */}
            <div style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.62rem',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(199,168,109,0.6)',
              marginBottom: '20px',
              display: 'flex',
              gap: 12,
              alignItems: 'center',
            }}>
              <Link href="/#portfolio" style={{ color: 'inherit', textDecoration: 'none' }}>Portfolio</Link>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
              <Link href={`/projects/${cat}`} style={{ color: 'inherit', textDecoration: 'none' }}>{project.categoryLabel}</Link>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
              <span style={{ color: 'rgba(245,240,232,0.55)' }}>{project.title}</span>
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2.4rem, 6vw, 4.8rem)',
              fontWeight: 400,
              lineHeight: 1.08,
              color: '#f5f0e8',
              marginBottom: '20px',
            }}>
              {project.title}
            </h1>

            <div style={{
              display: 'flex',
              gap: 24,
              flexWrap: 'wrap',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.65rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
            }}>
              {locationDisplay && (
                <span style={{ color: '#c7a86d' }}>📍 {locationDisplay}</span>
              )}
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>{project.categoryLabel}</span>
              {project.subcategory && (
                <span style={{ color: 'rgba(255,255,255,0.3)' }}>{project.subcategory}</span>
              )}
            </div>
          </div>
        </section>

        {/* Description */}
        {project.description && (
          <section style={{
            padding: '72px 6%',
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: '48px',
            borderBottom: '1px solid rgba(199,168,109,0.1)',
          }}>
            <div>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.6rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#c7a86d',
                marginBottom: 16,
              }}>About the Project</p>
              <p style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '0.85rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(245,240,232,0.4)',
                lineHeight: 1.8,
              }}>
                {project.categoryLabel}{project.subcategory ? ` · ${project.subcategory}` : ''}
                {locationDisplay ? `\n${locationDisplay}` : ''}
              </p>
            </div>
            <div>
              <p style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(1rem, 2vw, 1.3rem)',
                fontWeight: 300,
                lineHeight: 1.85,
                color: 'rgba(245,240,232,0.72)',
                whiteSpace: 'pre-wrap',
              }}>
                {project.description}
              </p>
            </div>
          </section>
        )}

        {/* Gallery */}
        {imageUrls.length > 0 && (
          <section style={{ padding: '64px 6% 80px', maxWidth: '1400px', margin: '0 auto' }}>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.6rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#c7a86d',
              marginBottom: 36,
            }}>Gallery · {galleryImages.length} Images</p>
            <GalleryLightbox images={imageUrls} filenames={galleryImages} captions={project.captions} altPrefix={project.title} />
          </section>
        )}

        {/* Prev / Next */}
        {(prevProject || nextProject) && (
          <section style={{
            borderTop: '1px solid rgba(199,168,109,0.1)',
            padding: '52px 6%',
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 24,
            flexWrap: 'wrap',
          }}>
            {prevProject ? (
              <Link
                href={`/projects/${prevProject.category}/${prevProject.slug}`}
                style={{ textDecoration: 'none', flex: 1, minWidth: 200 }}
              >
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(199,168,109,0.5)', marginBottom: 8 }}>← Previous</p>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: '#f5f0e8' }}>{prevProject.title}</p>
              </Link>
            ) : <div />}

            <Link
              href={`/projects/${cat}`}
              style={{
                alignSelf: 'center',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.6rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: '#c7a86d',
                textDecoration: 'none',
                border: '1px solid rgba(199,168,109,0.3)',
                padding: '12px 24px',
                borderRadius: 999,
              }}
            >
              All {project.categoryLabel}
            </Link>

            {nextProject ? (
              <Link
                href={`/projects/${nextProject.category}/${nextProject.slug}`}
                style={{ textDecoration: 'none', flex: 1, minWidth: 200, textAlign: 'right' }}
              >
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(199,168,109,0.5)', marginBottom: 8 }}>Next →</p>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: '#f5f0e8' }}>{nextProject.title}</p>
              </Link>
            ) : <div />}
          </section>
        )}

        {/* Footer strip */}
        <footer style={{
          borderTop: '1px solid rgba(199,168,109,0.1)',
          padding: '28px 6%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <Link href="/" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#f5f0e8', textDecoration: 'none' }}>
            INTER <em style={{ color: '#c7a86d', fontStyle: 'normal' }}>DESIGNS</em>
          </Link>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.25)' }}>
            © 2026 Inter Designs. All rights reserved.
          </p>
        </footer>
      </main>
    </>
  )
}
