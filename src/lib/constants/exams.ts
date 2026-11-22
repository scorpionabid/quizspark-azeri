import { AppLanguage } from '@/contexts/LanguageContext';

export interface OfficialExamConfig {
  key: string;
  title: string;
  title_ka: string;
  title_ru: string;
  title_tr: string;
  title_en: string;
  subject: string;
  subject_ka: string;
  subject_ru: string;
  subject_tr: string;
  subject_en: string;
  passScore: number;
  duration: number;
  questions: number;
}

export const OFFICIAL_EXAMS: OfficialExamConfig[] = [
  {
    key: 'gch',
    title: 'Gənclərin çağırışaqədərki hazırlığı rəhbəri (GÇH)',
    title_ka: 'ახალგაზრდობის წვევამდელი მომზადების ხელმძღვანელი',
    title_ru: 'Руководитель допризывной подготовки молодежи (НВП)',
    title_tr: 'Gençlerin Askerlik Öncesi Hazırlık Lideri',
    title_en: 'Pre-conscription Military Training Instructor',
    subject: 'GÇH rəhbəri',
    subject_ka: 'წვევამდელი მომზადების ხელმძღვანელი',
    subject_ru: 'Руководитель НВП',
    subject_tr: 'Askerlik Öncesi Hazırlık Lideri',
    subject_en: 'Military Training Instructor',
    passScore: 50,
    duration: 120,
    questions: 60,
  },
  {
    key: 'informatika_laboranti',
    title: 'İnformatika laborantı',
    title_ka: 'ინფორმატიკის ლაბორანტი',
    title_ru: 'Лаборант по информатике',
    title_tr: 'Bilişim Laborantı',
    title_en: 'Computer Science Lab Assistant',
    subject: 'İnformatika laborantı',
    subject_ka: 'ინფორმატიკის ლაბორანტი',
    subject_ru: 'Лаборант по информатике',
    subject_tr: 'Bilişim Laborantı',
    subject_en: 'Computer Lab Assistant',
    passScore: 50,
    duration: 120,
    questions: 60,
  },
  {
    key: 'katibe_makinaci',
    title: 'Katibə-makinaçı',
    title_ka: 'მდივან-მემანქანე',
    title_ru: 'Секретарь-машинистка',
    title_tr: 'Sekreter-Daktilograf',
    title_en: 'Secretary-Typist',
    subject: 'Katibə-makinaçı',
    subject_ka: 'მდივან-მემანქანე',
    subject_ru: 'Секретарь-машинистка',
    subject_tr: 'Sekreter',
    subject_en: 'Secretary-Typist',
    passScore: 50,
    duration: 120,
    questions: 60,
  },
  {
    key: 'kitabxanaci',
    title: 'Kitabxanaçı / Kitabxana müdiri',
    title_ka: 'ბიბლიოთეკარი / ბიბლიოთეკის გამგე',
    title_ru: 'Библиотекарь / Заведующий библиотекой',
    title_tr: 'Kütüphaneci / Kütüphane Müdürü',
    title_en: 'Librarian / Head of Library',
    subject: 'Kitabxanaçı',
    subject_ka: 'ბიბლიოთეკარი',
    subject_ru: 'Библиотекарь',
    subject_tr: 'Kütüphaneci',
    subject_en: 'Librarian',
    passScore: 50,
    duration: 120,
    questions: 60,
  },
  {
    key: 'laborant',
    title: 'Laborant (Fizika, Kimya, Biologiya)',
    title_ka: 'ლაბორანტი (ფიზიკა, ქიმია, ბიოლოგია)',
    title_ru: 'Лаборант (Физика, Химия, Биология)',
    title_tr: 'Laborant (Fizik, Kimya, Biyoloji)',
    title_en: 'Laboratory Assistant (Physics, Chemistry, Biology)',
    subject: 'Laborant',
    subject_ka: 'ლაბორანტი',
    subject_ru: 'Лаборант',
    subject_tr: 'Laborant',
    subject_en: 'Lab Assistant',
    passScore: 50,
    duration: 120,
    questions: 60,
  },
  {
    key: 'mekteb_psixoloqu',
    title: 'Məktəb psixoloqu',
    title_ka: 'სკოლის ფსიქოლოგი',
    title_ru: 'Школьный психолог',
    title_tr: 'Okul Psikoloğu',
    title_en: 'School Psychologist',
    subject: 'Məktəb psixoloqu',
    subject_ka: 'სკოლის ფსიქოლოგი',
    subject_ru: 'Школьный психолог',
    subject_tr: 'Okul Psikoloğu',
    subject_en: 'School Psychologist',
    passScore: 50,
    duration: 120,
    questions: 60,
  },
  {
    key: 'teserrufat_muavini',
    title: 'Təsərrüfat işləri üzrə direktor müavini',
    title_ka: 'დირექტორის მოადგილე სამეურნეო დარგში',
    title_ru: 'Заместитель директора по хозяйственной части',
    title_tr: 'İdari ve Mali İşler Müdür Yardımcısı',
    title_en: 'Deputy Director for Administrative & Economic Affairs',
    subject: 'Təsərrüfat müavini',
    subject_ka: 'სამეურნეო მოადგილე',
    subject_ru: 'Заместитель по хоз. части',
    subject_tr: 'İdari İşler Müdür Yrd.',
    subject_en: 'Deputy Director for Administration',
    passScore: 50,
    duration: 120,
    questions: 60,
  },
  {
    key: 'teserrufat_mudiri',
    title: 'Təsərrüfat müdiri',
    title_ka: 'სამეურნეო ნაწილის გამგე',
    title_ru: 'Заведующий хозяйством (Завхоз)',
    title_tr: 'İdari İşler Müdürü',
    title_en: 'Head of Facilities & Operations',
    subject: 'Təsərrüfat müdiri',
    subject_ka: 'სამეურნეო ნაწილის გამგე',
    subject_ru: 'Завхоз',
    subject_tr: 'İdari İşler Müdürü',
    subject_en: 'Facilities Manager',
    passScore: 50,
    duration: 120,
    questions: 60,
  },
  {
    key: 'ubtr',
    title: 'Uşaq birliyi təşkilatının rəhbəri (UBTR)',
    title_ka: 'ბავშვთა გაერთიანების ორგანიზაციის ხელმძღვანელი (UBTR)',
    title_ru: 'Руководитель детского объединения (вожатый / UBTR)',
    title_tr: 'Çocuk Birliği Teşkilatı Lideri (UBTR)',
    title_en: 'Youth Union Organization Leader (UBTR)',
    subject: 'UBTR',
    subject_ka: 'UBTR',
    subject_ru: 'UBTR',
    subject_tr: 'UBTR',
    subject_en: 'UBTR',
    passScore: 50,
    duration: 120,
    questions: 60,
  },
];

export function getExamTitle(exam: OfficialExamConfig, language: AppLanguage): string {
  switch (language) {
    case 'ka':
      return exam.title_ka || exam.title;
    case 'ru':
      return exam.title_ru || exam.title;
    case 'tr':
      return exam.title_tr || exam.title;
    case 'en':
      return exam.title_en || exam.title;
    case 'az':
    default:
      return exam.title;
  }
}

export function getExamSubject(exam: OfficialExamConfig, language: AppLanguage): string {
  switch (language) {
    case 'ka':
      return exam.subject_ka || exam.subject;
    case 'ru':
      return exam.subject_ru || exam.subject;
    case 'tr':
      return exam.subject_tr || exam.subject;
    case 'en':
      return exam.subject_en || exam.subject;
    case 'az':
    default:
      return exam.subject;
  }
}
