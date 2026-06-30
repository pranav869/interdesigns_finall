import fs from 'fs'
import path from 'path'

// Serve the existing index.html content via Next.js
// The layout for this page is in app/layout.tsx but we suppress
// its <html>/<body> by using a raw HTML injection pattern.
export default function HomePage() {
  const htmlPath = path.join(process.cwd(), 'index.html')
  const rawHtml = fs.readFileSync(htmlPath, 'utf-8')

  // Extract everything between <body> tags
  const bodyMatch = rawHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i)
  // Extract <style> tags from <head> that the existing site needs
  const styleMatches = Array.from(rawHtml.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi))
  const styles = styleMatches.map(m => m[0]).join('\n')

  const bodyContent = bodyMatch ? bodyMatch[1] : rawHtml

  return (
    <>
      <div
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: styles }}
      />
      <div
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: bodyContent }}
      />
    </>
  )
}
