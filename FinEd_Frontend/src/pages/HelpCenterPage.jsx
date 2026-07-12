import InfoPageLayout from '../components/InfoPageLayout';
import Brand from '../components/Brand';

const faqs = [
  {
    q: <>What makes <Brand /> different?</>,
    a: "It's hands-on. Instead of just reading about credit, loans, or investing, you work through interactive simulators built around real mechanics.",
  },
  {
    q: <>Is <Brand /> free to use?</>,
    a: 'Yes — the core platform, including the simulators, tracker, and chatbot, is free to use.',
  },
  {
    q: 'Is the AI chatbot giving financial advice?',
    a: "No. It's an educational tool meant to explain concepts and answer general questions. It isn't a substitute for advice from a licensed financial professional.",
  },
];

const HelpCenterPage = () => (
  <InfoPageLayout
    title="Help Center"
    subtitle="Getting started and answers to common questions."
  >
    <section>
      <h2 className="text-white font-sans font-semibold text-xl mb-3">Getting started</h2>
      <ol className="list-decimal list-inside space-y-2">
        <li>Create a free account</li>
        <li>Head to the Features page and pick a simulator or tool to start with</li>
        <li>Track your progress and revisit tools any time</li>
        <li>Join the community to ask questions or compare notes</li>
      </ol>
    </section>

    <section>
      <h2 className="text-white font-sans font-semibold text-xl mb-3">Frequently asked questions</h2>
      <div className="space-y-6">
        {faqs.map((item, index) => (
          <div key={index} className="pb-6 border-b border-white/10 last:border-none last:pb-0">
            <p className="text-white font-medium mb-1.5">{item.q}</p>
            <p className="text-gray-400">{item.a}</p>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h2 className="text-white font-sans font-semibold text-xl mb-3">Still stuck?</h2>
      <p>
        Reach out at <a href="mailto:vionix37@gmail.com" className="text-gold hover:underline">vionix37@gmail.com</a> and we'll get back to you.
      </p>
    </section>
  </InfoPageLayout>
);

export default HelpCenterPage;
