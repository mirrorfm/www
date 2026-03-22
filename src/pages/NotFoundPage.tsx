import Layout from '../layouts/Layout'
import SEO from '../components/SEO'

export default function NotFoundPage() {
  return (
    <Layout>
      <SEO title="404: Not found" />
      <h1>NOT FOUND</h1>
      <p>You just hit a route that doesn&apos;t exist... the sadness.</p>
    </Layout>
  )
}
