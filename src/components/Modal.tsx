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
let previousSectionPathname = '/'

export default function Modal({ children }: ModalProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as any

  if (state?.channels) channels = state.channels
  if (state?.labels) labels = state.labels

  const acceptedPrevious = ['/labels/', '/channels/', '/']
  if (state?.referrer && acceptedPrevious.includes(state.referrer)) {
    previousSectionPathname = state.referrer
  }

  const findCurrentIndex = useCallback(() => {
    const parts = location.pathname.split('/')
    const type = parts[1]
    const id = parts[2]

    let currentIndex = -1
    if (type === 'youtube' && channels) {
      currentIndex = channels.findIndex((c: any) => c.channel_id === id)
    } else if (type === 'discogs' && labels) {
      currentIndex = labels.findIndex((l: any) => l.label_id === id)
    }

    return { currentIndex, type }
  }, [location.pathname])

  const navigateEntity = useCallback((type: string, entity: any, entities: any[]) => {
    let id: string, name: string, navState: any
    if (type === 'youtube') {
      id = entity.channel_id
      name = entity.channel_name
      navState = { modal: true, channels: entities, channel: entity, label: entity }
    } else {
      id = entity.label_id
      name = entity.label_name
      navState = { modal: true, labels: entities, channel: entity, label: entity }
    }
    navigate(`/${type}/${id}/${slugify(name)}/`, { state: navState })
  }, [navigate])

  const goNext = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const { currentIndex, type } = findCurrentIndex()
    const entities = type === 'youtube' ? channels : labels
    if (!entities || currentIndex < 0) return
    const next = currentIndex + 1 === entities.length ? entities[0] : entities[currentIndex + 1]
    navigateEntity(type, next, entities)
  }, [findCurrentIndex, navigateEntity])

  const goPrevious = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const { currentIndex, type } = findCurrentIndex()
    const entities = type === 'youtube' ? channels : labels
    if (!entities || currentIndex < 0) return
    const prev = currentIndex === 0 ? entities[entities.length - 1] : entities[currentIndex - 1]
    navigateEntity(type, prev, entities)
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
