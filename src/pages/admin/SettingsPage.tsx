import { useState } from "react";
import {
  Settings,
  Globe,
  Bell,
  Shield,
  Database,
  Mail,
  Save,
  RefreshCw
} from "lucide-react";
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

export default function SettingsPage() {
  const [hasChanges, setHasChanges] = useState(false);

  // General settings
  const [siteName, setSiteName] = useState("Sınaq");
  const [siteDescription, setSiteDescription] = useState("Öyrənmək Əyləncəli Ola Bilər");
  const [language, setLanguage] = useState("az");
  const [timezone, setTimezone] = useState("Asia/Baku");

  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(true);

  // Security
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("60");
  const [passwordPolicy, setPasswordPolicy] = useState("medium");

  const handleSave = () => {
    toast.success("Ayarlar uğurla yeniləndi!");
    setHasChanges(false);
  };

  const handleChange = () => {
    setHasChanges(true);
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
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

        {/* Database & Backup */}
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
                <div className="text-sm text-muted-foreground">Bu gün, 03:00</div>
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                İndi Yedəklə
              </Button>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-muted/30 p-4">
              <div>
                <div className="font-medium text-foreground">Verilənlər Bazası Ölçüsü</div>
                <div className="text-sm text-muted-foreground">256 MB / 1 GB</div>
              </div>
              <Button variant="outline" size="sm">
                Optimallaşdır
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
