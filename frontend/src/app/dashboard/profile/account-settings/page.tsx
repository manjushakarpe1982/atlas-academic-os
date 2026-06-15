'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import BackHeader from '../BackHeader';
import { getUser } from '@/lib/api';

export default function AccountSettingsPage() {
  const user = getUser();
  const [name,  setName]  = useState(user?.full_name || 'Pooja Sharma');
  const [email, setEmail] = useState(user?.email     || 'pooja.sharma@email.com');
  const [uni,   setUni]   = useState('University of Arkansas');
  const [major, setMajor] = useState('Computer Science');
  const [year,  setYear]  = useState('Sophomore');

  return (
    <div className="min-h-screen bg-gray-50">
      <BackHeader title="Account Settings" />

      <div className="px-4 py-5 space-y-4">

        {/* Avatar */}
        <div className="flex flex-col items-center py-4">
          <div className="w-20 h-20 bg-indigo-200 rounded-full flex items-center justify-center text-4xl mb-2">
            👩‍🎓
          </div>
          <button className="text-sm font-bold text-indigo-600">Change Photo</button>
        </div>

        {/* Form fields */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {[
            { label: 'Full Name',       value: name,  set: setName,  type: 'text'  },
            { label: 'Email',           value: email, set: setEmail, type: 'email' },
            { label: 'University',      value: uni,   set: setUni,   type: 'text'  },
            { label: 'Major (Optional)',value: major, set: setMajor, type: 'text'  },
          ].map((f, i, arr) => (
            <div key={f.label} className={`px-4 py-3 ${i < arr.length - 1 ? 'border-b border-gray-50' : ''}`}>
              <label className="text-xs font-bold text-gray-400 block mb-1">{f.label}</label>
              <input type={f.type} value={f.value} onChange={e => f.set(e.target.value)}
                className="w-full text-sm font-semibold text-gray-900 outline-none bg-transparent" />
            </div>
          ))}

          {/* Academic Year dropdown */}
          <div className="px-4 py-3 border-t border-gray-50">
            <label className="text-xs font-bold text-gray-400 block mb-1">Academic Year</label>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">{year}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl text-sm shadow-md transition-all">
          Save Changes
        </button>

        <button className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-2xl text-sm hover:bg-gray-50 transition-all">
          🔒 Change Password
        </button>
      </div>
    </div>
  );
}
