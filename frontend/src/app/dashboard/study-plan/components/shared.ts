export interface FocusItem {
  className: string; classId: string; topic: string;
  examTitle: string; examDate: string; daysLeft: number;
  currentGrade: number | null; potentialImpact: number;
}

export interface SessionItem {
  topicId: string; title: string; className: string; classId: string;
  completed: number; total: number; urgencyText: string; isHighImpact: boolean;
}

export interface DeadlineItem {
  title: string; category: string; className: string; classId: string;
  due_date: string; days_left: number | null; month: string; day: string;
}

export interface StudyPlanData {
  firstName: string;
  focusItem: FocusItem | null;
  sessions: SessionItem[];
  deadlines: DeadlineItem[];
}
