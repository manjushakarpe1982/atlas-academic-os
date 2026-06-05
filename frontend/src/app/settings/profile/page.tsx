'use client';

import { useState, useEffect, useRef } from 'react';
import SettingsLayout from '@/components/layout/SettingsLayout';
import {
  CheckCircle2, AlertCircle, Eye, EyeOff,
  Camera, User, Mail, GraduationCap,
  Globe, BookOpen, Lock, Pencil,
} from 'lucide-react';

/* ─── Save toast ─────────────────────────────────────────────── */
function SaveToast({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="fixed bottom-6 right-6 flex items-center gap-2.5 bg-gray-900 text-white text-sm font-semibold px-4 py-3 rounded-2xl shadow-2xl z-50 animate-fade-in">
      <CheckCircle2 className="w-4 h-4 text-green-400" />
      Changes saved successfully
    </div>
  );
}

/* ─── Section card ───────────────────────────────────────────── */
function Card({ title, icon: Icon, iconBg, children }: {
  title: string; icon: typeof User; iconBg: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Card header */}
      <div className="flex items-center gap-3 px-4 md:px-6 py-3.5 border-b border-gray-50">
        <div className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <p className="text-lg font-bold text-gray-900">{title}</p>
      </div>
      <div className="px-4 md:px-6 py-4">{children}</div>
    </div>
  );
}

/* ─── Input field ────────────────────────────────────────────── */
const INP =
  'w-full bg-gray-50 border border-gray-200 hover:border-indigo-300 ' +
  'focus:border-indigo-500 focus:bg-white text-gray-900 placeholder:text-gray-300 ' +
  'rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-200 font-medium';

