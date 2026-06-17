'use client';
import { Shield, Download, Trash2, AlertTriangle, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BackHeader from '../BackHeader';

interface PrivacyOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  path: string;
}

const PRIVACY_OPTIONS: PrivacyOption[] = [
  {
    id: 'export-data',
    title: 'Export My Data',
    description: 'Download a copy of all your data from Atlas',
    icon: <Download className="w-6 h-6 text-indigo-600" />,
    iconBg: 'bg-indigo-100',
    path: '/dashboard/profile/privacy-data/export-data',
  },
  {
    id: 'delete-files',
    title: 'Delete Uploaded Files',
    description: 'Permanently delete all your uploaded files',
    icon: <Trash2 className="w-6 h-6 text-orange-600" />,
    iconBg: 'bg-orange-100',
    path: '/dashboard/profile/privacy-data/delete-files',
  },
  {
    id: 'delete-all-data',
    title: 'Delete All Data',
    description: 'Permanently erase all your data from Atlas',
    icon: <AlertTriangle className="w-6 h-6 text-pink-600" />,
    iconBg: 'bg-pink-100',
    path: '/dashboard/profile/privacy-data/delete-all-data',
  },
  {
    id: 'delete-account',
    title: 'Delete Account',
    description: 'Permanently delete your account and all associated data',
    icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
    iconBg: 'bg-red-100',
    path: '/dashboard/profile/privacy-data/delete-account',
  },
];

export default function PrivacyDataPage() {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BackHeader title="Privacy & Data" />

      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-start gap-3">
          <Shield className="w-8 h-8 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Your data. Your choice.</h2>
            <p className="text-sm text-gray-600 mt-1">
              You have complete control over your data. Learn what you can do.
            </p>
          </div>
        </div>

        {/* Options List */}
        <div className="space-y-2">
          {PRIVACY_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => handleNavigate(option.path)}
              className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 hover:border-indigo-300 transition-all flex items-start gap-3 group"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${option.iconBg}`}>
                {option.icon}
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {option.title}
                </h3>
                <p className="text-sm text-gray-600 mt-0.5">{option.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1 group-hover:text-indigo-600 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
