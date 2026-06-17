'use client';
import { Download, Folder, Trash2, AlertTriangle, User, Lock, ChevronRight } from 'lucide-react';
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
    title: 'Export Data',
    description: 'Download your data',
    icon: <Download className="w-5 h-5 text-indigo-600" />,
    iconBg: 'bg-indigo-100',
    path: '/dashboard/profile/privacy-data/export-data',
  },
  {
    id: 'manage-files',
    title: 'Manage Uploaded Files',
    description: 'View and delete your uploaded files',
    icon: <Folder className="w-5 h-5 text-green-600" />,
    iconBg: 'bg-green-100',
    path: '/dashboard/profile/privacy-data/delete-files',
  },
  {
    id: 'delete-class',
    title: 'Delete Class Data',
    description: 'Delete data of a specific class',
    icon: <Trash2 className="w-5 h-5 text-orange-600" />,
    iconBg: 'bg-orange-100',
    path: '/dashboard/profile/privacy-data/delete-class',
  },
  {
    id: 'delete-all-data',
    title: 'Delete All Data',
    description: 'Restore everything from Atlas',
    icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
    iconBg: 'bg-red-100',
    path: '/dashboard/profile/privacy-data/delete-all-data',
  },
  {
    id: 'delete-account',
    title: 'Delete Account',
    description: 'Permanently delete your account',
    icon: <User className="w-5 h-5 text-pink-600" />,
    iconBg: 'bg-pink-100',
    path: '/dashboard/profile/privacy-data/delete-account',
  },
];

export default function PrivacyDataPage() {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <div className="">
      <BackHeader title="Privacy & Data" />

      <div className="px-4 py-6 space-y-5">
        {/* Description */}
        <p className="text-base text-center text-gray-600">
          Manage your data and control your privacy on Atlas.
        </p>

        {/* Options List */}
        <div className="space-y-4">
          {PRIVACY_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => handleNavigate(option.path)}
              className="w-full bg-white border border-gray-200 rounded-xl p-3 hover:border-indigo-300 hover:bg-indigo-50 transition-all flex items-start gap-3 group"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${option.iconBg}`}>
                {option.icon}
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                  {option.title}
                </h3>
                <p className="text-sm text-gray-600 mt-0.5">{option.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1 group-hover:text-indigo-600 transition-colors" />
            </button>
          ))}
        </div>

        {/* Privacy Info Box */}
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4 flex items-start gap-3 mt-6">
          <Lock className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-indigo-900">Your privacy matters</h3>
            <p className="text-sm text-indigo-700 mt-1">
              We never share your personal data with anyone. Read our Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
