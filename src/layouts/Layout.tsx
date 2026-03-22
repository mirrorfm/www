import { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

interface LayoutProps {
  children: ReactNode
  genres?: { genre: string }[]
  selectedGenres?: { genre: string }[]
  handleClick?: (e: any, value: { genre: string }[]) => void
}

export default function Layout({ children, genres, selectedGenres, handleClick }: LayoutProps) {
  const location = useLocation()
  const state = location.state as { modal?: boolean } | null

  if (state?.modal) {
    return <>{children}</>
  }

  return (
    <div className="site">
      <Header
        siteTitle="Mirror.FM"
        genres={genres}
        selectedGenres={selectedGenres}
        handleClick={handleClick}
      />
      <div
        className="site-content"
        style={{
          margin: '0 auto',
          maxWidth: 1280,
          padding: '0px 1.0875rem 1.50rem',
          paddingTop: 0,
        }}
      >
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  )
}
