import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from '@mui/material/Button'
import Layout from '../layouts/Layout'
import SEO from '../components/SEO'
import { api } from '../config'
import { useAuth } from '../lib/auth'

interface CreditPackage {
  id: string
  credits: number
  price: number
  label: string
}

const packages: CreditPackage[] = [
  { id: '10', credits: 10, price: 20, label: '10 credits — $20' },
  { id: '25', credits: 25, price: 40, label: '25 credits — $40' },
  { id: '50', credits: 50, price: 70, label: '50 credits — $70' },
]

export default function CreditsPage() {
  const { user, loading: authLoading } = useAuth()
  const [balance, setBalance] = useState<number | null>(null)
  const [purchasing, setPurchasing] = useState<string | null>(null)
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

  const handlePurchase = async (pkg: CreditPackage) => {
    setPurchasing(pkg.id)
    setError(null)
    try {
      const { data } = await api.post('credits/checkout', { package_id: pkg.id })
      window.location.href = data.url
    } catch {
      setError('Failed to start checkout. Please try again.')
      setPurchasing(null)
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
        <div style={{
          padding: 20,
          background: '#f0faf4',
          borderRadius: 8,
          marginBottom: 30,
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 0 }}>
            Payment successful! Your credits have been added.
          </p>
        </div>
      )}

      {canceled && (
        <div style={{
          padding: 20,
          background: '#fff8e1',
          borderRadius: 8,
          marginBottom: 30,
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 16, marginBottom: 0, color: '#666' }}>
            Checkout canceled. No charges were made.
          </p>
        </div>
      )}

      <h2 style={{ fontWeight: 400 }}>Credits</h2>

      <div style={{
        padding: 20,
        background: '#f9f9f9',
        borderRadius: 8,
        marginBottom: 30,
        display: 'flex',
        alignItems: 'center',
        gap: 15,
      }}>
        <div>
          <div style={{ fontSize: 14, color: '#666' }}>Your balance</div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>
            {balance !== null ? balance : '...'}
          </div>
          <div style={{ fontSize: 13, color: '#999' }}>credits</div>
        </div>
      </div>

      <h3 style={{ fontWeight: 400, marginBottom: 20 }}>Buy credits</h3>
      <p style={{ color: '#999', fontSize: 14, marginBottom: 20 }}>
        Each credit lets you submit your track to one YouTube channel curator.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
        {packages.map(pkg => (
          <div
            key={pkg.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 15,
              border: '1px solid #eee',
              borderRadius: 8,
              background: 'white',
            }}
          >
            <div>
              <div style={{ fontWeight: 700 }}>{pkg.credits} credits</div>
              <div style={{ color: '#666', fontSize: 13 }}>
                ${pkg.price} (${(pkg.price / pkg.credits).toFixed(2)}/credit)
              </div>
            </div>
            <Button
              variant="contained"
              size="small"
              disabled={purchasing !== null}
              onClick={() => handlePurchase(pkg)}
              sx={{
                backgroundColor: '#1DB954',
                '&:hover': { backgroundColor: '#1aa34a' },
                textTransform: 'none',
              }}
            >
              {purchasing === pkg.id ? 'Loading...' : `$${pkg.price}`}
            </Button>
          </div>
        ))}
      </div>

      {error && (
        <p style={{ color: '#d32f2f', fontSize: 14, marginTop: 15 }}>{error}</p>
      )}
    </Layout>
  )
}
