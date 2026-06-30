import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProjectsByCategory, type Category } from '@/lib/projects'
import CategoryHero from '@/components/CategoryHero'
import ProjectCard from '@/components/ProjectCard'
import ProjectsNav from '@/components/ProjectsNav'

const VALID_CATEGORIES: Category[] = ['residential', 'commercial', 'retail', 'modular-kitchen']

const CATEGORY_TITLES: Record<Category, string> = {
  residential: 'Residential Projects',
  commercial: 'Commercial Projects',
  retail: 'Retail Projects',
  'modular-kitchen': 'Modular Kitchen Projects',
}

const CATEGORY_LABELS: Record<Category, string> = {
  residential: 'Residential',
  commercial: 'Commercial',
  retail: 'Retail',
  'modular-kitchen': 'Modular Kitchen',
}

export async function generateStaticParams() {
  return VALID_CATEGORIES.map(category => ({ category }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ category: string }> }
): Promise<Metadata> {
  const { category } = await params
  if (!VALID_CATEGORIES.includes(category as Category)) return {}
  const cat = category as Category
  const title = CATEGORY_TITLES[cat]
  return {
    title: `${title} | Inter Designs`,
    description: `Browse Inter Designs' ${CATEGORY_LABELS[cat].toLowerCase()} portfolio — luxury interiors crafted in Chennai.`,
    openGraph: {
      title: `${title} | Inter Designs`,
      description: `Luxury ${CATEGORY_LABELS[cat].toLowerCase()} interior design by Inter Designs, Chennai.`,
    },
  }
}

export default async function CategoryPage(
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params
  if (!VALID_CATEGORIES.includes(category as Category)) notFound()
  const cat = category as Category
  const projects = getProjectsByCategory(cat)
  const title = CATEGORY_TITLES[cat]
  const label = CATEGORY_LABELS[cat]

  return (
    <>
      <ProjectsNav />
      <main style={{ minHeight: '100vh', background: 'var(--ink)' }}>
        <CategoryHero title={title} categoryLabel={label} count={projects.length} />

        <section style={{ padding: '72px 6% 100px', maxWidth: '1400px', margin: '0 auto' }}>
          {projects.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 0',
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '1.4rem',
              color: 'rgba(245,240,232,0.35)',
            }}>
              No projects yet in this category.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '48px 32px',
            }}>
              {projects.map((project, i) => (
                <ProjectCard key={project.slug} project={project} index={i} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  )
}
