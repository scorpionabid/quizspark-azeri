export interface OfficialExamConfig {
  key: string;
  title: string;
  title_ka: string;
  subject: string;
  subject_ka: string;
  passScore: number;
  duration: number;
  questions: number;
}

export const OFFICIAL_EXAMS: OfficialExamConfig[] = [
  {
    key: 'gch',
    title: 'Gənclərin çağırışaqədərki hazırlığı rəhbəri (GÇH)',
    title_ka: 'ახალგაზრდობის წვევამდელი მომზადების ხელმძღვანელი',
    subject: 'GÇH rəhbəri',
    subject_ka: 'წვევამდელი მომზადების ხელმძღვანელი',
    passScore: 50,
    duration: 120,
    questions: 60,
  },
  {
    key: 'informatika_laboranti',
    title: 'İnformatika laborantı',
    title_ka: 'ინფორმატიკის ლაბორანტი',
    subject: 'İnformatika laborantı',
    subject_ka: 'ინფორმატიკის ლაბორანტი',
    passScore: 50,
    duration: 120,
    questions: 60,
  },
  {
    key: 'katibe_makinaci',
    title: 'Katibə-makinaçı',
    title_ka: 'მდივან-მემანქანე',
    subject: 'Katibə-makinaçı',
    subject_ka: 'მდივან-მემანქანე',
    passScore: 50,
    duration: 120,
    questions: 60,
  },
  {
    key: 'kitabxanaci',
    title: 'Kitabxanaçı / Kitabxana müdiri',
    title_ka: 'ბიბლიოთეკარი / ბიბლიოთეკის გამგე',
    subject: 'Kitabxanaçı',
    subject_ka: 'ბიბლიოთეკარი',
    passScore: 50,
    duration: 120,
    questions: 60,
  },
  {
    key: 'laborant',
    title: 'Laborant (Fizika, Kimya, Biologiya)',
    title_ka: 'ლაბორანტი (ფიზიკა, ქიმია, ბიოლოგია)',
    subject: 'Laborant',
    subject_ka: 'ლაბორანტი',
    passScore: 50,
    duration: 120,
    questions: 60,
  },
  {
    key: 'mekteb_psixoloqu',
    title: 'Məktəb psixoloqu',
    title_ka: 'სკოლის ფსიქოლოგი',
    subject: 'Məktəb psixoloqu',
    subject_ka: 'სკოლის ფსიქოლოგი',
    passScore: 50,
    duration: 120,
    questions: 60,
  },
  {
    key: 'teserrufat_muavini',
    title: 'Təsərrüfat işləri üzrə direktor müavini',
    title_ka: 'დირექტორის მოადგილე სამეურნეო დარგში',
    subject: 'Təsərrüfat müavini',
    subject_ka: 'სამეურნეო მოადგილე',
    passScore: 50,
    duration: 120,
    questions: 60,
  },
  {
    key: 'teserrufat_mudiri',
    title: 'Təsərrüfat müdiri',
    title_ka: 'სამეურნეო ნაწილის გამგე',
    subject: 'Təsərrüfat müdiri',
    subject_ka: 'სამეურნეო ნაწილის გამგე',
    passScore: 50,
    duration: 120,
    questions: 60,
  },
  {
    key: 'ubtr',
    title: 'Uşaq birliyi təşkilatının rəhbəri (UBTR)',
    title_ka: 'ბავშვთა გაერთიანების ორგანიზაციის ხელმძღვანელი (UBTR)',
    subject: 'UBTR',
    subject_ka: 'UBTR',
    passScore: 50,
    duration: 120,
    questions: 60,
  },
];
