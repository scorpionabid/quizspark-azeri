import {
  CareerQuestion,
  CareerStage,
  CareerAssessmentResult,
  RiasecKey,
  SkillKey,
  ValueKey,
  CareerRadarPoint,
  RecommendedCareer,
  SubjectAdvice,
  CareerOption
} from '@/types/career';
import { supabase } from '@/integrations/supabase/client';

export const STAGE_OPTIONS: Record<CareerStage, CareerOption[]> = {
  1: [
    { value: 1, label: 'Xoşlamıram', emoji: '😕' },
    { value: 2, label: 'Fərqi yoxdur', emoji: '😐' },
    { value: 3, label: 'Maraqlıdır', emoji: '🙂' },
    { value: 4, label: 'Çox xoşlayıram', emoji: '🤩' },
  ],
  2: [
    { value: 1, label: 'Çətinlik çəkirəm', emoji: '📉' },
    { value: 2, label: 'Orta səviyyədə', emoji: '⚖️' },
    { value: 3, label: 'Yaxşı bacarıram', emoji: '👍' },
    { value: 4, label: 'Mənim güclü tərəfimdir', emoji: '⚡' },
  ],
  3: [
    { value: 1, label: 'Əhəmiyyətli deyil', emoji: '⚪' },
    { value: 2, label: 'Qismən vacibdir', emoji: '🔵' },
    { value: 3, label: 'Çox vacibdir', emoji: '🌟' },
  ]
};

export const STAGE_META = {
  1: {
    title: 'Maraqlar və Həvəslər',
    subtitle: 'Nə ilə məşğul olmaq sənə həqiqətən zövq verir?',
    description: 'Holland (RIASEC) metodologiyasına əsaslanan 24 fəaliyyət növü.',
    badge: '1-ci Mərhələ',
    accentColor: 'from-blue-600 to-indigo-600'
  },
  2: {
    title: 'Şəxsi Bacarıqlar və Qabiliyyətlər',
    subtitle: 'Hansı sahələrdə özünü daha inamlı və qabiliyyətli hiss edirsən?',
    description: 'Praktik və zehni potensialını aşkar edən 15 situasiya.',
    badge: '2-ci Mərhələ',
    accentColor: 'from-emerald-600 to-teal-600'
  },
  3: {
    title: 'İş Mühiti və Gələcək Dəyərlər',
    subtitle: 'Gələcək karyeranda və iş həyatında sənin üçün ən vacib meyar nədir?',
    description: 'İdeal iş atmosferini və motivasiyanı müəyyən edən 9 meyar.',
    badge: '3-cü Mərhələ',
    accentColor: 'from-amber-500 to-orange-600'
  }
};

