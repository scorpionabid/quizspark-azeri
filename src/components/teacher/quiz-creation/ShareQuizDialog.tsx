import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Copy,
  Check,
  QrCode,
  KeyRound,
  Lock,
  Share2,
  Globe,
  Link as LinkIcon,
  MessageCircle,
  Send,
  ExternalLink,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { Quiz, useQuiz } from '@/hooks/useQuizzes';

interface ShareQuizDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quizId: string | null;
  quizTitle: string;
  quiz?: Quiz | null;
}

export function ShareQuizDialog({
  open,
  onOpenChange,
  quizId,
  quizTitle,
  quiz: passedQuiz,
}: ShareQuizDialogProps) {
  // If quiz was not passed directly, fetch it
  const { data: fetchedQuiz } = useQuiz(quizId || undefined);
  const quiz = passedQuiz || fetchedQuiz;

  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!quizId) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const pinCode = quiz?.share_code || quizId.slice(0, 6).toUpperCase();
  const directUrl = `${origin}/quiz/${quiz?.share_code || quizId}`;
  const password = quiz?.access_password?.trim() || '';
  const directUrlWithPwd = password
    ? `${directUrl}?pwd=${encodeURIComponent(password)}`
    : directUrl;

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      toast.success('Kopyalandı!');
      setTimeout(() => setCopiedType(null), 2000);
    } catch (err) {
      console.error('Kopyalama xətası:', err);
      toast.error('Kopyalamaq mümkün olmadı');
    }
  };

  const shareMessage = `🎯 *${quizTitle}* sınaq imtahanına dəvət edildiniz!

🔗 Giriş linki: ${directUrl}
🔑 PIN Kod: ${pinCode}
${password ? `🔒 Giriş şifrəsi: ${password}\n` : ''}
Uğurlar arzulayırıq!`;

  const shareToWhatsapp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(url, '_blank');
  };

  const shareToTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(directUrl)}&text=${encodeURIComponent(shareMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <div className="flex items-center justify-between gap-2 pr-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Share2 className="h-5 w-5" />
              </div>
              <DialogTitle className="text-lg sm:text-xl font-black">
                Quizi Paylaş
              </DialogTitle>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              {quiz?.is_public ? (
                <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200">
                  <Globe className="h-3 w-3 mr-1" /> İctimai
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200">
                  <LinkIcon className="h-3 w-3 mr-1" /> Yalnız Linklə
                </Badge>
              )}
              {password && (
                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200">
                  <Lock className="h-3 w-3 mr-1" /> Şifrəli
                </Badge>
              )}
            </div>
          </div>
          <DialogDescription className="text-xs sm:text-sm font-medium text-foreground/80 truncate">
            {quizTitle}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="links" className="w-full mt-2">
          <TabsList className="grid grid-cols-2 rounded-2xl p-1 bg-muted/60">
            <TabsTrigger value="links" className="rounded-xl font-bold text-xs sm:text-sm gap-1.5">
              <LinkIcon className="h-3.5 w-3.5" />
              <span>Link & PIN</span>
            </TabsTrigger>
            <TabsTrigger value="qr" className="rounded-xl font-bold text-xs sm:text-sm gap-1.5">
              <QrCode className="h-3.5 w-3.5" />
              <span>QR Kod & Sosial</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Linklər və PIN Kod */}
          <TabsContent value="links" className="space-y-4 pt-3">
            {/* 1. PIN KOD BLOKU */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-card to-primary/5 p-4 sm:p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary mb-1">
                    <KeyRound className="h-3.5 w-3.5" />
                    <span>Sürətli Giriş PIN Kodu</span>
                  </div>
                  <div className="font-mono text-2xl sm:text-3xl font-black tracking-widest text-foreground">
                    {pinCode.length === 6
                      ? `${pinCode.slice(0, 3)} ${pinCode.slice(3)}`
                      : pinCode}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Tələbələr saytın ana səhifəsində bu kodu yazaraq qoşula bilərlər.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(pinCode, 'pin')}
                  className="rounded-xl font-bold gap-1.5 shrink-0 shadow"
                >
                  {copiedType === 'pin' ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-400" />
                      <span>Kopyalandı</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Kodu Kopyala</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* 2. Standart Birbaşa Link */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                <LinkIcon className="h-3.5 w-3.5" />
                <span>Birbaşa Quiz Linki</span>
              </label>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={directUrl}
                  className="rounded-xl text-xs sm:text-sm font-mono bg-muted/30 select-all"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => copyToClipboard(directUrl, 'link')}
                  className="rounded-xl shrink-0 h-10 w-10"
                  title="Linki kopyala"
                >
                  {copiedType === 'link' ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* 3. Şifrəli Link (Əgər şifrə varsa) */}
            {password && (
              <div className="space-y-1.5 rounded-2xl border border-purple-200 dark:border-purple-900/40 bg-purple-50/50 dark:bg-purple-950/20 p-3.5">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5" />
                    <span>Şifrəli Birbaşa Keçid Linki</span>
                  </span>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-purple-200/60 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200">
                    Şifrə: {password}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={directUrlWithPwd}
                    className="rounded-xl text-xs font-mono bg-background select-all text-purple-900 dark:text-purple-200 border-purple-200 dark:border-purple-800"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(directUrlWithPwd, 'pwdLink')}
                    className="rounded-xl shrink-0 font-bold border-purple-300 text-purple-700 hover:bg-purple-100 dark:text-purple-300 dark:hover:bg-purple-950"
                  >
                    {copiedType === 'pwdLink' ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-[11px] text-purple-600/80 dark:text-purple-400/80">
                  Bu linklə daxil olan tələbələr üçün şifrə avtomatik təsdiqlənir (əllə daxil etməyə ehtiyac qalmır).
                </p>
              </div>
            )}
          </TabsContent>

          {/* TAB 2: QR Kod və Sosial Paylaşım */}
          <TabsContent value="qr" className="space-y-4 pt-3">
            {/* QR KOD MƏRKƏZİ */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl border bg-card text-center space-y-3 shadow-inner">
              <div className="p-3 bg-white rounded-2xl shadow-md border inline-block">
                <QRCodeSVG
                  value={directUrl}
                  size={170}
                  level="M"
                  includeMargin={true}
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-foreground">
                  Smartfon kamerasını yaxınlaşdırın
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Proyektorda və ya ağıllı lövhədə nümayiş etdirərək sinifin qoşulmasını təmin edin.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(directUrl, '_blank')}
                  className="rounded-xl text-xs gap-1"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Sınağı Aç</span>
                </Button>
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(directUrl, 'link')}
                  className="rounded-xl text-xs gap-1"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Linki Kopyala</span>
                </Button>
              </div>
            </div>

            {/* SOSİAL ŞƏBƏKƏ DÜYMƏLƏRİ */}
            <div className="grid grid-cols-2 gap-2.5">
              <Button
                type="button"
                onClick={shareToWhatsapp}
                className="rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold gap-2 h-11 text-xs sm:text-sm shadow-sm"
              >
                <MessageCircle className="h-4 w-4 fill-current" />
                <span>WhatsApp</span>
              </Button>
              <Button
                type="button"
                onClick={shareToTelegram}
                className="rounded-xl bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold gap-2 h-11 text-xs sm:text-sm shadow-sm"
              >
                <Send className="h-4 w-4 fill-current" />
                <span>Telegram</span>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
