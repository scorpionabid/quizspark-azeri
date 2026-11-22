import { describe, it, expect } from 'vitest';
import { isPatternBackground, getQuizBackgroundStyle, BACKGROUND_PRESETS } from '../quizBackground';

describe('quizBackground utilities', () => {
  it('should have standard background presets', () => {
    expect(BACKGROUND_PRESETS.length).toBeGreaterThanOrEqual(4);
    expect(BACKGROUND_PRESETS.some((b) => b.value === '/backgrounds/paper-graph.svg')).toBe(true);
    expect(BACKGROUND_PRESETS.some((b) => b.value === '/backgrounds/paper-lined.svg')).toBe(true);
    expect(BACKGROUND_PRESETS.some((b) => b.value === '/backgrounds/paper-dot.svg')).toBe(true);
  });

  it('should identify pattern backgrounds correctly', () => {
    expect(isPatternBackground('/backgrounds/paper-graph.svg')).toBe(true);
    expect(isPatternBackground('/backgrounds/paper-lined.svg')).toBe(true);
    expect(isPatternBackground('https://cdn.example.com/paper-custom.svg')).toBe(true);
    expect(isPatternBackground('https://cdn.example.com/photo.jpg')).toBe(false);
    expect(isPatternBackground('')).toBe(false);
    expect(isPatternBackground(null)).toBe(false);
  });

  it('should generate repeating background style for patterns', () => {
    const style = getQuizBackgroundStyle('/backgrounds/paper-graph.svg');
    expect(style).toBeDefined();
    expect(style?.backgroundImage).toBe('url(/backgrounds/paper-graph.svg)');
    expect(style?.backgroundRepeat).toBe('repeat');
    expect(style?.backgroundAttachment).toBe('fixed');
  });

  it('should generate cover background style for photos/wallpapers', () => {
    const style = getQuizBackgroundStyle('https://images.unsplash.com/photo-123.jpg');
    expect(style).toBeDefined();
    expect(style?.backgroundImage).toBe('url(https://images.unsplash.com/photo-123.jpg)');
    expect(style?.backgroundSize).toBe('cover');
    expect(style?.backgroundPosition).toBe('center');
  });

  it('should return undefined when no background is provided', () => {
    expect(getQuizBackgroundStyle('')).toBeUndefined();
    expect(getQuizBackgroundStyle(null)).toBeUndefined();
  });
});
