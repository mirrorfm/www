import { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

interface LayoutProps {
  children: ReactNode
  toolbar?: ReactNode
}

export default function Layout({ children, toolbar }: LayoutProps) {
  const location = useLocation()
  const state = location.state as { modal?: boolean } | null

  if (state?.modal) {
    return <>{children}</>
  }

  return (
    <div className="site">
      <Header toolbar={toolbar} />
      <div
        className="site-content"
        style={{
          margin: '0 auto',
          maxWidth: 1280,
          padding: '0px 1.0875rem 1.50rem',
          paddingTop: 0,
          width: '100%',
        }}
      >
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  )
}