function Field({ label, hint, children }: {
  label: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[13px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      {children}
      {hint && <p className="text-[12px] text-gray-400 mt-1 font-light">{hint}</p>}
    </div>
  );
}

/* ─── Password strength ──────────────────────────────────────── */
function PassStrength({ password }: { password: string }) {
  const score =
    (password.length >= 8          ? 1 : 0) +
    (/[A-Z]/.test(password)        ? 1 : 0) +
    (/[0-9]/.test(password)        ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(password) ? 1 : 0);
  if (!password) return null;
  const colors = ['bg-red-400','bg-orange-400','bg-yellow-400','bg-green-500'];
  const labels = ['Weak','Fair','Good','Strong'];
  const textC  = ['text-red-500','text-orange-500','text-yellow-600','text-green-600'];
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0,1,2,3].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i < score ? colors[score-1] : 'bg-gray-200'}`} />
        ))}
      </div>
      <p className={`text-[11px] font-semibold ${textC[score-1] || 'text-gray-400'}`}>{labels[score-1]}</p>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────── */
import { useTheme } from '@/components/ThemeProvider';

/* ─── Appearance card ────────────────────────────────────────── */
function AppearanceCard() {
  const { theme, setTheme } = useTheme();
  const options = [
    { value:'light',  emoji:'☀️',  label:'Light',  desc:'Clean white interface'       },
    { value:'dark',   emoji:'🌙',  label:'Dark',   desc:'Easy on the eyes at night'   },
    { value:'system', emoji:'💻',  label:'System', desc:'Follows your OS preference'  },
  ] as const;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-4 md:px-6 py-3.5 border-b border-gray-50">
        <div className="w-8 h-8 rounded-xl bg-gray-700 flex items-center justify-center flex-shrink-0">
          <span className="text-sm">🎨</span>
        </div>
        <p className="text-lg font-extrabold text-gray-900">Appearance</p>
      </div>
      <div className="px-4 md:px-6 py-4">
        <p className="text-sm text-gray-400 mb-3">Choose how Atlas looks to you</p>
        <div className="grid grid-cols-3 gap-2.5">
          {options.map((o) => (
            <button key={o.value} onClick={() => setTheme(o.value)}
              className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border-2 transition-all ${
                theme === o.value
                  ? 'border-indigo-400 bg-indigo-50 shadow-sm'
                  : 'border-gray-200 hover:border-indigo-200 hover:bg-gray-50'
              }`}>
              <span className="text-2xl">{o.emoji}</span>
              <div className="text-center">
                <p className={`text-sm font-bold ${theme===o.value?'text-indigo-700':'text-gray-700'}`}>{o.label}</p>
                <p className={`text-[13px] mt-0.5 leading-tight ${theme===o.value?'text-indigo-500':'text-gray-400'}`}>{o.desc}</p>
              </div>
              {theme === o.value && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProfileSettings() {
  const fileRef = useRef<HTMLInputElement>(null);

  // Defaults are EMPTY — first-time students see blank fields and can fill them in.
  // Values are loaded from localStorage (name/email from signup) and from the
  // onboarding API (institution / field of study / year) once available.
  const [firstName,   setFirstName]   = useState('');
  const [lastName,    setLastName]    = useState('');
  const [email,       setEmail]       = useState('');
  const [institution, setInstitution] = useState('');
  const [fieldStudy,  setFieldStudy]  = useState('');
  const [yearLevel,   setYearLevel]   = useState('');
  const [timezone,    setTimezone]    = useState('America/New_York');
  const [bio,         setBio]         = useState('');
  const [avatar,      setAvatar]      = useState<string | null>(null);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass,     setNewPass]     = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError,   setPassError]   = useState('');
  const [passSuccess, setPassSuccess] = useState(false);
  const [saved,       setSaved]       = useState(false);

  useEffect(() => {
    // Name/email from signup
    const n = localStorage.getItem('atlas_full_name') || '';
    const parts = n.split(' ');
    if (parts[0]) setFirstName(parts[0]);
    if (parts.slice(1).join(' ')) setLastName(parts.slice(1).join(' '));
    const e = localStorage.getItem('atlas_email') || '';
    if (e) setEmail(e);

    // Academic profile from onboarding (only if user completed onboarding)
    (async () => {
      try {
        const { fetchOnboarding } = await import('@/lib/onboarding');
        const data = await fetchOnboarding();
        if (data) {
          if (data.institution)    setInstitution(data.institution);
          if (data.field_of_study) setFieldStudy(data.field_of_study);
          if (data.year_level)     setYearLevel(data.year_level);
        }
      } catch {
        // Not logged in / no onboarding data — leave fields empty
      }
    })();
  }, []);

  /* ── Photo upload ────────────────────────────────────────── */
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Photo must be under 5 MB.'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const save = () => {
    localStorage.setItem('atlas_full_name', `${firstName} ${lastName}`.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const changePassword = () => {
    setPassError(''); setPassSuccess(false);
    if (!currentPass)           { setPassError('Please enter your current password.'); return; }
    if (newPass.length < 8)     { setPassError('New password must be at least 8 characters.'); return; }
    if (newPass !== confirmPass) { setPassError('Passwords do not match.'); return; }
    setCurrentPass(''); setNewPass(''); setConfirmPass('');
    setPassSuccess(true);
    setTimeout(() => setPassSuccess(false), 3000);
  };

  const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();

  return (
    <SettingsLayout>
      <div className="space-y-5">

        {/* ── Avatar card ──────────────────────────────────── */}
        <Card title="Your Profile" icon={User} iconBg="bg-indigo-500">

          {/* Avatar row */}
          <div className="flex flex-row items-start sm:items-center gap-4 mb-5 pb-5 border-b border-gray-100">
            {/* Avatar circle */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                {avatar
                  ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                  : <span className="text-3xl font-extrabold text-white">{initials}</span>
                }
              </div>
              {/* Camera overlay */}
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute inset-0 rounded-2xl bg-black/0 hover:bg-black/40 flex items-center justify-center transition-all group">
                <Camera className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              {/* Hidden file input */}
              <input aria-describedby="profile-form" ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-lg font-extrabold text-gray-900">{firstName} {lastName}</p>
              <p className="text-base text-gray-400 mb-2">{email}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-1.5 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg transition-all shadow-sm shadow-indigo-500/20">
                  <Camera className="w-3.5 h-3.5" /> Upload photo
                </button>
                {avatar && (
                  <button
                    onClick={() => setAvatar(null)}
                    className="text-base font-semibold text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg transition-all">
                    Remove
                  </button>
                )}
              </div>
              <p className="text-[12px] text-gray-400 mt-1.5">JPG, PNG or GIF · Max 5 MB</p>
            </div>
          </div>

          {/* Name fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 text-base gap-4 mb-4">
            <Field label="First name">
              <input className={INP} value={firstName}
                onChange={(e) => setFirstName(e.target.value)} placeholder="Jordan" />
            </Field>
            <Field label="Last name">
              <input className={INP} value={lastName}
                onChange={(e) => setLastName(e.target.value)} placeholder="Patel" />
            </Field>
          </div>

          {/* Bio */}
          <Field label="Bio" hint="A short intro about yourself. Max 160 characters.">
            <textarea
              className={INP + ' resize-none'}
              rows={2}
              value={bio}
              maxLength={160}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Pre-med student passionate about biology and research…"
            />
            <div className="flex justify-end">
              <p className={`text-[12px] font-medium mt-0.5 ${bio.length > 140 ? 'text-orange-500' : 'text-gray-300'}`}>
                {bio.length}/160
              </p>
            </div>
          </Field>
        </Card>

        {/* ── Academic details ─────────────────────────────── */}
        <Card title="Academic Details" icon={GraduationCap} iconBg="bg-green-500">
          <div className="space-y-4">

            {/* Email — read only */}
            <Field label="University email" hint="To change your email contact support.">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  className={INP + ' pl-9 opacity-60 cursor-not-allowed bg-gray-100'}
                  value={email} readOnly />
              </div>
            </Field>

            {/* Institution */}
            <Field label="Institution / University">
              <div className="relative">
                <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input className={INP + ' pl-9'} value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. MIT, Stanford, State University" />
              </div>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Field of study">
                <input className={INP} value={fieldStudy}
                  onChange={(e) => setFieldStudy(e.target.value)}
                  placeholder="e.g. Biology, CS, Business" />
              </Field>
              <Field label="Year / Level">
                <select className={INP} value={yearLevel}
                  onChange={(e) => setYearLevel(e.target.value)}>
                  {['Freshman (Year 1)','Sophomore (Year 2)','Junior (Year 3)','Senior (Year 4)',
                    'Graduate Year 1','Graduate Year 2','PhD Year 1','PhD Year 2+'].map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Timezone">
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select className={INP + ' pl-9'} value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}>
                  {[
                    ['America/New_York',    'Eastern Time (UTC−5)'],
                    ['America/Chicago',     'Central Time (UTC−6)'],
                    ['America/Denver',      'Mountain Time (UTC−7)'],
                    ['America/Los_Angeles', 'Pacific Time (UTC−8)'],
                    ['Europe/London',       'London (UTC+0)'],
                    ['Europe/Paris',        'Paris / Berlin (UTC+1)'],
                    ['Asia/Kolkata',        'India (UTC+5:30)'],
                    ['Asia/Singapore',      'Singapore (UTC+8)'],
                    ['Australia/Sydney',    'Sydney (UTC+11)'],
                  ].map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
            </Field>
          </div>
        </Card>

        {/* ── Change password ──────────────────────────────── */}
        <Card title="Change Password" icon={Lock} iconBg="bg-orange-400">
          <p className="text-sm text-gray-400 mb-4 font-light">
            Leave blank if you signed in with Google — your password is managed by Google.
          </p>

          {/* Error */}
          {passError && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-xs font-semibold text-red-600">{passError}</p>
            </div>
          )}
          {/* Success */}
          {passSuccess && (
            <div className="flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              <p className="text-xs font-semibold text-green-700">Password updated successfully!</p>
            </div>
          )}

          <div className="space-y-3">
            {/* Current password */}
            <Field label="Current password">
              <div className="relative">
                <input type={showCurrent ? 'text' : 'password'}
                  className={INP + ' pr-11'} value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  placeholder="Enter current password" />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-indigo-500 transition-colors">
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="New password" hint="Min 8 characters">
                <div className="relative">
                  <input type={showNew ? 'text' : 'password'}
                    className={INP + ' pr-11'} value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="New password" />
                  <button type="button" onClick={() => setShowNew(!showNew)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-indigo-500 transition-colors">
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <PassStrength password={newPass} />
              </Field>
              <Field label="Confirm new password">
                <input type="password" className={INP} value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Confirm password" />
                {confirmPass && newPass !== confirmPass && (
                  <p className="text-[11px] text-red-500 font-semibold mt-1">Passwords don&apos;t match</p>
                )}
                {confirmPass && newPass === confirmPass && newPass.length >= 8 && (
                  <p className="text-[11px] text-green-600 font-semibold mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Passwords match
                  </p>
                )}
              </Field>
            </div>
          </div>

          <button onClick={changePassword}
            className="mt-4 w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-orange-500/20">
            <Lock className="w-4 h-4" /> Update password
          </button>
        </Card>

        {/* ── Appearance ───────────────────────────────────── */}
        <AppearanceCard />

        {/* ── Save button ──────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
          <p className="text-xs text-gray-400">Your profile changes are saved when you click below</p>
          <button onClick={save}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-indigo-500/20 active:scale-95">
            <CheckCircle2 className="w-4 h-4" /> Save changes
          </button>
        </div>
      </div>
      <SaveToast show={saved} />
    </SettingsLayout>
  );
}
