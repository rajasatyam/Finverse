import React, { useState } from 'react';
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from "firebase/auth";
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import Beams from '../components/Beams';

const AuthPage = ({ mode = 'login' }) => {
  const isSignup = mode === 'signup';
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const googleProvider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (isSignup && !formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (isSignup && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (isSignup && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      if (isSignup) {
        const result = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = result.user;
        await updateProfile(user, {
          displayName: formData.fullName
        });
      } else {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      }
      navigate('/features');
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setErrors({});

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await updateProfile(user, {
        displayName: formData.fullName ? formData.fullName : user.displayName
      });

      navigate('/features');
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white font-sans flex items-center justify-center px-5 py-12 overflow-hidden">
      {/* Beams background — same effect as the landing hero */}
      <div className="absolute inset-0 z-0">
        <Beams
          beamWidth={3.2}
          beamHeight={30}
          beamNumber={20}
          lightColor="#FFD700"
          speed={2.4}
          noiseIntensity={2.6}
          scale={0.18}
          rotation={16}
        />
      </div>
      <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_55%_45%_at_50%_45%,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0.15)_60%,transparent_100%)]" />

      {/* Back to home */}
      <Link
        to="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-gray-400 hover:text-gold text-sm font-medium transition-colors z-20"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-4xl"
      >
        <div className="bg-black/60 border border-white/[0.08] rounded-[32px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.7)] backdrop-blur-md grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column: Informational/Brand Panel */}
          <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-gold/5 via-transparent to-transparent border-r border-white/[0.08]">
            <div className="flex flex-col gap-8">
              <div>
                <span className="text-[11px] uppercase font-bold tracking-widest text-gold bg-gold/10 px-3.5 py-1.5 rounded-full">
                  Financial Literacy Portal
                </span>
                <h2 className="font-sans text-3xl font-extrabold text-white mt-6 leading-tight">
                  Master your money with zero-risk <span className="bg-gradient-to-r from-gold to-amber-300 bg-clip-text text-transparent">simulations</span>.
                </h2>
                <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                  FinEd gives you the tools to learn real-world wealth management, investing, and budgeting in a safe environment.
                </p>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-gold mt-0.5 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Interactive Simulators</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-normal">
                      Simulate credit cards, loan amortization, and real-time stock trading.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-gold mt-0.5 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">AI Study Companion</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-normal">
                      Ask questions and get plain-language answers to complex financial terminology.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-gold mt-0.5 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Expense & Budget Tracker</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-normal">
                      Build healthy savings habits with our personalized budgeting tools.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Authentication Form */}
          <div className="p-8 sm:p-10 flex flex-col justify-center">
            {/* Logo */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
                <img src="/faviconb.png" alt="FinEd logo" className="w-10 h-10 rounded-full object-cover" />
                <span className="font-sans text-3xl font-extrabold">
                  <span className="bg-gradient-to-br from-gold to-gold-dark bg-clip-text text-transparent">Fin</span>
                  <span className="text-white">Ed</span>
                </span>
              </Link>
              <AnimatePresence mode="wait">
                <motion.div
                  key={isSignup ? 'signup' : 'signin'}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <h1 className="font-display text-xl font-bold text-white mb-1">
                    {isSignup ? 'Create your account' : 'Welcome back'}
                  </h1>
                  <p className="text-gray-400 text-sm">
                    {isSignup
                      ? 'Start learning with zero-risk simulations.'
                      : 'Sign in to pick up where you left off.'}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* General error */}
            <AnimatePresence>
              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 mb-5 text-red-400 text-sm text-left">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="break-words">{errors.general}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleAuth} className="flex flex-col gap-4" noValidate>
              {isSignup && (
                <InputField
                  label="Full Name"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  error={errors.fullName}
                />
              )}

              <InputField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                error={errors.email}
              />

              <InputField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={isSignup ? "Create a password" : "Enter your password"}
                error={errors.password}
                hint={isSignup ? "Must be at least 6 characters long" : ""}
              />

              {isSignup && (
                <InputField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  error={errors.confirmPassword}
                />
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-sans font-bold text-sm uppercase tracking-wider text-black bg-gradient-to-br from-gold to-gold-dark shadow-[0_8px_30px_rgba(255,215,0,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(255,215,0,0.4)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading
                  ? isSignup
                    ? "Creating account…"
                    : "Signing in…"
                  : isSignup
                  ? "Create Account"
                  : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-gray-500 text-xs font-semibold uppercase tracking-widest">or</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Google Button */}
            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-full bg-white/[0.04] border border-white/[0.12] text-white text-sm font-semibold transition-all duration-300 hover:bg-white/[0.08] hover:border-gold/40 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              <svg className="flex-shrink-0" viewBox="0 0 24 24" width="18" height="18">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {isSignup ? "Continue with Google" : "Sign in with Google"}
            </button>

            {/* Toggle — navigates to the other auth route rather than flipping local state */}
            <p className="mt-7 text-center text-gray-400 text-sm">
              {isSignup ? "Already have an account?" : "Don't have an account?"}
              <Link
                to={isSignup ? '/login' : '/signup'}
                className="ml-1.5 text-gold font-semibold hover:text-amber-300 transition-colors"
              >
                {isSignup ? "Sign In" : "Sign Up"}
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-gray-500 text-xs leading-relaxed">
          By continuing, you agree to our{' '}
          <Link to="/terms" className="text-gray-400 hover:text-gold underline underline-offset-2 transition-colors">Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy" className="text-gray-400 hover:text-gold underline underline-offset-2 transition-colors">Privacy Policy</Link>.
        </p>
      </motion.div>
    </div>
  );
};

function InputField({ label, name, type, value, onChange, placeholder, error, hint }) {
  return (
    <div className="text-left">
      <label htmlFor={name} className="block text-gray-300 text-sm font-medium mb-1.5">{label}</label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl bg-black/40 border text-white placeholder-gray-600 text-[15px] outline-none transition-all duration-200 focus:border-gold/60 focus:ring-2 focus:ring-gold/15 ${
          error ? 'border-red-500/60' : 'border-white/[0.12]'
        }`}
      />
      {error && (
        <span className="mt-1.5 flex items-center gap-1.5 text-red-400 text-xs">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </span>
      )}
      {hint && !error && <div className="mt-1.5 text-gray-600 text-xs">{hint}</div>}
    </div>
  );
}

export default AuthPage;
