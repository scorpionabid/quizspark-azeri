import { describe, it, expect } from 'vitest';
import { isAnswerCorrect, getPrimaryCorrectAnswer, getSmartOpenQuestionHint } from '../utils';
import { Question } from '@/hooks/useQuestions';

function makeOpenQ(
  correct_answer: string,
  question_text = 'Sual mətni',
): Question {
  return {
    id: 'test-q',
    quiz_id: 'test-quiz',
    question_text,
    question_type: 'short_answer',
    options: null,
    correct_answer,
    explanation: null,
    order_index: 1,
    created_at: '',
  } as unknown as Question;
}

describe('7-Layer Professional Open-Answer Evaluation Engine', () => {
  it('Layer 1 & 5: Numerical answers with units, decimals, commas, dots, and fractions', () => {
    const qPhysics = makeOpenQ('28 Kl|28|28 kl|28 kulon', 'İlk 4 saniyə ərzində keçən elektrik yükünü hesablayın.');
    expect(isAnswerCorrect(qPhysics, '28')).toBe(true);
    expect(isAnswerCorrect(qPhysics, '28 Kl')).toBe(true);
    expect(isAnswerCorrect(qPhysics, '28kl')).toBe(true);
    expect(isAnswerCorrect(qPhysics, '28 kulon')).toBe(true);
    expect(isAnswerCorrect(qPhysics, '28,0')).toBe(true);
    expect(isAnswerCorrect(qPhysics, '28.0')).toBe(true);
    expect(isAnswerCorrect(qPhysics, '24')).toBe(false);

    const qChemDecimal = makeOpenQ('43,2|43.2|43,2 qram|43,2 q', 'Alınan su buxarının kütləsi nə qədər olar?');
    expect(isAnswerCorrect(qChemDecimal, '43,2')).toBe(true);
    expect(isAnswerCorrect(qChemDecimal, '43.2')).toBe(true);
    expect(isAnswerCorrect(qChemDecimal, '43,20')).toBe(true);
    expect(isAnswerCorrect(qChemDecimal, '43,2 qram')).toBe(true);
    expect(isAnswerCorrect(qChemDecimal, '43.2 q')).toBe(true);
    expect(isAnswerCorrect(qChemDecimal, '432')).toBe(false);

    const qChemFrac = makeOpenQ('4,5|4.5|4,5 mol|9/2', 'Neçə mol H₂ qazı ayrılar?');
    expect(isAnswerCorrect(qChemFrac, '4,5')).toBe(true);
    expect(isAnswerCorrect(qChemFrac, '4.5')).toBe(true);
    expect(isAnswerCorrect(qChemFrac, '4,5 mol')).toBe(true);
    expect(isAnswerCorrect(qChemFrac, '9/2')).toBe(true);
    expect(isAnswerCorrect(qChemFrac, '4 1/2')).toBe(true);
    expect(isAnswerCorrect(qChemFrac, '4 tam 1/2')).toBe(true);
    expect(isAnswerCorrect(qChemFrac, '45')).toBe(false);

    const qPercent = makeOpenQ('77%|77|77 %|77 faiz', 'Reaksiyanın çıxımını (%-lə) hesablayın.');
    expect(isAnswerCorrect(qPercent, '77')).toBe(true);
    expect(isAnswerCorrect(qPercent, '77%')).toBe(true);
    expect(isAnswerCorrect(qPercent, '77 %')).toBe(true);
    expect(isAnswerCorrect(qPercent, '77 faiz')).toBe(true);
    expect(isAnswerCorrect(qPercent, '67%')).toBe(false);

    const qWordNum = makeOpenQ('4|4 ədəd|4 sayda|dörd', 'Belə n-lərin sayını tapın.');
    expect(isAnswerCorrect(qWordNum, '4')).toBe(true);
    expect(isAnswerCorrect(qWordNum, '4 ədəd')).toBe(true);
    expect(isAnswerCorrect(qWordNum, 'dörd')).toBe(true);
    expect(isAnswerCorrect(qWordNum, 'dord')).toBe(true);
    expect(isAnswerCorrect(qWordNum, 'IV')).toBe(true);
    expect(isAnswerCorrect(qWordNum, '5')).toBe(false);
  });

  it('Layer 6: Multi-Item Selection & Roman/Arabic Equivalence (order-independent)', () => {
    const qSelect = makeOpenQ(
      '1, 3, 4, 5|1345|1 3 4 5',
      'Nümunənin təhlili ilə bağlı doğru fikirləri müəyyən edin:\n1. Birinci\n2. İkinci\n3. Üçüncü\n4. Dördüncü\n5. Beşinci\n6. Altıncı',
    );
    expect(isAnswerCorrect(qSelect, '1, 3, 4, 5')).toBe(true);
    expect(isAnswerCorrect(qSelect, '1,3,4,5')).toBe(true);
    expect(isAnswerCorrect(qSelect, '1345')).toBe(true);
    expect(isAnswerCorrect(qSelect, '1 3 4 5')).toBe(true);
    expect(isAnswerCorrect(qSelect, '1; 3; 4; 5')).toBe(true);
    expect(isAnswerCorrect(qSelect, '5, 4, 3, 1')).toBe(true);
    expect(isAnswerCorrect(qSelect, '3154')).toBe(true);
    expect(isAnswerCorrect(qSelect, '1, 3, 4 və 5')).toBe(true);
    expect(isAnswerCorrect(qSelect, 'Yalnız 1, 3, 4, 5')).toBe(true);
    expect(isAnswerCorrect(qSelect, '1, 3, 4')).toBe(false);
    expect(isAnswerCorrect(qSelect, '1, 2, 3, 4, 5')).toBe(false);

    const qRoman = makeOpenQ(
      'IV və VII|IV, VII|4 və 7|4, 7|47',
      '1. Mətni üç abzasa bölsək, ikinci və üçüncü abzaslar hansı cümlələrlə başlayar?',
    );
    expect(isAnswerCorrect(qRoman, 'IV və VII')).toBe(true);
    expect(isAnswerCorrect(qRoman, 'IV, VII')).toBe(true);
    expect(isAnswerCorrect(qRoman, 'iv ve vii')).toBe(true);
    expect(isAnswerCorrect(qRoman, '4 və 7')).toBe(true);
    expect(isAnswerCorrect(qRoman, '4, 7')).toBe(true);
    expect(isAnswerCorrect(qRoman, '47')).toBe(true);
    expect(isAnswerCorrect(qRoman, '7, 4')).toBe(true);
    expect(isAnswerCorrect(qRoman, 'III və VII')).toBe(false);

    const qSingleRoman = makeOpenQ(
      'Yalnız I|I|1|yalnız 1|birinci',
      'Doğru mülahizələri seçin:\nI. Birinci\nII. İkinci',
    );
    expect(isAnswerCorrect(qSingleRoman, 'Yalnız I')).toBe(true);
    expect(isAnswerCorrect(qSingleRoman, 'I')).toBe(true);
    expect(isAnswerCorrect(qSingleRoman, 'i')).toBe(true);
    expect(isAnswerCorrect(qSingleRoman, '1')).toBe(true);
    expect(isAnswerCorrect(qSingleRoman, 'yalniz 1')).toBe(true);
    expect(isAnswerCorrect(qSingleRoman, 'II')).toBe(false);
  });

  it('Layer 6b: Chronological / Sequence Questions (order-sensitive)', () => {
    const qChrono = makeOpenQ(
      '1, 4, 3, 2|1432|1 4 3 2|1-4-3-2',
      'Hadisələrin düzgün xronoloji ardıcıllığını müəyyən edin:\n1. Hadisə A\n2. Hadisə B\n3. Hadisə C\n4. Hadisə D',
    );
    expect(isAnswerCorrect(qChrono, '1, 4, 3, 2')).toBe(true);
    expect(isAnswerCorrect(qChrono, '1432')).toBe(true);
    expect(isAnswerCorrect(qChrono, '1 4 3 2')).toBe(true);
    expect(isAnswerCorrect(qChrono, '1-4-3-2')).toBe(true);
    expect(isAnswerCorrect(qChrono, '1; 4; 3; 2')).toBe(true);
    // Wrong order must fail!
    expect(isAnswerCorrect(qChrono, '1, 2, 3, 4')).toBe(false);
    expect(isAnswerCorrect(qChrono, '1234')).toBe(false);
    expect(isAnswerCorrect(qChrono, '2, 3, 4, 1')).toBe(false);
  });

  it('Layer 7: Matching / Correspondence Questions in any notation', () => {
    const qMatch1 = makeOpenQ(
      '1-b; 2-d; 3-a; 4-c|1-b, 2-d, 3-a, 4-c|1b 2d 3a 4c|bdac',
      'Sözlərin leksik mənası ilə bağlı uyğunluğu müəyyən edin:',
    );
    expect(isAnswerCorrect(qMatch1, '1-b; 2-d; 3-a; 4-c')).toBe(true);
    expect(isAnswerCorrect(qMatch1, '1-b, 2-d, 3-a, 4-c')).toBe(true);
    expect(isAnswerCorrect(qMatch1, '1b 2d 3a 4c')).toBe(true);
    expect(isAnswerCorrect(qMatch1, '1:b, 2:d, 3:a, 4:c')).toBe(true);
    expect(isAnswerCorrect(qMatch1, '2-d, 1-b, 4-c, 3-a')).toBe(true);
    expect(isAnswerCorrect(qMatch1, 'bdac')).toBe(true);
    expect(isAnswerCorrect(qMatch1, 'b, d, a, c')).toBe(true);
    expect(isAnswerCorrect(qMatch1, '1-a; 2-d; 3-b; 4-c')).toBe(false);

    const qMatchRoman = makeOpenQ(
      'I-a, d; II-b, e|1-a,d; 2-b,e|1ad 2be',
      'Uyğunluğu müəyyən edin:\nI. Böyük Qafqaz\nII. Kiçik Qafqaz',
    );
    expect(isAnswerCorrect(qMatchRoman, 'I-a, d; II-b, e')).toBe(true);
    expect(isAnswerCorrect(qMatchRoman, 'I-d,a; II-e,b')).toBe(true);
    expect(isAnswerCorrect(qMatchRoman, '1-a,d; 2-b,e')).toBe(true);
    expect(isAnswerCorrect(qMatchRoman, '1-ad, 2-be')).toBe(true);
    expect(isAnswerCorrect(qMatchRoman, 'I ad, II be')).toBe(true);
    expect(isAnswerCorrect(qMatchRoman, 'I-a, b; II-d, e')).toBe(false);
  });

  it('Layer 2, 3, 4: Azerbaijani terms, case, English keyboard transliteration & grammatical suffixes', () => {
    const qGeo = makeOpenQ(
      'Meksika|Meksikada|Meksika dövləti|Meksika ölkəsi|Mexico',
      'Syerra-Madre dağlarının yerləşdiyi ölkə:',
    );
    expect(isAnswerCorrect(qGeo, 'Meksika')).toBe(true);
    expect(isAnswerCorrect(qGeo, 'meksika')).toBe(true);
    expect(isAnswerCorrect(qGeo, 'MEKSİKA')).toBe(true);
    expect(isAnswerCorrect(qGeo, 'Meksikada')).toBe(true);
    expect(isAnswerCorrect(qGeo, 'Meksika dövləti')).toBe(true);
    expect(isAnswerCorrect(qGeo, 'Meksika olkesi')).toBe(true);
    expect(isAnswerCorrect(qGeo, 'Kolumbiya')).toBe(false);

    const qPhysTerm = makeOpenQ(
      'Kütlə|Kütləni|Cismin kütləsi|Cismin kütləsini|m|kutle|kutleni',
      'Qüvvənin (F) təcilə (a) olan nisbəti (F / a) hansı fiziki kəmiyyəti ifadə edir?',
    );
    expect(isAnswerCorrect(qPhysTerm, 'Kütlə')).toBe(true);
    expect(isAnswerCorrect(qPhysTerm, 'Kütləni')).toBe(true);
    expect(isAnswerCorrect(qPhysTerm, 'kutle')).toBe(true);
    expect(isAnswerCorrect(qPhysTerm, 'kutleni')).toBe(true);
    expect(isAnswerCorrect(qPhysTerm, 'kutla')).toBe(true);
    expect(isAnswerCorrect(qPhysTerm, 'Cismin kütləsi')).toBe(true);
    expect(isAnswerCorrect(qPhysTerm, 'm')).toBe(true);
    expect(isAnswerCorrect(qPhysTerm, 'Sürət')).toBe(false);

    const qHistoryPerson = makeOpenQ(
      'Xurşidbanu Natəvan|Natəvan|X. Natəvan|Xan qızı Natəvan|Xurşidbanu|Natevan|Natavan',
      'Qeyd edilənlər kimə aiddir?',
    );
    expect(isAnswerCorrect(qHistoryPerson, 'Xurşidbanu Natəvan')).toBe(true);
    expect(isAnswerCorrect(qHistoryPerson, 'xursidbanu natevan')).toBe(true);
    expect(isAnswerCorrect(qHistoryPerson, 'xurshidbanu natavan')).toBe(true);
    expect(isAnswerCorrect(qHistoryPerson, 'Natəvan')).toBe(true);
    expect(isAnswerCorrect(qHistoryPerson, 'natevan')).toBe(true);
    expect(isAnswerCorrect(qHistoryPerson, 'Xan qızı Natəvan')).toBe(true);
    expect(isAnswerCorrect(qHistoryPerson, 'Məhsəti Gəncəvi')).toBe(false);

    const qBioChest = makeOpenQ(
      'Döş boşluğu|Döş boşluğuna|Döş qəfəsi|Döş qəfəsinə|Döş|dos boslugu|torakal boşluq',
      'Bu kəsik hansı bədən boşluğuna aiddir?',
    );
    expect(isAnswerCorrect(qBioChest, 'Döş boşluğu')).toBe(true);
    expect(isAnswerCorrect(qBioChest, 'dos boslugu')).toBe(true);
    expect(isAnswerCorrect(qBioChest, 'Döş boşluğuna')).toBe(true);
    expect(isAnswerCorrect(qBioChest, 'Döş qəfəsi')).toBe(true);
    expect(isAnswerCorrect(qBioChest, 'dos qefesi')).toBe(true);
    expect(isAnswerCorrect(qBioChest, 'Döş')).toBe(true);
    expect(isAnswerCorrect(qBioChest, 'Qarın boşluğu')).toBe(false);
  });

  it('Helper functions return clean primary answer and smart student hints', () => {
    const q = makeOpenQ('1, 3, 5|135|1 3 5', 'Doğru fikirləri müəyyən edin:\n1. A\n2. B\n3. C');
    expect(getPrimaryCorrectAnswer(q.correct_answer)).toBe('1, 3, 5');
    const hint = getSmartOpenQuestionHint(q);
    expect(hint.badge).toBe('Açıq Seçim Sualı');
  });

  it('Audits all 70 live open questions and all their pipe-separated variants', async () => {
    const fs = await import('fs');
    if (!fs.existsSync('/tmp/open_70_questions.json')) return;
    const questions = JSON.parse(fs.readFileSync('/tmp/open_70_questions.json', 'utf8'));
    expect(questions.length).toBe(70);

    for (const rawQ of questions) {
      const q = makeOpenQ(rawQ.correct_answer, rawQ.question_text);
      const variants = rawQ.correct_answer
        .split('|')
        .map((v: string) => v.trim())
        .filter(Boolean);

      expect(variants.length).toBeGreaterThanOrEqual(1);

      const hint = getSmartOpenQuestionHint(q);
      expect(hint.badge).toBeTruthy();

      // Every listed variant must evaluate to true
      for (const v of variants) {
        const ok = isAnswerCorrect(q, v);
        if (!ok) {
          throw new Error(
            `Variant "${v}" failed for Q ${rawQ.id} (${rawQ.quiz_title} #${rawQ.order_index + 1}): correct_answer="${rawQ.correct_answer}"`,
          );
        }
        expect(ok).toBe(true);

        // Lowercase and uppercase of every variant must also pass
        expect(isAnswerCorrect(q, v.toLowerCase())).toBe(true);
        expect(isAnswerCorrect(q, v.toUpperCase())).toBe(true);
        // Leading/trailing whitespace must also pass
        expect(isAnswerCorrect(q, `  ${v}  `)).toBe(true);
      }

      // Obvious wrong answers must evaluate to false
      expect(isAnswerCorrect(q, '999999')).toBe(false);
      expect(isAnswerCorrect(q, 'tamamile_yanlis_cavab_xyz')).toBe(false);
      expect(isAnswerCorrect(q, '')).toBe(false);
    }
  });
});
