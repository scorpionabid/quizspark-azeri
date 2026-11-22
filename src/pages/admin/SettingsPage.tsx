import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import {
  Globe,
  Bell,
  Shield,
  Database,
  Save,
  RefreshCw
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
import { toast } from "sonner";

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

  return (
    <div className="min-h-screen bg-gradient-hero p-4 sm:p-6 lg:p-8">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Sistem Ayarları</h1>
            <p className="text-muted-foreground">Platformanın ümumi parametrlərini idarə edin</p>
          </div>
          {hasChanges && (
            <Button variant="game" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Dəyişiklikləri Saxla
            </Button>
          )}
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
