export interface FontConfig {
  id: string;
  name: string;
  description: string;
  fontFamily: string;
  displayFontFamily?: string;
  category: 'Modern' | 'Education' | 'Geometric' | 'System' | 'Clean';
  badge?: string;
  previewSample: string;
}

export const AVAILABLE_FONTS: FontConfig[] = [
  {
    id: 'inter',
    name: 'Inter',
    description: 'Rəqəmsal interfeyslər üçün ən populyar və təmiz standart şrift',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    displayFontFamily: "'Space Grotesk', 'Inter', sans-serif",
    category: 'Clean',
    badge: 'Defolt',
    previewSample: 'Müasir Təhsil Portalı — Sınaq İmtahanı 123 (ქართული ენა)',
  },
  {
    id: 'plus-jakarta',
    name: 'Plus Jakarta Sans',
    description: 'Həndəsi, prestijli və yüksək dərəcədə oxunaqlı modern üslub',
    fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    displayFontFamily: "'Plus Jakarta Sans', sans-serif",
    category: 'Geometric',
    badge: 'Tövsiyə olunan',
    previewSample: 'Müasir Təhsil Portalı — Sınaq İmtahanı 123 (ქართული ენა)',
  },
  {
    id: 'roboto',
    name: 'Roboto',
    description: 'Google təhsil ekosisteminin rəsmi, dəqiq və balanslı şrifti',
    fontFamily: "'Roboto', system-ui, -apple-system, sans-serif",
    displayFontFamily: "'Roboto', sans-serif",
    category: 'Education',
    previewSample: 'Müasir Təhsil Portalı — Sınaq İmtahanı 123 (ქართული ენა)',
  },
  {
    id: 'poppins',
    name: 'Poppins',
    description: 'Yumşaq həndəsi quruluş, dostyana və müasir tədris hissi',
    fontFamily: "'Poppins', system-ui, -apple-system, sans-serif",
    displayFontFamily: "'Poppins', sans-serif",
    category: 'Modern',
    previewSample: 'Müasir Təhsil Portalı — Sınaq İmtahanı 123 (ქართული ენა)',
  },
  {
    id: 'outfit',
    name: 'Outfit',
    description: 'Zərif, innovativ və rəqəmsal imtahanlar üçün estetik şrift',
    fontFamily: "'Outfit', system-ui, -apple-system, sans-serif",
    displayFontFamily: "'Outfit', sans-serif",
    category: 'Modern',
    badge: 'Yeni',
    previewSample: 'Müasir Təhsil Portalı — Sınaq İmtahanı 123 (ქართული ენა)',
  },
  {
    id: 'fira-sans',
    name: 'Fira Sans',
    description: 'Simvolların aydın fərqləndiyi erqonomik akademik şrift',
    fontFamily: "'Fira Sans', system-ui, -apple-system, sans-serif",
    displayFontFamily: "'Fira Sans', sans-serif",
    category: 'Education',
    previewSample: 'Müasir Təhsil Portalı — Sınaq İmtahanı 123 (ქართული ენა)',
  },
  {
    id: 'arial',
    name: 'Arial',
    description: 'Klassik universal sistem şrifti, sürətli və rəsmi sənəd stili',
    fontFamily: "Arial, Helvetica, sans-serif",
    displayFontFamily: "Arial, Helvetica, sans-serif",
    category: 'System',
    badge: 'Klassik',
    previewSample: 'Müasir Təhsil Portalı — Sınaq İmtahanı 123 (ქართული ენა)',
  },
];

export const DEFAULT_FONT_ID = 'inter';
