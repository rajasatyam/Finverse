import InfoPageLayout from '../components/InfoPageLayout';

const PrivacyPolicyPage = () => (
  <InfoPageLayout
    title="Privacy Policy"
    subtitle="Last updated: September 2025"
  >
    <section>
      <h2 className="text-white font-sans font-semibold text-xl mb-3">Information we collect</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>Account information (name, email, sign-in preferences)</li>
        <li>Data you enter into tools such as the expense tracker or simulators</li>
        <li>Basic usage information used to fix bugs and improve the platform</li>
      </ul>
    </section>

    <section>
      <h2 className="text-white font-sans font-semibold text-xl mb-3">How we use it</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>To run your account and save your progress</li>
        <li>To operate the tools you use (tracker, simulators, chatbot)</li>
        <li>To identify and fix issues with the platform</li>
      </ul>
    </section>

    <section>
      <h2 className="text-white font-sans font-semibold text-xl mb-3">Data handling</h2>
      <p>
        We don't sell your personal information. Access to stored data is limited to what's needed to run
        the platform. As with any online service, no method of storage or transmission is completely risk-free,
        but we take reasonable steps to protect your information.
      </p>
    </section>

    <section>
      <h2 className="text-white font-sans font-semibold text-xl mb-3">Your rights</h2>
      <p>
        You can request access to, or deletion of, your personal data at any time by emailing{' '}
        <a href="mailto:vionix37@gmail.com" className="text-gold hover:underline">vionix37@gmail.com</a>.
      </p>
    </section>
  </InfoPageLayout>
);

export default PrivacyPolicyPage;
