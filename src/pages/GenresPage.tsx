import { useState, useEffect, useRef, useCallback } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import Layout from '../layouts/Layout'
import SEO from '../components/SEO'
import { api } from '../config'

interface GenreCount {
  name: string
  count: number
}

interface GraphNode {
  id: string
  count: number
}

interface GraphLink {
  source: string
  target: string
  weight: number
}

interface GraphData {
  nodes: GraphNode[]
  links: GraphLink[]
}

interface ChannelNode {
  id: string
  channel_name: string
  thumbnail: string
  followers: number
  genres: string[]
}

interface ChannelLink {
  source: string
  target: string
  shared_genres: string[]
  weight: number
}

interface ChannelGraphData {
  nodes: ChannelNode[]
  links: ChannelLink[]
}

type Tab = 'channels' | 'genres' | 'list'

export default function GenresPage() {
  const [genres, setGenres] = useState<GenreCount[]>([])
  const [graphData, setGraphData] = useState<GraphData | null>(null)
  const [channelGraphData, setChannelGraphData] = useState<ChannelGraphData | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('channels')
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const graphRef = useRef<any>(null)
  const channelGraphRef = useRef<any>(null)
  const [channelImages, setChannelImages] = useState<Map<string, HTMLImageElement>>(new Map())

  useEffect(() => {
    Promise.all([
      api.get('genres'),
      api.get('genres/graph'),
      api.get('channels/graph'),
    ]).then(([genresRes, graphRes, chGraphRes]) => {
      setGenres(genresRes.data.genres || [])
      const nodes = (graphRes.data.nodes || []).map((n: GenreCount) => ({ id: n.name, count: n.count }))
      const links = (graphRes.data.links || []).map((l: any) => ({ source: l.source, target: l.target, weight: l.weight }))
      setGraphData({ nodes, links })

      const chNodes: ChannelNode[] = chGraphRes.data.nodes || []
      const chLinks: ChannelLink[] = chGraphRes.data.links || []
      setChannelGraphData({ nodes: chNodes, links: chLinks })

      // Preload channel thumbnails
      const imgs = new Map<string, HTMLImageElement>()
      for (const node of chNodes) {
        if (node.thumbnail) {
          const img = new Image()
          img.src = node.thumbnail
          imgs.set(node.id, img)
        }
      }
      setChannelImages(imgs)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const maxCount = genres.length > 0 ? genres[0].count : 1
  const maxNodeCount = graphData ? Math.max(...graphData.nodes.map(n => n.count), 1) : 1
  const maxWeight = graphData ? Math.max(...graphData.links.map(l => l.weight), 1) : 1

  // Connected nodes for genre graph highlighting
  const connectedGenreNodes = new Set<string>()
  if (selectedNode && graphData && tab === 'genres') {
    connectedGenreNodes.add(selectedNode)
    for (const link of graphData.links) {
      const src = typeof link.source === 'object' ? (link.source as any).id : link.source
      const tgt = typeof link.target === 'object' ? (link.target as any).id : link.target
      if (src === selectedNode) connectedGenreNodes.add(tgt)
      if (tgt === selectedNode) connectedGenreNodes.add(src)
    }
  }

  // Connected nodes for channel graph highlighting
  const connectedChannelNodes = new Set<string>()
  let selectedChannelInfo: ChannelNode | null = null
  if (selectedNode && channelGraphData && tab === 'channels') {
    connectedChannelNodes.add(selectedNode)
    selectedChannelInfo = channelGraphData.nodes.find(n => n.id === selectedNode) || null
    for (const link of channelGraphData.links) {
      const src = typeof link.source === 'object' ? (link.source as any).id : link.source
      const tgt = typeof link.target === 'object' ? (link.target as any).id : link.target
      if (src === selectedNode) connectedChannelNodes.add(tgt)
      if (tgt === selectedNode) connectedChannelNodes.add(src)
    }
  }

  const paintGenreNode = useCallback((node: any, ctx: CanvasRenderingContext2D) => {
    const isHighlighted = !selectedNode || connectedGenreNodes.has(node.id)
    const isSelected = node.id === selectedNode
    const dimmed = selectedNode && !isHighlighted

    const size = isSelected ? 7 : 5
    const intensity = 0.3 + (node.count / maxNodeCount) * 0.7
    const alpha = dimmed ? 0.1 : 1

    ctx.beginPath()
    ctx.arc(node.x, node.y, size, 0, 2 * Math.PI)
    ctx.fillStyle = `rgba(${Math.round(29 * intensity)},${Math.round(185 * intensity)},${Math.round(84 * intensity)},${alpha})`
    ctx.fill()

    if (isSelected) {
      ctx.strokeStyle = '#1DB954'
      ctx.lineWidth = 1.5
      ctx.stroke()
    }

    ctx.font = `${isSelected ? '6' : '4'}px sans-serif`
    ctx.textAlign = 'center'
    ctx.fillStyle = `rgba(200,200,200,${dimmed ? 0.05 : 0.7})`
    ctx.fillText(node.id, node.x, node.y + (isSelected ? 14 : 10))
  }, [maxNodeCount, selectedNode, connectedGenreNodes])

  const paintChannelNode = useCallback((node: any, ctx: CanvasRenderingContext2D) => {
    const isHighlighted = !selectedNode || connectedChannelNodes.has(node.id)
    const isSelected = node.id === selectedNode
    const dimmed = selectedNode && !isHighlighted
    const alpha = dimmed ? 0.1 : 1

    const size = isSelected ? 10 : 6
    const img = channelImages.get(node.id)

    if (img && img.complete && img.naturalWidth > 0) {
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.beginPath()
      ctx.arc(node.x, node.y, size, 0, 2 * Math.PI)
      ctx.closePath()
      ctx.clip()
      ctx.drawImage(img, node.x - size, node.y - size, size * 2, size * 2)
      ctx.restore()

      if (isSelected) {
        ctx.beginPath()
        ctx.arc(node.x, node.y, size + 1, 0, 2 * Math.PI)
        ctx.strokeStyle = '#1DB954'
        ctx.lineWidth = 2
        ctx.stroke()
      }
    } else {
      ctx.beginPath()
      ctx.arc(node.x, node.y, size, 0, 2 * Math.PI)
      ctx.fillStyle = `rgba(29,185,84,${alpha})`
      ctx.fill()
    }

    if (isSelected || !selectedNode) {
      ctx.font = `${isSelected ? '5' : '3'}px sans-serif`
      ctx.textAlign = 'center'
      ctx.fillStyle = `rgba(200,200,200,${dimmed ? 0.05 : 0.6})`
      ctx.fillText(node.channel_name || '', node.x, node.y + size + 6)
    }
  }, [selectedNode, connectedChannelNodes, channelImages])

  const tabStyle = (t: Tab) => ({
    padding: '6px 14px', fontSize: 13, border: '1px solid #444', borderRadius: 4, cursor: 'pointer' as const,
    background: tab === t ? '#1DB954' : 'transparent', color: tab === t ? 'white' : '#999',
  })

  return (
    <Layout>
      <SEO title="Genres" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontWeight: 400, margin: 0 }}>Genres</h2>
          <p style={{ color: '#888', fontSize: 14, margin: '4px 0 0' }}>
            {tab === 'channels' && channelGraphData ? `${channelGraphData.nodes.length} channels connected by shared genres` : ''}
            {tab === 'genres' && graphData ? `${graphData.nodes.length} genres connected across channels` : ''}
            {tab === 'list' && genres.length > 0 ? `${genres.length} genres across all channels` : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => { setTab('channels'); setSelectedNode(null) }} style={tabStyle('channels')}>Channels</button>
          <button onClick={() => { setTab('genres'); setSelectedNode(null) }} style={tabStyle('genres')}>Genres</button>
          <button onClick={() => { setTab('list'); setSelectedNode(null) }} style={tabStyle('list')}>List</button>
        </div>
      </div>

      {/* Selected channel info */}
      {selectedChannelInfo && tab === 'channels' && (
        <div style={{ padding: 12, background: '#262626', borderRadius: 8, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12, fontSize: 13 }}>
          {selectedChannelInfo.thumbnail && (
            <img src={selectedChannelInfo.thumbnail} alt="" style={{ width: 32, height: 32, borderRadius: '50%' }} />
          )}
          <div>
            <div style={{ fontWeight: 600 }}>{selectedChannelInfo.channel_name}</div>
            <div style={{ color: '#888' }}>
              {selectedChannelInfo.followers.toLocaleString()} followers
              {selectedChannelInfo.genres?.length > 0 && ` · ${selectedChannelInfo.genres.join(', ')}`}
            </div>
          </div>
          <div style={{ marginLeft: 'auto', color: '#666' }}>
            {connectedChannelNodes.size - 1} similar channels
          </div>
        </div>
      )}

      {loading ? (
        <p style={{ color: '#999' }}>Loading...</p>
      ) : tab === 'channels' && channelGraphData ? (
        <div style={{ border: '1px solid #333', borderRadius: 8, overflow: 'hidden', background: '#1a1a1a' }}>
          <ForceGraph2D
            ref={channelGraphRef}
            graphData={channelGraphData}
            width={Math.min(window.innerWidth - 60, 1220)}
            height={600}
            backgroundColor="#1a1a1a"
            nodeCanvasObject={paintChannelNode}
            nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
              ctx.beginPath()
              ctx.arc(node.x, node.y, 12, 0, 2 * Math.PI)
              ctx.fillStyle = color
              ctx.fill()
            }}
            linkColor={(link: any) => {
              if (!selectedNode) return 'rgba(29, 185, 84, 0.08)'
              const src = typeof link.source === 'object' ? link.source.id : link.source
              const tgt = typeof link.target === 'object' ? link.target.id : link.target
              if (src === selectedNode || tgt === selectedNode) return 'rgba(29, 185, 84, 0.5)'
              return 'rgba(29, 185, 84, 0.02)'
            }}
            linkWidth={(link: any) => {
              if (!selectedNode) return 0.5
              const src = typeof link.source === 'object' ? link.source.id : link.source
              const tgt = typeof link.target === 'object' ? link.target.id : link.target
              if (src === selectedNode || tgt === selectedNode) return link.weight
              return 0.3
            }}
            d3VelocityDecay={0.4}
            d3AlphaDecay={0.02}
            cooldownTicks={200}
            onEngineStop={() => channelGraphRef.current?.zoomToFit(400, 40)}
            onNodeClick={(node: any) => setSelectedNode(prev => prev === node.id ? null : node.id)}
            onBackgroundClick={() => setSelectedNode(null)}
          />
        </div>
      ) : tab === 'genres' && graphData ? (
        <div style={{ border: '1px solid #333', borderRadius: 8, overflow: 'hidden', background: '#1a1a1a' }}>
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            width={Math.min(window.innerWidth - 60, 1220)}
            height={600}
            backgroundColor="#1a1a1a"
            nodeCanvasObject={paintGenreNode}
            nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
              ctx.beginPath()
              ctx.arc(node.x, node.y, 10, 0, 2 * Math.PI)
              ctx.fillStyle = color
              ctx.fill()
            }}
            linkColor={(link: any) => {
              if (!selectedNode) return 'rgba(29, 185, 84, 0.15)'
              const src = typeof link.source === 'object' ? link.source.id : link.source
              const tgt = typeof link.target === 'object' ? link.target.id : link.target
              if (src === selectedNode || tgt === selectedNode) return 'rgba(29, 185, 84, 0.6)'
              return 'rgba(29, 185, 84, 0.03)'
            }}
            linkWidth={(link: any) => 0.5 + (link.weight / maxWeight) * 2}
            d3VelocityDecay={0.4}
            d3AlphaDecay={0.02}
            cooldownTicks={200}
            onEngineStop={() => graphRef.current?.zoomToFit(400, 40)}
            onNodeClick={(node: any) => setSelectedNode(prev => prev === node.id ? null : node.id)}
            onBackgroundClick={() => setSelectedNode(null)}
          />
        </div>
      ) : tab === 'list' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {genres.map(g => (
            <div key={g.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0' }}>
              <div style={{ width: 200, fontSize: 13, color: '#ccc', textAlign: 'right', flexShrink: 0 }}>
                {g.name}
              </div>
              <div style={{ flex: 1, height: 16, background: '#222', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${(g.count / maxCount) * 100}%`,
                  background: '#1DB954',
                  borderRadius: 2,
                  minWidth: 2,
                }} />
              </div>
              <div style={{ width: 50, fontSize: 12, color: '#666', flexShrink: 0 }}>
                {g.count.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </Layout>
  )
}
