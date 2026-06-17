'use client';
import { useState } from 'react';
import { User, Mail, Building2, BookOpen, GraduationCap, Edit3, CheckCircle2, Lock, Camera, Loader2, AlertCircle } from 'lucide-react';
import BackHeader from '../BackHeader';
import { getUser, saveAuth, getToken, API_BASE } from '@/lib/api';

const YEARS = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate', 'PhD'];

export default function AccountSettingsPage() {
  const user = getUser();

  const [name,    setName]    = useState(user?.full_name  || '');
  const [email,   setEmail]   = useState(user?.email      || '');
  const [uni,     setUni]     = useState(user?.university || 'University of Arkansas');
  const [major,   setMajor]   = useState(user?.major      || '');
  const [year,    setYear]    = useState(user?.year       || 'Sophomore');

  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState('');

  const initial = name?.[0]?.toUpperCase() || email?.[0]?.toUpperCase() || 'S';

  const handleSave = async () => {
    setError('');
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        method:  'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          full_name:  name.trim()  || undefined,
          university: uni.trim()   || undefined,
          major:      major.trim() || undefined,
          year:       year         || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.detail || 'Save failed. Please try again.'); return; }

      // Update localStorage with new name/email
      const token = getToken();
      if (token) {
        saveAuth(token, {
          ...user,
          full_name:  data.full_name || name,
          email:      data.email     || email,
          university: uni,
          major,
          year,
        });
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError('Cannot reach server. Make sure the backend is running.');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = `
    w-full px-4 py-2.5 text-sm font-semibold text-gray-900
    bg-white border-2 border-gray-300 rounded-xl outline-none
    focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100
    hover:border-indigo-300 transition-all placeholder:text-gray-300
  `;

  return (
    <div className="">
      <BackHeader title="Account Settings" />

      <div className="px-4 py-5 space-y-5">

        {/* Avatar */}
        <div className="flex flex-col items-center py-2">
          <div className="relative mb-3">
            <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-extrabold shadow-lg">
              {initial}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border-2 border-indigo-600 rounded-full flex items-center justify-center shadow-sm hover:bg-indigo-50 transition-all">
              <Camera className="w-3.5 h-3.5 text-indigo-600" />
            </button>
          </div>
          <p className="text-xs text-gray-400">Tap the camera to change photo</p>
        </div>

        {/* Form fields */}
        <div className="space-y-3">

          <div>
            <label className="flex items-center gap-1.5 text-sm font-bold text-gray-600 mb-1.5 ">
              <User className="w-4 h-4" /> Full Name
            </label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Enter your full name" className={inputCls} />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-bold text-gray-600 mb-1.5 ">
              <Mail className="w-4 h-4" /> Email Address
              <span className="text-gray-400 font-normal normal-case tracking-normal ml-1">(Cannot be changed)</span>
            </label>
            <input type="email" value={email} disabled
              className="w-full px-4 py-3 text-sm font-semibold text-gray-400 bg-gray-100 border-2 border-gray-200 rounded-xl outline-none cursor-not-allowed select-none" />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-bold text-gray-600 mb-1.5 ">
              <Building2 className="w-4 h-4" /> University
            </label>
            <input type="text" value={uni} onChange={e => setUni(e.target.value)}
              placeholder="Your university name" className={inputCls} />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-bold text-gray-600 mb-1.5 ">
              <BookOpen className="w-4 h-4" /> Major
              <span className="text-gray-400 font-normal normal-case tracking-normal">(Optional)</span>
            </label>
            <input type="text" value={major} onChange={e => setMajor(e.target.value)}
              placeholder="e.g. Computer Science" className={inputCls} />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-bold text-gray-600 mb-1.5 ">
              <GraduationCap className="w-4 h-4" /> Academic Year
            </label>
            <select value={year} onChange={e => setYear(e.target.value)}
              className={inputCls + ' cursor-pointer'}>
              {YEARS.map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {/* Edit hint */}
        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2.5">
          <Edit3 className="w-4 h-4 text-indigo-500 flex-shrink-0" />
          <p className="text-xs text-indigo-700">Tap any field above to edit your information.</p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}

        {/* Save button */}
        <button onClick={handleSave} disabled={saving}
          className={`w-full flex items-center justify-center gap-2 font-bold py-3 rounded-xl text-base shadow-md transition-all disabled:opacity-70 ${
            saved ? 'bg-green-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}>
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> :
           saved  ? <><CheckCircle2 className="w-4 h-4" /> Changes Saved!</> :
           'Save Changes'}
        </button>

        {/* Change Password */}
        <button className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-indigo-300 text-gray-700 hover:text-indigo-600 font-bold py-3 rounded-xl text-base transition-all">
          <Lock className="w-5 h-5" /> Change Password
        </button>

      </div>
    </div>
  );
}
