import Box from '@mui/material/Box'
import LabelThumbnail from './LabelThumbnail'

interface LabelsGridProps {
  labels?: any[]
  category?: string
}

export default function LabelsGrid({ labels = [], category }: LabelsGridProps) {
  if (labels.length === 0) {
    return <p style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>No labels found.</p>
  }

  return (
    <Box
      component="ul"
      sx={{
        columnGap: '20px',
        marginLeft: 0,
        listStyleType: 'none',
        columns: { xs: 2, sm: 2, md: 4, lg: 6 },
      }}
    >
      {labels.map((c, index) => (
        <li key={index} style={{ marginBottom: 20, breakInside: 'avoid' as const }}>
          <LabelThumbnail label={c} labels={labels} category={category} />
        </li>
      ))}
    </Box>
  )
}
