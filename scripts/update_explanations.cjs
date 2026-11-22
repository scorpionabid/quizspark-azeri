const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://supa.imtahan.store',
  'process.env.SUPABASE_ANON_KEY || '''
);

const updates = [
  {
    ids: ['143daedb-ebfe-43e2-80a1-3c7c7b7ba5de'],
    explanation: 'AR Konstitusiyası Maddə 56 (Seçki hüququ) II hissə — Məhkəmənin qərarı ilə fəaliyyət qabiliyyətsizliyi təsdiq olunmuş şəxslərin seçkilərdə, habelə referendumda iştirak etmək hüququ yoxdur.'
  },
  {
    ids: ['14eca4d2-7920-4806-b4fc-31b1b64cc35f'],
    explanation: 'AR Konstitusiyası Maddə 38 (Sosial təminat hüququ) IV hissə — Təqaüdlərin və sosial müavinətlərin minimum məbləği Konstitusiya ilə deyil, qanunla müəyyən edilir.'
  },
  {
    ids: ['5772c233-8f83-4fa4-84e2-0632c9e29ca1', '7f762121-24ef-43cd-847a-c7d623a2f315'],
    explanation: 'AR Konstitusiyası II fəsil — Şəxsi toxunulmazlıq (Maddə 32), Mənzil toxunulmazlığı (Maddə 33) və Sağlam ətraf mühitdə yaşamaq hüququ (Maddə 39) Konstitusiyada təsbit olunmuş əsas insan hüquqlarıdır.'
  },
  {
    ids: ['34e0a971-09c0-4618-8f35-bad19c3b04d3'],
    explanation: 'AR Konstitusiyası II fəsil — Fikir və söz azadlığı (Maddə 47), Vicdan azadlığı (Maddə 48) və Sərbəst toplaşmaq azadlığı (Maddə 49) təsbit olunmuş əsas azadlıqlardır.'
  },
  {
    ids: ['d400aae6-edf1-4694-8a85-dcd73918f0f3'],
    explanation: 'AR Konstitusiyası Maddə 57 (Müraciət etmək hüququ) I hissə — Azərbaycan Respublikası vətəndaşlarının dövlət orqanlarına şəxsən müraciət etmək, habelə fərdi və kollektiv yazılı müraciətlər göndərmək hüququ vardır.'
  },
  {
    ids: ['49903ae8-7b7b-4e5d-95bc-7d7a4865f884'],
    explanation: 'AR Konstitusiyası Maddə 98 və Maddə 147 — Konstitusiya qanunları Azərbaycan Respublikasının Prezidenti tərəfindən imzalanmazsa qüvvəyə minmir.'
  },
  {
    ids: ['db65afd8-ac02-47af-9fbe-d157128cfee8', 'b9de5542-c929-4a38-93c5-c7f7742b7bd4'],
    explanation: 'AR Konstitusiyası Maddə 147 (Konstitusiyanın hüquqi qüvvəsi) I hissə — Azərbaycan Respublikasının Konstitusiyası Azərbaycan Respublikasında ən yüksək hüquqi qüvvəyə və birbaşa hüquqi qüvvəyə malikdir.'
  },
  {
    ids: ['26ffaa1b-43a3-4721-8456-df1f1e8e29e9', '1aaaf795-510d-4710-82d6-4c820bdf40a3', '23f0c69f-14e5-41ca-b58b-40341d9a9545'],
    explanation: 'AR Konstitusiyası Keçid Müddəaları Bənd 1 — Bu Konstitusiya referendumla qəbul edildikdən sonra rəsmən dərc olunduğu gündən (27 noyabr 1995) qüvvəyə minir və 1978-ci il Konstitusiyası qüvvədən düşür.'
  },
  {
    ids: ['19f5ef21-2456-475a-9eaa-9cf38af1fc36'],
    explanation: 'AR Konstitusiyası Keçid Müddəaları Bənd 2 — Yeni seçilmiş Milli Məclisin ilk iclas gününədək əvvəlki səlahiyyətlər saxlanılır və yeni MM-in ilk iclas günü başa çatır.'
  },
  {
    ids: ['47e44fb1-4b9b-467e-b3d4-d3f54508cca8', '4d6c5265-8d94-4a73-952f-3924a19286d1', '43df06c1-7ba0-4cc6-9e88-e8092b9fed40'],
    explanation: 'AR Konstitusiyası Keçid Müddəaları Bənd 3 — Yeni seçilmiş Milli Məclisin ilk iclası azı 83 deputatın seçildiyi gündən bir həftə sonra keçirilir. İlk sessiya 1996-cı il mayın 31-dək davam edir.'
  },
  {
    ids: ['d20cc911-236d-45ed-82d3-db9931825f20', 'c1883d01-528f-4137-9a39-d69af5886ebc'],
    explanation: 'AR Konstitusiyası Keçid Müddəaları Bənd 4 — Yerli xalq deputatları sovetlərinin səlahiyyətlərinə Konstitusiyanın qüvvəyə mindiyi gündən xitam verilir, onların səlahiyyətlərini yerli icra hakimiyyəti orqanları həyata keçirir.'
  },
  {
    ids: ['75b508fb-3865-48e8-94cf-0633552c61f4'],
    explanation: 'AR Konstitusiyası Keçid Müddəaları Bənd 5 — Konstitusiya qüvvəyə mindikdən sonra iki il müddətində yerli özünüidarə haqqında qanun qəbul edilməli və bələdiyyələrə seçkilər keçirilməlidir.'
  },
  {
    ids: ['f5183041-1e99-4c05-93cf-7957d57c5b9d'],
    explanation: 'AR Konstitusiyası Keçid Müddəaları Bənd 6 — Nazirlər Kabineti Konstitusiyanın qüvvəyə mindiyi gündən etibarən bu Konstitusiyada müəyyən edilən səlahiyyətləri həyata keçirir.'
  },
  {
    ids: ['755b5e35-9195-4ca5-adb6-5ecfc7df4149'],
    explanation: 'AR Konstitusiyası Keçid Müddəaları Bənd 7 — Konstitusiya qüvvəyə mindikdən sonra 1 il müddətində Konstitusiya Məhkəməsi haqqında Qanun qəbul edilməli və KM yaradılmalıdır. Yaradılanadək KM-in səlahiyyətləri həyata keçirilmir.'
  },
  {
    ids: ['e2d9e5a0-d936-4f31-aeae-c416b6c0825e'],
    explanation: "AR Konstitusiyası Keçid Müddəaları Bənd 8 — Bu Konstitusiya qüvvəyə mindiyi gündən Azərbaycan Respublikasının Ali Arbitraj Məhkəməsi 'Azərbaycan Respublikasının İqtisad Məhkəməsi' adlandırılmışdır."
  },
  {
    ids: ['71f79078-c715-4cd8-bd82-acd5ce390786'],
    explanation: 'AR Konstitusiyası Keçid Müddəaları Bənd 9 — Konstitusiya qüvvəyə mindikdən sonra 1 il müddətində hakimlərin statusu və məhkəmə quruluşu ilə əlaqədar qanunvericilik qəbul edilməli və hakimlər yenidən təyin edilməlidir.'
  },
  {
    ids: ['a7d46fab-681d-43ac-8ab4-4223420c0742', 'b788f7e2-5990-4ac4-97d1-964409263d9a'],
    explanation: 'AR Konstitusiyası Keçid Müddəaları Bənd 10 — Bu Konstitusiyanın qəbul edildiyi günədək ərazidə qüvvədə olan qanunlar və başqa normativ hüquqi aktlar bu Konstitusiyaya zidd olmayan hissədə öz qüvvəsini saxlayır.'
  }
];

async function run() {
  let count = 0;
  for (const item of updates) {
    for (const id of item.ids) {
      const { error } = await supabase
        .from('questions')
        .update({ explanation: item.explanation })
        .eq('id', id);
      if (error) {
        console.error('Error updating id:', id, error);
      } else {
        count++;
      }
    }
  }
  console.log(`Successfully updated and enriched ${count} question explanations with exact legal citations.`);
}

run();
