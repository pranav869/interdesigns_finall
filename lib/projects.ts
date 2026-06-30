import fs from 'fs'
import path from 'path'

export type Category = 'residential' | 'commercial' | 'retail' | 'modular-kitchen'

export interface Project {
  title: string
  location: string
  description: string
  category: Category
  categoryLabel: string
  subcategory: string
  slug: string
  folderPath: string  // absolute path to project folder
  publicImageBase: string  // URL prefix for images served via API
  images: string[]  // filenames only e.g. ['01_reference.png', '02.png']
  thumbnail: string  // filename of thumbnail
}

const EXTRACTED_ROOT = path.join(process.cwd(), 'final projects', 'Extracted')

const CATEGORY_MAP: Record<string, Category> = {
  Residential: 'residential',
  Commercial: 'commercial',
  Retail: 'retail',
  'Modular Kitchen': 'modular-kitchen',
}

const CATEGORY_LABELS: Record<Category, string> = {
  residential: 'Residential',
  commercial: 'Commercial',
  retail: 'Retail',
  'modular-kitchen': 'Modular Kitchen',
}

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function parseProjTxt(filePath: string): { title: string; location: string; description: string } {
  const fallback = { title: '', location: '', description: '' }
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const lines = content.split('\n').map(l => l.trim())
    const title = lines[0] ?? ''
    const location = (lines[1] ?? '').replace(/^@\s*/, '').trim()
    const description = lines.slice(2).join('\n').trim()
    return { title, location, description }
  } catch {
    return fallback
  }
}

function getImagesInFolder(folderPath: string): string[] {
  const IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.webp', '.gif']
  try {
    return fs
      .readdirSync(folderPath)
      .filter(f => IMAGE_EXTS.includes(path.extname(f).toLowerCase()))
      .sort((a, b) => {
        // Sort numerically by leading number
        const numA = parseInt(a) || 999
        const numB = parseInt(b) || 999
        return numA - numB
      })
  } catch {
    return []
  }
}

function getThumbnail(images: string[]): string {
  // Prefer 01_reference.* then first image
  const ref = images.find(f => f.startsWith('01_reference'))
  return ref ?? images[0] ?? ''
}

function readProjectsFromCategory(
  categoryDir: string,
  category: Category,
  categoryLabel: string
): Project[] {
  const projects: Project[] = []
  if (!fs.existsSync(categoryDir)) return projects

  // Structure: categoryDir / [subcategory?] / [project folder]
  // or: categoryDir / [project folder] directly
  // Detect by checking if children are directories containing proj.txt
  const entries = fs.readdirSync(categoryDir, { withFileTypes: true })
    .filter(e => e.isDirectory())

  for (const entry of entries) {
    const childPath = path.join(categoryDir, entry.name)
    const projTxtDirect = path.join(childPath, 'proj.txt')

    if (fs.existsSync(projTxtDirect)) {
      // Direct project folder (e.g. Commercial/Future FX Studio Project)
      const images = getImagesInFolder(childPath)
      const thumbnail = getThumbnail(images)
      const { title, location, description } = parseProjTxt(projTxtDirect)
      const displayTitle = title || entry.name.replace(/ Project$/, '').trim()
      const slug = toSlug(displayTitle || entry.name)

      projects.push({
        title: displayTitle,
        location,
        description,
        category,
        categoryLabel,
        subcategory: '',
        slug,
        folderPath: childPath,
        publicImageBase: `/api/project-image/${category}/${encodeURIComponent(entry.name)}`,
        images,
        thumbnail,
      })
    } else {
      // Subcategory folder — go one level deeper
      const subEntries = fs.readdirSync(childPath, { withFileTypes: true })
        .filter(e => e.isDirectory())
      for (const subEntry of subEntries) {
        const projectPath = path.join(childPath, subEntry.name)
        const projTxt = path.join(projectPath, 'proj.txt')
        if (!fs.existsSync(projectPath)) continue
        const images = getImagesInFolder(projectPath)
        const thumbnail = getThumbnail(images)
        const { title, location, description } = fs.existsSync(projTxt)
          ? parseProjTxt(projTxt)
          : { title: '', location: '', description: '' }
        const displayTitle = title || subEntry.name.replace(/ Project$/, '').trim()
        const slug = toSlug(displayTitle || subEntry.name)

        projects.push({
          title: displayTitle,
          location,
          description,
          category,
          categoryLabel,
          subcategory: entry.name,
          slug,
          folderPath: projectPath,
          publicImageBase: `/api/project-image/${category}/${encodeURIComponent(entry.name)}/${encodeURIComponent(subEntry.name)}`,
          images,
          thumbnail,
        })
      }
    }
  }

  return projects
}

export function getAllProjects(): Project[] {
  const all: Project[] = []
  for (const [dirName, category] of Object.entries(CATEGORY_MAP)) {
    const categoryDir = path.join(EXTRACTED_ROOT, dirName)
    all.push(...readProjectsFromCategory(categoryDir, category, CATEGORY_LABELS[category]))
  }
  return all
}

export function getProjectsByCategory(category: Category): Project[] {
  return getAllProjects().filter(p => p.category === category)
}

export function getProjectBySlug(category: Category, slug: string): Project | undefined {
  return getAllProjects().find(p => p.category === category && p.slug === slug)
}

export function getAllSlugs(): { category: Category; slug: string }[] {
  return getAllProjects().map(p => ({ category: p.category, slug: p.slug }))
}
