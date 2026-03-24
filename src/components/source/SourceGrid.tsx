import Box from '@mui/material/Box'
import SourceThumbnail, { SourceItem } from './SourceThumbnail'

interface SourceGridProps {
  items?: SourceItem[]
  category?: string
  selectedGenresArr?: string[]
}

export default function SourceGrid({ items = [], category, selectedGenresArr }: SourceGridProps) {
  if (items.length === 0) {
    return <p style={{ textAlign: 'center', color: '#999', padding: '20px 0' }}>No results found.</p>
  }

  return (
    <Box
      component="ul"
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '10px 10px',
        rowGap: '16px',
        marginLeft: 0,
        paddingLeft: 0,
        listStyleType: 'none',
        marginTop: 0,
        marginBottom: 0,
      }}
    >
      {items.map((item, index) => (
        <li key={`${item.source}-${item.channel_id || item.label_id}-${index}`} style={{ minWidth: 0 }}>
          <SourceThumbnail item={item} items={items} category={category} selectedGenresArr={selectedGenresArr} />
        </li>
      ))}
    </Box>
  )
}
