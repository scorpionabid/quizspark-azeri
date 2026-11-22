import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import {
  Globe,
  Bell,
  Shield,
  Database,
  Save,
  RefreshCw,
  Type,
  Check,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useFont } from "@/contexts/FontContext";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "platform_settings_v1";

function loadSavedSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export default function SettingsPage() {
  const { role } = useAuth();
  const queryClient = useQueryClient();
  const initial = loadSavedSettings();
  const [hasChanges, setHasChanges] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [lastBackupTime, setLastBackupTime] = useState<string>(initial.lastBackupTime || "Hələ edilməyib");

  // General settings
  const [siteName, setSiteName] = useState(initial.siteName ?? "Sınaq");
  const [siteDescription, setSiteDescription] = useState(initial.siteDescription ?? "Öyrənmək Əyləncəli Ola Bilər");
  const [language, setLanguage] = useState(initial.language ?? "az");
  const [timezone, setTimezone] = useState(initial.timezone ?? "Asia/Baku");

  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(initial.emailNotifications ?? true);
  const [pushNotifications, setPushNotifications] = useState(initial.pushNotifications ?? false);
  const [weeklyReport, setWeeklyReport] = useState(initial.weeklyReport ?? true);

  // Security
  const [twoFactor, setTwoFactor] = useState(initial.twoFactor ?? false);
  const [sessionTimeout, setSessionTimeout] = useState(initial.sessionTimeout ?? "60");
  const [passwordPolicy, setPasswordPolicy] = useState(initial.passwordPolicy ?? "medium");

  const handleSave = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        siteName,
        siteDescription,
        language,
        timezone,
        emailNotifications,
        pushNotifications,
        weeklyReport,
        twoFactor,
        sessionTimeout,
        passwordPolicy,
        lastBackupTime,
      })
    );
    toast.success("Ayarlar uğurla yadda saxlanıldı!");
    setHasChanges(false);
  };

  const handleBackupNow = async () => {
    setIsBackingUp(true);
    try {
      const [{ data: quizzes }, { data: textbooks }, { data: classes }] = await Promise.all([
        supabase.from("quizzes").select("id, title, subject, grade, assessment_type, created_at").limit(200),
        supabase.from("textbooks").select("id, title, grade, subject, status").limit(200),
        supabase.from("teacher_classes").select("id, name, grade, academic_year").limit(200),
      ]);
      const payload = {
        exportedAt: new Date().toISOString(),
        quizzes: quizzes ?? [],
        textbooks: textbooks ?? [],
        classes: classes ?? [],
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `platform-backup-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      const nowStr = new Date().toLocaleTimeString("az-AZ", { hour: "2-digit", minute: "2-digit" });
      setLastBackupTime(`Bu gün, ${nowStr}`);
      toast.success("Verilənlər bazası ehtiyat nüsxəsi endirildi!");
    } catch {
      toast.error("Yedəkləmə zamanı xəta baş verdi");
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleOptimizeCache = async () => {
    await queryClient.invalidateQueries();
    toast.success("Keş təmizləndi və məlumatlar yeniləndi!");
  };

  const handleChange = () => {
    setHasChanges(true);
  };

  const handleFontSelect = (fontId: string) => {
    setFont(fontId);
    const selected = availableFonts.find((f) => f.id === fontId);
    toast.success(`Şrift dəyişdirildi: ${selected?.name || fontId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-4 sm:p-6 lg:p-8">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Sistem Ayarları</h1>
            <p className="text-muted-foreground">Platformanın ümumi parametrlərini və görünüşünü idarə edin</p>
          </div>
          {hasChanges && (
            <Button variant="game" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Dəyişiklikləri Saxla
            </Button>
          )}
        </div>

        {/* Typography & Font Settings */}
        <div className="mb-8 rounded-2xl bg-gradient-card border border-border/50 p-6 shadow-sm">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
                <Type className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                  Saytın Şrifti və Tipoqrafika
                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                    {currentFont.name}
                  </Badge>
                </h2>
                <p className="text-xs text-muted-foreground">
                  Bütün platforma, imtahan sualları və idarəetmə paneli üçün istədiyiniz modern şrifti seçin
                </p>
              </div>
            </div>

            {currentFont.id !== 'inter' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  resetFont();
                  toast.info("İlkin standart şriftə (Inter) qaytarıldı");
                }}
                className="h-8 text-xs self-start sm:self-auto"
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                İlkin Vəziyyətə Qaytar
              </Button>
            )}
          </div>

          {/* Font Cards Grid */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            {availableFonts.map((font) => {
              const isSelected = currentFont.id === font.id;
              return (
                <div
                  key={font.id}
                  onClick={() => handleFontSelect(font.id)}
                  className={cn(
                    "relative cursor-pointer rounded-xl border p-4 transition-all duration-200 text-left hover:shadow-md",
                    isSelected
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                      : "border-border/60 bg-card/60 hover:border-border hover:bg-card"
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                        <span style={{ fontFamily: font.fontFamily }}>{font.name}</span>
                        {font.badge && (
                          <span className={cn(
                            "text-[10px] font-semibold px-1.5 py-0.5 rounded-md",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          )}>
                            {font.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-muted-foreground font-mono">{font.category}</span>
                    </div>

                    {isSelected && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0 shadow-sm">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {font.description}
                  </p>

                  {/* Sample text rendering in the target font */}
                  <div
                    className="p-2.5 rounded-lg bg-background/80 border border-border/40 text-xs text-foreground/90 select-none"
                    style={{ fontFamily: font.fontFamily }}
                  >
                    Aa Bb Gg Əə Ğğ Şş 123
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Preview Box */}
          <div className="rounded-xl bg-muted/30 border border-border/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                Canlı Sınaq Mətni (Seçilmiş: <span className="text-foreground font-bold">{currentFont.name}</span>)
              </Label>
              <span className="text-[11px] text-muted-foreground">İstənilən mətni yazıb yoxlaya bilərsiniz</span>
            </div>
            <Input
              value={customPreviewText}
              onChange={(e) => setCustomPreviewText(e.target.value)}
              className="text-sm bg-background border-border/60"
              style={{ fontFamily: currentFont.fontFamily }}
            />
          </div>
        </div>

        {/* General Settings */}
        <div className="mb-8 rounded-2xl bg-gradient-card border border-border/50 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground">Ümumi Ayarlar</h2>
          </div>

          <div className="grid gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="siteName">Sayt Adı</Label>
                <Input
                  id="siteName"
                  value={siteName}
                  onChange={(e) => {
                    setSiteName(e.target.value);
                    handleChange();
                  }}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="language">Dil</Label>
                <Select value={language} onValueChange={(value) => {
                  setLanguage(value);
                  handleChange();
                }}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="az">Azərbaycan</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ru">Русский</SelectItem>
                    <SelectItem value="tr">Türkçe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="siteDescription">Sayt Təsviri</Label>
              <Textarea
                id="siteDescription"
                value={siteDescription}
                onChange={(e) => {
                  setSiteDescription(e.target.value);
                  handleChange();
                }}
                className="mt-2"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="timezone">Saat Qurşağı</Label>
              <Select value={timezone} onValueChange={(value) => {
                setTimezone(value);
                handleChange();
              }}>
                <SelectTrigger className="mt-2 w-full sm:w-[300px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Baku">Bakı (GMT+4)</SelectItem>
                  <SelectItem value="Europe/Moscow">Moskva (GMT+3)</SelectItem>
                  <SelectItem value="Europe/Istanbul">İstanbul (GMT+3)</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="mb-8 rounded-2xl bg-gradient-card border border-border/50 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/20">
              <Bell className="h-5 w-5 text-secondary" />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground">Bildiriş Ayarları</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-xl bg-muted/30 p-4">
              <div>
                <Label className="text-base">E-poçt Bildirişləri</Label>
                <p className="text-sm text-muted-foreground">Vacib yenilikləri e-poçt ilə alın</p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={(checked) => {
                  setEmailNotifications(checked);
                  handleChange();
                }}
              />
            </div>

            <div className="flex items-center justify-between rounded-xl bg-muted/30 p-4">
              <div>
                <Label className="text-base">Push Bildirişlər</Label>
                <p className="text-sm text-muted-foreground">Brauzer bildirişlərini aktivləşdirin</p>
              </div>
              <Switch
                checked={pushNotifications}
                onCheckedChange={(checked) => {
                  setPushNotifications(checked);
                  handleChange();
                }}
              />
            </div>

            <div className="flex items-center justify-between rounded-xl bg-muted/30 p-4">
              <div>
                <Label className="text-base">Həftəlik Hesabat</Label>
                <p className="text-sm text-muted-foreground">Hər həftə statistika hesabatı alın</p>
              </div>
              <Switch
                checked={weeklyReport}
                onCheckedChange={(checked) => {
                  setWeeklyReport(checked);
                  handleChange();
                }}
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="mb-8 rounded-2xl bg-gradient-card border border-border/50 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
              <Shield className="h-5 w-5 text-accent" />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground">Təhlükəsizlik Ayarları</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-xl bg-muted/30 p-4">
              <div>
                <Label className="text-base">İki Faktorlu Autentifikasiya</Label>
                <p className="text-sm text-muted-foreground">Admin hesabları üçün 2FA tələb edin</p>
              </div>
              <Switch
                checked={twoFactor}
                onCheckedChange={(checked) => {
                  setTwoFactor(checked);
                  handleChange();
                }}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="sessionTimeout">Sessiya Timeout (dəqiqə)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => {
                    setSessionTimeout(e.target.value);
                    handleChange();
                  }}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Şifrə Siyasəti</Label>
                <Select value={passwordPolicy} onValueChange={(value) => {
                  setPasswordPolicy(value);
                  handleChange();
                }}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Sadə</SelectItem>
                    <SelectItem value="medium">Orta</SelectItem>
                    <SelectItem value="high">Güclü</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Database & Backup (Admin only) */}
        {role === "admin" && (
        <div className="rounded-2xl bg-gradient-card border border-border/50 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/20">
              <Database className="h-5 w-5 text-success" />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground">Verilənlər Bazası</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-muted/30 p-4">
              <div>
                <div className="font-medium text-foreground">Son Yedəkləmə</div>
                <div className="text-sm text-muted-foreground">{lastBackupTime}</div>
              </div>
              <Button variant="outline" size="sm" onClick={handleBackupNow} disabled={isBackingUp}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isBackingUp ? "animate-spin" : ""}`} />
                İndi Yedəklə
              </Button>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-muted/30 p-4">
              <div>
                <div className="font-medium text-foreground">Keş və Sinxronizasiya</div>
                <div className="text-sm text-muted-foreground">Lokal sorğu keşini təmizləyib yeniləyin</div>
              </div>
              <Button variant="outline" size="sm" onClick={handleOptimizeCache}>
                Optimallaşdır
              </Button>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
