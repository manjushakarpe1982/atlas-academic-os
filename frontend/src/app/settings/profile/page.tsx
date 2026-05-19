'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Camera, AlertCircle, Eye, EyeOff } from 'lucide-react';
import SettingsLayout from '@/components/layout/SettingsLayout';

/* ─── Reusable field components ──────────────────────────────── */
function Field({
  label, hint, children,
}: {
  label: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-gray-400 mt-1 font-light">{hint}</p>}
    </div>
  );
}

const INP =
  'w-full bg-[#FAFAFE] border border-gray-200 hover:border-indigo-300 ' +
  'focus:border-indigo-500 focus:bg-white text-gray-900 placeholder:text-gray-300 ' +
  'rounded-xl px-4 py-2.5 text-sm outline-none transition-all font-medium';

/* ─── Save toast ─────────────────────────────────────────────── */
function SaveToast({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="fixed bottom-6 right-6 flex items-center gap-2.5 bg-gray-900 text-white text-sm font-semibold px-4 py-3 rounded-2xl shadow-2xl z-50 animate-fade-in">
      <CheckCircle2 className="w-4 h-4 text-green-400" />
      Changes saved
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────── */
export default function ProfileSettings() {
  const [firstName,    setFirstName]    = useState('Jordan');
  const [lastName,     setLastName]     = useState('Patel');
  const [email,        setEmail]        = useState('jordan@university.edu');
  const [institution,  setInstitution]  = useState('State University');
  const [fieldStudy,   setFieldStudy]   = useState('Biology / Pre-med');
  const [yearLevel,    setYearLevel]    = useState('Sophomore (Year 2)');
  const [timezone,     setTimezone]     = useState('America/New_York');
  const [bio,          setBio]          = useState('');
  const [showPass,     setShowPass]     = useState(false);
  const [currentPass,  setCurrentPass]  = useState('');
  const [newPass,      setNewPass]      = useState('');
  const [confirmPass,  setConfirmPass]  = useState('');
  const [passError,    setPassError]    = useState('');
  const [saved,        setSaved]        = useState(false);

  useEffect(() => {
    const n = localStorage.getItem('atlas_full_name') || '';
    const parts = n.split(' ');
    if (parts[0]) setFirstName(parts[0]);
    if (parts[1]) setLastName(parts[1]);
    const e = localStorage.getItem('atlas_email') || '';
    if (e) setEmail(e);
  }, []);

  const save = () => {
    localStorage.setItem('atlas_full_name', `${firstName} ${lastName}`.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const changePassword = () => {
    if (!currentPass)       { setPassError('Enter your current password.'); return; }
    if (newPass.length < 8) { setPassError('New password must be at least 8 characters.'); return; }
    if (newPass !== confirmPass) { setPassError('Passwords do not match.'); return; }
    setPassError('');
    setCurrentPass(''); setNewPass(''); setConfirmPass('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <SettingsLayout>
      <div className="space-y-5">

        {/* ── Avatar + name header ────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-5">Public profile</h2>

          {/* Avatar */}
          <div className="flex items-center gap-5 mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg shadow-indigo-500/25">
                {firstName[0]?.toUpperCase()}{lastName[0]?.toUpperCase()}
              </div>
              <button className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:border-indigo-400 transition-all">
                <Camera className="w-3 h-3 text-gray-500" />
              </button>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{firstName} {lastName}</p>
              <p className="text-xs text-gray-400">{email}</p>
              <button className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 mt-1 transition-colors">
                Upload photo
              </button>
            </div>
          </div>

          {/* Name */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Field label="First name">
              <input className={INP} value={firstName}
                onChange={(e) => setFirstName(e.target.value)} placeholder="Jordan" />
            </Field>
            <Field label="Last name">
              <input className={INP} value={lastName}
                onChange={(e) => setLastName(e.target.value)} placeholder="Patel" />
            </Field>
          </div>

          <Field label="Bio (optional)" hint="Shown on your Atlas profile. Max 160 characters.">
            <textarea
              className={INP + ' resize-none'}
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 160))}
              placeholder="Pre-med student, Biology major…"
            />
            <p className="text-[10px] text-gray-300 text-right mt-0.5">{bio.length}/160</p>
          </Field>
        </div>

        {/* ── Account details ──────────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-5">Account details</h2>
          <div className="space-y-4">

            <Field label="University email" hint="Used for login — contact support to change.">
              <input className={INP + ' opacity-60 cursor-not-allowed'} value={email}
                readOnly />
            </Field>

            <Field label="Institution / University">
              <input className={INP} value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g. MIT, Stanford…" />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Field of study">
                <input className={INP} value={fieldStudy}
                  onChange={(e) => setFieldStudy(e.target.value)}
                  placeholder="e.g. Biology, CS…" />
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
              <select className={INP} value={timezone}
                onChange={(e) => setTimezone(e.target.value)}>
                {[
                  ['America/New_York',    'Eastern (UTC−5)'],
                  ['America/Chicago',     'Central (UTC−6)'],
                  ['America/Denver',      'Mountain (UTC−7)'],
                  ['America/Los_Angeles', 'Pacific (UTC−8)'],
                  ['Europe/London',       'London (UTC+0)'],
                  ['Europe/Paris',        'Paris (UTC+1)'],
                  ['Asia/Kolkata',        'India (UTC+5:30)'],
                  ['Asia/Singapore',      'Singapore (UTC+8)'],
                  ['Australia/Sydney',    'Sydney (UTC+11)'],
                ].map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        {/* ── Change password ──────────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-1.5">Change password</h2>
          <p className="text-xs text-gray-400 mb-5 font-light">
            Leave blank if you signed up with Google.
          </p>

          {passError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 mb-4">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-xs font-medium text-red-600">{passError}</p>
            </div>
          )}

          <div className="space-y-3">
            <Field label="Current password">
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} className={INP + ' pr-10'}
                  value={currentPass} onChange={(e) => setCurrentPass(e.target.value)}
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-indigo-500 transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="New password" hint="Min 8 characters">
                <input type="password" className={INP}
                  value={newPass} onChange={(e) => setNewPass(e.target.value)}
                  placeholder="••••••••" />
              </Field>
              <Field label="Confirm new password">
                <input type="password" className={INP}
                  value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="••••••••" />
              </Field>
            </div>
          </div>

          <button onClick={changePassword}
            className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all">
            Update password
          </button>
        </div>

        {/* ── Save button ──────────────────────────────────── */}
        <div className="flex justify-end">
          <button onClick={save}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-indigo-500/20">
            Save changes
          </button>
        </div>
      </div>

      <SaveToast show={saved} />
    </SettingsLayout>
  );
}
