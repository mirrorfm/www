import React from 'react'
import Pagination from '@material-ui/lab/Pagination'

class PaginationControls extends React.Component {
  handleChange = (e, value) => {
    this.props.onPageChange(value)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  render() {
    const { page, totalCount, perPage, compact } = this.props
    const totalPages = Math.ceil(totalCount / perPage)
    if (totalPages <= 1) return null

    const start = (page - 1) * perPage + 1
    const end = Math.min(page * perPage, totalCount)

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
          onChange={this.handleChange}
          shape="rounded"
          size="small"
          showFirstButton
          showLastButton
        />
      </div>
    )
  }
}

export default PaginationControls
