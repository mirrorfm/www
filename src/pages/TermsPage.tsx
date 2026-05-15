import { Link } from 'react-router-dom'
import Layout from '../layouts/Layout'
import SEO from '../components/SEO'

export default function TermsPage() {
  return (
    <Layout>
      <SEO title="Terms of Use" />
      <Link style={{ float: 'right', textDecoration: 'none', fontSize: 30 }} to="/">←</Link>
      <h2>Terms of Use</h2>
      <p style={{ color: '#999', fontSize: 13 }}>Last updated: 2026-05-10</p>

      <p>
        These Terms of Use ("Terms") govern your use of the Mirror.FM
        website and services ("Mirror.FM", "we", "us", or "our"). By using
        Mirror.FM, you agree to these Terms.
      </p>

      <h3>YouTube Terms of Service</h3>
      <p>
        Mirror.FM uses YouTube API Services. By using Mirror.FM, you also
        agree to be bound by the{' '}
        <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer">
          YouTube Terms of Service
        </a>
        .
      </p>

      <h3>What Mirror.FM does</h3>
      <p>
        Mirror.FM maintains a community-curated public list of music
        YouTube channels and provides tools and integrations around that
        list. The community-curated list is published openly at{' '}
        <a href="https://github.com/mirrorfm/data" target="_blank" rel="noopener noreferrer">
          github.com/mirrorfm/data
        </a>
        .
      </p>

      <h3>Acceptable use</h3>
      <p>You agree not to:</p>
      <ul>
        <li>Use Mirror.FM for any unlawful purpose.</li>
        <li>Attempt to access accounts, data, or systems you are not authorized to access.</li>
        <li>Disrupt, overload, or attempt to disable Mirror.FM or its infrastructure.</li>
        <li>Submit content you do not have the right to submit.</li>
        <li>Use Mirror.FM to harass, defame, or harm any person.</li>
        <li>Reverse engineer, copy, or scrape data from Mirror.FM in violation of applicable terms.</li>
      </ul>

      <h3>Submissions and content</h3>
      <p>
        If you submit content (for example, suggesting a channel, sending
        a takedown request, or contacting us), you are responsible for that
        content and for ensuring you have the right to submit it. We may
        remove submissions at our discretion. Submissions to the public
        community-curated list at{' '}
        <a href="https://github.com/mirrorfm/data" target="_blank" rel="noopener noreferrer">
          github.com/mirrorfm/data
        </a>{' '}
        are governed by that repository's own contribution terms.
      </p>

      <h3>Channel owners</h3>
      <p>
        Channel owners may request removal of their channel from Mirror.FM
        at any time via the takedown process or by contacting us at{' '}
        <a href="mailto:mirrordotfm@gmail.com">mirrordotfm@gmail.com</a>.
      </p>

      <h3>Payments</h3>
      <p>
        If you make a payment through Mirror.FM, the payment is processed
        by our payment provider. The terms applicable to that payment will
        be presented at the time of purchase. Refunds, when offered, are
        subject to the conditions presented at purchase.
      </p>

      <h3>No warranty</h3>
      <p>
        Mirror.FM is provided "as is", without warranty of any kind. We do
        not warrant that the service will be uninterrupted, error-free, or
        free of harmful components, and we do not warrant the accuracy,
        completeness, or reliability of any data displayed on Mirror.FM.
      </p>

      <h3>Limitation of liability</h3>
      <p>
        To the fullest extent permitted by law, Mirror.FM and its
        contributors will not be liable for any indirect, incidental,
        special, consequential, or punitive damages arising out of or in
        connection with your use of Mirror.FM.
      </p>

      <h3>Privacy</h3>
      <p>
        Your use of Mirror.FM is also subject to our{' '}
        <Link to="/privacy/">Privacy Policy</Link>, which describes how we
        collect, use, and share information.
      </p>

      <h3>Third parties</h3>
      <p>
        Mirror.FM may link to or embed third-party content. We are not
        responsible for third-party services and their use of your
        information is governed by their own terms and privacy policies.
      </p>

      <h3>Changes</h3>
      <p>
        We may update these Terms from time to time. Material changes will
        be reflected on this page with an updated date. Your continued use
        of Mirror.FM after a change constitutes acceptance of the updated
        Terms.
      </p>

      <h3>Contact</h3>
      <p>
        For questions about these Terms, contact us at{' '}
        <a href="mailto:mirrordotfm@gmail.com">mirrordotfm@gmail.com</a>.
      </p>
    </Layout>
  )
}