export const CAREER_QUESTIONS: CareerQuestion[] = [
  // --- MƏRHƏLƏ 1: MARAQLAR (RIASEC) ---
  // Realistic (Praktik, Mexanika, Texnika)
  {
    id: 1,
    stage: 1,
    stageTitle: 'Maraqlar və Həvəslər',
    category: 'realistic',
    text: 'Cihazları, elektronikanı və ya kompüter hissələrini söküb onların necə işlədiyini öyrənmək.',
    example: 'Xarab olmuş qulaqlığı, oyuncaq pultunu və ya kompüter blokunu açıb naqilləri, mikrosxemləri araşdırmaq və təmir etmək.',
    iconName: 'Wrench'
  },
  {
    id: 2,
    stage: 1,
    stageTitle: 'Maraqlar və Həvəslər',
    category: 'realistic',
    text: 'Əllə işləmək, fiziki modellər, robot və ya mexaniki konstruksiyalar yığmaq.',
    example: 'Lego, taxta maketlər, sadə robot hissələri və ya mexaniki fiqurlar yığmaqdan zövq almaq.',
    iconName: 'Cpu'
  },
  {
    id: 3,
    stage: 1,
    stageTitle: 'Maraqlar və Həvəslər',
    category: 'realistic',
    text: 'Texniki laboratoriyalarda və ya açıq təbiətdə təcrübələr və sınaqlar aparmaq.',
    example: 'Məktəb laboratoriyasında cihazlarla ölçmələr aparmaq və ya təbiətdə bitki və mineralları araşdırmaq.',
    iconName: 'Compass'
  },
  {
    id: 4,
    stage: 1,
    stageTitle: 'Maraqlar və Həvəslər',
    category: 'realistic',
    text: 'Müasir texniki avadanlıqlar, dronlar və 3D çap texnologiyaları ilə işləmək.',
    example: 'Pultla idarə olunan dron uçurmaq, 3D printerdə fiqur çap etmək və ya ağıllı cihazları sazlamaq.',
    iconName: 'Laptop'
  },

  // Investigative (Tədqiqatçı, Analitik, Dəqiq Elmlər)
  {
    id: 5,
    stage: 1,
    stageTitle: 'Maraqlar və Həvəslər',
    category: 'investigative',
    text: 'Mürəkkəb riyazi məsələləri, alqoritmləri və məntiqi tapmacaları həll etmək.',
    example: 'Çətin olimpiada misalını, şahmat taktikasını və ya məntiqi başsındıran tapmacaları saatlarla həvəslə düşünmək.',
    iconName: 'Binary'
  },
  {
    id: 6,
    stage: 1,
    stageTitle: 'Maraqlar və Həvəslər',
    category: 'investigative',
    text: 'Təbiət qanunlarını, fizika, kimya və kosmos hadisələrini dərindən araşdırmaq.',
    example: 'Qara dəliklər, atomların quruluşu və ya kimyəvi elementlərin reaksiyası barədə elmi verilişlərə maraqla baxmaq.',
    iconName: 'Atom'
  },
  {
    id: 7,
    stage: 1,
    stageTitle: 'Maraqlar və Həvəslər',
    category: 'investigative',
    text: 'Böyük məlumatları (data), qrafikləri və statistik göstəriciləri analiz etmək.',
    example: 'Futbolçuların oyun statistikalarını, havanın temperatur qrafikini və ya ölkələrin iqtisadi rəqəmlərini müqayisə etmək.',
    iconName: 'BarChart3'
  },
  {
    id: 8,
    stage: 1,
    stageTitle: 'Maraqlar və Həvəslər',
    category: 'investigative',
    text: 'Canlı orqanizmlərin quruluşunu, genetikanı və ya insan biologiyasını öyrənmək.',
    example: 'İnsan beyninin necə işlədiyini, DNT-nin irsiyyətə təsirini və ya xəstəliklərin necə yarandığını araşdırmaq.',
    iconName: 'Dna'
  },

  // Artistic (Yaradıcı, Dizayn, İncəsənət)
  {
    id: 9,
    stage: 1,
    stageTitle: 'Maraqlar və Həvəslər',
    category: 'artistic',
    text: 'Rəsm çəkmək, qrafik dizayn etmək və ya vizual layihələr hazırlamaq.',
    example: 'Dəftər kənarına qəşəng eskizlər çəkmək, Canva və ya kompüterdə loqo, afişa və vizual posterlər düzəltmək.',
    iconName: 'Palette'
  },
  {
    id: 10,
    stage: 1,
    stageTitle: 'Maraqlar və Həvəslər',
    category: 'artistic',
    text: 'Hekayələr, ssenarilər, bloq məqalələri yazmaq və ya fikirləri sözlərlə zəngin ifadə etmək.',
    example: 'Özündən maraqlı hekayə və ya ssenari uydurmaq, sosial şəbəkələrdə təsirli və dərin yazılar paylaşmaq.',
    iconName: 'PenTool'
  },
  {
    id: 11,
    stage: 1,
    stageTitle: 'Maraqlar və Həvəslər',
    category: 'artistic',
    text: 'Video montaj etmək, animasiya yaratmaq və ya musiqi ilə məşğul olmaq.',
    example: 'CapCut və ya kompüterdə videoları kəsib musiqi ilə sinxronlaşdırmaq, maraqlı reels/tiktok montajları hazırlamaq.',
    iconName: 'Video'
  },
  {
    id: 12,
    stage: 1,
    stageTitle: 'Maraqlar və Həvəslər',
    category: 'artistic',
    text: 'Veb-sayt, geyim və ya otaq interyeri üçün estetik və orijinal dizayn ideyaları irəli sürmək.',
    example: 'Öz otağının mebellərini zövqlə yerləşdirmək, saytların dizaynındakı estetik xətaları dərhal hiss etmək.',
    iconName: 'Sparkles'
  },

  // Social (İctimai, Təhsil, Psixologiya, Kömək)
  {
    id: 13,
    stage: 1,
    stageTitle: 'Maraqlar və Həvəslər',
    category: 'social',
    text: 'İnsanlara yeni biliklər öyrətmək, mövzuları başa salmaq və mentorluq etmək.',
    example: 'Sinif yoldaşına başa düşmədiyi dərsi səbirlə izah etmək və ya kiçik qardaş/bacına ev tapşırıqlarında kömək etmək.',
    iconName: 'GraduationCap'
  },
  {
    id: 14,
    stage: 1,
    stageTitle: 'Maraqlar və Həvəslər',
    category: 'social',
    text: 'Başqalarının problemlərini, hisslərini dinləmək və onlara məsləhətlə dəstək olmaq.',
    example: 'Dostun kefsiz olanda onun ürək sözlərini dinləyib ona təsəlli vermək və doğru yol göstərmək.',
    iconName: 'HeartHandshake'
  },
  {
    id: 15,
    stage: 1,
    stageTitle: 'Maraqlar və Həvəslər',
    category: 'social',
    text: 'Xeyriyyə və könüllülük tədbirlərində iştirak edərək cəmiyyətə fayda vermək.',
    example: 'Məktəbdə xeyriyyə yarmarkası təşkil etmək, kimsəsiz heyvanlara yemək vermək və ya ağacəkmə aksiyasında iştirak etmək.',
    iconName: 'Users'
  },
  {
    id: 16,
    stage: 1,
    stageTitle: 'Maraqlar və Həvəslər',
    category: 'social',
    text: 'Qrup müzakirələrini təşkil etmək və komandada mehriban ab-hava yaratmaq.',
    example: 'Sinif tədbirində hər kəsin söz deməsinə şərait yaratmaq və komanda daxilində mehriban əhval-ruhiyyə saxlamaq.',
    iconName: 'MessageSquare'
  },

  // Enterprising (Sahibkar, Biznes, Liderlik)
  {
    id: 17,
    stage: 1,
    stageTitle: 'Maraqlar və Həvəslər',
    category: 'enterprising',
    text: 'Yeni bir biznes və ya startap ideyası düşünüb onu reallaşdırmaq.',
    example: 'Məktəb yarmarkasında ləvazimat satıb qazanc əldə etmək və ya internetdə kiçik bir satış səhifəsi açmaq.',
    iconName: 'Rocket'
  },
  {
    id: 18,
    stage: 1,
    stageTitle: 'Maraqlar və Həvəslər',
    category: 'enterprising',
    text: 'İnsanları bir məqsəd ətrafında toplamaq, komandaya liderlik etmək və təşviq etmək.',
    example: 'Qrup layihəsində hamıya vəzifələri bölüşdürmək və komandanı birincilik qazanmağa həvəsləndirmək.',
    iconName: 'Award'
  },
  {
    id: 19,
    stage: 1,
    stageTitle: 'Maraqlar və Həvəslər',
    category: 'enterprising',
    text: 'Danışıqlar aparmaq, insanları inandırmaq və ya layihənin təqdimatını etmək.',
    example: 'Mübahisəli məsələdə öz fikrini faktlarla müdafiə edib ətrafdakıları öz haqlılığına inandırmaq.',
    iconName: 'Target'
  },
  {
    id: 20,
    stage: 1,
    stageTitle: 'Maraqlar və Həvəslər',
    category: 'enterprising',
    text: 'Maliyyə imkanlarını qiymətləndirmək və qazanclı fürsətləri dərhal görmək.',
    example: 'Cib xərcliyini yığıb daha sərfəli alış-veriş etmək və ya haradan daha çox qazanmağın yollarını düşünmək.',
    iconName: 'TrendingUp'
  },

  // Conventional (Sistemli, Təşkilatçı, Qayda-qanun)
  {
    id: 21,
    stage: 1,
    stageTitle: 'Maraqlar və Həvəslər',
    category: 'conventional',
    text: 'Məlumatları səliqəli cədvəllərdə, fayllarda sistemləşdirmək və nizamda saxlamaq.',
    example: 'Telefon və ya kompüterdəki faylları, şəkilləri qovluqlara səliqə ilə yığmaq, Excel-də siyahılar tutmaq.',
    iconName: 'Table'
  },
  {
    id: 22,
    stage: 1,
    stageTitle: 'Maraqlar və Həvəslər',
    category: 'conventional',
    text: 'Qaydalar, dəqiq təlimatlar və standartlar əsasında işləməyi üstün tutmaq.',
    example: 'Hər hansı oyunu və ya tapşırığı qaydaları pozmadan, addım-addım və tam düzgün icra etmək.',
    iconName: 'CheckSquare'
  },
  {
    id: 23,
    stage: 1,
    stageTitle: 'Maraqlar və Həvəslər',
    category: 'conventional',
    text: 'Gəlir-xərc büdcəsini dəqiqliklə hesablamaq və planlaşdırmaq.',
    example: 'Bir aylıq xərclərini qabaqcadan qeyd etmək, lazımsız xərclərdən qaçaraq puluna qənaət etmək.',
    iconName: 'Calculator'
  },
  {
    id: 24,
    stage: 1,
    stageTitle: 'Maraqlar və Həvəslər',
    category: 'conventional',
    text: 'Gündəlik iş qrafikini öncədən saatbasaat planlaşdırmaq və nizam-intizama riayət etmək.',
    example: 'Günün rejimini (dərs, idman, istirahət saatlarını) cədvələ yazıb ona dəqiqliklə əməl etmək.',
    iconName: 'Calendar'
  },

  // --- MƏRHƏLƏ 2: BACARIQLAR VƏ GÜCLÜ TƏRƏFLƏR ---
  // Technical
  {
    id: 25,
    stage: 2,
    stageTitle: 'Bacarıqlar və Güclü Tərəflər',
    category: 'technical',
    text: 'Kompüter proqramları, rəqəmsal platformalar və kodlaşdırmadan tez baş çıxarmaq.',
    example: 'Yeni bir proqramı və ya tətbiqi heç kim kömək etmədən 5 dəqiqəyə sərbəst öyrənib istifadə etmək.',
    iconName: 'Terminal'
  },
  {
    id: 26,
    stage: 2,
    stageTitle: 'Bacarıqlar və Güclü Tərəflər',
    category: 'technical',
    text: 'Texniki nasazlığı və ya proqram xətasını tez tapıb həll etmək.',
    example: 'Telefon donanda, internet sönəndə və ya proqram xəta verəndə problemin səbəbini tapıb düzəltmək.',
    iconName: 'ShieldAlert'
  },
  {
    id: 27,
    stage: 2,
    stageTitle: 'Bacarıqlar və Güclü Tərəflər',
    category: 'technical',
    text: 'Məsələyə ardıcıl alqoritmik addımlarla yanaşaraq həll modeli qurmaq.',
    example: 'Hər hansı qarışıq tapşırığı hissələrə bölərək: "1-ci addım bu, 2-ci addım bu" prinsipi ilə ardıcıl həll etmək.',
    iconName: 'Code'
  },

  // Analytical
  {
    id: 28,
    stage: 2,
    stageTitle: 'Bacarıqlar və Güclü Tərəflər',
    category: 'analytical',
    text: 'Faktları, rəqəmləri və dəlilləri müqayisə edərək məntiqli nəticə çıxarmaq.',
    example: 'İki fərqli telefon modelinin və ya ideyanın üstünlüklərini rəqəmlərlə ölçüb ən doğrusunu seçmək.',
    iconName: 'Scale'
  },
  {
    id: 29,
    stage: 2,
    stageTitle: 'Bacarıqlar və Güclü Tərəflər',
    category: 'analytical',
    text: 'Böyük bir mətndən və ya hadisədən ən əsas mahiyyəti dərhal fərqləndirmək.',
    example: 'Uzun bir paraqrafı və ya xəbəri oxuyub 1 cümlə ilə əsas fikri başqalarına çatdıra bilmək.',
    iconName: 'FileText'
  },
  {
    id: 30,
    stage: 2,
    stageTitle: 'Bacarıqlar və Güclü Tərəflər',
    category: 'analytical',
    text: 'Hadisələrin səbəb və nəticə əlaqələrini dərindən izah edə bilmək.',
    example: 'Tarixi bir qərarın və ya təbiət hadisəsinin niyə baş verdiyini və nəyə səbəb olduğunu məntiqlə əsaslandırmaq.',
    iconName: 'GitBranch'
  },

  // Creative
  {
    id: 31,
    stage: 2,
    stageTitle: 'Bacarıqlar və Güclü Tərəflər',
    category: 'creative',
    text: 'Hər kəsin düşündüyündən fərqli, qeyri-adi və yaradıcı ideyalar tapmaq.',
    example: 'Sinifdə standart təqdimat etmək əvəzinə, maraqlı videoçarx və ya interaktiv oyun formatı təklif etmək.',
    iconName: 'Lightbulb'
  },
  {
    id: 32,
    stage: 2,
    stageTitle: 'Bacarıqlar və Güclü Tərəflər',
    category: 'creative',
    text: 'Gözəl rəng uyğunluğu, forma və vizual kompozisiya yaratmaq.',
    example: 'Təqdimat slaydlarında rəngləri, şriftləri və şəkilləri göz oxşayan şəkildə düzmək.',
    iconName: 'Eye'
  },
  {
    id: 33,
    stage: 2,
    stageTitle: 'Bacarıqlar və Güclü Tərəflər',
    category: 'creative',
    text: 'Fikirləri təsirli hekayə, bənzətmə və ya metafora ilə başqalarına çatdırmaq.',
    example: 'Mövzunu quru faktlarla deyil, maraqlı bir həyat hadisəsi və ya bənzətmə ilə danışıb yadda qalan etmək.',
    iconName: 'Feather'
  },

  // Interpersonal
  {
    id: 34,
    stage: 2,
    stageTitle: 'Bacarıqlar və Güclü Tərəflər',
    category: 'interpersonal',
    text: 'Xarakteri fərqli olan insanlarla rahat ünsiyyət qurmaq və ortaq dil tapmaq.',
    example: 'İlk dəfə gördüyün insanla belə bir neçə dəqiqəyə səmimi söhbət bağlamaq və dostlaşmaq.',
    iconName: 'Smile'
  },
  {
    id: 35,
    stage: 2,
    stageTitle: 'Bacarıqlar və Güclü Tərəflər',
    category: 'interpersonal',
    text: 'Başqalarının gizli hisslərini, narahatlığını və ya sevincini hiss etmək.',
    example: 'Dostun "hər şey yaxşıdır" desə də, səsindən və baxışından onun nəyəsə kədərləndiyini dərhal duymaq.',
    iconName: 'Heart'
  },
  {
    id: 36,
    stage: 2,
    stageTitle: 'Bacarıqlar və Güclü Tərəflər',
    category: 'interpersonal',
    text: 'Mübahisəli anlarda tərəfləri barışdırmaq və razılıq əldə etmək.',
    example: 'İki yoldaşın dalaşdığı vaxt araya girib hər iki tərəfi sakitləşdirmək və ədalətli çıxış yolu tapmaq.',
    iconName: 'ShieldCheck'
  },

  // Organizational
  {
    id: 37,
    stage: 2,
    stageTitle: 'Bacarıqlar və Güclü Tərəflər',
    category: 'organizational',
    text: 'Dərsləri və tapşırıqları son ana saxlamadan vaxtında və nizamla bitirmək.',
    example: 'Sabaha olan layihəni axşam saat 11-də yox, bir neçə gün öncədən rahat şəkildə hazırlayıb qurtarmaq.',
    iconName: 'Clock'
  },
  {
    id: 38,
    stage: 2,
    stageTitle: 'Bacarıqlar və Güclü Tərəflər',
    category: 'organizational',
    text: 'İşlərdə gözdən qaçan kiçik detalları və xətaları dərhal görmək.',
    example: 'Mətndəki hərf səhvlərini, rəqəm uyğunsuzluqlarını və ya dizayndakı əyriliyi ilk baxışda tutmaq.',
    iconName: 'CheckCircle'
  },
  {
    id: 39,
    stage: 2,
    stageTitle: 'Bacarıqlar və Güclü Tərəflər',
    category: 'organizational',
    text: 'Qoyulmuş qaydalara və struktura səbirlə əməl etmək.',
    example: 'İmtahan və ya laboratoriya təlimatlarını dəqiqliklə oxuyub heç bir bəndi ötürmədən icra etmək.',
    iconName: 'Layers'
  },

  // --- MƏRHƏLƏ 3: İŞ MÜHİTİ VƏ DƏYƏRLƏR ---
  // Innovation & Autonomy
  {
    id: 40,
    stage: 3,
    stageTitle: 'İş Mühiti və Dəyərlər',
    category: 'innovation',
    text: 'Sərbəst qərarlar verə biləcəyim və daimi yeniliklər yaradılan sərbəst mühit.',
    example: 'Səhər 9-dan axşam 6-ya kimi bir yerdə oturmaq əvəzinə, sərbəst qrafiklə işləmək və yeni ideyalar sınamaq.',
    iconName: 'Compass'
  },
  {
    id: 41,
    stage: 3,
    stageTitle: 'İş Mühiti və Dəyərlər',
    category: 'innovation',
    text: 'Ən son texnologiyalar və qlobal layihələrlə işləmək imkanı.',
    example: 'Süni intellekt alətlərindən istifadə edərək xarici ölkələrdəki komandalarla beynəlxalq layihələrdə işləmək.',
    iconName: 'Globe'
  },
  {
    id: 42,
    stage: 3,
    stageTitle: 'İş Mühiti və Dəyərlər',
    category: 'innovation',
    text: 'Təkrarçılıqdan (rutin) uzaq, hər gün yeni çağırışlarla dolu bir iş həyatı.',
    example: 'Hər gün eyni kağızları doldurmaq əvəzinə, hər həftə fərqli problemləri həll etmək və dinamik olmaq.',
    iconName: 'Zap'
  },

  // Impact & Purpose
  {
    id: 43,
    stage: 3,
    stageTitle: 'İş Mühiti və Dəyərlər',
    category: 'impact',
    text: 'İnsanların həyatını yaxşılaşdırmaq, xəstələrə kömək etmək və ya təbiəti qorumaq.',
    example: 'Gördüyün iş nəticəsində bir xəstənin sağaldığını və ya təbiətin təmizləndiyini görüb qürur duymaq.',
    iconName: 'ShieldAlert'
  },
  {
    id: 44,
    stage: 3,
    stageTitle: 'İş Mühiti və Dəyərlər',
    category: 'impact',
    text: 'Cəmiyyətdə ədaləti, qanunçuluğu və insan hüquqlarını müdafiə etmək.',
    example: 'Haqsızlığa məruz qalmış bir insanın hüququnu məhkəmədə qorumaq və ədaləti bərpa etmək.',
    iconName: 'Award'
  },
  {
    id: 45,
    stage: 3,
    stageTitle: 'İş Mühiti və Dəyərlər',
    category: 'impact',
    text: 'Mehriban komanda ilə birlikdə böyük ictimai məqsədlərə çatmaq.',
    example: 'Təkbaşına deyil, bir-birinə dəstək olan mehriban kollektivlə çiyin-çiyinə böyük işlər görmək.',
    iconName: 'Users'
  },

  // Stability & Growth
  {
    id: 46,
    stage: 3,
    stageTitle: 'İş Mühiti və Dəyərlər',
    category: 'stability',
    text: 'Zəmanətli və yüksək gəlir, aydın iş qrafiki və sabit karyera.',
    example: 'Ayın sonunda maaşının gecikməyəcəyindən əmin olmaq və gələcəyini arxayınlıqla planlaşdıra bilmək.',
    iconName: 'TrendingUp'
  },
  {
    id: 47,
    stage: 3,
    stageTitle: 'İş Mühiti və Dəyərlər',
    category: 'stability',
    text: 'Böyük şirkətlərdə və ya dövlət orqanlarında rəhbər pillələrə yüksəlmək.',
    example: 'Böyük bir şöbənin və ya nazirliyin rəhbəri olub mühüm strateji qərarlar qəbul etmək.',
    iconName: 'Briefcase'
  },
  {
    id: 48,
    stage: 3,
    stageTitle: 'İş Mühiti və Dəyərlər',
    category: 'stability',
    text: 'Beynəlxalq arenada tanınmaq və qlobal imkanlar qazanmaq.',
    example: 'Xarici konfranslarda çıxış etmək, beynəlxalq dərəcəli ekspert kimi xaricə ezamiyyətlərə getmək.',
    iconName: 'Award'
  }
];

