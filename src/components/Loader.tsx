const barStyle = (delay: string, height: string, color: string): React.CSSProperties => ({
  width: 4,
  backgroundColor: color,
  borderRadius: 2,
  animation: `equalize 1s ease-in-out ${delay} infinite`,
  height,
})

const colors = ['#fff', '#fff', '#a0dab0', '#1DB954', '#1DB954']

export default function Loader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
      <style>{`
        @keyframes equalize {
          0%, 100% { height: 8px; }
          25% { height: 24px; }
          50% { height: 32px; }
          75% { height: 16px; }
        }
      `}</style>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 36 }}>
        <div style={barStyle('0s', '8px', colors[0])} />
        <div style={barStyle('0.15s', '16px', colors[1])} />
        <div style={barStyle('0.3s', '24px', colors[2])} />
        <div style={barStyle('0.45s', '32px', colors[3])} />
        <div style={barStyle('0.6s', '16px', colors[4])} />
      </div>
    </div>
  )
}
