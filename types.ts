
export interface StudyPlan {
  id: string;
  subject: string;
  category: string;
  startDate: string;
  endDate: string;
  totalPages: number;
  completedPages: number;
  frequencyPerWeek: number;
  color: string;
  tasks: DailyTask[];
  aiAdvice?: string;
  totalMinutes: number;
}

export interface DailyTask {
  date: string;
  pagesToRead: number;
  isCompleted: boolean;
  minutesSpent: number;
  isRestDay: boolean;
}

export interface FixedEvent {
  id: string;
  title: string;
  dayOfWeek: number; // 0-6, 0 is Sunday
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  isAI?: boolean;
}

export interface ProjectPlan {
  id: string;
  title: string;
  categories: ProjectCategory[];
}

export interface ProjectCategory {
  id: string;
  name: string;
  tasks: ProjectTask[];
}

export interface ProjectTask {
  id: string;
  name: string;
  deadline: string;
  isCompleted: boolean;
}

export type ViewType = 'plans' | 'stats' | 'projects';
