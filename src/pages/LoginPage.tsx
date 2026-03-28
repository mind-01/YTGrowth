import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, TrendingUp, ArrowRight, Loader2, AlertCircle, CheckCircle2, Users, Zap, BarChart3, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export default function LoginPage() {
  const { t } = useLanguage();
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, user } = useAuth();
  const navigate = useNavigate();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }
        await signUpWithEmail(email, password);
        setSuccess("Account created! Please check your email for verification.");
      } else {
        await signInWithEmail(email, password);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || "Google login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8f9fb]">
      {/* LEFT SIDE: Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white p-6 sm:p-12 lg:p-20 overflow-y-auto">
        {/* Logo */}
        <div className="mb-12 lg:mb-20">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-red/20 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black tracking-tighter">
              <span className="text-brand-red">YT</span>
              <span className="text-brand-dark">Growth</span>
            </span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="max-w-md w-full mx-auto my-auto">
          <div className="mb-10">
            <h1 className="text-[28px] lg:text-[32px] font-bold text-brand-dark mb-2 leading-tight">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-brand-gray font-medium">
              {isSignUp 
                ? "Join 10,000+ creators optimizing their channels" 
                : "Log in to access your tools and analytics"}
            </p>
          </div>

          {/* Status Messages */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm font-medium"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3 text-emerald-600 text-sm font-medium"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <p>{success}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gray" />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  className="w-full !pl-12 pr-4 py-4 bg-[#f8f9fb] border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red focus:bg-white transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gray" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  className="w-full !pl-12 pr-12 py-4 bg-[#f8f9fb] border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red focus:bg-white transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-dark transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {!isSignUp && (
                <div className="flex justify-end">
                  <button type="button" className="text-xs font-bold text-brand-red hover:underline">
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            {/* Confirm Password (Sign Up Only) */}
            <AnimatePresence>
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gray" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Confirm Password"
                      className="w-full !pl-12 pr-4 py-4 bg-[#f8f9fb] border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red focus:bg-white transition-all"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#ff2d2d] text-white rounded-xl font-bold text-base hover:bg-[#e62929] transition-all shadow-lg shadow-brand-red/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isSignUp ? "Sign Up" : "Sign In"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#eee]"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em] text-brand-gray">
              <span className="px-4 bg-white">OR CONTINUE WITH</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-4 bg-white border border-[#eee] text-brand-dark rounded-xl font-bold text-sm hover:bg-[#f8f9fb] transition-all flex items-center justify-center gap-3 shadow-sm"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              Google
            </button>
          </div>

          {/* Toggle Sign In/Up */}
          <p className="text-center mt-10 text-sm text-brand-gray font-medium">
            {isSignUp ? "Already have an account?" : "Don't have an account yet?"}{" "}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setSuccess(null);
              }}
              className="text-brand-red font-bold hover:underline ml-1"
            >
              {isSignUp ? "Sign In" : "Create Account"}
            </button>
          </p>
        </div>

        {/* Footer Links */}
        <div className="mt-auto pt-10 flex items-center justify-center gap-8 text-[10px] font-black text-brand-gray uppercase tracking-widest">
          <Link to="/privacy" className="hover:text-brand-red transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-brand-red transition-colors">Terms</Link>
          <Link to="/contact" className="hover:text-brand-red transition-colors">Support</Link>
        </div>
      </div>

      {/* RIGHT SIDE: Visual Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-dark via-brand-dark to-brand-red/20 items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative glass circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-xl w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            {/* Dashboard Mockup */}
            <div className="mb-12 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center text-white">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Channel Growth</div>
                      <div className="text-lg font-bold text-white leading-none">Analytics Dashboard</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { label: 'Subscribers', value: '+12.4k', icon: Users, color: 'text-blue-400' },
                    { label: 'Views', value: '842k', icon: BarChart3, color: 'text-emerald-400' },
                    { label: 'SEO Score', value: '98%', icon: Zap, color: 'text-amber-400' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/5 rounded-2xl p-4 border border-white/5">
                      <stat.icon className={`w-5 h-5 mb-2 ${stat.color}`} />
                      <div className="text-xl font-black text-white">{stat.value}</div>
                      <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Growth Chart Mockup */}
                <div className="h-32 flex items-end gap-1 px-2">
                  {[40, 35, 55, 45, 70, 60, 85, 75, 95, 80, 100].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.5 + (i * 0.05), duration: 1 }}
                      className="flex-1 bg-gradient-to-t from-brand-red/40 to-brand-red rounded-t-sm"
                    />
                  ))}
                </div>
              </motion.div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -right-4 -bottom-4 bg-white rounded-2xl p-4 shadow-2xl flex items-center gap-3 border border-gray-100"
              >
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Status</div>
                  <div className="text-sm font-bold text-gray-900 leading-none">Optimized</div>
                </div>
              </motion.div>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
              Grow Faster on YouTube 🚀
            </h2>
            <p className="text-lg text-white/60 font-medium mb-10 max-w-md mx-auto leading-relaxed">
              Analyze, optimize, and rank your videos using powerful AI tools. Boost views, improve SEO, and grow your channel faster.
            </p>

            {/* Bullet Points */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-10">
              {[
                'Smart SEO Optimization',
                'Real-time Analytics',
                'AI-powered Tools',
                'Trusted by Creators'
              ].map((point, i) => (
                <div key={i} className="flex items-center gap-3 text-left">
                  <div className="w-5 h-5 rounded-full bg-brand-red/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-brand-red" />
                  </div>
                  <span className="text-sm font-bold text-white/80">{point}</span>
                </div>
              ))}
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
              <span className="text-amber-400">⭐</span>
              <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Used by 10,000+ creators</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
