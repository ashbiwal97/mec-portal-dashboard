'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Select } from '@/components/ui/Select';

const LANGUAGES = ['English (EN)', 'French (FR)', 'German (DE)', 'Spanish (ES)', 'Arabic (AR)', 'Chinese (ZH)'];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const router = useRouter();

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'Roboto, system-ui, sans-serif' }}>

      {/* ── Left panel: full-bleed photo ── */}
      <div className="hidden lg:block relative w-[58%] flex-shrink-0 overflow-hidden">
        {/* Conference photo */}
        <Image
          src="/login-photo.jpg"
          alt="MEConnects conference"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />

        {/* MEConnects logo — top-left */}
        <div className="absolute top-10 left-10 z-10">
          <Image
            src="/mec-logo-white.png"
            alt="MEConnects by Marcus Evans"
            width={200}
            height={80}
            className="object-contain"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </div>

        {/* Tagline — bottom-left */}
        <div className="absolute bottom-16 left-[80px] z-10">
          <p
            className="text-white font-medium"
            style={{ fontSize: '60px', lineHeight: '72px' }}
          >
            Be connected.<br />
            Be informed.<br />
            Be inspired.
          </p>
        </div>
      </div>

      {/* ── Right panel: form ── */}
      <div
        className="flex-1 relative flex flex-col overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #c8f3f8 0%, #e8fafb 25%, #ffffff 55%, #f5eef8 80%, #ede8f5 100%)',
        }}
      >
        {/* Language selector — top-right */}
        <div className="flex justify-end px-10 pt-8">
          <Select
            value={language}
            onChange={setLanguage}
            options={LANGUAGES}
            className="w-44"
          />
        </div>

        {/* Form — vertically centered */}
        <div className="flex flex-1 items-center justify-center px-12 py-8">
          <div className="w-full max-w-[522px]">

            {/* Heading */}
            <h1
              className="text-[#131011] mb-3"
              style={{ fontSize: '40px', fontWeight: 500, lineHeight: '52px' }}
            >
              Welcome to MEConnects
            </h1>

            {/* Subtitle */}
            <p
              className="text-[#363032] mb-8"
              style={{ fontSize: '28px', fontWeight: 400, lineHeight: '40px' }}
            >
              Sign in to your account
            </p>

            <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); router.push('/'); }}>

              {/* Email field */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-[18px] font-medium text-[#062026] capitalize"
                  style={{ lineHeight: '28px' }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Alexjacob@gmail.com"
                  className="w-full px-4 py-4 rounded-[8px] border border-[#839093] bg-white text-[16px] text-[#031317] placeholder:text-[#908386] focus:outline-none focus:border-[#3AA2B7] transition-colors"
                  style={{ lineHeight: '24px' }}
                />
              </div>

              {/* Password field */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label
                    className="text-[18px] font-medium text-[#062026] capitalize"
                    style={{ lineHeight: '28px' }}
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-[14px] text-[#1570ef] hover:text-[#1260d0] transition-colors"
                    style={{ lineHeight: '20px' }}
                  >
                    Forgot password
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-4 pr-12 rounded-[8px] border border-[#839093] bg-white text-[16px] text-[#031317] placeholder:text-[#908386] focus:outline-none focus:border-[#3AA2B7] transition-colors"
                    style={{ lineHeight: '24px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#908386] hover:text-[#605759] transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Login button */}
              <button
                type="submit"
                className="w-full px-4 py-5 rounded-[98px] bg-[#3AA2B7] hover:bg-[#2E8FA2] active:bg-[#25676E] text-white text-[20px] font-bold transition-colors mt-1"
                style={{ lineHeight: '28px' }}
              >
                Login now
              </button>

            </form>
          </div>
        </div>
      </div>

    </div>
  );
}
