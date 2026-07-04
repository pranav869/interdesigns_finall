import fs from 'fs'
import path from 'path'

export type Category = 'residential' | 'commercial' | 'retail' | 'modular-kitchen'

export interface ImageCaption {
  heading?: string
  text?: string
}

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
  images: string[]  // filenames only e.g. ['02.png', '03.png']
  thumbnail: string  // filename of thumbnail
  captions: Record<string, ImageCaption>  // filename -> caption
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

// Per-project extra excludes keyed by folder basename
const FOLDER_EXCLUDES: Record<string, string[]> = {
  'Mr Sunil K Project': ['11.webp', '17.webp', '21.webp', '24.webp'],
  'Mr.Kushalji Project': ['28.webp'],
}

// Per-project allowed reference images (exceptions to global 01_reference filter)
const ALLOWED_REFERENCE: Record<string, string[]> = {
  'Tissot Showroom Project': ['01_reference.webp'],
}

function getImagesInFolder(baseFolder: string): string[] {
  const IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.webp', '.gif']
  const folderName = path.basename(baseFolder)
  const extraExcludes = FOLDER_EXCLUDES[folderName] ?? []
  const allowedRefs = ALLOWED_REFERENCE[folderName] ?? []

  function walk(currentDir: string, relativeDir: string): string[] {
    let results: string[] = []
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true })
      for (const entry of entries) {
        if (entry.isDirectory()) {
          results = results.concat(
            walk(path.join(currentDir, entry.name), path.join(relativeDir, entry.name))
          )
        } else {
          const f = entry.name
          if (!IMAGE_EXTS.includes(path.extname(f).toLowerCase())) continue
          if (f.toLowerCase().startsWith('01_reference') && !allowedRefs.includes(f)) continue
          if (extraExcludes.includes(f)) continue
          results.push(path.join(relativeDir, f))
        }
      }
    } catch {
      // ignore
    }
    return results
  }

  const images = walk(baseFolder, '')
  return images.sort((a, b) => {
    const numA = parseInt(path.basename(a)) || 999
    const numB = parseInt(path.basename(b)) || 999
    if (numA !== numB) return numA - numB
    return a.localeCompare(b)
  })
}

function getThumbnail(images: string[]): string {
  // Images are already filtered — use first available
  return images[0] ?? ''
}

function readCaptions(folderPath: string): Record<string, ImageCaption> {
  try {
    const captionsPath = path.join(folderPath, 'captions.json')
    if (!fs.existsSync(captionsPath)) return {}
    return JSON.parse(fs.readFileSync(captionsPath, 'utf-8'))
  } catch {
    return {}
  }
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
        captions: readCaptions(childPath),
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
          captions: readCaptions(projectPath),
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
