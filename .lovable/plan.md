
# AI Komekci Sehifesinin Novbeti Tekmillesdirilmesi

## Movcud Veziyyetin Qisa Analizi

Hazirda AI Komekci asagidaki funksiyalara malikdir:
- Movzu uzre sual yaratma (tek ve batch rejim)
- AI Parametrleri (model, temperatur, max token)
- Bloom taksonomiyasi filtri ve badge
- Senedden sual yaratma (PDF/DOCX/TXT)
- Sablon kitabxanasi (kateqoriya filtri, axtaris)
- Sual redaktesinde AI desteki (sadelesd/cetinlesd/variantlari yaxsilasdir/izah genislendir/oxsar yarat)
- Keyfiyyet analizi
- Yaratma statistikasi
- AI ile sekil yaratma (generate-question-image)

## Askar Edilmis Catismazliqlar ve Tekmillesdirilecek Saheler

### 1. "Senedden" Tab - Cok Mehduddur

Hazirda "Senedden" tabi yalniz fayl yukleyir ve istifadecini "Sual Yarat" tabina yonlendirir. Hecc bir birbaasa islem imkani yoxdur:
- Senedden sual yaratma birbaasa bu tabdan mumkun deyil
- Sened mezmununun onizlemesi yoxdur (yalniz 500 simvol)
- Sened icerisinden xususi bolmeleri secmek mumkun deyil
- Coxlu sened yukleyerken siyahi icerisinden secim yoxdur
- Sened tipine gore ikon gosterilmir
- Yuklenme proqresi gosterilmir (yalniz spin)

### 2. Sual Yaratma Interfeysinin Genislendirilmesi

- Sual tipi secimi yoxdur (yalniz coxsecimli) - dogru/yanlis, qisa cavab ve s. olmalidir
- Fenn siyahisi mehdud ve sabitdir (6 fenn)
- Sual sayisi seciminde mehdud (3/5/10/15)
- Yaranan suallara media elave etmek asan deyil (ImageGenerator movcuddur amma inteqrasiya zeidir)
- Hamisi Istifade Et duymesi yalniz quize yonlendirir, sual bankina toplu elave etmir
- Suallar arasinda surukleme ile siralama yoxdur

### 3. Document Tab - Birbaasa Sual Yaratma

Istifadeciler senedi yukledikden sonra hemin tabdan cixmali ve diger taba kecmelidirler. Bu UX problemdir.

### 4. Sablon Sistemi - Lokal Saxlama

Sablonlar yalniz React state-de saxlanilir, sehife yenilendikde itirilir. Database-e saxlama yoxdur.

### 5. Sualin Onizlemesi ve Export

Yaranan suallarin PDF/Word formatinda export edilmesi, cap imkani yoxdur.

---

## Heyata Kecirilecek Deyisiklikler

### Faza A: "Senedden" Tabinin Tam Yeniden Islenmesi

**1. Senedden Birbaasa Sual Yaratma**
- Document tab-a fenn, cetinlik ve sual sayi secimlerini elave etmek
- "Senedden Sual Yarat" duymesini birbaasa bu taba yerlesdirmek
- Senedi yukledikden sonra istifadecini yonlendirmemek, evezine butun lazimi alatlari orada gostermek

**2. Sened Mezmununun Tam Onizlemesi**
- Yuklenmiis senedin tam mezmununu ScrollArea-da gostermek
- Sened mezmunundan xususi hisseleri secmek (highlight/select) imkani
- Secilmis hisseye esasen sual yaratma

**3. Coxlu Sened Desteki**
- Eyni anda 3-e qeder sened yuklemek
- Sened siyahisinda aktiv/deaktiv secim (hansini istifade etmek isteyirsen)
- Her sened ucun fayl olcusu, tip ikonu ve sehife sayi gostermek

**4. Yuklenme Proqresi**
- Fayl yukleme ve emal prosesini mehhelelerle gostermek (Upload -> Emal -> Hazir)
- Proqres bari ile vizual gosterici

