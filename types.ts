
export interface StudyPlan {
  id: string;
  subject: string;
  category: string;
  startDate: string;
  endDate: string;
  totalPages: number;
  completedPages: number;
  frequencyPerWeek: number; // 每週讀書天數
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
  isRestDay: boolean; // 是否為休息日
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

export interface AIAnalysisResponse {
  advice: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Intense';
  suggestedPace: string;
}

export type ViewType = 'plans' | 'stats' | 'projects';
