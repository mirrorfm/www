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

export default function GenresPage() {
  const [genres, setGenres] = useState<GenreCount[]>([])
  const [graphData, setGraphData] = useState<GraphData | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'chart' | 'graph'>('graph')
  const graphRef = useRef<any>(null)

  useEffect(() => {
    Promise.all([
      api.get('genres'),
      api.get('genres/graph'),
    ]).then(([genresRes, graphRes]) => {
      setGenres(genresRes.data.genres || [])
      const nodes = (graphRes.data.nodes || []).map((n: GenreCount) => ({ id: n.name, count: n.count }))
      const links = (graphRes.data.links || []).map((l: any) => ({ source: l.source, target: l.target, weight: l.weight }))
      setGraphData({ nodes, links })
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const maxCount = genres.length > 0 ? genres[0].count : 1
  const maxNodeCount = graphData ? Math.max(...graphData.nodes.map(n => n.count), 1) : 1
  const maxWeight = graphData ? Math.max(...graphData.links.map(l => l.weight), 1) : 1

  const paintNode = useCallback((node: any, ctx: CanvasRenderingContext2D) => {
    const size = 3 + (node.count / maxNodeCount) * 12
    ctx.beginPath()
    ctx.arc(node.x, node.y, size, 0, 2 * Math.PI)
    ctx.fillStyle = '#1DB954'
    ctx.fill()

    ctx.font = `${Math.max(3, size * 0.7)}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#ccc'
    ctx.fillText(node.id, node.x, node.y + size + 6)
  }, [maxNodeCount])

  return (
    <Layout>
      <SEO title="Genres" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontWeight: 400, margin: 0 }}>Genres</h2>
          <p style={{ color: '#888', fontSize: 14, margin: '4px 0 0' }}>
            {genres.length > 0 ? `${genres.length} genres across all channels` : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => setTab('graph')} style={{
            padding: '6px 14px', fontSize: 13, border: '1px solid #444', borderRadius: 4, cursor: 'pointer',
            background: tab === 'graph' ? '#1DB954' : 'transparent', color: tab === 'graph' ? 'white' : '#999',
          }}>Graph</button>
          <button onClick={() => setTab('chart')} style={{
            padding: '6px 14px', fontSize: 13, border: '1px solid #444', borderRadius: 4, cursor: 'pointer',
            background: tab === 'chart' ? '#1DB954' : 'transparent', color: tab === 'chart' ? 'white' : '#999',
          }}>List</button>
        </div>
      </div>

      {loading ? (
        <p style={{ color: '#999' }}>Loading...</p>
      ) : tab === 'graph' && graphData ? (
        <div style={{ border: '1px solid #333', borderRadius: 8, overflow: 'hidden', background: '#1a1a1a' }}>
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            width={Math.min(window.innerWidth - 60, 1220)}
            height={600}
            backgroundColor="#1a1a1a"
            nodeCanvasObject={paintNode}
            nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
              const size = 3 + (node.count / maxNodeCount) * 12
              ctx.beginPath()
              ctx.arc(node.x, node.y, size + 4, 0, 2 * Math.PI)
              ctx.fillStyle = color
              ctx.fill()
            }}
            linkColor={() => 'rgba(29, 185, 84, 0.15)'}
            linkWidth={(link: any) => 0.5 + (link.weight / maxWeight) * 2}
            d3VelocityDecay={0.4}
            d3AlphaDecay={0.02}
            cooldownTicks={200}
            onEngineStop={() => graphRef.current?.zoomToFit(400, 40)}
            onNodeClick={(node: any) => {
              if (graphRef.current) {
                graphRef.current.centerAt(node.x, node.y, 500)
                graphRef.current.zoom(3, 500)
              }
            }}
          />
        </div>
      ) : tab === 'chart' ? (
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
