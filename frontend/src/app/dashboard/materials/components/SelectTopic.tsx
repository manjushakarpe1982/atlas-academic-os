"use client";
import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, BookOpen, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { TopicItem } from "./shared";

interface ClassData {
  id: string;
  name: string;
  term: string | null;
  instructor: string | null;
}
interface TopicData {
  id: string;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
}

interface Props {
  onTopicSelect: (t: TopicItem, className: string, classId: string) => void;
}

export default function SelectTopic({ onTopicSelect }: Props) {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [topics, setTopics] = useState<TopicData[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showAllTopics, setShowAllTopics] = useState(false);

  // Fetch classes on mount
  useEffect(() => {
    api<{ classes: ClassData[] }>("/api/classes")
      .then((d) => {
        const list = d.classes || [];
        setClasses(list);
        if (list.length > 0) setSelectedClass(list[0]);
      })
      .catch(() => {})
      .finally(() => setLoadingClasses(false));
  }, []);

  // Fetch topics when selected class changes
  useEffect(() => {
    if (!selectedClass) {
      setTopics([]);
      return;
    }
    setLoadingTopics(true);
    api<{ topics: TopicData[] }>(`/api/classes/${selectedClass.id}/topics`)
      .then((d) => setTopics(d.topics || []))
      .catch(() => setTopics([]))
      .finally(() => setLoadingTopics(false));
  }, [selectedClass]);

  const handleClassSelect = (c: ClassData) => {
    setSelectedClass(c);
    setDropdownOpen(false);
    setShowAllTopics(false);
  };

  if (loadingClasses) {
    return (
      <div className="flex items-center justify-center py-20 gap-2 text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading classes...</span>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 pb-24">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-extrabold text-gray-900">
          Study Materials
        </h1>
        {/* <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0"> <BookOpen className="w-5 h-5 text-indigo-500" /></div> */}
      </div>

      {/* Select Class Dropdown */}
      <div className="mb-5 relative">
        <p className="text-base font-bold text-gray-700  mb-2">Select Class</p>

        {classes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
            <p className="text-sm text-gray-500">
              No classes found. Add a class first.
            </p>
          </div>
        ) : (
          <>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full bg-white rounded-lg border border-gray-200 p-3 flex items-center justify-between hover:border-indigo-300 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-900">
                    {selectedClass?.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {selectedClass?.term || ""}
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-lg border  border-gray-200 shadow-xl z-50 overflow-y-auto max-h-60">
                  {classes.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleClassSelect(c)}
                      className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 border-b border-gray-100 transition-all text-left ${
                        selectedClass?.id === c.id ? "bg-indigo-50" : ""
                      }`}
                    >
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {c.name}
                        </p>
                        <p className="text-xs text-gray-400">{c.term || ""}</p>
                      </div>
                      {selectedClass?.id === c.id && (
                        <span className="ml-auto text-indigo-600 text-xs font-bold">
                          Selected
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Topics List */}
      <div className="mb-4">
        <p className="text-base font-bold text-gray-700  mb-2">Select Topic</p>

        {loadingTopics ? (
          <div className="flex items-center justify-center bg-white rounded-lg border border-gray-100 shadow-sm py-8 gap-2 text-gray-800">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-base">Loading topics...</span>
          </div>
        ) : topics.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 text-center">
            <p className="text-base text-gray-800 font-medium">
              No topics found
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Upload a syllabus to generate topics
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-3">
              Topics ({topics.length})
            </p>
            <div className="space-y-3">
              {(showAllTopics ? topics : topics.slice(0, 5)).map((t, i) => {
                const isDone = t.status === "completed";
                const inProgress = t.status === "in_progress";

                return (
                  <button
                    key={t.id}
                    onClick={() =>
                      onTopicSelect(
                        {
                          id: t.id,
                          title: t.title,
                          lastStudied: t.status,
                          description: t.description || "",
                        },
                        selectedClass?.name || "",
                        selectedClass?.id || "",
                      )
                    }
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left hover:shadow-md group ${
                      isDone
                        ? "border-green-200 bg-green-50/60"
                        : inProgress
                          ? "border-indigo-200 bg-indigo-50/60"
                          : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-base font-extrabold transition-colors ${
                        isDone
                          ? "bg-green-100 text-green-600 group-hover:bg-green-200"
                          : inProgress
                            ? "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200"
                            : "bg-violet-100 text-violet-600 group-hover:bg-violet-200"
                      }`}
                    >
                      {i + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900">
                        {t.title}
                      </p>

                      {t.description && (
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {t.description}
                        </p>
                      )}

                      <span
                        className={`text-[10px] font-bold mt-1.5 inline-block px-3 py-1 rounded-full ${
                          isDone
                            ? "text-green-700 bg-green-100"
                            : inProgress
                              ? "text-indigo-700 bg-indigo-100"
                              : "text-gray-500 bg-gray-100"
                        }`}
                      >
                        {isDone
                          ? "Completed"
                          : inProgress
                            ? "In Progress"
                            : "Not Started"}
                      </span>
                    </div>

                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-500 flex-shrink-0 transition-colors" />
                  </button>
                );
              })}
            </div>
            {topics.length > 5 && (
              <button
                onClick={() => setShowAllTopics(!showAllTopics)}
                className="w-full mt-3 flex items-center justify-center gap-2 text-sm bg-violet-100 font-bold text-violet-600 py-2.5 rounded-lg border border-violet-200 hover:bg-violet-50 transition-all"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${showAllTopics ? "rotate-180" : ""}`}
                />
                {showAllTopics
                  ? "Show Less"
                  : `View All Topics (${topics.length})`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
