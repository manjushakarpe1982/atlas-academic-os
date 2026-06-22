'use client';
import { useState } from 'react';
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

type View = 'list' | 'chooser' | 'manual' | 'photo' | 'upload' | 'edit' | 'success';

export default function GradesTab() {
  const [view, setView] = useState<View>('list');
  const [editGrade, setEditGrade] = useState<GradeItem | null>(null);
  const [deleteGrade, setDeleteGrade] = useState<GradeItem | null>(null);

  const resetAll = () => { setView('list'); setEditGrade(null); setDeleteGrade(null); };

  return (
    <div className="space-y-4">

      {/* Normal view: Breakdown + History */}
      {view === 'list' && (
        <>
          <GradeBreakdown />
          <GradeHistory
            onAdd={() => setView('chooser')}
            onEdit={(g) => { setEditGrade(g); setView('edit'); }}
            onDelete={(g) => setDeleteGrade(g)}
          />
        </>
      )}

      {/* Chooser bottom sheet */}
      {view === 'chooser' && (
        <AddGradeChooser
          onClose={resetAll}
          onManual={() => setView('manual')}
          onPhoto={() => setView('photo')}
          onUpload={() => setView('upload')}
        />
      )}

      {/* Manual entry form */}
      {view === 'manual' && <ManualEntryForm onBack={resetAll} onSave={() => setView('success')} />}

      {/* Take photo form */}
      {view === 'photo' && <TakePhotoForm onBack={resetAll} />}

      {/* Upload screenshot form */}
      {view === 'upload' && <UploadScreenshotForm onBack={resetAll} />}

      {/* Edit grade form */}
      {view === 'edit' && editGrade && (
        <EditGradeForm
          grade={editGrade}
          onBack={resetAll}
          onSave={resetAll}
          onDelete={() => { setDeleteGrade(editGrade); setView('list'); }}
        />
      )}

      {/* Success screen */}
      {view === 'success' && (
        <GradeSuccess
          onViewGrades={resetAll}
          onAddAnother={() => setView('manual')}
        />
      )}

      {/* Delete confirmation modal */}
      {deleteGrade && (
        <DeleteGradeModal
          grade={deleteGrade}
          onCancel={() => setDeleteGrade(null)}
          onDelete={() => setDeleteGrade(null)}
        />
      )}
    </div>
  );
}
