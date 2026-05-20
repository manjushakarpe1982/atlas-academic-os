'use client';

import { useState } from 'react';
import SettingsLayout from '@/components/layout/SettingsLayout';
import {
  Shield, Download, Trash2, AlertTriangle,
  CheckCircle2, Lock, FileText, Database,
  Eye, EyeOff, Users, BarChart2, Bug,
  Brain, ExternalLink, ChevronRight,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';

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

/* ─── Toggle ─────────────────────────────────────────────────── */
function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!enabled)}
      className={`relative rounded-full transition-all duration-200 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-400 ${
        enabled ? 'bg-indigo-500 shadow-sm shadow-indigo-500/30' : 'bg-gray-200'
      }`}
      style={{ height: 22, width: 40 }}>
      <span className="absolute top-[2px] rounded-full bg-white shadow-sm transition-all duration-200"
        style={{ width: 18, height: 18, left: enabled ? 19 : 2 }} />
    </button>
  );
}

/* ─── Privacy toggle row ─────────────────────────────────────── */
function PrivacyToggleRow({ icon: Icon, iconBg, iconColor, label, desc, badge, enabled, onChange }: {
  icon: typeof Shield; iconBg: string; iconColor: string;
  label: string; desc: string; badge?: { text: string; color: string };
  enabled: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className={`rounded-2xl border p-4 flex items-start gap-3 transition-all ${
      enabled ? 'bg-white border-gray-100 shadow-sm' : 'bg-gray-50/50 border-gray-100'
    }`}>
      <div className={`w-9 h-9 rounded-xl ${enabled ? iconBg : 'bg-gray-100'} flex items-center justify-center flex-shrink-0 mt-0.5 transition-all`}>
        <Icon className={`w-4 h-4 ${enabled ? iconColor : 'text-gray-400'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className={`text-sm font-semibold ${enabled ? 'text-gray-900' : 'text-gray-500'}`}>{label}</p>
          {badge && (
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border uppercase tracking-wide ${badge.color}`}>
              {badge.text}
            </span>
          )}
        </div>
        <p className="text-[11px] text-gray-400 font-light leading-relaxed">{desc}</p>
      </div>
      <Toggle enabled={enabled} onChange={onChange} />
    </div>
  );
}

/* ─── Section header ─────────────────────────────────────────── */
function SectionHeader({ icon: Icon, label, color, sub }: {
  icon: typeof Shield; label: string; color: string; sub?: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className={`w-8 h-8 rounded-xl ${color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-900">{label}</p>
        {sub && <p className="text-[11px] text-gray-400 font-light mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

/* ─── Danger action row ──────────────────────────────────────── */
function DangerRow({ icon: Icon, label, desc, buttonLabel, buttonColor, onClick, children }: {
  icon: typeof Trash2; label: string; desc: string;
  buttonLabel: string; buttonColor: string;
  onClick: () => void; children?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3 mb-3">
        <Icon className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 mb-0.5">{label}</p>
          <p className="text-[11px] text-gray-400 font-light leading-relaxed">{desc}</p>
        </div>
      </div>
      {children}
      <button onClick={onClick}
        className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all border ${buttonColor}`}>
        <Icon className="w-3.5 h-3.5" />
        {buttonLabel}
      </button>
    </div>
  );
}

