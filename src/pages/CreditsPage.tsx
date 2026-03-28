import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from '@mui/material/Button'
import Layout from '../layouts/Layout'
import SEO from '../components/SEO'
import { api } from '../config'
import { useAuth } from '../lib/auth'

const PLAN = { id: '10', credits: 10, price: 20 }

export default function CreditsPage() {
  const { user, loading: authLoading } = useAuth()
  const [balance, setBalance] = useState<number | null>(null)
  const [purchasing, setPurchasing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const params = new URLSearchParams(window.location.search)
  const success = params.get('success') === 'true'
  const canceled = params.get('canceled') === 'true'

  useEffect(() => {
    if (!user) return
    api.get('credits').then(({ data }) => {
      setBalance(data.balance)
    }).catch(() => {})
  }, [user])

  const handlePurchase = async () => {
    setPurchasing(true)
    setError(null)
    try {
      const { data } = await api.post('credits/checkout', { package_id: PLAN.id })
      window.location.href = data.url
    } catch {
      setError('Failed to start checkout. Please try again.')
      setPurchasing(false)
    }
  }

  if (authLoading) return null

  if (!user) {
    return (
      <Layout>
        <SEO title="Credits" />
        <div style={{ textAlign: 'center', paddingTop: 60 }}>
          <h2 style={{ fontWeight: 400 }}>Sign in to continue</h2>
          <p style={{ color: '#999' }}>You need an account to purchase credits.</p>
          <Link to="/signin/" style={{ color: '#1DB954' }}>Sign in</Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <SEO title="Credits" />

      {success && (
        <div style={{ padding: 16, background: '#f0faf4', borderRadius: 8, marginBottom: 24, textAlign: 'center' }}>
          <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 0 }}>
            Payment successful! Your credits have been added.
          </p>
        </div>
      )}

      {canceled && (
        <div style={{ padding: 16, background: '#fff8e1', borderRadius: 8, marginBottom: 24, textAlign: 'center' }}>
          <p style={{ fontSize: 15, marginBottom: 0, color: '#666' }}>
            Checkout canceled. No charges were made.
          </p>
        </div>
      )}

      <h2 style={{ fontWeight: 400 }}>Credits</h2>

      <div style={{
        padding: 24,
        border: '1px solid #333',
        borderRadius: 10,
        maxWidth: 420,
        marginBottom: 30,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 14, color: '#999' }}>Your balance</div>
            <div style={{ fontSize: 36, fontWeight: 700 }}>{balance !== null ? balance : '...'} <span style={{ fontSize: 16, fontWeight: 400, color: '#999' }}>credits</span></div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #333', paddingTop: 16, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{PLAN.credits} credits &mdash; ${PLAN.price}</div>
          <div style={{ color: '#999', fontSize: 13, marginBottom: 4 }}>
            ${(PLAN.price / PLAN.credits).toFixed(0)} per submission to a YouTube channel curator
          </div>
          <div style={{ color: '#888', fontSize: 13, lineHeight: 1.5 }}>
            Each credit = one submission. Curators have 7 days to respond.
            No response = automatic refund. Full refund available within 60 days if unused.
          </div>
        </div>

        <Button
          variant="contained"
          fullWidth
          disabled={purchasing}
          onClick={handlePurchase}
          sx={{
            backgroundColor: '#1DB954',
            '&:hover': { backgroundColor: '#1aa34a' },
            textTransform: 'none',
            fontSize: 15,
            padding: '10px',
          }}
        >
          {purchasing ? 'Loading...' : `Buy ${PLAN.credits} credits — $${PLAN.price}`}
        </Button>

        {error && (
          <p style={{ color: '#d32f2f', fontSize: 13, marginTop: 12, marginBottom: 0 }}>{error}</p>
        )}
      </div>
    </Layout>
  )
}
