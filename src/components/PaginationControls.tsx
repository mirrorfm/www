import Pagination from '@mui/material/Pagination'

interface PaginationControlsProps {
  page: number
  totalCount: number
  perPage: number
  onPageChange: (page: number) => void
  compact?: boolean
}

export default function PaginationControls({ page, totalCount, perPage, onPageChange, compact }: PaginationControlsProps) {
  const totalPages = Math.ceil(totalCount / perPage)
  if (totalPages <= 1) return null

  const start = (page - 1) * perPage + 1
  const end = Math.min(page * perPage, totalCount)

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', margin: '12px 0', gap: '12px' }}>
      {!compact && (
        <span style={{ fontSize: 14, color: '#666' }}>
          Showing {start}–{end} of {totalCount}
        </span>
      )}
      <Pagination
        count={totalPages}
        page={page}
        onChange={handleChange}
        shape="rounded"
        size="small"
        showFirstButton
        showLastButton
      />
    </div>
  )
}
