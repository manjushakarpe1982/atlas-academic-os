"use client";
import { useState, useEffect } from "react";
import JSZip from "jszip";
import {
  Download,
  ChevronRight,
  Globe,
  Check,
  FileText,
  Archive,
  Code,
  CheckCircle2,
  Eye,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import BackHeader from "../../BackHeader";
import Image from "next/image";
import { api } from "@/lib/api";

// ── Types ──
interface ClassData {
  id: string;
  name: string;
  instructor: string | null;
  term: string | null;
  credit_hours: number | null;
}

// ── Icon / color helpers based on class name ──
const CLASS_STYLES: { pattern: RegExp; icon: string; iconBg: string }[] = [
  { pattern: /math|calculus|algebra|geometry/i, icon: "📐", iconBg: "bg-indigo-100" },
  { pattern: /bio|anatomy|genetics/i,          icon: "🧬", iconBg: "bg-green-100" },
  { pattern: /chem/i,                          icon: "⚗️", iconBg: "bg-yellow-100" },
  { pattern: /phys/i,                          icon: "⚛️", iconBg: "bg-blue-100" },
  { pattern: /eng|english|lit|writing/i,       icon: "📝", iconBg: "bg-orange-100" },
  { pattern: /hist|history/i,                  icon: "📜", iconBg: "bg-amber-100" },
  { pattern: /comp|cs|programming|code/i,      icon: "💻", iconBg: "bg-purple-100" },
  { pattern: /art|music|design/i,              icon: "🎨", iconBg: "bg-pink-100" },
];

function getClassStyle(name: string) {
  const match = CLASS_STYLES.find((s) => s.pattern.test(name));
  return match || { icon: "📖", iconBg: "bg-gray-100" };
}

// ── Export options ──
interface ExportOption {
  id: string;
  label: string;
  icon: string;
}

const EXPORT_ITEMS: ExportOption[] = [
  { id: "course-info", label: "Course Information", icon: "📋" },
  { id: "grades", label: "Grades", icon: "📊" },
  { id: "assignments", label: "Assignments", icon: "✓" },
  { id: "dates", label: "Important Dates", icon: "📅" },
  { id: "study-plan", label: "Study Plan", icon: "⚡" },
  { id: "notes", label: "Notes", icon: "📝" },
];

const FORMAT_OPTIONS = [
  { id: "pdf", label: "PDF", icon: <FileText className="w-5 h-5" /> },
  { id: "zip", label: "ZIP", icon: <Archive className="w-5 h-5" /> },
  { id: "json", label: "JSON", icon: <Code className="w-5 h-5" /> },
];

export default function ExportDataPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([
    "course-info",
    "grades",
    "assignments",
    "dates",
    "study-plan",
    "notes",
  ]);
  const [selectedFormat, setSelectedFormat] = useState("pdf");

  // ── Dynamic class data ──
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ classes: ClassData[] }>("/api/classes")
      .then((data) => {
        const list = data.classes || [];
        setClasses(list);
        if (list.length > 0) {
          setSelectedClass(list[0].id);
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const selectedClassData = classes.find((c) => c.id === selectedClass);
  const selectedClassStyle = selectedClassData
    ? getClassStyle(selectedClassData.name)
    : { icon: "📖", iconBg: "bg-gray-100" };
  const formatLabel =
    FORMAT_OPTIONS.find((f) => f.id === selectedFormat)?.label || "PDF";

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const [exporting, setExporting] = useState(false);
  const [exportData, setExportData] = useState<any>(null);

  const doDownload = async (data?: any) => {
    const d = data || exportData;
    if (!d) return;
    const fileName = selectedClass === "all"
      ? "AllClasses_Export"
      : `${(selectedClassData?.name || "Class").replace(/\s+/g, "")}_Export`;

    if (selectedFormat === "json") {
      const blob = new Blob([JSON.stringify(d, null, 2)], { type: "application/json" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
      a.download = `${fileName}.json`; a.click();
    } else if (selectedFormat === "zip") {
      const zip = new JSZip();
      if (d.classes?.length) zip.file("classes.json", JSON.stringify(d.classes, null, 2));
      if (d.grades?.length) zip.file("grades.json", JSON.stringify(d.grades, null, 2));
      if (d.assignments?.length) zip.file("assignments.json", JSON.stringify(d.assignments, null, 2));
      if (d.calendar_events?.length) zip.file("calendar_events.json", JSON.stringify(d.calendar_events, null, 2));
      if (d.study_topics?.length) zip.file("study_topics.json", JSON.stringify(d.study_topics, null, 2));
      if (d.study_attempts?.length) zip.file("study_attempts.json", JSON.stringify(d.study_attempts, null, 2));
      zip.file("export_info.json", JSON.stringify({ exported_at: d.exported_at, user_id: d.user_id }, null, 2));
      const blob = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
      a.download = `${fileName}.zip`; a.click();
    } else {
      let html = `<html><head><meta charset="utf-8"><style>body{font-family:Calibri,Arial;padding:20px;color:#333}h1{color:#4F46E5;font-size:22px;border-bottom:2px solid #4F46E5;padding-bottom:8px}h2{color:#6B7280;font-size:16px;margin-top:20px}table{width:100%;border-collapse:collapse;margin:10px 0}th{background:#EEF2FF;text-align:left;padding:8px;font-size:13px;border:1px solid #E5E7EB}td{padding:8px;font-size:13px;border:1px solid #E5E7EB}</style></head><body>`;
      html += `<h1>Atlas Academic Export</h1><p>Exported: ${new Date().toLocaleString()}</p>`;
      if (d.classes?.length) {
        html += `<h2>Classes</h2><table><tr><th>Name</th><th>Code</th><th>Instructor</th><th>Term</th></tr>`;
        d.classes.forEach((c: any) => { html += `<tr><td>${c.name}</td><td>${c.code||''}</td><td>${c.instructor||''}</td><td>${c.term||''}</td></tr>`; });
        html += `</table>`;
      }
      if (d.grades?.length) {
        html += `<h2>Grades</h2><table><tr><th>Class</th><th>Name</th><th>Score</th><th>Total</th><th>Date</th></tr>`;
        d.grades.forEach((g: any) => { html += `<tr><td>${g.class}</td><td>${g.name}</td><td>${g.score??''}</td><td>${g.total??''}</td><td>${g.date||''}</td></tr>`; });
        html += `</table>`;
      }
      if (d.assignments?.length) {
        html += `<h2>Assignments</h2><table><tr><th>Class</th><th>Title</th><th>Category</th><th>Due Date</th><th>Note</th></tr>`;
        d.assignments.forEach((a: any) => { html += `<tr><td>${a.class}</td><td>${a.title}</td><td>${a.category||''}</td><td>${a.due_date||''}</td><td>${a.date_note||''}</td></tr>`; });
        html += `</table>`;
      }
      if (d.calendar_events?.length) {
        html += `<h2>Calendar Events</h2><table><tr><th>Title</th><th>Date</th><th>Category</th><th>Location</th></tr>`;
        d.calendar_events.forEach((e: any) => { html += `<tr><td>${e.title}</td><td>${e.date||''}</td><td>${e.category||''}</td><td>${e.location||''}</td></tr>`; });
        html += `</table>`;
      }
      if (d.study_topics?.length) {
        html += `<h2>Study Topics</h2><table><tr><th>Class</th><th>Topic</th><th>Week</th><th>Priority</th></tr>`;
        d.study_topics.forEach((t: any) => { html += `<tr><td>${t.class}</td><td>${t.title}</td><td>${t.week??''}</td><td>${t.priority||''}</td></tr>`; });
        html += `</table>`;
      }
      if (d.study_attempts?.length) {
        html += `<h2>Study Attempts</h2><table><tr><th>Type</th><th>Attempt #</th><th>Score</th><th>Total</th><th>Status</th><th>Date</th></tr>`;
        d.study_attempts.forEach((a: any) => { html += `<tr><td>${a.material_type}</td><td>${a.attempt_number}</td><td>${a.score}</td><td>${a.total}</td><td>${a.status}</td><td>${a.completed_at||''}</td></tr>`; });
        html += `</table>`;
      }
      html += `</body></html>`;
      const blob = new Blob([html], { type: "application/msword" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
      a.download = `${fileName}.doc`; a.click();
    }
  };

  const handleContinue = async () => {
    if (step === 1) {
      setStep(2);
      window.scrollTo(0, 0);
    } else if (step === 2) {
      setExporting(true);
      try {
        const res = await api<{ success: boolean; data: any }>("/api/profile/export-data", {
          method: "POST",
          body: { class_id: selectedClass, items: selectedItems },
        });
        if (res.success) {
          doDownload(res.data);
        }
      } catch (e: any) {
        setError(e.message || "Export failed");
      } finally {
        setExporting(false);
      }
    }
  };

  return (
    <div className="">
      <BackHeader title="Export Data" />

      <div className="px-4 py-6 space-y-6">
        {/* STEP 1: Select Class */}
        {step === 1 ? (
          <div className="space-y-6">
            {/* Illustration */}
            <div className="flex flex-col items-center text-center space-y-3">
              <Image
                src="https://res.cloudinary.com/mview/image/upload/v1781700036/atlas/privacypage1.png"
                alt="Export Data Illustration"
                width={300}
                height={180}
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  What would you like to export?
                </h1>
                <p className="text-sm text-gray-600 mt-2">
                  Choose the class or data you want to export from Atlas.
                </p>
              </div>
            </div>

            {/* All Classes Option */}
            <div className="space-y-4">
              <h2 className="font-bold text-gray-900">Export From</h2>
              <button
                onClick={() => setSelectedClass("all")}
                className={`w-full p-4 rounded-lg border transition-all flex items-center justify-between ${
                  selectedClass === "all"
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-300 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-100 flex-shrink-0">
                    <Globe className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">All Classes</p>
                    <p className="text-xs text-gray-600">
                      Export everything from all your classes
                    </p>
                  </div>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selectedClass === "all"
                      ? "border-indigo-600 bg-indigo-600"
                      : "border-gray-300"
                  }`}
                >
                  {selectedClass === "all" && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>

              {/* Your Classes — dynamic from API */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Your Classes</h3>

                {/* Loading */}
                {loading && (
                  <div className="flex items-center justify-center py-8 gap-2 text-gray-400">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm font-medium">Loading classes...</span>
                  </div>
                )}

                {/* Error */}
                {!loading && error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-red-900">Failed to load classes</p>
                      <p className="text-xs text-red-700 mt-1">{error}</p>
                    </div>
                  </div>
                )}

                {/* Empty */}
                {!loading && !error && classes.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500 font-medium">No classes found</p>
                    <p className="text-xs text-gray-400 mt-1">Add a class first to export data.</p>
                  </div>
                )}

                {/* Class List */}
                {!loading && !error && classes.length > 0 && (
                  <div className="space-y-2">
                    {classes.map((cls) => {
                      const style = getClassStyle(cls.name);
                      return (
                        <button
                          key={cls.id}
                          onClick={() => setSelectedClass(cls.id)}
                          className={`w-full p-3 rounded-lg border transition-all flex items-center justify-between ${
                            selectedClass === cls.id
                              ? "border-indigo-500 bg-indigo-50"
                              : "border-gray-300 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-start gap-3 text-left flex-1">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center ${style.iconBg} flex-shrink-0`}
                            >
                              <span className="text-2xl">{style.icon}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{cls.name}</p>
                              {cls.term && (
                                <p className="text-xs text-gray-600 mt-0.5">{cls.term}</p>
                              )}
                              {cls.instructor && (
                                <p className="text-xs text-gray-500 mt-1">{cls.instructor}</p>
                              )}
                            </div>
                          </div>
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              selectedClass === cls.id
                                ? "border-indigo-600 bg-indigo-600"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedClass === cls.id && (
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : step === 2 ? (
          /* STEP 2: Select Items & Format */
          <div className="">
            {/* Selected Class Card */}
            <div className="bg-white border-2 border-gray-200 rounded-lg mb-7 p-4">
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 ${selectedClassStyle.iconBg} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
                  {selectedClass === "all" ? (
                    <Globe className="w-6 h-6 text-indigo-600" />
                  ) : (
                    selectedClassStyle.icon
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-gray-900">
                    {selectedClass === "all" ? "All Classes" : selectedClassData?.name}
                  </h2>
                  {selectedClass !== "all" && selectedClassData?.term && (
                    <p className="text-sm text-gray-600 mt-0.5">{selectedClassData.term}</p>
                  )}
                  {selectedClass !== "all" && selectedClassData?.instructor && (
                    <p className="text-xs text-gray-500 mt-1">{selectedClassData.instructor}</p>
                  )}
                  {selectedClass === "all" && (
                    <p className="text-sm text-gray-600 mt-0.5">
                      Export data from all {classes.length} classes
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-1 flex justify-end">
                <button
                  onClick={() => setStep(1)}
                  className="text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors flex items-center gap-1"
                >
                  Change Class <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* What to Include */}
            <div className="mb-7">
              <div>
                <h2 className="font-bold text-gray-700 text-[17px]">
                  What do you want to include?
                </h2>
                <p className="text-sm text-gray-600 mb-3">
                  Select the data you want to export.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {EXPORT_ITEMS.map((item) => {
                  const isSelected = selectedItems.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`relative px-2 py-2 min-h-[90px] rounded-md border text-left transition-all ${
                        isSelected
                          ? "border-indigo-300 bg-indigo-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div
                        className={`absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center ${
                          isSelected
                            ? "bg-indigo-600 text-white"
                            : "border border-gray-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5" />}
                      </div>
                      <div className="flex flex-col items-start">
                        <div
                          className={`w-8 h-8 rounded-md flex items-center justify-center mb-2 ${
                            isSelected ? "bg-indigo-100" : "bg-gray-100"
                          }`}
                        >
                          {item.icon}
                        </div>
                        <p className="text-sm font-medium text-gray-700 leading-tight">
                          {item.label}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Export Format */}
            <div className="">
              <div className="mb-3">
                <h2 className="font-bold text-gray-700 text-[17px]">
                  Export Format
                </h2>
                <p className="text-sm text-gray-600">
                  Choose the file format for your export.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {FORMAT_OPTIONS.map((format) => (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className={`p-3 rounded-lg border transition-all flex flex-col items-center gap-2 ${
                      selectedFormat === format.id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 ${
                        selectedFormat === format.id
                          ? "text-indigo-600"
                          : "text-gray-600"
                      }`}
                    >
                      {format.icon}
                      <span className="text-sm font-semibold text-gray-900">
                        {format.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {/* Continue/Done Button */}
        <button
          onClick={handleContinue}
          disabled={(step === 1 && !selectedClass) || exporting}
          className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-base transition-all flex items-center justify-center gap-2"
        >
          {exporting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Exporting...
            </>
          ) : step === 2 ? (
            <>
              <Download className="w-5 h-5" /> Download
            </>
          ) : (
            <>
              Continue <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
