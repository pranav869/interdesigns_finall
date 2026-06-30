import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Inter Designs | Luxury Interior Design Studio — Chennai',
  description: 'Crafting bespoke luxury interiors that reflect the aspirations of the people who live and work within them. Chennai\'s premier design studio.',
  openGraph: {
    title: 'Inter Designs | Luxury Interior Design Studio',
    description: 'Bespoke luxury interiors crafted in Chennai.',
    url: 'https://interdesigns.in',
    siteName: 'Inter Designs',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,700&family=Inter:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
