import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Grid as GridLoader } from 'react-loader-spinner'
import { NumericFormat } from 'react-number-format'

import Layout from '../layouts/Layout'
import SEO from '../components/SEO'
import LabelsGrid from '../components/label/LabelsGrid'
import PaginationControls from '../components/PaginationControls'
import SortDropdown from '../components/SortDropdown'
import SearchBar from '../components/SearchBar'
import { api } from '../config'

interface Genre {
  genre: string
}

export default function LabelsPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [labels, setLabels] = useState<any[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [foundTracks, setFoundTracks] = useState(0)
  const [totalTracks, setTotalTracks] = useState(0)
  const [genres, setGenres] = useState<Genre[]>([])
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([])
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState('followers')
  const [search, setSearch] = useState('')
  const perPage = 100

  const fetchLabels = useCallback((p: number, s: string, q: string, sg: Genre[]) => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(p), per_page: String(perPage), sort: s, order: 'desc' })
    if (q) params.set('search', q)
    sg.forEach(g => params.append('genres', g.genre))

    api.get('labels?' + params.toString())
      .then(({ data }) => {
        setLabels(data.discogs || [])
        setTotalCount(data.total_count)
        setFoundTracks(data.found_tracks)
        setTotalTracks(data.total_tracks)
        setGenres((data.all_genres || []).map((g: string) => ({ genre: g })))
        setLoading(false)
      })
      .catch((err) => { setLoading(false); if (err.rateLimited) alert('Too many requests. Please wait a moment.') })
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const initPage = parseInt(params.get('page') || '') || 1
    const initSort = params.get('sort') || 'followers'
    const initSearch = params.get('search') || ''
    const initGenres = params.getAll('genres').map(g => ({ genre: g }))
    setPage(initPage)
    setSort(initSort)
    setSearch(initSearch)
    setSelectedGenres(initGenres)
    fetchLabels(initPage, initSort, initSearch, initGenres)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const updateAndFetch = useCallback((updates: { page?: number; sort?: string; search?: string; selectedGenres?: Genre[] }) => {
    const newPage = updates.page ?? page
    const newSort = updates.sort ?? sort
    const newSearch = updates.search ?? search
    const newGenres = updates.selectedGenres ?? selectedGenres

    setPage(newPage)
    setSort(newSort)
    setSearch(newSearch)
    setSelectedGenres(newGenres)

    const params = new URLSearchParams()
    if (newPage > 1) params.set('page', String(newPage))
    if (newSort !== 'followers') params.set('sort', newSort)
    if (newSearch) params.set('search', newSearch)
    newGenres.forEach(g => params.append('genres', g.genre))
    const qs = params.toString()
    navigate('/labels/' + (qs ? '?' + qs : ''), { replace: true })
    fetchLabels(newPage, newSort, newSearch, newGenres)
  }, [page, sort, search, selectedGenres, navigate, fetchLabels])

  return (
    <Layout>
      <SEO title="All Discogs labels" />
      <div>
        {loading ? (
          <GridLoader color="lightgrey" height={50} width={50} wrapperStyle={{ textAlign: 'center' }} />
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
              <p style={{ margin: 0 }}>
                Found <strong>{Math.round(foundTracks * 100 / totalTracks)}%</strong> of <strong><NumericFormat value={totalTracks} displayType="text" thousandSeparator /></strong> total tracks in <strong>{totalCount}</strong> Discogs labels.
                <Link style={{ marginLeft: 10, fontSize: 30, textDecoration: 'none' }} to="/join/">+</Link>
              </p>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <SearchBar search={search} onSearchChange={(q) => updateAndFetch({ search: q, page: 1 })} />
                <SortDropdown sort={sort} onSortChange={(s) => updateAndFetch({ sort: s, page: 1 })} />
              </div>
            </div>
            <PaginationControls page={page} totalCount={totalCount} perPage={perPage} onPageChange={(p) => updateAndFetch({ page: p })} compact />
            <LabelsGrid labels={labels} />
            <PaginationControls page={page} totalCount={totalCount} perPage={perPage} onPageChange={(p) => updateAndFetch({ page: p })} />
          </>
        )}
      </div>
    </Layout>
  )
}
