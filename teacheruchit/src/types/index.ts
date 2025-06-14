export type UserRole = 'teacher' | 'student';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  school?: string;
  subject?: string;
  classIds?: string[];
  grade?: number;
  avatarProgress?: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  subject: 'history' | 'social';
  grade: number;
  blocks: Array<{
    id: string;
    type: 'video' | 'map' | 'document' | 'quiz' | 'simulator';
    data: any;
    order: number;
  }>;
  classIds: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProgress {
  userId: string;
  xp: number;
  level: number;
  badges: string[];
  lastCompleted: {
    lessonId: string;
    timestamp: Date;
    score: number;
  };
}

export interface HistoricalMap {
  era: string;
  period: {
    start: number;
    end: number;
  };
  geoJson: any;
  events: Array<{
    id: string;
    title: string;
    description: string;
    date: string;
    coordinates: [number, number];
    type: 'battle' | 'treaty' | 'discovery' | 'revolution';
  }>;
} 