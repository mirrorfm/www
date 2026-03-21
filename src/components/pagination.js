import React from 'react'
import Pagination from '@material-ui/lab/Pagination'

class PaginationControls extends React.Component {
  render() {
    const { page, totalCount, perPage, onPageChange } = this.props
    const totalPages = Math.ceil(totalCount / perPage)
    if (totalPages <= 1) return null

    const start = (page - 1) * perPage + 1
    const end = Math.min(page * perPage, totalCount)

    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', margin: '20px 0', gap: '12px' }}>
        <span style={{ fontSize: 14, color: '#666' }}>
          Showing {start}–{end} of {totalCount}
        </span>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => onPageChange(value)}
          shape="rounded"
          size="small"
        />
      </div>
    )
  }
}

export default PaginationControls
