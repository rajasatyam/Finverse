import InfoPageLayout from '../components/InfoPageLayout';

const ContactPage = () => (
  <InfoPageLayout
    title="Contact Us"
    subtitle="Questions, feedback, or bug reports — we read everything that comes in."
  >
    <section>
      <div className="flex flex-col gap-1 p-5 rounded-xl bg-white/5 border border-white/10">
        <span className="text-gold text-xs font-semibold uppercase tracking-wider">Email</span>
        <a href="mailto:vionix37@gmail.com" className="text-white text-lg hover:text-gold transition-colors">
          vionix37@gmail.com
        </a>
      </div>
    </section>

    <section>
      <p>
        We're a small team, so response times can vary, but we do read and respond to every message —
        whether it's a feature suggestion, a bug you've run into, or a question about how something works.
      </p>
    </section>
  </InfoPageLayout>
);

export default ContactPage;
