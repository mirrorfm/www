import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useRef, useEffect, useState } from 'react'
import { checkPrerelease } from './lib/prerelease'

import HomePage from './pages/HomePage'
import BrowsePage from './pages/BrowsePage'
import YouTubePage from './pages/YouTubePage'
import DiscogsPage from './pages/DiscogsPage'
import AboutPage from './pages/AboutPage'
import SubmitPage from './pages/SubmitPage'
import LoginPage from './pages/LoginPage'
import TakedownPage from './pages/TakedownPage'
import PitchPage from './pages/PitchPage'
import HistoryPage from './pages/HistoryPage'
import CuratorInboxPage from './pages/CuratorInboxPage'
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
  const [pre] = useState(() => checkPrerelease())

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
        <Route path="/browse/" element={<BrowsePage />} />
        {/* Redirect old routes to /browse/ with source filter */}
        <Route path="/channels/" element={<Navigate to="/browse/?source=youtube" replace />} />
        <Route path="/labels/" element={<Navigate to="/browse/?source=discogs" replace />} />
        <Route path="/add/" element={<Navigate to="/submit/" replace />} />
        <Route path="/youtube/:id/:name/" element={<YouTubePage />} />
        <Route path="/discogs/:id/:name/" element={<DiscogsPage />} />
        <Route path="/about/" element={<AboutPage />} />
        <Route path="/submit/" element={<SubmitPage />} />
        {pre && <>
          <Route path="/signin/" element={<LoginPage />} />
          <Route path="/about2/" element={<TakedownPage />} />
          <Route path="/pitch/" element={<PitchPage />} />
          <Route path="/history/" element={<HistoryPage />} />
          <Route path="/inbox/" element={<CuratorInboxPage />} />
        </>}
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
