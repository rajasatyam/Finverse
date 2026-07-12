import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { Lock } from 'lucide-react';

// Soft gate: lets anyone see the page, but disables all interaction and
// shows a disclaimer banner + centered CTA prompting login. Used for
// simulators/tools reached from the landing page's feature cards.
const ViewOnlyGate = ({ children }) => {
  const [user, setUser] = useState(undefined); // undefined = still checking
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  // Reset dismissed state on route change or user changes
  useEffect(() => {
    setDismissed(false);
  }, [children]);

  if (user === undefined) {
    return <div className="min-h-screen bg-[#0a0a0a]" />;
  }

  if (user) {
    return children;
  }

  return (
    <div className="relative">
      {/* Disclaimer banner */}
      <div className="fixed top-0 left-0 right-0 z-[900] bg-gold text-black text-sm font-semibold px-4 py-2.5 flex items-center justify-center gap-2 text-center shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
        <Lock className="w-4 h-4 flex-shrink-0" />
        <span>
          {dismissed ? (
            <>
              You are in a read-only preview.{' '}
              <button onClick={() => navigate('/login')} className="underline underline-offset-2 font-bold cursor-pointer">
                Log in
              </button>{' '}
              to save your progress and unlock all features.
            </>
          ) : (
            <>
              You're viewing a preview.{' '}
              <button onClick={() => navigate('/login')} className="underline underline-offset-2 font-bold cursor-pointer">
                Log in
              </button>{' '}
              to actually use this tool.
            </>
          )}
        </span>
      </div>

      {/* Disabled, dimmed page content */}
      <div className={dismissed ? "pt-9" : "pointer-events-none select-none opacity-50 blur-[1.5px] pt-9"}>
        {children}
      </div>

      {/* Centered CTA overlay */}
      {!dismissed && (
        <div className="fixed inset-0 z-[950] flex items-start justify-center pt-32 sm:pt-40 px-5 pointer-events-none">
          <div className="pointer-events-auto bg-[#0a0a0a] border border-gold/25 rounded-3xl p-7 sm:p-8 max-w-sm w-full text-center shadow-[0_30px_80px_rgba(0,0,0,0.8)]">
            <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-gold/10 border border-gold/25 flex items-center justify-center text-gold">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-white mb-2">Preview mode</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              This is a read-only preview. Log in to start using this tool for real.
            </p>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => navigate('/login')}
                className="w-full px-5 py-3 rounded-full font-bold text-sm uppercase tracking-wider text-black bg-gradient-to-br from-gold to-gold-dark cursor-pointer"
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="w-full px-5 py-3 rounded-full font-semibold text-sm text-gray-300 border border-white/15 hover:border-gold hover:text-gold transition-colors cursor-pointer"
              >
                Create an account
              </button>
              <button
                onClick={() => setDismissed(true)}
                className="w-full px-5 py-3 rounded-full font-semibold text-sm text-gold hover:bg-gold/10 border border-gold/25 transition-colors cursor-pointer"
              >
                Continue in Read-Only Mode
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewOnlyGate;