// Calculation and recommendation engine
export function calculateCareerResults(
  answers: Record<number, number>,
  meta?: {
    userId?: string | null;
    utisCode?: string | null;
    studentName?: string | null;
    schoolName?: string | null;
    gradeLevel?: string | null;
  }
): CareerAssessmentResult {
  // 1. Group answers by category
  const riasecScores: Record<RiasecKey, number> = {
    realistic: 0,
    investigative: 0,
    artistic: 0,
    social: 0,
    enterprising: 0,
    conventional: 0,
  };

  const skillScores: Record<SkillKey, number> = {
    technical: 0,
    analytical: 0,
    creative: 0,
    interpersonal: 0,
    organizational: 0,
  };

  const valueScores: Record<ValueKey, number> = {
    innovation: 0,
    impact: 0,
    stability: 0,
  };

  CAREER_QUESTIONS.forEach(q => {
    const rawVal = answers[q.id] || (q.stage === 3 ? 2 : 2); // default midpoint
    if (q.stage === 1) {
      riasecScores[q.category as RiasecKey] += rawVal;
    } else if (q.stage === 2) {
      skillScores[q.category as SkillKey] += rawVal;
    } else if (q.stage === 3) {
      valueScores[q.category as ValueKey] += rawVal;
    }
  });

  // Normalize scores to percentage (0 - 100)
  // Stage 1: 4 questions per category, max 4 * 4 = 16, min 4 * 1 = 4.
  const normRiasec: Record<RiasecKey, number> = { ...riasecScores };
  Object.keys(normRiasec).forEach(k => {
    const raw = riasecScores[k as RiasecKey];
    normRiasec[k as RiasecKey] = Math.round(((raw - 4) / 12) * 100);
  });

  // Stage 2: 3 questions per category, max 3 * 4 = 12, min 3 * 1 = 3.
  const normSkills: Record<SkillKey, number> = { ...skillScores };
  Object.keys(normSkills).forEach(k => {
    const raw = skillScores[k as SkillKey];
    normSkills[k as SkillKey] = Math.round(((raw - 3) / 9) * 100);
  });

  // Stage 3: 3 questions per category, max 3 * 3 = 9, min 3 * 1 = 3.
  const normValues: Record<ValueKey, number> = { ...valueScores };
  Object.keys(normValues).forEach(k => {
    const raw = valueScores[k as ValueKey];
    normValues[k as ValueKey] = Math.round(((raw - 3) / 6) * 100);
  });

  // 2. Prepare Radar Data (6 dimensional personality & aptitude overview)
  const radarData: CareerRadarPoint[] = [
    { subject: 'Texniki / Praktik', score: Math.max(15, Math.round((normRiasec.realistic * 0.6) + (normSkills.technical * 0.4))), fullMark: 100 },
    { subject: 'Elmi / Analitik', score: Math.max(15, Math.round((normRiasec.investigative * 0.6) + (normSkills.analytical * 0.4))), fullMark: 100 },
    { subject: 'Yaradıcı / Dizayn', score: Math.max(15, Math.round((normRiasec.artistic * 0.6) + (normSkills.creative * 0.4))), fullMark: 100 },
    { subject: 'Sosial / Humanitar', score: Math.max(15, Math.round((normRiasec.social * 0.6) + (normSkills.interpersonal * 0.4))), fullMark: 100 },
    { subject: 'Liderlik / Biznes', score: Math.max(15, Math.round((normRiasec.enterprising * 0.7) + (normValues.stability * 0.3))), fullMark: 100 },
    { subject: 'Sistemli / Dəqiq', score: Math.max(15, Math.round((normRiasec.conventional * 0.6) + (normSkills.organizational * 0.4))), fullMark: 100 },
  ];

  // 3. Composite cluster scores for DİM groups:
  // Group I (Tech/Eng): Realistic + Investigative + Technical
  const scoreGroup1 = Math.round((normRiasec.realistic * 0.35) + (normRiasec.investigative * 0.35) + (normSkills.technical * 0.30));
  
  // Group II (Econ/Biz): Enterprising + Conventional + Organizational
  const scoreGroup2 = Math.round((normRiasec.enterprising * 0.40) + (normRiasec.conventional * 0.30) + (normSkills.organizational * 0.30));

  // Group III (Hum/Law): Social + Interpersonal + Analytical (humanities)
  const scoreGroup3 = Math.round((normRiasec.social * 0.35) + (normSkills.interpersonal * 0.35) + (normSkills.analytical * 0.30));

  // Group IV (Med/Bio/Chem): Investigative + Impact + Social (medicine/nature)
  const scoreGroup4 = Math.round((normRiasec.investigative * 0.40) + (normValues.impact * 0.30) + (normRiasec.realistic * 0.30));

  // Group V (Art/Design): Artistic + Creative + Innovation
  const scoreGroup5 = Math.round((normRiasec.artistic * 0.45) + (normSkills.creative * 0.35) + (normValues.innovation * 0.20));

  // Subbakalavr / Professional Vocational (High realistic + low abstract)
  const scoreVocational = Math.round((normRiasec.realistic * 0.50) + (normSkills.technical * 0.30) + (normValues.stability * 0.20));

  // Find dominant
  const clusterOptions = [
    { key: 'group1', score: scoreGroup1, name: 'Texniki, Mühəndislik və İT', dim: 'I İxtisas Qrupu (Riyaziyyat - İnformatika / Fizika)' },
    { key: 'group2', score: scoreGroup2, name: 'İqtisadiyyat, Biznes və İdarəetmə', dim: 'II İxtisas Qrupu (Riyaziyyat - Coğrafiya)' },
    { key: 'group3', score: scoreGroup3, name: 'Humanitar, Hüquq və Sosial Elmlər', dim: 'III İxtisas Qrupu (Azərbaycan dili - Tarix - Ədəbiyyat)' },
    { key: 'group4', score: scoreGroup4, name: 'Təbiət Elmləri, Tibb və Əczaçılıq', dim: 'IV İxtisas Qrupu (Biologiya - Kimya - Fizika)' },
    { key: 'group5', score: scoreGroup5, name: 'Yaradıcı Sənayelər, Memarlıq və Dizayn', dim: 'V İxtisas Qrupu / Xüsusi Qabiliyyət' },
  ];

  clusterOptions.sort((a, b) => b.score - a.score);
  const topCluster = clusterOptions[0];

  let dimGroupDescription = '';
  let recommendedCareers: RecommendedCareer[] = [];
  let recommendedSubjects: SubjectAdvice[] = [];

  switch (topCluster.key) {
    case 'group1':
      dimGroupDescription = 'Sənin düşüncə tərzin sistemli, analitik və alqoritmik problemləri həll etməyə çox meyillidir. Müasir rəqəmsal dünyada ən çox axtarılan texnoloji və mühəndislik peşələri sənin üçün idealdır.';
      recommendedCareers = [
        {
          id: 'ai-eng',
          title: 'Süni İntellekt və Data Mühəndisi',
          cluster: 'Texnologiya & İT',
          matchScore: Math.min(99, Math.round(scoreGroup1 * 1.05)),
          description: 'Böyük məlumat modelləri, maşın öyrənməsi alqoritmləri və süni intellekt sistemlərinin qurulması.',
          keySkills: ['Python / Alqoritmlər', 'Riyazi Statistika', 'Məntiqi Təfəkkür'],
          educationPath: 'Kompüter elmləri, İnformasiya texnologiyaları və ya Tətbiqi riyaziyyat',
          futureDemand: 'Çox Yüksək'
        },
        {
          id: 'swe',
          title: 'Proqram Təminatı Tərtibatçısı (Full-Stack / Mobile)',
          cluster: 'Proqramlaşdırma',
          matchScore: Math.min(98, scoreGroup1),
          description: 'Mobil tətbiqlər, veb platformalar və mürəkkəb proqram təminatlarının hazırlanması.',
          keySkills: ['Veb/Mobil Texnologiyalar', 'Arxitektura', 'Problem Həlli'],
          educationPath: 'Kompüter mühəndisliyi və ya Proqram mühəndisliyi',
          futureDemand: 'Çox Yüksək'
        },
        {
          id: 'cyber',
          title: 'Kibertəhlükəsizlik Mütəxəssisi',
          cluster: 'Təhlükəsizlik & İT',
          matchScore: Math.min(95, Math.round(scoreGroup1 * 0.96)),
          description: 'Dövlət və kommersiya sistemlərinin kiber hücumlardan qorunması və təhlükəsizlik auditi.',
          keySkills: ['Şəbəkə Protokolları', 'Kriptoqrafiya', 'Analitik Nəzarət'],
          educationPath: 'İnformasiya təhlükəsizliyi',
          futureDemand: 'Çox Yüksək'
        },
        {
          id: 'robotics',
          title: 'Robototexnika və Mexatronika Mühəndisi',
          cluster: 'Mühəndislik',
          matchScore: Math.min(94, Math.round(scoreGroup1 * 0.94)),
          description: 'Avtomatlaşdırılmış robotlar, pilotsuz uçuş aparatları və ağıllı cihazların yaradılması.',
          keySkills: ['Mexanika', 'Elektronika', 'Mikrokontrollerlər'],
          educationPath: 'Mexatronika və robototexnika mühəndisliyi',
          futureDemand: 'Yüksək'
        },
        {
          id: 'civil-eng',
          title: 'İnşaat və ya Energetika Mühəndisi',
          cluster: 'Sənaye & Mühəndislik',
          matchScore: Math.min(90, Math.round(scoreGroup1 * 0.90)),
          description: 'Müasir binaların, körpülərin və ya bərpa olunan enerji (yaşıl enerji) stansiyalarının layihələndirilməsi.',
          keySkills: ['Fizika və Statika', 'AutoCAD / BIM', 'Dəqiqlik'],
          educationPath: 'İnşaat mühəndisliyi və ya Bərpa olunan enerji mühəndisliyi',
          futureDemand: 'Yüksək'
        }
      ];
      recommendedSubjects = [
        { subject: 'Riyaziyyat', importance: 'Əsas', reason: 'Alqoritmik düşüncə və mühəndislik hesablamalarının təməlidir.' },
        { subject: 'İnformatika', importance: 'Əsas', reason: 'Proqramlaşdırma və rəqəmsal arxitektura üçün birbaşa ixtisas fənnidir.' },
        { subject: 'Fizika', importance: 'Əsas', reason: 'Mexanika, elektronika və cihazların iş prinsipləri üçün zəruridir.' },
        { subject: 'İngilis dili', importance: 'Tövsiyə olunan', reason: 'Qlobal texnoloji sənədləşmə və beynəlxalq karyera üçün tələb olunur.' },
      ];
      break;

    case 'group2':
      dimGroupDescription = 'Səndə liderlik qabiliyyəti, strateji görmə qabiliyyəti və iqtisadi fürsətləri qiymətləndirmək istedadı var. Komandaları yönləndirmək və biznesi böyütmək sənin təbii istiqamətindir.';
      recommendedCareers = [
        {
          id: 'fin-analyst',
          title: 'Maliyyə Analitiki və İnvestisiya Meneceri',
          cluster: 'Maliyyə & İnvestisiya',
          matchScore: Math.min(99, scoreGroup2),
          description: 'Böyük şirkətlərin büdcəsini idarə etmək, investisiya risklərini hesablamaq və gəlirləri artırmaq.',
          keySkills: ['Maliyyə Modelləşdirməsi', 'İqtisadi Təhlil', 'Strateji İdarəetmə'],
          educationPath: 'Maliyyə, İqtisadiyyat və ya Mühasibat',
          futureDemand: 'Çox Yüksək'
        },
        {
          id: 'prod-manager',
          title: 'Rəqəmsal Məhsul Meneceri (Product Manager)',
          cluster: 'Biznes & Texnologiya',
          matchScore: Math.min(97, Math.round(scoreGroup2 * 0.98)),
          description: 'Məhsulun (sayt, tətbiq və ya xidmət) ideyadan bazara çıxarılmasına qədər bütün komandanı idarə etmək.',
          keySkills: ['Liderlik', 'Bazar Araşdırması', 'Komanda İdarəçiliyi'],
          educationPath: 'Menecment, Biznesin idarə edilməsi və ya Marketinq',
          futureDemand: 'Çox Yüksək'
        },
        {
          id: 'growth-mkt',
          title: 'Data-Əsaslı Marketoloq və Böyümə Strateqi',
          cluster: 'Marketinq & Satış',
          matchScore: Math.min(95, Math.round(scoreGroup2 * 0.95)),
          description: 'Müasir rəqəmsal platformalarda müştəri davranışını analiz edərək brendin satışlarını artırmaq.',
          keySkills: ['Rəqəmsal Marketinq', 'Məlumat Analizi', 'Yaradıcı Təqdimat'],
          educationPath: 'Marketinq və ya Kommersiya',
          futureDemand: 'Yüksək'
        },
        {
          id: 'intl-biz',
          title: 'Beynəlxalq İqtisadi Əlaqələr və Logistika Mütəxəssisi',
          cluster: 'Qlobal Ticarət',
          matchScore: Math.min(92, Math.round(scoreGroup2 * 0.92)),
          description: 'Qlobal ticarət yolları, gömrük və transmilli şirkətlərin təchizat zəncirini idarə etmək.',
          keySkills: ['Xarici Dillər', 'Danışıqlar Aparmaq', 'Logistik Planlama'],
          educationPath: 'Beynəlxalq ticarət və logistika',
          futureDemand: 'Yüksək'
        }
      ];
      recommendedSubjects = [
        { subject: 'Riyaziyyat', importance: 'Əsas', reason: 'Maliyyə, statistika və iqtisadi modellər üçün həlledicidir.' },
        { subject: 'Coğrafiya', importance: 'Əsas', reason: 'Qlobal iqtisadiyyat, təbii ehtiyatlar və ticarət xəritələrini anlamaq üçün.' },
        { subject: 'Xarici dil (İngilis dili)', importance: 'Əsas', reason: 'Qlobal biznes danışıqları və beynəlxalq şirkətlərdə işləmək üçün.' },
        { subject: 'Tarix', importance: 'Tövsiyə olunan', reason: 'Cəmiyyətlərin inkişaf dinamikasını və dövlət qanunlarını dərk etmək üçün.' }
      ];
      break;

    case 'group3':
      dimGroupDescription = 'Sənin güclü empatiyan, zəngin söz ehtiyatın və insan münasibətlərini təhlil etmək qabiliyyətin var. Ədalət, hüquq, təhsil və cəmiyyətə rəhbərlik edən sahələrdə çox uğurlu olacaqsan.';
      recommendedCareers = [
        {
          id: 'lawyer',
          title: 'Korporativ Hüquqşünas və ya Vəkil',
          cluster: 'Hüquq & Ədalət',
          matchScore: Math.min(99, scoreGroup3),
          description: 'Şirkətlərin və vətəndaşların hüquqlarını məhkəmədə və müqavilələrdə yüksək peşəkarlıqla müdafiə etmək.',
          keySkills: ['Məntiqi Mühakimə', 'Nitq Mədəniyyəti', 'Qanunvericilik Bilikləri'],
          educationPath: 'Hüquqşünaslıq',
          futureDemand: 'Çox Yüksək'
        },
        {
          id: 'diplomat',
          title: 'Diplomat və Beynəlxalq Əlaqələr Mütəxəssisi',
          cluster: 'Diplomatiya & Dövlət',
          matchScore: Math.min(96, Math.round(scoreGroup3 * 0.97)),
          description: 'Ölkəni beynəlxalq arenada təmsil etmək, strateji müqavilələr və danışıqlar aparmaq.',
          keySkills: ['Diplomatik Etiket', 'Çoxdillilik', 'Tənqidi Düşüncə'],
          educationPath: 'Beynəlxalq münasibətlər və ya Regionşünaslıq',
          futureDemand: 'Yüksək'
        },
        {
          id: 'psychologist',
          title: 'Klinik və ya Təşkilati Psixoloq',
          cluster: 'İnsan Elmləri & Terapiya',
          matchScore: Math.min(94, Math.round(scoreGroup3 * 0.94)),
          description: 'İnsanların psixoloji rifahını yüksəltmək, komandalarda motivasiya və stres idarəçiliyi qurmaq.',
          keySkills: ['Dərin Empatiya', 'Aktiv Dinləmə', 'Müşahidəçilik'],
          educationPath: 'Psixologiya',
          futureDemand: 'Çox Yüksək'
        },
        {
          id: 'media-pr',
          title: 'Media Strateqi, Jurnalist və İctimaiyyətlə Əlaqələr (PR)',
          cluster: 'Media & Kommunikasiya',
          matchScore: Math.min(92, Math.round(scoreGroup3 * 0.92)),
          description: 'Böyük auditoriyalar üçün nüfuzlu məzmun hazırlamaq və ictimai rəyi formalaşdırmaq.',
          keySkills: ['Yazıçı Qabiliyyəti', 'Rəqəmsal Media', 'Kreativ Kommunikasiya'],
          educationPath: 'Jurnalistika və ya İctimaiyyətlə əlaqələr',
          futureDemand: 'Yüksək'
        }
      ];
      recommendedSubjects = [
        { subject: 'Azərbaycan dili və Ədəbiyyat', importance: 'Əsas', reason: 'Fikirləri aydın, səlis və inandırıcı şəkildə ifadə etməyin açarıdır.' },
        { subject: 'Tarix', importance: 'Əsas', reason: 'Hüquq, dövlətçilik və cəmiyyət dinamikasını dərindən anlamaq üçün.' },
        { subject: 'Xarici dillər', importance: 'Əsas', reason: 'Diplomatiya və beynəlxalq hüquq sahəsində qlobal fəaliyyət üçün.' },
        { subject: 'Fəlsəfə / Məntiq', importance: 'Tövsiyə olunan', reason: 'Tənqidi təhlil və arqument quruculuğunu inkişaf etdirir.' }
      ];
      break;

    case 'group4':
      dimGroupDescription = 'Səndə təbiət hadisələrinə, canlı aləmə və laboratoriya tədqiqatlarına qarşı böyük maraq və dəqiqlik var. İnsanların sağlamlığını qorumaq və elmi kəşflər etmək sənin missiyandır.';
      recommendedCareers = [
        {
          id: 'doctor',
          title: 'Həkim (Cərrahiyyə, Kardiologiya, Pediatriya)',
          cluster: 'Tibb & Səhiyyə',
          matchScore: Math.min(99, scoreGroup4),
          description: 'İnsanların sağlamlığını bərpa etmək, xəstəlikləri müalicə etmək və həyat xilas etmək.',
          keySkills: ['Soyuqqanlı Qərarvermə', 'Dəqiqlik', 'Bioloji Biliklər'],
          educationPath: 'Müalicə işi, Pediatriya və ya Stomatologiya',
          futureDemand: 'Çox Yüksək'
        },
        {
          id: 'biotech',
          title: 'Biotexnoloq və Gen Mühəndisi',
          cluster: 'Gələcəyin Elmi',
          matchScore: Math.min(97, Math.round(scoreGroup4 * 0.97)),
          description: 'DNT mühəndisliyi, yeni dərmanların ixtirası və kənd təsərrüfatında bioloji innovasiyalar.',
          keySkills: ['Laboratoriya Tədqiqatı', 'Genetika', 'Bioinformatika'],
          educationPath: 'Biotexnologiya və ya Biologiya',
          futureDemand: 'Çox Yüksək'
        },
        {
          id: 'pharma',
          title: 'Əczaçı və Farmasevtik Alim',
          cluster: 'Dərman Sənayesi',
          matchScore: Math.min(93, Math.round(scoreGroup4 * 0.93)),
          description: 'Yeni terapevtik molekulların sintezi və dərman preparatlarının istehsal texnologiyası.',
          keySkills: ['Kimyəvi Analiz', 'Keyfiyyətə Nəzarət', 'Dəqiqlik'],
          educationPath: 'Əczaçılıq və ya Kimya mühəndisliyi',
          futureDemand: 'Yüksək'
        },
        {
          id: 'ecologist',
          title: 'Ekoloq və Yaşıl Texnologiyalar Mütəxəssisi',
          cluster: 'Ətraf Mühit & İqlim',
          matchScore: Math.min(90, Math.round(scoreGroup4 * 0.90)),
          description: 'Təbiətin çirklənməsinin qarşısını almaq, su və torpaq ehtiyatlarını qorumaq layihələri.',
          keySkills: ['Təbiət Tədqiqatları', 'Ekoloji Monitorinq', 'Sosial Məsuliyyət'],
          educationPath: 'Ekologiya və ya Ətraf mühit mühəndisliyi',
          futureDemand: 'Yüksək'
        }
      ];
      recommendedSubjects = [
        { subject: 'Biologiya', importance: 'Əsas', reason: 'Tibb və canlı aləmin öyrənilməsinin təməl fənnidir.' },
        { subject: 'Kimya', importance: 'Əsas', reason: 'Orqanizmdəki maddələr mübadiləsi və farmasevtika üçün vacibdir.' },
        { subject: 'Fizika', importance: 'Əsas', reason: 'Tibbi cihazlar (MRT, rentgen) və laboratoriya prinsipləri üçün.' },
        { subject: 'Riyaziyyat', importance: 'Tövsiyə olunan', reason: 'Tibbi doza hesablamaları və genetik statistika üçün.' }
      ];
      break;

    case 'group5':
    default:
      dimGroupDescription = 'Sənin zəngin vizual təxəyyülün, estetik duyumun və yaradıcı baxış bucağın var. Boş kətanı, ekranı və ya məkanı sənət və funksionallıqla canlandırmaq sənin təbii istedadındır.';
      recommendedCareers = [
        {
          id: 'ui-ux',
          title: 'UI/UX və Rəqəmsal Məhsul Dizayneri',
          cluster: 'Rəqəmsal Dizayn',
          matchScore: Math.min(99, scoreGroup5),
          description: 'Mobil tətbiqlərin və saytların istifadəçi üçün rahat, cəlbedici və estetik interfeysini qurmaq.',
          keySkills: ['Figma / Adobe Suite', 'İstifadəçi Təcrübəsi', 'Vizual Estetika'],
          educationPath: 'Dizayn, Kompüter qrafikası və ya Tətbiqi incəsənət',
          futureDemand: 'Çox Yüksək'
        },
        {
          id: 'architect',
          title: 'Memar və Şəhərsalma Mütəxəssisi',
          cluster: 'Memarlıq & Məkan',
          matchScore: Math.min(96, Math.round(scoreGroup5 * 0.96)),
          description: 'Müasir binaların, parkların və futuristik şəhər məkanlarının memarlıq layihələrini çəkmək.',
          keySkills: ['Məkan Təxəyyülü', '3D Çertyoj', 'Estetika & Mühəndislik'],
          educationPath: 'Memarlıq və ya Şəhərsalma',
          futureDemand: 'Yüksək'
        },
        {
          id: '3d-animator',
          title: '3D Modelləşdirici və Oyun Dizayneri',
          cluster: 'Oyun Sənayesi & CGI',
          matchScore: Math.min(94, Math.round(scoreGroup5 * 0.94)),
          description: 'Video oyunlar və animasiya filmləri üçün xarakterlər, dünyalar və xüsusi vizual effektlər yaratmaq.',
          keySkills: ['Blender / Maya', 'Animasiya Prinsipləri', 'Kreativlik'],
          educationPath: 'Rəqəmsal media və ya Qrafik dizayn',
          futureDemand: 'Çox Yüksək'
        },
        {
          id: 'motion-director',
          title: 'Video Rejissoru və Hərəkətli Qrafika Mütəxəssisi',
          cluster: 'Kino & Media',
          matchScore: Math.min(91, Math.round(scoreGroup5 * 0.91)),
          description: 'Brendlər, filmlər və kliplər üçün dinamik vizual hekayələr və reklam çarxları yaratmaq.',
          keySkills: ['After Effects', 'Ssenari', 'İşıq və Rəng'],
          educationPath: 'Rejissorluq və ya Kino sənəti',
          futureDemand: 'Yüksək'
        }
      ];
      recommendedSubjects = [
        { subject: 'Rəsm və Dizayn', importance: 'Əsas', reason: 'Kompozisiya, perspektiv və rəng ahəngini mükəmməlləşdirir.' },
        { subject: 'Həndəsə / Riyaziyyat', importance: 'Əsas', reason: '3D fəza təfəkkürü və memarlıq proporsiyaları üçün həlledicidir.' },
        { subject: 'İnformatika', importance: 'Əsas', reason: 'Qrafik proqramlar, süni intellekt dizayn alətləri və render üçün.' },
        { subject: 'Ədəbiyyat və Tarix', importance: 'Tövsiyə olunan', reason: 'Zəngin vizual dünyalar və hekayələr qurmaq üçün intellektual baza yaradır.' }
      ];
      break;
  }

  return {
    userId: meta?.userId || null,
    utisCode: meta?.utisCode || null,
    studentName: meta?.studentName || null,
    schoolName: meta?.schoolName || null,
    gradeLevel: meta?.gradeLevel || null,
    dominantCluster: topCluster.name,
    dimGroup: topCluster.dim,
    dimGroupDescription,
    riasecScores: normRiasec,
    skillScores: normSkills,
    valueScores: normValues,
    radarData,
    recommendedCareers,
    recommendedSubjects,
    rawAnswers: answers,
    createdAt: new Date().toISOString()
  };
}

