import { describe, it, expect } from 'vitest';
import { parseMarkdownFull, parseAiken, parseGIFT } from '../import-parsers';

describe('import-parsers', () => {
  describe('parseMarkdownFull', () => {
    it('should parse Universal Format (Header + Labeled Options + Cavab)', () => {
      const content = `# Sual 1
A) Birinci # İzah 1
B) İkinci # İzah 2
C) Düzgün # İzah 3

Cavab: C
Kateqoriya: Elm`;
      const result = parseMarkdownFull(content);
      expect(result.questions).toHaveLength(1);
      expect(result.questions[0].question_text).toBe('Sual 1');
      expect(result.questions[0].correct_answer).toBe('Düzgün');
      expect(result.questions[0].options).toHaveLength(3);
      expect(result.questions[0].per_option_explanations?.['2']).toBe('İzah 3');
      expect(result.questions[0].category).toBe('Elm');
    });

    it('should parse Format 1 (Header + Checklist) - Legacy support', () => {
      const content = `# Sual 1
- [x] Düzgün
- [ ] Səhv 1

Izahat: Bu bir izahdır`;
      const result = parseMarkdownFull(content);
      expect(result.questions).toHaveLength(1);
      expect(result.questions[0].correct_answer).toBe('Düzgün');
    });

    it('should parse Format 2 (Numbered + Variants) via single block fallback', () => {
      const content = `1. Azərbaycanın paytaxtı?
A) Gəncə
B) Bakı
C) Sumqayıt

Düzgün cavab: B`;
      const result = parseMarkdownFull(content);
      expect(result.questions).toHaveLength(1);
      expect(result.questions[0].question_text).toBe('Azərbaycanın paytaxtı?');
      expect(result.questions[0].correct_answer).toBe('Bakı');
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
    it('should detect true_false type when options are Doğru/Yanlış', () => {
      const content = `Su kimyəvi formulası H₂O-dur.
A) Doğru
B) Yanlış

ANSWER: A
Kateqoriya: Kimya`;
      const result = parseMarkdownFull(content);
      expect(result.questions).toHaveLength(1);
      expect(result.questions[0].question_type).toBe('true_false');
      expect(result.questions[0].correct_answer).toBe('Doğru');
      expect(result.questions[0].category).toBe('Kimya');
    });

    it('should detect true_false type with True/False options', () => {
      const content = `The sky is blue.
A) True
B) False

ANSWER: A`;
      const result = parseMarkdownFull(content);
      expect(result.questions).toHaveLength(1);
      expect(result.questions[0].question_type).toBe('true_false');
    });

    it('should parse matching block with Tip: matching', () => {
      const content = `Tip: matching
Əsərləri müəllifləri ilə uyğunlaşdırın:
Dədə Qorqud → Türk xalq dastanı
Ana → Maksim Gorki
Don Kixot → Servantes

Kateqoriya: Ədəbiyyat
Çətinlik: orta`;
      const result = parseMarkdownFull(content);
      expect(result.questions).toHaveLength(1);
      expect(result.questions[0].question_type).toBe('matching');
      expect(result.questions[0].category).toBe('Ədəbiyyat');
    });

    it('should parse fill_blank block with ___ placeholder', () => {
      const content = `Tip: fill_blank
Azərbaycanın paytaxtı ___ şəhəridir.

Cavab: Bakı
Kateqoriya: Coğrafiya`;
      const result = parseMarkdownFull(content);
      expect(result.questions).toHaveLength(1);
      expect(result.questions[0].question_type).toBe('fill_blank');
      expect(result.questions[0].correct_answer).toBe('Bakı');
    });

    it('should parse ordering block with Tip: ordering', () => {
      const content = `Tip: ordering
Hadisələri xronoloji ardıcıllıqla sıralayın:
- Birinci Dünya Müharibəsi (1914)
- Sovet İttifaqının yaranması (1922)
- Azərbaycanın müstəqillik elanı (1991)

Kateqoriya: Tarix`;
      const result = parseMarkdownFull(content);
      expect(result.questions).toHaveLength(1);
      expect(result.questions[0].question_type).toBe('ordering');
      expect(result.questions[0].category).toBe('Tarix');
    });

    it('should parse short_answer type when no options given', () => {
      const content = `Azərbaycanın paytaxtı nədir?

Cavab: Bakı
Kateqoriya: Coğrafiya`;
      const result = parseMarkdownFull(content);
      expect(result.questions).toHaveLength(1);
      expect(result.questions[0].question_type).toBe('short_answer');
      expect(result.questions[0].correct_answer).toBe('Bakı');
    });
    it('should assign severity: error for critical issues like missing answers', () => {
      const content = `# Sual cavabsız
- [ ] Variant 1`;
      const result = parseMarkdownFull(content);
      expect(result.warnings[0].severity).toBe('error');
    });

    it('should detect duplicate options and assign severity: warning', () => {
      const content = `# Sual
A) Bakı
B) Gəncə
C) Bakı
Cavab: A`;
      const result = parseMarkdownFull(content);
      expect(result.warnings.some(w => w.type === 'duplicate_option')).toBe(true);
      expect(result.warnings.find(w => w.type === 'duplicate_option')?.severity).toBe('warning');
    });

    it('should detect missing question text and assign severity: error', () => {
      const content = `A) Variant 1
B) Variant 2
Cavab: A`;
      const result = parseMarkdownFull(content);
      expect(result.warnings.some(w => w.type === 'missing_question_text')).toBe(true);
    });

    it('should split blocks using special separators like em-dash or asterisks', () => {
      const content = `Sual 1
A) V1
Cavab: A
⸻
Sual 2
A) V2
Cavab: A
***
Sual 3
A) V3
Cavab: A`;
      const result = parseMarkdownFull(content);
      expect(result.questions).toHaveLength(3);
      expect(result.questions[0].question_text).toContain('Sual 1');
      expect(result.questions[1].question_text).toContain('Sual 2');
      expect(result.questions[2].question_text).toContain('Sual 3');
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
