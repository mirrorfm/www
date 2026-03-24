import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Loader from '../components/Loader'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

import Layout from '../layouts/Layout'
import SEO from '../components/SEO'
import SourceGrid from '../components/source/SourceGrid'
import { SourceItem, SourceType } from '../components/source/SourceThumbnail'
import PaginationControls from '../components/PaginationControls'
import SortDropdown from '../components/SortDropdown'
import SearchBar from '../components/SearchBar'
import CheckboxesTag from '../components/CheckboxesTag'
import { api } from '../config'

interface Genre {
  genre: string
}

type SourceFilter = 'all' | 'youtube' | 'discogs'

function tagSource(items: any[], source: SourceType): SourceItem[] {
  return items.map(item => ({ ...item, source }))
}

export default function BrowsePage() {
  const location = useLocation()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<SourceItem[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [foundTracks, setFoundTracks] = useState(0)
  const [totalTracks, setTotalTracks] = useState(0)
  const [genres, setGenres] = useState<Genre[]>([])
  const genresLoaded = genres.length > 0
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([])
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState('followers')
  const [search, setSearch] = useState('')
  const [source, setSource] = useState<SourceFilter>('all')
  const [youtubeCount, setYoutubeCount] = useState(0)
  const [discogsCount, setDiscogsCount] = useState(0)
  const perPage = 150

  const fetchData = useCallback((p: number, s: string, q: string, sg: Genre[], src: SourceFilter) => {
    setLoading(true)

    const makeParams = (perPageOverride?: number) => {
      const params = new URLSearchParams({ page: String(p), per_page: String(perPageOverride || perPage), sort: s, order: 'desc' })
      if (q) params.set('search', q)
      sg.forEach(g => params.append('genres', g.genre))
      return params.toString()
    }

    if (src === 'youtube') {
      api.get('channels?' + makeParams())
        .then(({ data }) => {
          setItems(tagSource(data.youtube || [], 'youtube'))
          setTotalCount(data.total_count)
          setFoundTracks(data.found_tracks)
          setTotalTracks(data.total_tracks)
          setYoutubeCount(data.total_count)
          if (!genresLoaded) setGenres((data.all_genres || []).map((g: string) => ({ genre: g })))
          setLoading(false)
        })
        .catch((err) => { setLoading(false); if (err.rateLimited) alert('Too many requests. Please wait a moment.') })
    } else if (src === 'discogs') {
      api.get('labels?' + makeParams())
        .then(({ data }) => {
          setItems(tagSource(data.discogs || [], 'discogs'))
          setTotalCount(data.total_count)
          setFoundTracks(data.found_tracks)
          setTotalTracks(data.total_tracks)
          setDiscogsCount(data.total_count)
          if (!genresLoaded) setGenres((data.all_genres || []).map((g: string) => ({ genre: g })))
          setLoading(false)
        })
        .catch((err) => { setLoading(false); if (err.rateLimited) alert('Too many requests. Please wait a moment.') })
    } else {
      // Fetch both sources
      const half = Math.ceil(perPage / 2)
      Promise.all([
        api.get('channels?' + makeParams(half)),
        api.get('labels?' + makeParams(half)),
      ])
        .then(([channelsRes, labelsRes]) => {
          const channels = tagSource(channelsRes.data.youtube || [], 'youtube')
          const labels = tagSource(labelsRes.data.discogs || [], 'discogs')

          const merged = interleave(channels, labels)
          setItems(merged)
          setTotalCount(channelsRes.data.total_count + labelsRes.data.total_count)
          setFoundTracks(channelsRes.data.found_tracks + labelsRes.data.found_tracks)
          setTotalTracks(channelsRes.data.total_tracks + labelsRes.data.total_tracks)
          setYoutubeCount(channelsRes.data.total_count)
          setDiscogsCount(labelsRes.data.total_count)

          const allGenres = new Set([
            ...(channelsRes.data.all_genres || []),
            ...(labelsRes.data.all_genres || []),
          ])
          if (!genresLoaded) setGenres(Array.from(allGenres).sort().map(g => ({ genre: g })))
          setLoading(false)
        })
        .catch((err) => { setLoading(false); if (err.rateLimited) alert('Too many requests. Please wait a moment.') })
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const initPage = parseInt(params.get('page') || '') || 1
    const initSort = params.get('sort') || 'followers'
    const initSearch = params.get('search') || ''
    const initGenres = params.getAll('genres').map(g => ({ genre: g }))
    const initSource = (params.get('source') as SourceFilter) || 'all'
    setPage(initPage)
    setSort(initSort)
    setSearch(initSearch)
    setSelectedGenres(initGenres)
    setSource(initSource)
    fetchData(initPage, initSort, initSearch, initGenres, initSource)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const updateAndFetch = useCallback((updates: { page?: number; sort?: string; search?: string; selectedGenres?: Genre[]; source?: SourceFilter }) => {
    const newPage = updates.page ?? page
    const newSort = updates.sort ?? sort
    const newSearch = updates.search ?? search
    const newGenres = updates.selectedGenres ?? selectedGenres
    const newSource = updates.source ?? source

    setPage(newPage)
    setSort(newSort)
    setSearch(newSearch)
    setSelectedGenres(newGenres)
    setSource(newSource)

    const params = new URLSearchParams()
    if (newPage > 1) params.set('page', String(newPage))
    if (newSort !== 'followers') params.set('sort', newSort)
    if (newSearch) params.set('search', newSearch)
    if (newSource !== 'all') params.set('source', newSource)
    newGenres.forEach(g => params.append('genres', g.genre))
    const qs = params.toString()
    navigate('/browse/' + (qs ? '?' + qs : ''), { replace: true })
    fetchData(newPage, newSort, newSearch, newGenres, newSource)
  }, [page, sort, search, selectedGenres, source, navigate, fetchData])

  const sourceLabel = source === 'youtube' ? 'YouTube channels' : source === 'discogs' ? 'Discogs labels' : 'sources'

  const headerToolbar = (
    <>
      <SearchBar search={search} onSearchChange={(q) => updateAndFetch({ search: q, page: 1 })} />
      <div style={{ flex: 1, minWidth: 150 }}>
        <CheckboxesTag genres={genres} selectedGenres={selectedGenres} handleClick={(_, sg) => updateAndFetch({ selectedGenres: sg, page: 1 })} placeholder={genres.length > 0 ? `Genres (${genres.length})` : 'Genres'} />
      </div>
      <ToggleButtonGroup
        value={source}
        exclusive
        onChange={(_, v) => { if (v) updateAndFetch({ source: v, page: 1 }) }}
        size="small"
      >
        <ToggleButton value="all" style={{ fontSize: 14, textTransform: 'none', color: '#d4d4d4', borderColor: 'rgba(255,255,255,0.23)', height: 40 }}>All</ToggleButton>
        <ToggleButton value="youtube" style={{ fontSize: 14, textTransform: 'none', color: '#d4d4d4', borderColor: 'rgba(255,255,255,0.23)', height: 40 }}>YouTube{youtubeCount > 0 ? ` (${youtubeCount})` : ''}</ToggleButton>
        <ToggleButton value="discogs" style={{ fontSize: 14, textTransform: 'none', color: '#d4d4d4', borderColor: 'rgba(255,255,255,0.23)', height: 40 }}>Discogs{discogsCount > 0 ? ` (${discogsCount})` : ''}</ToggleButton>
      </ToggleButtonGroup>
      <SortDropdown sort={sort} onSortChange={(s) => updateAndFetch({ sort: s, page: 1 })} />
    </>
  )

  const footerPagination = totalCount > perPage ? (
    <PaginationControls page={page} totalCount={totalCount} perPage={perPage} onPageChange={(p) => updateAndFetch({ page: p })} />
  ) : undefined

  return (
    <Layout toolbar={headerToolbar} footer={footerPagination}>
      <SEO title="Browse playlists" />
      <div>
        {loading ? (
          <Loader />
        ) : (
          <SourceGrid items={items} selectedGenresArr={selectedGenres.map(g => g.genre)} />
        )}
      </div>
    </Layout>
  )
}

/** Interleave two arrays proportionally */
function interleave<T>(a: T[], b: T[]): T[] {
  if (b.length === 0) return a
  if (a.length === 0) return b
  const result: T[] = []
  const ratio = a.length / b.length
  let ai = 0, bi = 0
  while (ai < a.length || bi < b.length) {
    if (ai < a.length && (bi >= b.length || (ai / (bi + 1)) < ratio)) {
      result.push(a[ai++])
    } else if (bi < b.length) {
      result.push(b[bi++])
    }
  }
  return result
}
