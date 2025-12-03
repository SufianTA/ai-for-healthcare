export type Task = {
  id: number;
  name: string;
  slug: string;
  category?: string | null;
  description?: string | null;
};

export type TaskStandard = {
  id: number;
  level: string;
  target_time_seconds: number;
  max_minor_errors: number;
  max_major_errors: number;
  consecutive_required: number;
  objective_criteria?: Record<string, unknown> | null;
};

export type ErrorType = {
  id: number;
  name: string;
  description?: string | null;
  severity: 'minor' | 'major' | 'critical';
};

export type AttemptResponse = {
  id: number;
  task_id: number;
  standard_id: number;
  started_at: string;
  ended_at: string;
  time_seconds: number;
  score: number;
  proficiency: boolean;
  errors: ErrorType[];
};

export type AttemptCreatePayload = {
  task_id: number;
  standard_id: number;
  started_at: string;
  ended_at: string;
  errors: { error_type_id: number }[];
};

export type UserSummary = {
  proficient_tasks: number;
  total_tasks: number;
  task_details: {
    task_id: number;
    task_name: string;
    best_time_seconds: number | null;
    best_score: number | null;
  }[];
};

export type Profile = {
  id: number;
  email: string;
  full_name?: string | null;
  created_at: string;
};

export type LeaderboardEntry = {
  user_id: number;
  user_email: string;
  task_id: number;
  task_name: string;
  score: number;
  time_seconds: number;
};
