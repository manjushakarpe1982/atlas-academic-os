'use client';
import { useState, useEffect } from 'react';
import { Trash2, Info, CheckCircle2, FileText, Loader2, AlertCircle, Download } from 'lucide-react';
import BackHeader from '../../BackHeader';
import Image from 'next/image';
import { api, API_BASE, getToken } from '@/lib/api';

// ── Types ──
interface FileData {
  id: string;
  original_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  extension: string | null;
  category: string;
  status: string;
  class_id: string | null;
  class_name: string;
  created_at: string;
}

// ── Helpers ──
function formatFileSize(bytes: number | null): string {
  if (!bytes) return 'Unknown size';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function getFileColor(ext: string | null): string {
  switch (ext?.toLowerCase()) {
    case 'pdf': return 'bg-red-100';
    case 'doc': case 'docx': return 'bg-blue-100';
    case 'png': case 'jpg': case 'jpeg': return 'bg-purple-100';
    case 'csv': case 'xlsx': return 'bg-green-100';
    default: return 'bg-gray-100';
  }
}

export default function DeleteFilesPage() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [deletedFile, setDeletedFile] = useState(false);

  // ── Download file ──
  const handleDownload = async (fileId: string) => {
    setDownloading(fileId);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/classes/files/${fileId}/download`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.url) {
        const a = document.createElement('a');
        a.href = data.url;
        a.download = data.name || 'download';
        a.target = '_blank';
        a.click();
      }
    } catch {} finally { setDownloading(null); }
  };
  const [deletingAll, setDeletingAll] = useState(false);
  const [allDeleted, setAllDeleted] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // ── Fetch files on mount ──
  useEffect(() => {
    api<{ files: FileData[] }>('/api/classes/files/all')
      .then((data) => {
        setFiles(data.files || []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // ── Delete single file ──
  const handleDeleteFile = async (fileId: string) => {
    setDeleting(fileId);
    setDeleteError('');

    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/api/classes/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const err = await response.json();
        setDeleteError(err.detail || 'Failed to delete file');
        setDeleting(null);
        return;
      }

      setFiles(files.filter((f) => f.id !== fileId));
      setDeletedFile(true);
      setTimeout(() => setDeletedFile(false), 2500);
    } catch (e) {
      setDeleteError('Network error. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  // ── Delete all files ──
  const handleDeleteAll = async () => {
    setDeletingAll(true);
    setDeleteError('');

    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/api/classes/files/all/delete`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const err = await response.json();
        setDeleteError(err.detail || 'Failed to delete files');
        setDeletingAll(false);
        return;
      }

      setAllDeleted(true);
    } catch (e) {
      setDeleteError('Network error. Please try again.');
    } finally {
      setDeletingAll(false);
    }
  };

  // ── Success screen — all deleted ──
  if (allDeleted) {
    return (
      <div className="">
        <BackHeader title="Manage Uploaded Files" />

        <div className="px-4 py-6 flex flex-col items-center justify-center space-y-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">All files deleted!</h1>
            <p className="text-sm text-gray-600">
              All your uploaded files have been permanently deleted.
            </p>
          </div>

          <div className="w-full bg-green-50 border-2 border-green-200 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-900 font-medium">
              All uploaded files have been deleted from Atlas and storage.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Main page ──
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
        <p className="text-lg text-center font-bold text-gray-800 mb-1">Manage your uploaded files</p>
        <p className="text-sm text-center text-gray-600">View and delete your uploaded files.</p>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12 gap-2 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Loading files...</span>
          </div>
        )}

        {/* Fetch Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 mt-4">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-900">Failed to load files</p>
              <p className="text-xs text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Delete Error */}
        {deleteError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 mt-4">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-medium">{deleteError}</p>
          </div>
        )}

        {/* File Count */}
        {!loading && !error && files.length > 0 && (
          <div className="text-sm font-bold text-indigo-600 mt-4 mb-2">
            {files.length} File{files.length !== 1 ? 's' : ''}
          </div>
        )}

        {/* Files List */}
        {!loading && !error && files.length > 0 && (
          <div className="space-y-3">
            {files.map((file) => (
              <div
                key={file.id}
                className={`bg-white border border-gray-200 rounded-lg p-3 flex items-start gap-4 hover:border-gray-300 transition-all ${
                  deleting === file.id ? 'opacity-50' : ''
                }`}
              >
                {/* File Icon */}
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getFileColor(file.extension)}`}>
                  <FileText className="w-6 h-6 text-gray-700" />
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 truncate">{file.original_name}</p>
                  <p className="text-xs text-gray-600 mt-1">{file.class_name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Uploaded on {formatDate(file.created_at)} <br />• {formatFileSize(file.size_bytes)}
                    {file.extension && ` • .${file.extension.toUpperCase()}`}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleDownload(file.id)}
                    disabled={downloading === file.id}
                    className="text-indigo-600 hover:text-indigo-700 transition-colors p-1.5 hover:bg-indigo-50 rounded-lg disabled:opacity-50"
                  >
                    {downloading === file.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    disabled={deleting === file.id}
                    className="text-red-600 hover:text-red-700 transition-colors p-1.5 hover:bg-red-50 rounded-lg disabled:opacity-50"
                  >
                    {deleting === file.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && files.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 font-medium">No files uploaded yet.</p>
            <p className="text-xs text-gray-400 mt-1">Upload a syllabus in Add Class to see files here.</p>
          </div>
        )}

        {/* Deleted File Toast */}
        {deletedFile && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex mt-3 items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-900 font-medium">
              File deleted successfully
            </p>
          </div>
        )}

        {/* Delete All Button */}
        {!loading && files.length > 0 && (
          <button
            onClick={handleDeleteAll}
            disabled={deletingAll}
            className="w-full border border-red-600 text-red-600 font-bold py-3 rounded-lg hover:bg-red-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
          >
            {deletingAll ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Deleting all files...
              </>
            ) : (
              <>
                <Trash2 className="w-5 h-5" /> Delete All Uploaded Files
              </>
            )}
          </button>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3 mt-6 mb-6">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-900 leading-relaxed">
            Deleting a file removes it from Atlas and storage. It won&apos;t delete your course data.
          </p>
        </div>
      </div>
    </div>
  );
}
