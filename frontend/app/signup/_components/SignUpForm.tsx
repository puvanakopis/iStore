"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function SignUpForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [step, setStep] = useState<'info' | 'otp'>('info');
  const [otpCode, setOtpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ width: 0, text: '', className: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;

    if (password.length > 0) strength += 25;
    if (password.length > 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 25;

    let text = '';
    let className = '';

    if (strength <= 25) {
      className = 'bg-red-500';
      text = password.length > 0 ? 'Weak security' : 'Security: Enter at least 8 characters';
    } else if (strength <= 50) {
      className = 'bg-orange-400';
      text = 'Moderate security';
    } else if (strength <= 75) {
      className = 'bg-blue-400';
      text = 'Strong security';
    } else {
      className = 'bg-emerald-500';
      text = 'Titanium-grade security';
    }

    return { width: strength, text, className };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (id === 'otpCode') {
      setOtpCode(value);
      return;
    }

    let key: keyof FormData;

    switch (id) {
      case 'firstName':
        key = 'firstName';
        break;
      case 'lastName':
        key = 'lastName';
        break;
      case 'email':
        key = 'email';
        break;
      case 'password':
        key = 'password';
        setPasswordStrength(calculatePasswordStrength(value));
        break;
      default:
        return;
    }

    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const togglePassword = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (step === 'info') {
        await authService.register({
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
        });
        setStep('otp');
      } else {
        await authService.verifyOtp({
          email: formData.email,
          code: otpCode,
          purpose: 'signup'
        });

        setSuccess(true);
        setTimeout(() => {
          router.push('/signin');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Operation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
  };

  return (
    <section className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-24 bg-white">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[500px]"
      >
        <div className="bg-background-dim p-8 md:p-12 rounded-sm">
          <header className="mb-10 text-center md:text-left">
            <h2 className="text-[32px] font-bold tracking-tight mb-2">
              Create Account
            </h2>
            <p className="text-[17px] font-light text-foreground-secondary text-pretty">
              Join the elite circle of iStore aficionados and experience the future of technology.
            </p>
          </header>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-sm text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-sm text-sm">
              Registration successful! Redirecting to sign in...
            </div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
            {step === 'info' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col">
                    <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium mb-1" htmlFor="firstName">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      className="w-full bg-transparent border-b border-border py-2 focus:border-black outline-none transition-colors"
                      placeholder="Enter first name"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium mb-1" htmlFor="lastName">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      className="w-full bg-transparent border-b border-border py-2 focus:border-black outline-none transition-colors"
                      placeholder="Enter last name"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium mb-1" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    className="w-full bg-transparent border-b border-border py-2 focus:border-black outline-none transition-colors"
                    placeholder="name@example.com"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex flex-col space-y-3">
                  <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium mb-1" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      className="w-full bg-transparent border-b border-border py-2 focus:border-black outline-none transition-colors pr-10"
                      placeholder="••••••••"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <button
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                      onClick={togglePassword}
                      type="button"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] text-foreground-secondary uppercase tracking-tight">
                      {passwordStrength.text || 'Enter at least 8 characters'}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-4">
                <p className="text-sm text-foreground-secondary">
                  We've sent a 6-digit verification code to <span className="font-semibold text-black">{formData.email}</span>.
                  Please enter it below to confirm your account.
                </p>
                <div className="flex flex-col">
                  <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium mb-1" htmlFor="otpCode">
                    Verification Code
                  </label>
                  <input
                    id="otpCode"
                    className="w-full bg-transparent border-b border-border py-2 focus:border-black outline-none transition-colors text-center text-2xl tracking-[1em]"
                    placeholder="000000"
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setStep('info')}
                  className="text-[11px] text-foreground-secondary hover:text-black uppercase tracking-widest transition-colors w-fit"
                >
                  Change email address
                </button>
              </div>
            )}

            <button
              className="w-full bg-black text-white px-10 py-4 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Processing...'
              ) : (
                step === 'info' ? 'Send Verification Code' : 'Verify & Create Account'
              )}
            </button>
          </form>

          <div className="relative flex items-center my-10">
            <div className="flex-grow border-t border-border"></div>
            <span className="px-4 text-[11px] text-gray-400 uppercase tracking-[0.2em]">Or join with</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <div className="grid">

            <button
              onClick={() => handleSocialLogin('Google')}
              className="flex items-center justify-center gap-2 py-3 px-6 border border-border rounded-full hover:bg-white transition-all duration-300 text-sm font-medium"
            >
              <Image src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" width={16} height={16} />
              Google
            </button>
          </div>

          <footer className="mt-10 text-center">
            <p className="text-sm text-foreground-secondary">
              Already have an account?{' '}
              <Link className="text-black font-bold hover:underline underline-offset-4" href="/signin">
                Sign In
              </Link>
            </p>
          </footer>
        </div>
      </motion.div>
    </section>
  );
}
