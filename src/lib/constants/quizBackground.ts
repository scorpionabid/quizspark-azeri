import React from 'react';

export const BACKGROUND_PRESETS = [
  { label: 'Yoxdur', value: '' },
  { label: 'Dəftər vərəqi', value: '/backgrounds/paper-lined.svg' },
  { label: 'Riyaziyyat dəftəri', value: '/backgrounds/paper-graph.svg' },
  { label: 'Nöqtəli kağız', value: '/backgrounds/paper-dot.svg' },
];

export function isPatternBackground(url?: string | null): boolean {
  if (!url) return false;
  return url.startsWith('/backgrounds/') || url.includes('paper-') || url.endsWith('.svg');
}

export function getQuizBackgroundStyle(url?: string | null): React.CSSProperties | undefined {
  if (!url) return undefined;
  
  if (isPatternBackground(url)) {
    return {
      backgroundImage: `url(${url})`,
      backgroundRepeat: 'repeat',
      backgroundAttachment: 'fixed',
    };
  }

  return {
    backgroundImage: `url(${url})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };
}
