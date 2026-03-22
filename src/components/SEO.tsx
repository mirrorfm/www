import { Helmet } from 'react-helmet-async'
import { siteMetadata } from '../config'

interface SEOProps {
  title: string
  description?: string
  lang?: string
  meta?: Array<{ name?: string; property?: string; content: string }>
}

export default function SEO({ description, lang = 'en', meta = [], title }: SEOProps) {
  const metaDescription = description || siteMetadata.description

  return (
    <Helmet
      htmlAttributes={{ lang }}
      title={title}
      titleTemplate={`%s | ${siteMetadata.title}`}
      meta={[
        { name: 'description', content: metaDescription },
        { property: 'og:title', content: title },
        { property: 'og:description', content: metaDescription },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:creator', content: siteMetadata.author },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: metaDescription },
        ...meta,
      ]}
    />
  )
}
