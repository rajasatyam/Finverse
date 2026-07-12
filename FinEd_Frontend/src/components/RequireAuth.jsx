import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

// Hard gate: redirects to /login if the user isn't signed in. Used for
// routes that must not be viewable at all without auth (e.g. Market Insights).
const RequireAuth = ({ children }) => {
  const [status, setStatus] = useState('checking'); // 'checking' | 'authed' | 'guest'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setStatus(user ? 'authed' : 'guest');
    });
    return () => unsubscribe();
  }, []);

  if (status === 'checking') {
    return <div className="min-h-screen bg-[#0a0a0a]" />;
  }

  if (status === 'guest') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireAuth;
