import InfoPageLayout from '../components/InfoPageLayout';
import Brand from '../components/Brand';

const TermsPage = () => (
  <InfoPageLayout
    title="Terms of Service"
    subtitle="Last updated: September 2025"
  >
    <section>
      <h2 className="text-white font-sans font-semibold text-xl mb-3">Using <Brand /></h2>
      <p>By creating an account and using <Brand />, you agree to the terms below.</p>
    </section>

    <section>
      <h2 className="text-white font-sans font-semibold text-xl mb-3">Your responsibilities</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>Provide accurate information when signing up</li>
        <li>Keep your account credentials secure</li>
        <li>Use the platform for its intended, educational purpose</li>
        <li>Be respectful of other users in the community space</li>
      </ul>
    </section>

    <section>
      <h2 className="text-white font-sans font-semibold text-xl mb-3">What <Brand /> is (and isn't)</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>All simulators, calculators, and AI responses are for educational purposes only</li>
        <li>Nothing on this platform is professional financial, investment, or legal advice</li>
        <li>You're responsible for any financial decisions you make outside the platform</li>
        <li>Features and content may change as the platform develops</li>
      </ul>
    </section>

    <section>
      <h2 className="text-white font-sans font-semibold text-xl mb-3">Community guidelines</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>No spam, harassment, or abusive behavior</li>
        <li>Share knowledge and help other learners in good faith</li>
        <li>Report issues to us directly so we can act on them</li>
      </ul>
    </section>

    <section>
      <h2 className="text-white font-sans font-semibold text-xl mb-3">Availability</h2>
      <p>
        <Brand className="mr-1" /> is a small, actively developed project. We aim to keep it running reliably, but as with any
        small platform, occasional downtime or changes should be expected.
      </p>
    </section>
  </InfoPageLayout>
);

export default TermsPage;