// Save to Supabase database
export async function saveCareerAssessment(result: CareerAssessmentResult): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('career_assessments')
      .insert({
        user_id: result.userId || null,
        utis_code: result.utisCode || null,
        student_name: result.studentName || null,
        school_name: result.schoolName || null,
        grade_level: result.gradeLevel || null,
        interests_score: result.riasecScores,
        skills_score: result.skillScores,
        values_score: result.valueScores,
        radar_data: result.radarData,
        dominant_cluster: result.dominantCluster,
        dim_group: result.dimGroup,
        recommended_careers: result.recommendedCareers,
        recommended_subjects: result.recommendedSubjects,
        raw_answers: result.rawAnswers
      })
      .select('id')
      .single();

    if (error) {
      console.warn('Could not save career assessment to database, using local session state:', error);
      return null;
    }

    return data?.id || null;
  } catch (err) {
    console.warn('Network error saving career assessment:', err);
    return null;
  }
}

// Helper to get description for DİM group
export function getDimGroupDescription(dimGroup: string, dominantCluster?: string): string {
  if (dimGroup.includes('I İxtisas') || (dominantCluster && dominantCluster.includes('Texniki'))) {
    return 'Sənin düşüncə tərzin sistemli, analitik və alqoritmik problemləri həll etməyə çox meyillidir. Müasir rəqəmsal dünyada ən çox axtarılan texnoloji və mühəndislik peşələri sənin üçün idealdır.';
  }
  if (dimGroup.includes('II İxtisas') || (dominantCluster && dominantCluster.includes('İqtisadiyyat'))) {
    return 'Səndə liderlik qabiliyyəti, strateji görmə qabiliyyəti və iqtisadi fürsətləri qiymətləndirmək istedadı var. Komandaları yönləndirmək və biznesi böyütmək sənin təbii istiqamətindir.';
  }
  if (dimGroup.includes('III İxtisas') || (dominantCluster && dominantCluster.includes('Humanitar'))) {
    return 'Sənin güclü empatiyan, zəngin söz ehtiyatın və insan münasibətlərini təhlil etmək qabiliyyətin var. Ədalət, hüquq, təhsil və cəmiyyətə rəhbərlik edən sahələrdə çox uğurlu olacaqsan.';
  }
  if (dimGroup.includes('IV İxtisas') || (dominantCluster && dominantCluster.includes('Təbiət'))) {
    return 'Səndə təbiət hadisələrinə, canlı aləmə və laboratoriya tədqiqatlarına qarşı böyük maraq və dəqiqlik var. İnsanların sağlamlığını qorumaq və elmi kəşflər etmək sənin missiyandır.';
  }
  return 'Sənin zəngin vizual təxəyyülün, estetik duyumun və yaradıcı baxış bucağın var. Boş kətanı, ekranı və ya məkanı sənət və funksionallıqla canlandırmaq sənin təbii istedadındır.';
}

