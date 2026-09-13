export interface OfficialExamConfig {
  key: string;
  title: string;
  subject: string;
  passScore: number;
  duration: number;
  questions: number;
}

export const OFFICIAL_EXAMS: OfficialExamConfig[] = [
  {
    key: 'gch',
    title: 'Gənclərin çağırışaqədərki hazırlığı rəhbəri (GÇH)',
    subject: 'GÇH rəhbəri',
    passScore: 70,
    duration: 120,
    questions: 60,
  },
  {
    key: 'informatika_laboranti',
    title: 'İnformatika laborantı',
    subject: 'İnformatika laborantı',
    passScore: 50,
    duration: 120,
    questions: 60,
  },
  {
    key: 'katibe_makinaci',
    title: 'Katibə-makinaçı',
    subject: 'Katibə-makinaçı',
    passScore: 50,
    duration: 120,
    questions: 60,
  },
  {
    key: 'kitabxanaci',
    title: 'Kitabxanaçı / Kitabxana müdiri',
    subject: 'Kitabxanaçı',
    passScore: 50,
    duration: 120,
    questions: 60,
  },
  {
    key: 'laborant',
    title: 'Laborant (Fizika, Kimya, Biologiya)',
    subject: 'Laborant',
    passScore: 50,
    duration: 120,
    questions: 60,
  },
  {
    key: 'mekteb_psixoloqu',
    title: 'Məktəb psixoloqu',
    subject: 'Məktəb psixoloqu',
    passScore: 50,
    duration: 120,
    questions: 60,
  },
  {
    key: 'teserrufat_muavini',
    title: 'Təsərrüfat işləri üzrə direktor müavini',
    subject: 'Təsərrüfat müavini',
    passScore: 50,
    duration: 120,
    questions: 60,
  },
  {
    key: 'teserrufat_mudiri',
    title: 'Təsərrüfat müdiri',
    subject: 'Təsərrüfat müdiri',
    passScore: 50,
    duration: 120,
    questions: 60,
  },
  {
    key: 'ubtr',
    title: 'Uşaq birliyi təşkilatının rəhbəri (UBTR)',
    subject: 'UBTR',
    passScore: 50,
    duration: 120,
    questions: 60,
  },
];
