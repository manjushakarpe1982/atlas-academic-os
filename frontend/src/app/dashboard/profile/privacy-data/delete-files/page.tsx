'use client';
import { useState } from 'react';
import { Trash2, Info, CheckCircle2, FileText } from 'lucide-react';
import BackHeader from '../../BackHeader';
import Image from 'next/image';

interface UploadedFile {
  id: string;
  name: string;
  className: string;
  uploadDate: string;
  fileSize: string;
  icon: string;
  color: string;
}

const INITIAL_FILES: UploadedFile[] = [
  {
    id: 'bio-syllabus',
    name: 'Biology_Syllabus.pdf',
    className: 'Biology 101',
    uploadDate: 'May 16, 2024',
    fileSize: '2.4 MB',
    icon: '📄',
    color: 'bg-red-100',
  },
  {
    id: 'math-syllabus',
    name: 'Mathematics_Syllabus.pdf',
    className: 'Mathematics 251',
    uploadDate: 'May 15, 2024',
    fileSize: '1.5 MB',
    icon: '📄',
    color: 'bg-green-100',
  },
  {
    id: 'chem-syllabus',
    name: 'Chemistry_Syllabus.pdf',
    className: 'Chemistry 101',
    uploadDate: 'May 14, 2024',
    fileSize: '1.8 MB',
    icon: '📄',
    color: 'bg-orange-100',
  },
];

export default function DeleteFilesPage() {
  const [files, setFiles] = useState<UploadedFile[]>(INITIAL_FILES);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deletedFile, setDeletedFile] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);
  const [allDeleted, setAllDeleted] = useState(false);

  const handleDeleteFile = async (fileId: string) => {
    setDeleting(fileId);
    setTimeout(() => {
      setDeleting(null);
      setFiles(files.filter((f) => f.id !== fileId));
      setDeletedFile(true);
      setTimeout(() => setDeletedFile(false), 2000);
    }, 1000);
  };

  const handleDeleteAll = async () => {
    setDeletingAll(true);
    setTimeout(() => {
      setDeletingAll(false);
      setAllDeleted(true);
    }, 1500);
  };

  // Success Screen - All Deleted
  if (allDeleted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BackHeader title="Manage Uploaded Files" />

        <div className="px-4 py-6 flex flex-col items-center justify-center space-y-6">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>

          {/* Title & Message */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">All files deleted!</h1>
            <p className="text-sm text-gray-600">
              All your uploaded files have been permanently deleted.
            </p>
          </div>

          {/* Success Message */}
          <div className="w-full bg-green-50 border-2 border-green-200 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-900 font-medium">
              All uploaded files have been deleted
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <BackHeader title="Manage Uploaded Files" />

      <div className="px-4 mt-2">

        <Image

          src="https://res.cloudinary.com/mview/image/upload/v1781703504/atlas/privacypage2.png"
          alt="Privacy Data Illustration"
          width={300}
          height={200}
          className="mx-auto"
        />
        {/* Subtitle */}
        <p className="text-lg text-center font-bold text-gray-800 mb-1">Manage your uploaded files</p>
        <p className="text-sm text-center text-gray-600">View and delete your uploaded files.</p>

        {/* File Count */}
        {files.length > 0 && (
          <div className="text-sm font-bold text-indigo-600 mt-4 mb-2">
            {files.length} File{files.length !== 1 ? 's' : ''}
          </div>
        )}

        {/* Files List */}
        {files.length > 0 ? (
          <div className="space-y-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="bg-white border border-gray-200 rounded-lg p-3 flex items-start gap-4 hover:border-gray-300 transition-all"
              >
                {/* File Icon */}
               <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${file.color}`}>
  <FileText className="w-6 h-6 text-gray-700" />
</div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 truncate">{file.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{file.className}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Uploaded on {file.uploadDate} <br /> • {file.fileSize}
                  </p>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteFile(file.id)}
                  disabled={deleting === file.id}
                  className="text-red-600 hover:text-red-700 transition-colors flex-shrink-0 p-2 hover:bg-red-50 rounded-lg disabled:opacity-50"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No files uploaded yet.</p>
          </div>
        )}

        {/* Deleted File Toast */}
        {deletedFile && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex mt-3 items-start gap-3 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-900 font-medium">
              File deleted successfully
            </p>
          </div>
        )}

        {/* Delete All Button */}
        {files.length > 0 && (
          <button
            onClick={handleDeleteAll}
            disabled={deletingAll}
            className="w-full border border-red-600 text-red-600 font-bold py-3 rounded-lg hover:bg-red-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
          >
            <Trash2 className="w-5 h-5" />
            {deletingAll ? 'Deleting all files...' : 'Delete All Uploaded Files'}
          </button>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3 mt-6">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-900 leading-relaxed">
            Deleting a file will remove it from Atlas. It won't delete your course data.
          </p>
        </div>
      </div>
    </div>
  );
}
