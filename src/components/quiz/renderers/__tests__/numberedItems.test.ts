import { describe, it, expect } from 'vitest';
import { parseNumberedItems, isSequenceQuestion, isAnswerCorrect } from '../utils';
import { Question } from '@/hooks/useQuestions';

describe('Numbered Items & Numerical Evaluation', () => {
  it('parses multi-item selection question correctly', () => {
    const text = `Həmcins üzvlər işlənmiş cümlələri seçin:

1. Sürücü yaddan çıxartdığımız çantanı, pulu bizə qaytardı.
2. Ayrılarmı könül candan, Azərbaycan, Azərbaycan?
3. O, otağındakı kitab şkafının yerini dəyişdi, öz zövqü ilə bəzədi.
4. Sarı, qırmızı, bənövşəyi güllər həyətə gözəllik verirdi.
5. Ən yüksək elm müdriklikdir, ən yüksək müdriklik isə xeyirxahlıqdır.`;

    const parsed = parseNumberedItems(text);
    expect(parsed).not.toBeNull();
    expect(parsed?.header).toBe('Həmcins üzvlər işlənmiş cümlələri seçin:');
    expect(parsed?.items).toHaveLength(5);
    expect(parsed?.items[0].num).toBe(1);
    expect(parsed?.items[0].text).toBe('Sürücü yaddan çıxartdığımız çantanı, pulu bizə qaytardı.');
    expect(isSequenceQuestion(text)).toBe(false);
  });

  it('detects sequence questions accurately', () => {
    const seqText = `Xronoloji ardıcıllığı müəyyən edin:

1. Lənkəran xanlığının işğal olunması
2. Şəki xanlığının ləğv edilməsi
3. Gülüstan sülhünün imzalanması`;

    expect(isSequenceQuestion(seqText)).toBe(true);
    const parsed = parseNumberedItems(seqText);
    expect(parsed?.items).toHaveLength(3);
  });

  it('evaluates selection questions with order-independent digits', () => {
    const q: Question = {
      id: 'q1',
      question_text: `Həmcins üzvlər işlənmiş cümlələri seçin:
1. Bir
2. İki
3. Üç
4. Dörd`,
      question_type: 'numerical',
      correct_answer: '134',
      numerical_answer: 134,
    };

    expect(isAnswerCorrect(q, '134')).toBe(true);
    expect(isAnswerCorrect(q, '314')).toBe(true);
    expect(isAnswerCorrect(q, '431')).toBe(true);
    expect(isAnswerCorrect(q, '1, 3, 4')).toBe(true);
    expect(isAnswerCorrect(q, '1 3 4')).toBe(true);
    expect(isAnswerCorrect(q, '13')).toBe(false);
    expect(isAnswerCorrect(q, '1345')).toBe(false);
  });

  it('evaluates sequence questions strictly in order', () => {
    const q: Question = {
      id: 'q2',
      question_text: `Xronoloji ardıcıllığı müəyyən edin:
1. Bir
2. İki
3. Üç`,
      question_type: 'numerical',
      correct_answer: '132',
      numerical_answer: 132,
    };

    expect(isAnswerCorrect(q, '132')).toBe(true);
    expect(isAnswerCorrect(q, '1, 3, 2')).toBe(true);
    expect(isAnswerCorrect(q, '123')).toBe(false);
    expect(isAnswerCorrect(q, '321')).toBe(false);
  });

  it('evaluates pure math calculation correctly without digit reordering', () => {
    const q: Question = {
      id: 'q3',
      question_text: '$x - 17 = 25$ tənliyini həll edin.',
      question_type: 'numerical',
      correct_answer: '42',
      numerical_answer: 42,
    };

    expect(isAnswerCorrect(q, '42')).toBe(true);
    expect(isAnswerCorrect(q, '24')).toBe(false);
  });

  it('evaluates multi-matching questions with comma-separated targets accurately', () => {
    const q: Question = {
      id: 'q-matching',
      question_text: `Uyğunluğu müəyyən edin:
1. Yazılışı və tələffüzü fərqlənir.
2. Yazılışı və tələffüzü fərqlənmir.`,
      question_type: 'matching',
      matching_pairs: {
        '1': 'a, c',
        '2': 'b, d, e',
      },
      correct_answer: '1-a,c; 2-b,d,e',
    };

    expect(isAnswerCorrect(q, '1:a,c|||2:b,d,e')).toBe(true);
    expect(isAnswerCorrect(q, '1:c,a|||2:e,b,d')).toBe(true);
    expect(isAnswerCorrect(q, '1-a,c; 2-b,d,e')).toBe(true);
    expect(isAnswerCorrect(q, '1:a|||2:b,d,e')).toBe(false);
    expect(isAnswerCorrect(q, '1:a,c|||2:b,d')).toBe(false);
  });
});
