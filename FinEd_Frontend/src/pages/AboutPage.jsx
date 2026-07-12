import InfoPageLayout from '../components/InfoPageLayout';
import Brand from '../components/Brand';

const AboutPage = () => (
  <InfoPageLayout
    title={<>About <Brand /></>}
    subtitle="Financial education that's built to be used, not just read."
  >
    <section>
      <h2 className="text-white font-sans font-semibold text-xl mb-3">Why we built this</h2>
      <p>
        Most financial literacy resources are either too dry to finish or too generic to be useful.
        <Brand className="mx-1" /> was built to close that gap — a place to actually practice the decisions that matter,
        like taking a loan, using a credit card, or investing, before you have to make them for real.
      </p>
    </section>

    <section>
      <h2 className="text-white font-sans font-semibold text-xl mb-3">What's on the platform</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>Credit card and loan simulators that walk through real repayment mechanics</li>
        <li>A stock market simulator for practicing investing without real money</li>
        <li>An expense tracker and savings tools for everyday budgeting</li>
        <li>An AI chatbot for answering personal finance questions as they come up</li>
        <li>A community space to discuss and learn alongside other users</li>
      </ul>
    </section>

    <section>
      <h2 className="text-white font-sans font-semibold text-xl mb-3">Who's behind it</h2>
      <div className="flex flex-col sm:flex-row gap-6 sm:items-center bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 sm:p-7">
        <img
          src="/vionix.jpg"
          alt="VioniX logo"
          className="w-16 h-16 rounded-2xl object-cover border border-gold/20 flex-shrink-0"
        />
        <div>
          <p className="text-gold text-xs font-bold uppercase tracking-widest mb-1.5">Made by devs who care</p>
          <h3 className="font-display text-xl font-bold text-white mb-2">VioniX Dev Group</h3>
          <p className="text-gray-400 text-sm sm:text-[15px] leading-relaxed">
            <Brand className="mr-1" /> is built and maintained by VioniX, a small student developer group focused on
            making practical tools rather than just talking about them. This platform is actively evolving and open
            to feedback — if something feels rough around the edges, it's probably because it's new.
          </p>
        </div>
      </div>
    </section>
  </InfoPageLayout>
);

export default AboutPage;
