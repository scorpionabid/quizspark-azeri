import { describe, it, expect } from 'vitest';
import { parseMarkdownFull, parseAiken, parseGIFT } from '../import-parsers';

describe('import-parsers', () => {
  describe('parseMarkdownFull', () => {
    it('should parse Format 1 (Header + Checklist)', () => {
      const content = `# Sual 1
- [x] Düzgün
- [ ] Səhv 1

Izahat: Bu bir izahdır
Kateqoriya: Elm`;
      const result = parseMarkdownFull(content);
      expect(result.questions).toHaveLength(1);
      expect(result.questions[0].question_text).toBe('Sual 1');
      expect(result.questions[0].correct_answer).toBe('Düzgün');
      expect(result.questions[0].category).toBe('Elm');
      expect(result.warnings).toHaveLength(0);
    });

    it('should parse Format 2 (Numbered + Variants) - test.md style', () => {
      const content = `1. Azərbaycanın paytaxtı?
A) Gəncə
B) Bakı
C) Sumqayıt

Düzgün cavab: B
Taqlar: coğrafiya, bakı`;
      const result = parseMarkdownFull(content);
      expect(result.questions).toHaveLength(1);
      expect(result.questions[0].question_text).toBe('Azərbaycanın paytaxtı?');
      expect(result.questions[0].correct_answer).toBe('Bakı');
      expect(result.questions[0].tags).toContain('coğrafiya');
    });

    it('should parse Format 3 (Bullet Points) - Apple Notes style', () => {
      const content = `1
Paytaxtımız haradır?
- Bakı
- Gəncə
- Şəki

Cavab: Bakı`;
      const result = parseMarkdownFull(content);
      expect(result.questions).toHaveLength(1);
      expect(result.questions[0].question_text).toBe('Paytaxtımız haradır?');
      expect(result.questions[0].correct_answer).toBe('Bakı');
      expect(result.questions[0].options).toHaveLength(3);
    });

    it('should generate warnings for missing answers', () => {
      const content = `# Sual cavabsız
- [ ] Səhv 1
- [ ] Səhv 2`;
      const result = parseMarkdownFull(content);
      expect(result.questions).toHaveLength(1);
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0].type).toBe('missing_answer');
    });

    it('should generate warnings for missing options', () => {
      const content = `# Sual variantsız`;
      const result = parseMarkdownFull(content);
      expect(result.questions).toHaveLength(1);
      expect(result.warnings).toHaveLength(2); // no_options AND missing_answer
      expect(result.warnings.some(w => w.type === 'no_options')).toBe(true);
    });

    it('should parse Format 2 with numbered options and multiple answers', () => {
      const content = `14. Xalqımızın təntənəli surətdə bəyan etdiyi ülvi niyyətlərə aiddir:
1. vətəndaş cəmiyyətinin bərqərar edilməsinə nail olmaq
2. qanunların aliliyini təmin edən hüquqi, dünyəvi dövlət qurmaq
3. hamı üçün layiqli həyat səviyyəsini təmin etmək
4. ümumbəşəri dəyərlərə sadiq qalaraq bütün dünya xalqları ilə dostluq, sülh və əmin-amanlıq şəraitində yaşamaq
5. öz müqəddəratını sərbəst müəyyən etmək
6. Azərbaycanın suverenliyi və ərazi bütövlüyünü qorumaq

Düzgün cavab: 1, 3, 6`;
      const result = parseMarkdownFull(content);
      expect(result.questions).toHaveLength(1);
      expect(result.questions[0].question_type).toBe('multiple_select');
      expect(result.questions[0].options).toHaveLength(6);
      expect(result.questions[0].correct_answer).toBe('vətəndaş cəmiyyətinin bərqərar edilməsinə nail olmaq,hamı üçün layiqli həyat səviyyəsini təmin etmək,Azərbaycanın suverenliyi və ərazi bütövlüyünü qorumaq');
    });

    it('should parse Aiken-style with numbered options', () => {
      const content = `Test question?
1) Option 1
2) Option 2
ANSWER: 2`;
      const result = parseMarkdownFull(content);
      expect(result.questions).toHaveLength(1);
      expect(result.questions[0].correct_answer).toBe('Option 2');
    });
  });

  describe('parseAiken', () => {
    it('should parse standard Aiken format', () => {
      const content = `What is 2+2?
A) 3
B) 4
C) 5
ANSWER: B`;
      const result = parseAiken(content);
      expect(result).toHaveLength(1);
      expect(result[0].correct_answer).toBe('4');
    });
  });

  describe('parseGIFT', () => {
    it('should parse multiple choice GIFT format', () => {
      const content = `::Q1:: What is 2+2? {=4 ~3 ~5}`;
      const result = parseGIFT(content);
      expect(result).toHaveLength(1);
      expect(result[0].correct_answer).toBe('4');
    });
  });
});
