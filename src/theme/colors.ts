export const colors = {
  background: {
    primary: '#0F172A',   // Slate 900 (Koyu arka plan)
    secondary: '#1E293B', // Slate 800 (Kart ve modal zeminleri)
    tertiary: '#334155',  // Slate 700 (Giriş alanları ve divider)
  },
  text: {
    primary: '#F8FAFC',   // Slate 50 (Ana metinler)
    secondary: '#94A3B8', // Slate 400 (İkincil açıklamalar)
    muted: '#64748B',     // Slate 500 (Placeholder / Pasif metin)
    inverse: '#0F172A',   // Açık zemin üstü koyu metin
  },
  accent: {
    primary: '#6366F1',   // Indigo 500 (Vurgu ve ana butonlar)
    primaryHover: '#4F46E5',
    secondary: '#0EA5E9', // Sky 500 (Arama ve AI vurguları)
  },
  status: {
    success: '#10B981',   // Emerald 500
    warning: '#F59E0B',   // Amber 500
    error: '#EF4444',     // Red 500
    info: '#3B82F6',      // Blue 500
  },
  border: {
    subtle: '#1E293B',
    medium: '#334155',
    focus: '#6366F1',
  },
} as const;

export type Colors = typeof colors;