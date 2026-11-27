export type CareerStage = 1 | 2 | 3;

export type RiasecKey = 'realistic' | 'investigative' | 'artistic' | 'social' | 'enterprising' | 'conventional';
export type SkillKey = 'technical' | 'analytical' | 'creative' | 'interpersonal' | 'organizational';
export type ValueKey = 'innovation' | 'impact' | 'stability';

export interface CareerQuestion {
  id: number;
  stage: CareerStage;
  stageTitle: string;
  category: RiasecKey | SkillKey | ValueKey;
  text: string;
  example: string;
  iconName: string;
}

export interface CareerOption {
  value: number; // 1 to 5 or 1 to 3
  label: string;
  emoji: string;
}

export interface CareerRadarPoint {
  subject: string;
  score: number;
  fullMark: number;
}

export interface RecommendedCareer {
  id: string;
  title: string;
  cluster: string;
  matchScore: number; // 0 - 100
  description: string;
  keySkills: string[];
  educationPath: string;
  futureDemand: 'Yüksək' | 'Çox Yüksək' | 'Sabit';
}

export interface SubjectAdvice {
  subject: string;
  importance: 'Əsas' | 'Tövsiyə olunan';
  reason: string;
}

export interface CareerAssessmentResult {
  id?: string;
  userId?: string | null;
  utisCode?: string | null;
  studentName?: string | null;
  schoolName?: string | null;
  gradeLevel?: string | null;
  dominantCluster: string;
  dimGroup: string;
  dimGroupDescription: string;
  riasecScores: Record<RiasecKey, number>;
  skillScores: Record<SkillKey, number>;
  valueScores: Record<ValueKey, number>;
  radarData: CareerRadarPoint[];
  recommendedCareers: RecommendedCareer[];
  recommendedSubjects: SubjectAdvice[];
  rawAnswers: Record<number, number>;
  createdAt?: string;
}