/* ─── Confirm modal ──────────────────────────────────────────── */
function Modal({ title, desc, confirmLabel, confirmClass, onConfirm, onClose, danger, children }: {
  title: string; desc: string; confirmLabel: string; confirmClass: string;
  onConfirm: () => void; onClose: () => void;
  danger?: boolean; children?: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
        {/* Modal top strip */}
        <div className={`h-1.5 w-full ${danger ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`} />
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${danger ? 'bg-red-100' : 'bg-indigo-100'}`}>
              <AlertTriangle className={`w-5 h-5 ${danger ? 'text-red-600' : 'text-indigo-600'}`} />
            </div>
            <button onClick={onClose} className="text-gray-300 hover:text-gray-600 transition-colors text-xl leading-none ml-auto">×</button>
          </div>
          <h3 className="text-base font-extrabold text-gray-900 mb-1.5">{title}</h3>
          <p className="text-sm text-gray-500 font-light leading-relaxed mb-4">{desc}</p>
          {children}
          <div className="flex gap-2 mt-5">
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
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────── */
export default function PrivacySettings() {
  const [modelTraining,     setModelTraining]     = useState(false);
  const [analytics,         setAnalytics]         = useState(true);
  const [crashReports,      setCrashReports]      = useState(true);
  const [publicProfile,     setPublicProfile]     = useState(false);
  const [activityVisible,   setActivityVisible]   = useState(false);
  const [showExport,        setShowExport]        = useState(false);
  const [showDeleteData,    setShowDeleteData]    = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [exportDone,        setExportDone]        = useState(false);
  const [deleteInput,       setDeleteInput]       = useState('');
  const [saved,             setSaved]             = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <SettingsLayout>
      <div className="space-y-6">

        {/* ── Security banner ──────────────────────────────── */}
        <div className="rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-5 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Your data is protected</p>
              <p className="text-[11px] text-green-100 font-light mt-0.5">
                AES-256 encryption · FERPA compliant · Never sold to third parties
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 bg-white/20 rounded-xl px-3 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
              <span className="text-[11px] font-bold text-white">Secure</span>
            </div>
          </div>
          {/* Security detail row */}
          <div className="bg-green-50 border border-green-100 px-5 py-3 grid grid-cols-3 gap-0 divide-x divide-green-100">
            {[
              { icon: Lock,      label: 'Encrypted', sub: 'AES-256'      },
              { icon: ShieldCheck,label: 'FERPA',    sub: 'Compliant'    },
              { icon: Eye,        label: 'No tracking', sub: 'Zero ads'  },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 px-4 first:pl-0 last:pr-0">
                <s.icon className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-green-800">{s.label}</p>
                  <p className="text-[10px] text-green-600">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── AI & Model Training ──────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <SectionHeader icon={Brain} label="AI & Model Training" color="bg-purple-500"
            sub="Control how your academic data is used to improve Atlas" />
          <div className="space-y-3">
            <PrivacyToggleRow
              icon={Brain} iconBg="bg-purple-50" iconColor="text-purple-600"
              label="Allow training on my academic content"
              desc="Atlas can use your anonymised uploaded files to improve study guide quality for all students. Your identity is never linked to training data."
              badge={{ text: 'Off by default', color: 'bg-gray-100 text-gray-500 border-gray-200' }}
              enabled={modelTraining} onChange={setModelTraining}
            />
            <PrivacyToggleRow
              icon={BarChart2} iconBg="bg-blue-50" iconColor="text-blue-600"
              label="Usage analytics"
              desc="Helps the Atlas team understand which features are most useful. No personally identifiable data is ever collected."
              enabled={analytics} onChange={setAnalytics}
            />
            <PrivacyToggleRow
              icon={Bug} iconBg="bg-orange-50" iconColor="text-orange-600"
              label="Crash reports"
              desc="Sends anonymous error logs when something goes wrong so we can fix issues faster. No file contents are included."
              enabled={crashReports} onChange={setCrashReports}
            />
          </div>
        </div>

        {/* ── Profile Visibility ───────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <SectionHeader icon={Users} label="Profile Visibility" color="bg-indigo-500"
            sub="Control what other Atlas students can see about you" />
          <div className="space-y-3">
            <PrivacyToggleRow
              icon={Users} iconBg="bg-indigo-50" iconColor="text-indigo-600"
              label="Discoverable profile"
              desc="Allow other students at your institution to find your profile by name or email for study groups."
              badge={{ text: 'Off by default', color: 'bg-gray-100 text-gray-500 border-gray-200' }}
              enabled={publicProfile} onChange={setPublicProfile}
            />
            <PrivacyToggleRow
              icon={BarChart2} iconBg="bg-teal-50" iconColor="text-teal-600"
              label="Study activity on leaderboards"
              desc="Show your study streak and completion rate on institution-only leaderboards."
              enabled={activityVisible} onChange={setActivityVisible}
            />
          </div>
        </div>

        {/* ── Your Data ────────────────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <SectionHeader icon={Database} label="Your Data" color="bg-blue-500"
            sub="See what Atlas stores and manage your data" />

          {/* Data stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { icon: FileText, label: 'Files',        value: '12',  sub: '2.4 GB',     bg: 'bg-indigo-50',  text: 'text-indigo-600' },
              { icon: BookOpen, label: 'Study guides',  value: '8',   sub: 'Generated',  bg: 'bg-green-50',   text: 'text-green-600'  },
              { icon: Brain,    label: 'Flashcards',    value: '64',  sub: '5 classes',  bg: 'bg-purple-50',  text: 'text-purple-600' },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-2xl p-3.5 text-center border border-white`}>
                <s.icon className={`w-4 h-4 ${s.text} mx-auto mb-1.5`} />
                <p className={`text-2xl font-extrabold ${s.text}`}>{s.value}</p>
                <p className="text-[10px] text-gray-600 font-semibold mt-0.5">{s.label}</p>
                <p className="text-[9px] text-gray-400">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Export */}
          <DangerRow
            icon={Download}
            label="Export all data"
            desc="Download a complete ZIP of your files, study guides, flashcards, grades, and settings."
            buttonLabel="Export my data"
            buttonColor="text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-400"
            onClick={() => setShowExport(true)}>
            {exportDone && (
              <div className="flex items-center gap-2 mb-3 bg-green-50 border border-green-200 rounded-xl px-3.5 py-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                <p className="text-[11px] font-semibold text-green-700">
                  Export started — download link sent to your email within 5 minutes.
                </p>
              </div>
            )}
          </DangerRow>
        </div>

        {/* ── Danger Zone ──────────────────────────────────── */}
        <div className="rounded-2xl border-2 border-red-100 overflow-hidden">
          <div className="bg-red-50 px-5 py-3 flex items-center gap-2 border-b border-red-100">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <p className="text-sm font-extrabold text-red-700">Danger Zone</p>
            <p className="text-[11px] text-red-400 font-light ml-1">These actions are permanent and cannot be undone</p>
          </div>
          <div className="p-5 space-y-4 bg-white">

            {/* Delete study data */}
            <div className="flex items-start justify-between gap-4 p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-0.5">Delete all study data</p>
                  <p className="text-[11px] text-gray-500 font-light leading-relaxed">
                    Permanently removes all files, guides, flashcards, and grades. Your login stays intact.
                  </p>
                </div>
              </div>
              <button onClick={() => setShowDeleteData(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-orange-600 border border-orange-200 hover:bg-orange-100 px-3.5 py-2 rounded-xl transition-all flex-shrink-0">
                <Trash2 className="w-3.5 h-3.5" /> Delete data
              </button>
            </div>

            {/* Delete account */}
            <div className="flex items-start justify-between gap-4 p-4 bg-red-50/50 rounded-2xl border border-red-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-red-700 mb-0.5">Delete my account</p>
                  <p className="text-[11px] text-gray-500 font-light leading-relaxed">
                    Permanently deletes your account, all uploaded files, grades, and every piece of data Atlas holds.
                  </p>
                </div>
              </div>
              <button onClick={() => setShowDeleteAccount(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-red-600 border border-red-200 hover:bg-red-100 px-3.5 py-2 rounded-xl transition-all flex-shrink-0">
                <Trash2 className="w-3.5 h-3.5" /> Delete account
              </button>
            </div>
          </div>
        </div>

        {/* ── Legal ────────────────────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-3">Legal & Compliance</p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {['Privacy Policy','Terms of Service','FERPA Compliance','GDPR Rights'].map((doc) => (
              <a key={doc} href="#"
                className="flex items-center justify-between text-xs font-semibold text-gray-600 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50 border border-gray-100 hover:border-indigo-200 px-3.5 py-2.5 rounded-xl transition-all group">
                <span className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-gray-400 group-hover:text-indigo-500" />
                  {doc}
                </span>
                <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-indigo-400" />
              </a>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 font-light leading-relaxed">
            Atlas is FERPA compliant and follows GDPR guidelines. Your academic content is never used to train
            AI models without your explicit consent above. We never sell your data.
          </p>
        </div>

        {/* ── Save ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-gray-400">Privacy settings apply immediately after saving</p>
          <button onClick={save}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-indigo-500/20 active:scale-95">
            <CheckCircle2 className="w-4 h-4" /> Save privacy settings
          </button>
        </div>
      </div>

      {/* ── Modals ───────────────────────────────────────────── */}
      {showExport && (
        <Modal
          title="Export your data"
          desc="We'll prepare a ZIP file with all your files, study guides, flashcards, grades, and settings. A download link will be emailed to you within 5 minutes."
          confirmLabel="Start export"
          confirmClass="bg-indigo-600 hover:bg-indigo-700 text-white"
          onConfirm={() => { setExportDone(true); setTimeout(() => setExportDone(false), 4000); }}
          onClose={() => setShowExport(false)}
        />
      )}

      {showDeleteData && (
        <Modal
          title="Delete all study data?"
          desc="This permanently removes all uploaded files, study guides, flashcards, grades, and quiz results. Your login remains intact."
          confirmLabel="Yes, delete all data"
          confirmClass="bg-orange-600 hover:bg-orange-700 text-white"
          onConfirm={() => {}}
          onClose={() => setShowDeleteData(false)}
          danger
        >
          <div className="bg-orange-50 border border-orange-200 rounded-xl px-3.5 py-2.5 mb-2">
            <p className="text-xs font-semibold text-orange-800">
              ⚠ This will delete 12 files · 8 study guides · 64 flashcards · all grades
            </p>
          </div>
        </Modal>
      )}

      {showDeleteAccount && (
        <Modal
          title="Delete your Atlas account?"
          desc="This permanently deletes your account and all associated data. This cannot be undone."
          confirmLabel={deleteInput === 'DELETE' ? 'Permanently delete account' : 'Type DELETE to confirm'}
          confirmClass={deleteInput === 'DELETE' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
          onConfirm={() => {}}
          onClose={() => { setShowDeleteAccount(false); setDeleteInput(''); }}
          danger
        >
          <div className="space-y-3">
            <div className="bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">
              <p className="text-xs font-semibold text-red-800">
                Deletes: account · all files · grades · study guides · flashcards
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1.5 font-medium">
                Type <strong className="text-red-600 font-mono">DELETE</strong> to confirm
              </p>
              <input
                className="w-full border-2 border-red-200 focus:border-red-500 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none font-mono tracking-widest text-center transition-all"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value.toUpperCase())}
                placeholder="DELETE"
                autoComplete="off"
              />
            </div>
          </div>
        </Modal>
      )}

      <SaveToast show={saved} />
    </SettingsLayout>
  );
}
