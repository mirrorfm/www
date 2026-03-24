import { useEffect, useCallback, ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { MdClose } from 'react-icons/md'
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa'
import { Box } from '@mui/material'
import slugify from 'react-slugify'
import mousetrap from 'mousetrap'

interface ModalProps {
  children: ReactNode
}

let channels: any[] | undefined
let labels: any[] | undefined
let items: any[] | undefined
let previousSectionPathname = '/'

export default function Modal({ children }: ModalProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as any

  if (state?.channels) channels = state.channels
  if (state?.labels) labels = state.labels
  // Track the full mixed items list for unified browsing
  if (state?.channels || state?.labels) {
    items = state.channels || state.labels
  }

  const acceptedPrevious = ['/browse/', '/labels/', '/channels/', '/']
  if (state?.referrer && acceptedPrevious.includes(state.referrer)) {
    previousSectionPathname = state.referrer
  }

  const findCurrentIndex = useCallback(() => {
    const parts = location.pathname.split('/')
    const type = parts[1]
    const id = parts[2]

    let currentIndex = -1
    if (items) {
      // Search in the unified items list (supports mixed sources)
      currentIndex = items.findIndex((item: any) => {
        if (type === 'youtube') return item.channel_id === id
        if (type === 'discogs') return String(item.label_id) === id
        return false
      })
    } else if (type === 'youtube' && channels) {
      currentIndex = channels.findIndex((c: any) => c.channel_id === id)
    } else if (type === 'discogs' && labels) {
      currentIndex = labels.findIndex((l: any) => String(l.label_id) === id)
    }

    return { currentIndex, type }
  }, [location.pathname])

  const navigateEntity = useCallback((entity: any, allItems: any[]) => {
    const entityType = entity.source === 'discogs' ? 'discogs'
      : entity.label_id && !entity.channel_id ? 'discogs'
      : 'youtube'
    let id: string, name: string, navState: any
    if (entityType === 'youtube') {
      id = entity.channel_id
      name = entity.channel_name || entity.channel?.channel_name
      navState = { modal: true, channels: allItems, channel: entity }
    } else {
      id = entity.label_id
      name = entity.label_name || entity.label?.label_name
      navState = { modal: true, labels: allItems, label: entity }
    }
    navigate(`/${entityType}/${id}/${slugify(name)}/`, { state: navState })
  }, [navigate])

  const goNext = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const { currentIndex } = findCurrentIndex()
    const allItems = items || channels || labels
    if (!allItems || currentIndex < 0) return
    const next = currentIndex + 1 === allItems.length ? allItems[0] : allItems[currentIndex + 1]
    navigateEntity(next, allItems)
  }, [findCurrentIndex, navigateEntity])

  const goPrevious = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const { currentIndex } = findCurrentIndex()
    const allItems = items || channels || labels
    if (!allItems || currentIndex < 0) return
    const prev = currentIndex === 0 ? allItems[allItems.length - 1] : allItems[currentIndex - 1]
    navigateEntity(prev, allItems)
  }, [findCurrentIndex, navigateEntity])

  const close = useCallback(() => {
    navigate(previousSectionPathname, { state: { noScroll: true } })
  }, [navigate])

  useEffect(() => {
    mousetrap.bind('left', () => goPrevious())
    mousetrap.bind('right', () => goNext())
    mousetrap.bind('space', () => goNext())
    return () => {
      mousetrap.unbind('left')
      mousetrap.unbind('right')
      mousetrap.unbind('space')
    }
  }, [goNext, goPrevious])

  const caretSx = {
    fontSize: 50,
    width: { xs: '2rem', sm: '2.5rem', md: '10rem' },
    cursor: 'pointer',
    userSelect: 'none' as const,
    display: 'flex',
    justifyContent: 'space-between',
  }

  return (
    <div
      onClick={close}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 10,
        overflow: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          position: 'relative',
          height: '100vh',
        }}
      >
        <div
          style={{
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyItems: 'center',
          }}
        >
          <Box
            component={FaCaretLeft}
            data-testid="previous-channel"
            sx={{ ...caretSx, color: 'rgba(255, 255, 255, 0.7)' }}
            onClick={(e: any) => goPrevious(e)}
          />
          {children}
          <Box
            component={FaCaretRight}
            data-testid="next-channel"
            sx={{ ...caretSx, color: 'white' }}
            onClick={(e: any) => goNext(e)}
          />
        </div>
        <MdClose
          data-testid="modal-close"
          onClick={close}
          style={{
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.8)',
            fontSize: 30,
            position: 'absolute',
          }}
        />
      </div>
    </div>
  )
}
