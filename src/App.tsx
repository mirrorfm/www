import { Routes, Route, useLocation } from 'react-router-dom'
import { useRef, useEffect } from 'react'

import Layout from './layouts/Layout'
import HomePage from './pages/HomePage'
import ChannelsPage from './pages/ChannelsPage'
import LabelsPage from './pages/LabelsPage'
import YouTubePage from './pages/YouTubePage'
import DiscogsPage from './pages/DiscogsPage'
import AboutPage from './pages/AboutPage'
import AddPage from './pages/AddPage'
import LogsPage from './pages/LogsPage'
import NotFoundPage from './pages/NotFoundPage'
import Modal from './components/Modal'

interface LocationState {
  modal?: boolean
  channels?: any[]
  labels?: any[]
  channel?: any
  label?: any
  referrer?: string
  noScroll?: boolean
}

export default function App() {
  const location = useLocation()
  const state = location.state as LocationState | null
  const previousLocation = useRef(location)

  useEffect(() => {
    if (!state?.modal) {
      previousLocation.current = location
    }
  }, [location, state])

  const isModal = state?.modal === true
  const bgLocation = isModal ? previousLocation.current : location

  return (
    <>
      <Routes location={bgLocation}>
        <Route path="/" element={<HomePage />} />
        <Route path="/channels/" element={<ChannelsPage />} />
        <Route path="/labels/" element={<LabelsPage />} />
        <Route path="/youtube/:id/:name/" element={<YouTubePage />} />
        <Route path="/discogs/:id/:name/" element={<DiscogsPage />} />
        <Route path="/about/" element={<AboutPage />} />
        <Route path="/add/" element={<AddPage />} />
        <Route path="/logs/" element={<LogsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {isModal && (
        <Routes>
          <Route
            path="/youtube/:id/:name/"
            element={
              <Modal>
                <YouTubePage />
              </Modal>
            }
          />
          <Route
            path="/discogs/:id/:name/"
            element={
              <Modal>
                <DiscogsPage />
              </Modal>
            }
          />
        </Routes>
      )}
    </>
  )
}
