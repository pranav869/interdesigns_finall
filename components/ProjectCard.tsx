'use client'
import Link from 'next/link'
import { useState } from 'react'
import type { Project } from '@/lib/projects'

interface Props {
  project: Project
  index?: number
}

export default function ProjectCard({ project, index = 0 }: Props) {
  const [loaded, setLoaded] = useState(false)

  const thumbnailUrl = project.thumbnail
    ? `${project.publicImageBase}/${encodeURIComponent(project.thumbnail)}`
    : ''

  const excerpt = project.description
    ? project.description.slice(0, 180) + (project.description.length > 180 ? '…' : '')
    : ''

  const locationDisplay = project.location
    ? project.location.charAt(0).toUpperCase() + project.location.slice(1)
    : ''

  return (
    <Link
      href={`/projects/${project.category}/${project.slug}`}
      className="group block relative overflow-hidden rounded-sm"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Skeleton */}
      {!loaded && (
        <div
          className="absolute inset-0 z-10"
          style={{ background: 'linear-gradient(110deg, #1a1f2e 30%, #242b3d 50%, #1a1f2e 70%)', backgroundSize: '200% 100%', animation: 'shimmer 1.6s infinite' }}
        />
      )}

      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]" style={{ background: '#0f1115' }}>
        {thumbnailUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailUrl}
            alt={project.title}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.4s ease, transform 0.7s ease' }}
          />
        )}

        {/* Overlay */}
        <div
          className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
          style={{ background: 'linear-gradient(to top, rgba(10,11,14,0.92) 0%, rgba(10,11,14,0.4) 60%, transparent 100%)' }}
        >
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(245,240,232,0.82)', fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
            {excerpt}
          </p>
          <span
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase"
            style={{ color: 'var(--gold)', fontFamily: 'Inter, sans-serif' }}
          >
            View Project <span>→</span>
          </span>
        </div>
      </div>

      {/* Card info */}
      <div className="pt-4 pb-2">
        <h3
          className="text-lg font-medium mb-1 group-hover:text-yellow-400 transition-colors duration-300"
          style={{ fontFamily: 'Playfair Display, serif', color: 'var(--white)' }}
        >
          {project.title}
        </h3>
        <p
          className="text-xs tracking-widest uppercase"
          style={{ color: 'rgba(199,168,109,0.65)', fontFamily: 'Inter, sans-serif', letterSpacing: '0.2em' }}
        >
          {locationDisplay}
          {locationDisplay && project.categoryLabel ? ' · ' : ''}
          {project.categoryLabel}
        </p>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </Link>
  )
}
