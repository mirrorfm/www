import { Link } from 'react-router-dom'
import Layout from '../layouts/Layout'
import SEO from '../components/SEO'

export default function PrivacyPage() {
  return (
    <Layout>
      <SEO title="Privacy Policy" />
      <Link style={{ float: 'right', textDecoration: 'none', fontSize: 30 }} to="/">←</Link>
      <h2>Privacy Policy</h2>
      <p style={{ color: '#999', fontSize: 13 }}>Last updated: 2026-05-10</p>

      <p>
        This privacy policy describes how Mirror.FM ("we", "us", or "our")
        collects, uses, and shares information when you use our website
        and services.
      </p>

      <h3>Use of YouTube API Services</h3>
      <p>
        Mirror.FM uses YouTube API Services. By using Mirror.FM, you also
        agree to be bound by the{' '}
        <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer">
          YouTube Terms of Service
        </a>
        . Information that we receive about you and your activity through
        the YouTube API is also subject to the{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
          Google Privacy Policy
        </a>
        .
      </p>
      <p>
        You may revoke Mirror.FM's access to your data via the Google
        security settings page at{' '}
        <a href="https://security.google.com/settings/security/permissions" target="_blank" rel="noopener noreferrer">
          https://security.google.com/settings/security/permissions
        </a>
        .
      </p>

      <h3>Information we collect</h3>
      <p>
        Depending on how you use Mirror.FM, we may collect:
      </p>
      <ul>
        <li>
          <strong>Public channel information</strong> retrieved through the
          YouTube API for channels listed in our community-curated public
          dataset (channel name, channel ID, public thumbnails, public
          uploads playlist identifier, public video titles and publish
          dates).
        </li>
        <li>
          <strong>Account information</strong> if you sign in: your name,
          email address, and authentication identifiers, provided via your
          identity provider.
        </li>
        <li>
          <strong>Submissions</strong> if you submit content or messages
          (including any contact form): the message content and any contact
          details you provide.
        </li>
        <li>
          <strong>Payment information</strong> if you make a payment: name
          and email associated with your payment, processed by our payment
          provider. We do not receive or store your card details.
        </li>
        <li>
          <strong>Technical data</strong>: limited request metadata logged
          by our infrastructure (IP address, user agent, request time)
          retained for security and operations purposes.
        </li>
      </ul>

      <h3>How we use information</h3>
      <ul>
        <li>To operate the Mirror.FM service and keep public datasets up to date.</li>
        <li>To respond to your messages, takedown requests, or submissions.</li>
        <li>To process payments where applicable.</li>
        <li>To detect and prevent abuse.</li>
        <li>To improve the service.</li>
      </ul>

      <h3>How we share information</h3>
      <p>
        We do not sell personal data. We share information with the
        following categories of service providers strictly to operate
        Mirror.FM:
      </p>
      <ul>
        <li><strong>Cloud infrastructure</strong> (Amazon Web Services) — hosting, storage, logs.</li>
        <li><strong>Authentication</strong> (Google Firebase) — sign-in.</li>
        <li><strong>Payment processing</strong> (Stripe) — when you make a payment.</li>
        <li><strong>Music metadata services</strong> — to look up information about tracks and artists referenced on channels.</li>
        <li>
          <strong>YouTube API Services</strong> — to retrieve public channel and video data, in accordance with the{' '}
          <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer">
            YouTube Terms of Service
          </a>{' '}
          and the{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            Google Privacy Policy
          </a>.
        </li>
      </ul>
      <p>
        We may also disclose information when required by law, to enforce
        our terms, or to protect the rights, property, or safety of
        Mirror.FM, our users, or others.
      </p>

      <h3>Third-party content</h3>
      <p>
        Mirror.FM pages may embed or link to third-party content (for
        example, embedded media players or external links). Third parties
        may serve content (including advertisements) and may set their own
        cookies or use similar technologies on your device. Their use of
        information is governed by their own privacy policies.
      </p>

      <h3>Cookies and local storage</h3>
      <p>
        Mirror.FM and the third parties listed above may store, access, or
        collect information on your device — directly or through cookies,
        local storage, or similar technologies — to operate the service,
        remember preferences, sign you in, process payments, and analyze
        usage. You can control cookies through your browser settings.
      </p>

      <h3>Data retention</h3>
      <p>
        Public dataset information is retained as long as it remains in our
        community-curated dataset. Account and submission information is
        retained while your account or submission is active and for a
        reasonable period afterward. Technical request logs are retained
        for a limited period for security and debugging.
      </p>

      <h3>Your choices</h3>
      <p>
        You can request access, correction, or deletion of your personal
        information by contacting us at{' '}
        <a href="mailto:mirrordotfm@gmail.com">mirrordotfm@gmail.com</a>.
        Channel owners may request removal of their channel from Mirror.FM
        via the takedown process described on the website.
      </p>

      <h3>Changes</h3>
      <p>
        We may update this policy from time to time. Material changes will
        be reflected on this page with an updated date.
      </p>

      <h3>Contact</h3>
      <p>
        For questions about this policy or your information, contact us at{' '}
        <a href="mailto:mirrordotfm@gmail.com">mirrordotfm@gmail.com</a>.
      </p>
    </Layout>
  )
}
