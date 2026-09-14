import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppLanguage = 'az' | 'ka';

interface LanguageContextType {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: (key: string, fallback?: string) => string;
}

const UI_TRANSLATIONS: Record<AppLanguage, Record<string, string>> = {
  az: {
    // General & Header
    language: 'Azərbaycan dili',
    lang_az: 'AZ',
    lang_ka: 'ქარ',
    lang_name_az: 'Azərbaycanca',
    lang_name_ka: 'ქართული',

    // Exam Login (/imtahan)
    exam_portal: 'Rəsmi İmtahan Portalı',
    exam_portal_desc: 'Rəsmi imtahana başlamaq üçün FİN kodunuzu daxil edin',
    fin_label: 'FİN Kod',
    fin_placeholder: 'Məsələn: 7ABC123',
    fullname_label: 'Ad, Soyad və Ata adı',
    fullname_placeholder: 'Məsələn: Əliyev Əli Vəli oğlu',
    specialty_label: 'İmtahan İxtisası',
    specialty_placeholder: 'İxtisasınızı seçin...',
    exam_code_label: 'İmtahan Giriş Kodu',
    exam_code_placeholder: 'Nəzarətçi tərəfindən elan olunan kod',
    agree_terms: 'İmtahan qaydaları ilə tanış oldum və razıyam',
    start_exam_btn: 'İmtahana Başla',
    checking_btn: 'Yoxlanılır...',
    portal_closed: 'İmtahan portalı hazırda qapalıdır! İmtahan vaxtını gözləyin.',
    already_completed: 'Siz bu imtahanı artıq tamamlamısınız.',
    welcome_exam: 'İmtahana xoş gəlmisiniz! Uğurlar arzulayırıq.',
    err_fin_req: 'FİN kod dəqiq 7 simvoldan ibarət olmalıdır (Məsələn: 7ABC123)',
    err_name_req: 'Zəhmət olmasa Ad və Soyadınızı daxil edin',
    err_specialty_req: 'Zəhmət olmasa imtahan ixtisasını seçin',
    err_code_req: 'İmtahan zalında nəzarətçi tərəfindən verilən imtahan kodunu daxil edin',
    err_agree_req: 'İmtahan qaydaları ilə razılaşmalısınız',
    err_wrong_code: 'İmtahan giriş kodu yanlışdır! Yalnız nəzarətçi tərəfindən elan olunan parolu daxil edin.',

    // Quiz Intro
    quiz_intro_questions: 'Sual',
    quiz_intro_duration: 'Dəqiqə',
    quiz_intro_pass: 'Keçid balı',
    quiz_intro_start: 'İmtahana Başla',
    quiz_intro_resume: 'İmtahanı Davam Et',

    // Quiz Playing
    question_count: 'Sual',
    time_left: 'Qalan vaxt',
    prev_question: 'Əvvəlki',
    next_question: 'Növbəti Səhifə',
    next_short: 'İrəli',
    finish_exam: 'İmtahanı Bitir',
    finish_short: 'Bitir',
    finish_confirm_title: 'İmtahanı bitirmək istədiyinizdən əminsiniz?',
    finish_confirm_desc: 'Bütün cavablarınız təsdiqlənəcək və yekun nəticəniz hesablanacaq. Bu əməliyyat geri qaytarıla bilməz.',
    cancel: 'Ləğv et',
    confirm_finish: 'Bəli, Bitir',
    answered: 'Cavablandırılıb',
    unanswered: 'Cavablandırılmayıb',
    current: 'Cari sual',
    question_map: 'Sual Xəritəsi',
    multiple_select_hint: 'Bir və ya bir neçə cavab seçə bilərsiniz',
    offline_warning: 'İnternet bağlantısı kəsildi. Cavablar brauzerdə qorunur.',

    // Quiz Result
    exam_completed: 'İmtahan Tamamlandı',
    exam_completed_desc: 'Cavablarınız qeydə alındı və nəticəniz hesablandı',
    result: 'Nəticə',
    correct_count: 'Düzgün',
    wrong_count: 'Yanlış / Boş',
    duration: 'Müddət',
    pass_score: 'Keçid balı',
    passed: '✓ Keçdiniz',
    failed: '✗ Keçid balı toplanmadı',
    exit_btn: 'İmtahanı Bitir və Çıxış Et',
  },
  ka: {
    // General & Header
    language: 'ქართული ენა',
    lang_az: 'AZ',
    lang_ka: 'ქარ',
    lang_name_az: 'Azərbaycanca',
    lang_name_ka: 'ქართული',

    // Exam Login (/imtahan)
    exam_portal: 'ოფიციალური საგამოცდო პორტალი',
    exam_portal_desc: 'შეიყვანეთ თქვენი პირადი ნომერი (FIN) ოფიციალურ გამოცდაზე დასაშვებად',
    fin_label: 'პირადი ნომერი (FIN)',
    fin_placeholder: 'მაგალითად: 7ABC123',
    fullname_label: 'სახელი, გვარი და მამის სახელი',
    fullname_placeholder: 'მაგალითად: ალიევი ალი',
    specialty_label: 'გამოცდის სპეციალობა',
    specialty_placeholder: 'აირჩიეთ თქვენი სპეციალობა...',
    exam_code_label: 'საგამოცდო წვდომის კოდი',
    exam_code_placeholder: 'დამკვირვებლის მიერ გამოცხადებული კოდი',
    agree_terms: 'გავეცანი საგამოცდო წესებს და ვეთანხმები',
    start_exam_btn: 'გამოცდის დაწყება',
    checking_btn: 'მოწმდება...',
    portal_closed: 'საგამოცდო პორტალი ამჟამად დახურულია! გთხოვთ, დაელოდოთ გამოცდის დაწყებას.',
    already_completed: 'თქვენ უკვე დასრულებული გაქვთ ეს გამოცდა.',
    welcome_exam: 'კეთილი იყოს თქვენი მობრძანება გამოცდაზე! გისურვებთ წარმატებას.',
    err_fin_req: 'პირადი ნომერი უნდა შედგებოდეს ზუსტად 7 სიმბოლოსგან (მაგ: 7ABC123)',
    err_name_req: 'გთხოვთ, შეიყვანოთ თქვენი სახელი და გვარი',
    err_specialty_req: 'გთხოვთ, აირჩიოთ გამოცდის სპეციალობა',
    err_code_req: 'შეიყვანეთ დამკვირვებლის მიერ მოწოდებული საგამოცდო კოდი',
    err_agree_req: 'თქვენ უნდა დაეთანხმოთ საგამოცდო წესებს',
    err_wrong_code: 'საგამოცდო კოდი არასწორია! შეიყვანეთ მხოლოდ დამკვირვებლის მიერ გამოცხადებული პაროლი.',

    // Quiz Intro
    quiz_intro_questions: 'შეკითხვა',
    quiz_intro_duration: 'წუთი',
    quiz_intro_pass: 'გამსვლელი ქულა',
    quiz_intro_start: 'გამოცდის დაწყება',
    quiz_intro_resume: 'გამოცდის გაგრძელება',

    // Quiz Playing
    question_count: 'კითხვა',
    time_left: 'დარჩენილი დრო',
    prev_question: 'წინა',
    next_question: 'შემდეგი გვერდი',
    next_short: 'წინ',
    finish_exam: 'გამოცდის დასრულება',
    finish_short: 'დასრულება',
    finish_confirm_title: 'დარწმუნებული ხართ, რომ გსურთ გამოცდის დასრულება?',
    finish_confirm_desc: 'თქვენი ყველა პასუხი დადასტურდება და დაითვლება საბოლოო შედეგი. ამ მოქმედების გაუქმება შეუძლებელია.',
    cancel: 'გაუქმება',
    confirm_finish: 'დიახ, დასრულება',
    answered: 'პასუხგაცემული',
    unanswered: 'უპასუხო',
    current: 'მიმდინარე კითხვა',
    question_map: 'კითხვების რუკა',
    multiple_select_hint: 'შეგიძლიათ აირჩიოთ ერთი ან რამდენიმე პასუხი',
    offline_warning: 'ინტერნეტ კავშირი შეწყდა. პასუხები ინახება ბრაუზერში.',

    // Quiz Result
    exam_completed: 'გამოცდა დასრულდა',
    exam_completed_desc: 'თქვენი პასუხები ჩაწერილია და შედეგი დათვლილია',
    result: 'შედეგი',
    correct_count: 'სწორი',
    wrong_count: 'არასწორი / ცარიელი',
    duration: 'ხანგრძლივობა',
    pass_score: 'გამსვლელი ქულა',
    passed: '✓ ჩაბარებულია',
    failed: '✗ ვერ ჩაბარდა',
    exit_btn: 'გამოცდის დასრულება და გასვლა',
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'az',
  setLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quiz_language');
      if (saved === 'az' || saved === 'ka') return saved;
    }
    return 'az';
  });

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('quiz_language', lang);
      window.dispatchEvent(new Event('storage'));
    }
  };

  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem('quiz_language');
      if (saved === 'az' || saved === 'ka') {
        setLanguageState(saved);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const t = (key: string, fallback?: string): string => {
    const langDict = UI_TRANSLATIONS[language];
    if (langDict && langDict[key] !== undefined) {
      return langDict[key];
    }
    const fallbackDict = UI_TRANSLATIONS.az;
    if (fallbackDict && fallbackDict[key] !== undefined) {
      return fallbackDict[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
