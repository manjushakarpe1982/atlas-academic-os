'use client';

import { useState } from 'react';
import {
  Shield, Download, Trash2, AlertTriangle,
  CheckCircle2, Lock, Eye, EyeOff,
  FileText, Database, X,
} from 'lucide-react';
import SettingsLayout from '@/components/layout/SettingsLayout';

/* ─── Save toast ─────────────────────────────────────────────── */
function SaveToast({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="fixed bottom-6 right-6 flex items-center gap-2.5 bg-gray-900 text-white text-sm font-semibold px-4 py-3 rounded-2xl shadow-2xl z-50 animate-fade-in">
      <CheckCircle2 className="w-4 h-4 text-green-400" />
      Privacy settings saved
    </div>
  );
}

/* ─── Toggle component ───────────────────────────────────────── */
function Toggle({
  enabled, onChange,
}: {
  enabled: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <button type="button" onClick={() => onChange(!enabled)}
      className={`relative rounded-full transition-all duration-200 flex-shrink-0 ${
        enabled ? 'bg-indigo-600' : 'bg-gray-200'
      }`}
      style={{ height: 22, width: 40 }}>
      <span className={`absolute top-0.5 w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-all duration-200 ${
        enabled ? 'left-[19px]' : 'left-0.5'
      }`} />
    </button>
  );
}

/* ─── Privacy row ────────────────────────────────────────────── */
function PrivacyRow({
  label, desc, badge, enabled, onChange,
}: {
  label: string; desc: string; badge?: string;
  enabled: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-gray-50 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-semibold text-gray-900">{label}</p>
          {badge && (
            <span className="text-[9px] font-bold bg-green-100 text-green-700 border border-green-200 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
              {badge}
            </span>
          )}
        </div>
        <p className="text-[11px] text-gray-400 font-light leading-relaxed">{desc}</p>
      </div>
      <Toggle enabled={enabled} onChange={onChange} />
    </div>
  );
}