// Fetch single assessment by ID
export async function getCareerAssessmentById(id: string): Promise<CareerAssessmentResult | null> {
  try {
    const { data, error } = await supabase
      .from('career_assessments')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      userId: data.user_id,
      utisCode: data.utis_code,
      studentName: data.student_name,
      schoolName: data.school_name,
      gradeLevel: data.grade_level,
      dominantCluster: data.dominant_cluster,
      dimGroup: data.dim_group,
      dimGroupDescription: getDimGroupDescription(data.dim_group || '', data.dominant_cluster || ''),
      riasecScores: (data.interests_score || {}) as Record<RiasecKey, number>,
      skillScores: (data.skills_score || {}) as Record<SkillKey, number>,
      valueScores: (data.values_score || {}) as Record<ValueKey, number>,
      radarData: (data.radar_data || []) as CareerRadarPoint[],
      recommendedCareers: (data.recommended_careers || []) as RecommendedCareer[],
      recommendedSubjects: (data.recommended_subjects || []) as SubjectAdvice[],
      rawAnswers: (data.raw_answers || {}) as Record<number, number>,
      createdAt: data.created_at
    };
  } catch (err) {
    console.error('Error fetching career assessment:', err);
    return null;
  }
}

// Fetch latest assessment for logged-in user or UTIS code
export async function getLatestCareerAssessmentForUser(userId?: string, utisCode?: string): Promise<CareerAssessmentResult | null> {
  if (!userId && !utisCode) return null;
  try {
    let query = supabase
      .from('career_assessments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (userId) {
      query = query.eq('user_id', userId);
    } else if (utisCode) {
      query = query.eq('utis_code', utisCode);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) return null;

    const row = data[0];
    return {
      id: row.id,
      userId: row.user_id,
      utisCode: row.utis_code,
      studentName: row.student_name,
      schoolName: row.school_name,
      gradeLevel: row.grade_level,
      dominantCluster: row.dominant_cluster,
      dimGroup: row.dim_group,
      dimGroupDescription: getDimGroupDescription(row.dim_group || '', row.dominant_cluster || ''),
      riasecScores: (row.interests_score || {}) as Record<RiasecKey, number>,
      skillScores: (row.skills_score || {}) as Record<SkillKey, number>,
      valueScores: (row.values_score || {}) as Record<ValueKey, number>,
      radarData: (row.radar_data || []) as CareerRadarPoint[],
      recommendedCareers: (row.recommended_careers || []) as RecommendedCareer[],
      recommendedSubjects: (row.recommended_subjects || []) as SubjectAdvice[],
      rawAnswers: (row.raw_answers || {}) as Record<number, number>,
      createdAt: row.created_at
    };
  } catch (err) {
    console.error('Error fetching latest career assessment:', err);
    return null;
  }
}
