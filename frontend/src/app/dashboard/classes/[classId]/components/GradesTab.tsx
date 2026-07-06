'use client';
import { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { GradeItem } from './shared';
import GradeBreakdown from './GradeBreakdown';
import GradeHistory from './GradeHistory';
import AddGradeChooser from './AddGradeChooser';
import ManualEntryForm from './ManualEntryForm';
import TakePhotoForm from './TakePhotoForm';
import UploadScreenshotForm from './UploadScreenshotForm';
import EditGradeForm from './EditGradeForm';
import DeleteGradeModal from './DeleteGradeModal';
import GradeSuccess from './GradeSuccess';

interface GradeData {
  id: string; category: string; title: string; score: number; max_score: number; created_at: string;
}
interface WeightData {
  id: string; category: string; weight_pct: number;
}

type View = 'list' | 'chooser' | 'manual' | 'photo' | 'upload' | 'edit' | 'success';

const WEIGHT_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#22c55e', '#06b6d4', '#f97316', '#ef4444'];

export default function GradesTab({ classId }: { classId: string }) {
  const [view, setView] = useState<View>('list');
  const [editGrade, setEditGrade] = useState<GradeItem | null>(null);
  const [deleteGrade, setDeleteGrade] = useState<GradeItem | null>(null);

  const [grades, setGrades] = useState<GradeData[]>([]);
  const [weights, setWeights] = useState<WeightData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(() => {
    setLoading(true);
    Promise.all([
      api<{ grades: GradeData[] }>(`/api/classes/${classId}/grades`),
      api<{ weights: WeightData[] }>(`/api/classes/${classId}/grade-weights`),
    ])
      .then(([g, w]) => { setGrades(g.grades || []); setWeights(w.weights || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [classId]);

  useEffect(() => { if (classId) fetchData(); }, [classId, fetchData]);

  const resetAll = () => { setView('list'); setEditGrade(null); setDeleteGrade(null); };

  const handleSaved = () => { resetAll(); fetchData(); };
  const handleDeleted = () => { setDeleteGrade(null); setEditGrade(null); setView('list'); fetchData(); };

  const gradeItems: GradeItem[] = grades.map(g => ({
    id: g.id,
    title: g.title,
    category: g.category,
    date: new Date(g.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    score: g.score,
    max: g.max_score,
  }));

  const weightItems = weights.map((w, i) => ({
    label: w.category,
    pct: w.weight_pct,
    color: WEIGHT_COLORS[i % WEIGHT_COLORS.length],
  }));

  const currentGrade = grades.length > 0
    ? Math.round(grades.reduce((s, g) => s + (g.score / g.max_score * 100), 0) / grades.length)
    : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 gap-2 text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading grades...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {view === 'list' && (
        <>
          <GradeBreakdown weights={weightItems} currentGrade={currentGrade} />
          <GradeHistory
            grades={gradeItems}
            onAdd={() => setView('chooser')}
            onEdit={(g) => { setEditGrade(g); setView('edit'); }}
            onDelete={(g) => setDeleteGrade(g)}
          />
        </>
      )}

      {view === 'chooser' && (
        <AddGradeChooser onClose={resetAll} onManual={() => setView('manual')} onPhoto={() => setView('photo')} onUpload={() => setView('upload')} />
      )}

      {view === 'manual' && <ManualEntryForm classId={classId} onBack={resetAll} onSaved={() => setView('success')} />}
      {view === 'photo' && <TakePhotoForm classId={classId} onBack={resetAll} onSaved={() => { fetchData(); resetAll(); }} />}
      {view === 'upload' && <UploadScreenshotForm classId={classId} onBack={resetAll} onSaved={() => { fetchData(); resetAll(); }} />}

      {view === 'edit' && editGrade && (
        <EditGradeForm
          grade={editGrade}
          classId={classId}
          onBack={resetAll}
          onSaved={handleSaved}
          onDelete={() => { setDeleteGrade(editGrade); setView('list'); }}
        />
      )}

      {view === 'success' && (
        <GradeSuccess onViewGrades={handleSaved} onAddAnother={() => setView('manual')} />
      )}

      {deleteGrade && (
        <DeleteGradeModal grade={deleteGrade} classId={classId} onCancel={() => setDeleteGrade(null)} onDeleted={handleDeleted} />
      )}
    </div>
  );
}