/* ─── Confirm modal ──────────────────────────────────────────── */
function ConfirmModal({
  title, desc, confirmLabel, confirmClass, onConfirm, onClose, children,
}: {
  title: string; desc: string;
  confirmLabel: string; confirmClass: string;
  onConfirm: () => void; onClose: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none ml-auto">×</button>
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1.5">{title}</h3>
        <p className="text-sm text-gray-500 font-light leading-relaxed mb-4">{desc}</p>
        {children}
        <div className="flex gap-2 mt-4">
          <button onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-all text-sm">
            Cancel
          </button>
          <button onClick={() => { onConfirm(); onClose(); }}
            className={`flex-1 font-bold py-2.5 rounded-xl text-sm transition-all ${confirmClass}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────── */
export default function PrivacySettings() {
  // Privacy toggles
  const [modelTraining,     setModelTraining]     = useState(false);
  const [analytics,         setAnalytics]         = useState(true);
  const [crashReports,      setCrashReports]      = useState(true);
  const [publicProfile,     setPublicProfile]     = useState(false);
  const [activityVisible,   setActivityVisible]   = useState(false);

  // Modals
  const [showExport,        setShowExport]        = useState(false);
  const [showDeleteData,    setShowDeleteData]    = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [exportDone,        setExportDone]        = useState(false);
  const [deleteInput,       setDeleteInput]       = useState('');

  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const handleExport = () => {
    setExportDone(true);
    setTimeout(() => setExportDone(false), 4000);
  };

  return (
    <SettingsLayout>
      <div className="space-y-5">

        {/* ── Security badge ───────────────────────────────── */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center flex-shrink-0">
            <Shield className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <p className="text-sm font-bold text-green-800">Your data is protected</p>
            <p className="text-[11px] text-green-600 font-light leading-relaxed mt-0.5">
              Atlas uses end-to-end encryption for all uploaded files. Your academic content is stored
              on Cloudinary with AES-256 encryption and is never shared with third parties.
            </p>
          </div>
        </div>

        {/* ── AI & training ────────────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-bold text-gray-900">AI & model training</h2>
            <Lock className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <p className="text-xs text-gray-400 mb-4 font-light">
            Control how your data is used to improve Atlas.
          </p>
          <PrivacyRow
            label="Allow training on my academic content"
            desc="Lets Atlas use your uploaded files to improve study guide quality for all users. Your content is anonymised before use. Off by default."
            badge="Off by default"
            enabled={modelTraining}
            onChange={setModelTraining}
          />
          <PrivacyRow
            label="Usage analytics"
            desc="Helps the Atlas team understand which features are most useful. No personally identifiable data is collected."
            enabled={analytics}
            onChange={setAnalytics}
          />
          <PrivacyRow
            label="Crash reports"
            desc="Sends error logs when something goes wrong so we can fix it faster. No file contents are included."
            enabled={crashReports}
            onChange={setCrashReports}
          />
        </div>

        {/* ── Profile visibility ───────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-1">Profile visibility</h2>
          <p className="text-xs text-gray-400 mb-4 font-light">
            Control what other Atlas users can see about you.
          </p>
          <PrivacyRow
            label="Public profile"
            desc="Allow other students at your institution to find your profile by name or email."
            badge="Off by default"
            enabled={publicProfile}
            onChange={setPublicProfile}
          />
          <PrivacyRow
            label="Study activity visible"
            desc="Show your study streaks and completion rates on leaderboards (institution-only)."
            enabled={activityVisible}
            onChange={setActivityVisible}
          />
        </div>

        {/* ── Data & storage ───────────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4">Your data</h2>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { icon: FileText,  label: 'Files',        value: '12 files',  sub: '2.4 GB'      },
              { icon: Database,  label: 'Study guides', value: '8 guides',  sub: 'Generated'   },
              { icon: Shield,    label: 'Flashcards',   value: '64 cards',  sub: 'Across 5 cls'},
            ].map((s) => (
              <div key={s.label} className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                <s.icon className="w-4 h-4 text-gray-400 mx-auto mb-1.5" />
                <p className="text-sm font-bold text-gray-900">{s.value}</p>
                <p className="text-[10px] text-gray-400">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Export data */}
          <div className="border border-gray-100 rounded-xl p-4 mb-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-gray-900 mb-0.5">Export all data</p>
                <p className="text-[11px] text-gray-400 font-light leading-relaxed">
                  Download everything: uploaded files, study guides, flashcards, grades, and settings as a ZIP archive.
                </p>
              </div>
              <button
                onClick={() => setShowExport(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 px-3 py-2 rounded-xl transition-all flex-shrink-0"
              >
                <Download className="w-3.5 h-3.5" /> Export
              </button>
            </div>
            {exportDone && (
              <div className="flex items-center gap-2 mt-3 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                <p className="text-[11px] font-semibold text-green-700">
                  Export started — you'll receive a download link by email within 5 minutes.
                </p>
              </div>
            )}
          </div>

          {/* Delete study data */}
          <div className="border border-orange-100 bg-orange-50/30 rounded-xl p-4 mb-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-gray-900 mb-0.5">Delete all study data</p>
                <p className="text-[11px] text-gray-400 font-light leading-relaxed">
                  Permanently removes all uploaded files, study guides, flashcards, and grades.
                  Your account and login remain intact.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteData(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-800 border border-orange-200 hover:border-orange-400 hover:bg-orange-50 px-3 py-2 rounded-xl transition-all flex-shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete data
              </button>
            </div>
          </div>

          {/* Delete account */}
          <div className="border border-red-100 bg-red-50/30 rounded-xl p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-red-800 mb-0.5">Delete account</p>
                <p className="text-[11px] text-gray-400 font-light leading-relaxed">
                  Permanently deletes your account, all uploaded files, grades, and study guides.
                  This action is irreversible.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteAccount(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-800 border border-red-200 hover:border-red-400 hover:bg-red-50 px-3 py-2 rounded-xl transition-all flex-shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete account
              </button>
            </div>
          </div>
        </div>

        {/* ── Legal ────────────────────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-3">Legal & compliance</h2>
          <div className="flex flex-wrap gap-3">
            {[
              'Privacy Policy', 'Terms of Service', 'FERPA Compliance',
              'GDPR Rights', 'Data Processing Agreement',
            ].map((doc) => (
              <a key={doc} href="#"
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50 border border-gray-100 hover:border-indigo-200 px-3 py-1.5 rounded-xl transition-all">
                <FileText className="w-3 h-3" /> {doc}
              </a>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 mt-3 font-light leading-relaxed">
            Atlas is FERPA compliant. We never sell your data. Your academic content is never
            used to train other students' models without your explicit consent above.
          </p>
        </div>

        {/* ── Save ─────────────────────────────────────────── */}
        <div className="flex justify-end">
          <button onClick={save}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-indigo-500/20">
            Save privacy settings
          </button>
        </div>
      </div>

      {/* ── Modals ───────────────────────────────────────────── */}
      {showExport && (
        <ConfirmModal
          title="Export your data"
          desc="We'll prepare a ZIP file containing all your uploaded files, study guides, flashcards, grades, and account settings. You'll receive a download link by email within 5 minutes."
          confirmLabel="Start export"
          confirmClass="bg-indigo-600 hover:bg-indigo-700 text-white"
          onConfirm={handleExport}
          onClose={() => setShowExport(false)}
        />
      )}

      {showDeleteData && (
        <ConfirmModal
          title="Delete all study data?"
          desc="This permanently removes all uploaded files, study guides, flashcards, grades, and quiz results. Your account and login remain intact. This cannot be undone."
          confirmLabel="Yes, delete all data"
          confirmClass="bg-orange-600 hover:bg-orange-700 text-white"
          onConfirm={() => {}}
          onClose={() => setShowDeleteData(false)}
        >
          <div className="bg-orange-50 border border-orange-200 rounded-xl px-3 py-2 mb-1">
            <p className="text-xs font-semibold text-orange-800">
              ⚠ This will delete 12 files, 8 study guides, 64 flashcards, and all grade records.
            </p>
          </div>
        </ConfirmModal>
      )}

      {showDeleteAccount && (
        <ConfirmModal
          title="Delete your Atlas account?"
          desc="This permanently deletes your account and all data. You cannot undo this."
          confirmLabel={deleteInput === 'DELETE' ? 'Delete my account' : 'Type DELETE to confirm'}
          confirmClass={`${deleteInput === 'DELETE' ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-200 cursor-not-allowed'} text-white`}
          onConfirm={() => { if (deleteInput === 'DELETE') {} }}
          onClose={() => { setShowDeleteAccount(false); setDeleteInput(''); }}
        >
          <div className="space-y-3">
            <div className="bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
              <p className="text-xs font-semibold text-red-800">
                ⚠ Permanently deletes your account, all files, grades, study guides, and flashcards.
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1.5 font-medium">
                Type <strong>DELETE</strong> to confirm
              </p>
              <input
                className="w-full border border-red-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-red-500 font-mono tracking-widest"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value.toUpperCase())}
                placeholder="DELETE"
              />
            </div>
          </div>
        </ConfirmModal>
      )}

      <SaveToast show={saved} />
    </SettingsLayout>
  );
}