### Faza B: Sual Yaratma Interfeysinin Genislendirilmesi

**1. Sual Tipi Secimi**
- Coxsecimli (movcud)
- Dogru/Yanlis 
- Qisa Cavab (aciq sual)
- Eslesdirme (matching)

Bunu hem UI-da hem de `generate-quiz` edge function-da desdeklemek.

**2. Fenn Siyahisinin Genislendirilmesi**
- Movcud 6 fenne elave olaraq: Edebiyyat, Informatika, Ingilis dili, Musiqi, Idman, Huquq ve s.
- Istifadecinin oz fenni elave etmesi (xususi fenn inputu)

**3. Xususi Sual Sayi**
- Movcud secimlerle yanasi, istifadecinin manual reqem daxil etmesi (1-50 arasi)

**4. Suallara Media Inteqrasiyasi**
- Her yaradilmis sualin altinda "Sekil elave et" duymesi (ImageGenerator cagirmaq)
- AI ile yaradilmis sekli avtomatik `question_image_url`-a yazmaq
- Sual bankina elave edende media melumatlarini da gonderme

**5. Toplu Sual Bankina Elave Etme**
- "Hamisini Sual Bankina Elave Et" duymesi - tek klikle butun yaradilmis suallari banka elave edir

### Faza C: Istifadeci Tecrubesi (UX) Yaxsilasdirmalari

**1. Sual Kartinda Gosterilen Melumat**
- Sualin altinda media onizlemesi (sekil varsa)
- Kopyala duymesi (suali clipboard-a kopyalamaq)
- Suali paylasma linki (opsional)

**2. Sual Yaratma Tarixcesi**
- Son yaradilmis suallari browser localStorage-da saxlamaq
- Istifadeci sehifeni yeniledikde sonuncu neticeleri gore bilsin
- "Sonuncu neticeler" seksiyasi

**3. Senedden Tabinda "Smart Suggestions"**
- Sened yuklenenden sonra AI-nin avtomatik movzu teklifleri vermesi
- "Bu senedde hansi movzular var?" analizi

---

## Texniki Deyisiklikler (Fayl Siyahisi)

| Fayl | Emeliyyat | Tesvir |
|------|-----------|--------|
| `src/pages/teacher/AIAssistantPage.tsx` | Deyisiklik | Senedden tabi yeniden islenmesi, sual tipi secimi, xususi sual sayi, toplu banka elave, media inteqrasiyasi |
| `src/components/ai/DocumentUploader.tsx` | Deyisiklik | Coxlu sened desteki, proqres bari, sened onizlemesi, mezmun secimi |
| `src/components/quiz/EditableQuestionCard.tsx` | Deyisiklik | Media onizlemesi, kopyala duymesi, ImageGenerator inteqrasiyasi |
| `src/components/ai/DocumentQuizGenerator.tsx` | Yeni | Senedden birbaasa sual yaratma komponenti (fenn/cetinlik/sual sayi secimi + yaratma duymesi) |
| `supabase/functions/generate-quiz/index.ts` | Deyisiklik | Sual tipi desteyi (dogru/yanlis, qisa cavab), genisledilmis fenn siyahisi |
| `supabase/functions/process-document/index.ts` | Deyisiklik | Sened analizi ve movzu teklifleri, mehheleli emal |

---

## Prioritet Sirasi

1. **Senedden tabi tam yeniden islenmesi** - esas problem budur, istifadeciler senedden sual yaratmaq ucun coxlu elave addim atmalidilar
2. **Sual tipi secimi** - yalniz coxsecimli sual yaratmaq mehdudlasdiricidir
3. **Toplu sual bankina elave** - istifadeciler her suali ayri-ayri elave etmelidir
4. **Media inteqrasiyasi** - yaradilmis suallara sekil elave etmek
5. **UX yaxsilasdirilmalari** - tarixce, kopyalama, smart suggestions

