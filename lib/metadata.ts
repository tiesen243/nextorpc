import type { Metadata as NextMetadata } from 'next'

import { getBaseUrl } from '@/lib/utils'

type Metadata = Omit<NextMetadata, 'title' | 'keywords'> & {
  title: string
  keywords: string[]
}

export const createMetadata = (override: Partial<Metadata> = {}): Metadata => {
  const siteName = 'nextorpc'
  const title = override.title ? `${override.title} | ${siteName}` : siteName
  const description =
    override.description ??
    "Next.js + oRPC + Drizzle ORM template. A simple and fast way to build a full-stack application with Next.js, oRPC, and Drizzle ORM. It's a great starting point for building your own applications with these technologies."

  const {
    title: _,
    description: __,
    keywords = [],
    openGraph,
    ...restOverride
  } = override
  const { images: ogImages, url: ogUrl, ...restOpenGraph } = openGraph ?? {}
  const url = `${getBaseUrl()}${ogUrl ?? ''}`

  return {
    metadataBase: new URL(getBaseUrl()),
    applicationName: siteName,
    title,
    description,
    keywords: [...keywords, 'nextjs', 'orpc', 'drizzle'],
    openGraph: {
      url,
      title,
      description,
      siteName,
      type: 'website',
      images: [
        {
          url: `https://tiesen.id.vn/api/og?title=${title}&description=${description}`,
          alt: title,
        },
        ...(Array.isArray(ogImages) ? ogImages : ogImages ? [ogImages] : []),
      ],
      ...restOpenGraph,
    },
    twitter: {
      card: 'summary_large_image',
      ...override.twitter,
    },
    icons: {
      icon: 'https://tiesen.id.vn/favicon.ico',
      shortcut: 'https://tiesen.id.vn/favicon-16x16.png',
      apple: 'https://tiesen.id.vn/apple-touch-icon.png',
    },
    alternates: {
      canonical: url,
      ...override.alternates,
    },
    assets: '/assets',
    ...restOverride,
  }
}
