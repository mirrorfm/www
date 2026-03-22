import Box from '@mui/material/Box'
import ChannelThumbnail from './ChannelThumbnail'

interface ChannelGridProps {
  channels?: any[]
  category?: string
}

export default function ChannelGrid({ channels = [], category }: ChannelGridProps) {
  if (channels.length === 0) {
    return <p style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>No channels found.</p>
  }

  return (
    <Box
      component="ul"
      sx={{
        columnGap: '20px',
        marginLeft: 0,
        listStyleType: 'none',
        columns: { xs: 2, sm: 3, md: 6, lg: 6 },
      }}
    >
      {channels.map((c, index) => (
        <li key={index} style={{ breakInside: 'avoid' as const }}>
          <ChannelThumbnail channel={c} channels={channels} category={category} />
        </li>
      ))}
    </Box>
  )
}
