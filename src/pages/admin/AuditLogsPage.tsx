import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  ShieldAlert,
  AlertTriangle,
  Bug,
  History,
  Bot,
  Search,
  CheckCircle2,
  XCircle,
  Download,
  Terminal,
  Smartphone,
  Globe,
  Clock,
  User,
  Layers,
  ArrowRight,
  Eye,
} from 'lucide-react';
import {
  useAuditLogsList,
  useSystemErrorLogsList,
  useResolveErrorLog,
  useAuditLogsStats,
  SystemErrorLogItem,
  AuditLogItem,
} from '@/hooks/useAuditLogs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function AuditLogsPage() {
  const [activeTab, setActiveTab] = useState<'errors' | 'audit'>('errors');

  // Error filters
  const [errorSearch, setErrorSearch] = useState('');
  const [errorSeverity, setErrorSeverity] = useState<string>('all');
  const [errorStatus, setErrorStatus] = useState<string>('unresolved'); // default unresolved

  // Audit filters
  const [auditSearch, setAuditSearch] = useState('');
  const [auditAction, setAuditAction] = useState<string>('all');
  const [auditEntity, setAuditEntity] = useState<string>('all');

  // Selected item modals
  const [selectedError, setSelectedError] = useState<SystemErrorLogItem | null>(null);
  const [selectedAudit, setSelectedAudit] = useState<AuditLogItem | null>(null);

  // Queries
  const { data: stats, isLoading: statsLoading } = useAuditLogsStats();
  const { data: errorLogs = [], isLoading: errorsLoading } = useSystemErrorLogsList({
    search: errorSearch,
    severity: errorSeverity,
    isResolved: errorStatus === 'all' ? undefined : errorStatus === 'resolved',
  });
  const { data: auditLogs = [], isLoading: auditsLoading } = useAuditLogsList({
    search: auditSearch,
    action: auditAction,
    entityType: auditEntity,
  });

  const resolveMutation = useResolveErrorLog();

  // Export functions
  const exportToJSON = (data: unknown, filename: string) => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('JSON faylı yükləndi');
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-rose-500 hover:bg-rose-600 text-white gap-1"><AlertTriangle className="w-3 h-3" /> Kritik</Badge>;
      case 'warning':
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white gap-1">Xəbərdarlıq</Badge>;
      default:
        return <Badge variant="secondary" className="gap-1 border-border">Xəta</Badge>;
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'CREATE':
        return <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300">Yaratma</Badge>;
      case 'UPDATE':
        return <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-300">Yeniləmə</Badge>;
      case 'DELETE':
        return <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-300">Silinmə</Badge>;
      case 'ROLE_CHANGE':
        return <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-300">Rol Dəyişimi</Badge>;
      case 'PERMISSION_CHANGE':
        return <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300">İcazə</Badge>;
      case 'AUTH':
        return <Badge className="bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-300">Giriş/Çıxış</Badge>;
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit və Sistem Logları"
        description="Sistem xətaları, istifadəçi əməliyyatları və təhlükəsizlik tarixçəsinin monitorinqi"
      >
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              exportToJSON(
                activeTab === 'errors' ? errorLogs : auditLogs,
                activeTab === 'errors' ? 'system-error-logs' : 'audit-logs'
              )
            }
          >
            <Download className="h-4 w-4 mr-2" />
            Eksport (JSON)
          </Button>
        </div>
      </PageHeader>

      {/* ── 1. Metric Cards ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Unresolved Errors */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Aktiv Xətalar</CardTitle>
            <Bug className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {stats?.unresolvedErrors ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">həll gözləyən texniki xəta</p>
          </CardContent>
        </Card>

        {/* Critical Errors */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Kritik Qəzalar</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400">
              {stats?.criticalErrors ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">React crash & bloklayıcı xətalar</p>
          </CardContent>
        </Card>

        {/* 24h Errors */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Son 24 Saat Xətaları</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {stats?.errors24h ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">qeydə alınmış hadisə</p>
          </CardContent>
        </Card>

        {/* 24h Audit Events */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">24 Saat Əməliyyatları</CardTitle>
            <History className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {stats?.audits24h ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">istifadəçi & admin əməliyyatı</p>
          </CardContent>
        </Card>
      </div>

      {/* ── 2. Tabs Section ────────────────────────────────────── */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'errors' | 'audit')} className="space-y-6">
        <TabsList className="grid w-full sm:w-auto grid-cols-2 max-w-md">
          <TabsTrigger value="errors" className="gap-2">
            <Bug className="h-4 w-4" />
            Sistem Xətaları
            {(stats?.unresolvedErrors ?? 0) > 0 && (
              <Badge variant="destructive" className="h-4 px-1 text-[10px]">
                {stats!.unresolvedErrors}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-2">
            <History className="h-4 w-4" />
            Əməliyyat Auditi
          </TabsTrigger>
        </TabsList>

        {/* ── Tab 1: System Errors ── */}
        <TabsContent value="errors" className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-xl border border-border">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Xəta mətni, komponent və ya URL..."
                value={errorSearch}
                onChange={(e) => setErrorSearch(e.target.value)}
                className="pl-8 h-9 text-xs"
              />
            </div>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Select value={errorSeverity} onValueChange={setErrorSeverity}>
                <SelectTrigger className="h-9 text-xs w-32">
                  <SelectValue placeholder="Şiddət" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Bütün Şiddətlər</SelectItem>
                  <SelectItem value="critical">🔴 Kritik</SelectItem>
                  <SelectItem value="error">🟠 Xəta</SelectItem>
                  <SelectItem value="warning">🟡 Xəbərdarlıq</SelectItem>
                </SelectContent>
              </Select>

              <Select value={errorStatus} onValueChange={setErrorStatus}>
                <SelectTrigger className="h-9 text-xs w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Bütün Statuslar</SelectItem>
                  <SelectItem value="unresolved">⏳ Həll Olunmamış</SelectItem>
                  <SelectItem value="resolved">✓ Həll Edilmiş</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Errors Table */}
          <Card className="border-border/60 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
                  <tr>
                    <th className="p-3 w-10 text-center">Status</th>
                    <th className="p-3">Şiddət</th>
                    <th className="p-3">Xəta Mesajı</th>
                    <th className="p-3">Komponent / Səhifə</th>
                    <th className="p-3">İstifadəçi</th>
                    <th className="p-3">Tarix</th>
                    <th className="p-3 text-right">Əməliyyat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {errorsLoading ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-muted-foreground">
                        Xətalar yüklənir...
                      </td>
                    </tr>
                  ) : errorLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-muted-foreground">
                        <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2 opacity-60" />
                        Heç bir sistem xətası tapılmadı. Sistem stabil işləyir!
                      </td>
                    </tr>
                  ) : (
                    errorLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              resolveMutation.mutate({
                                errorId: log.id,
                                isResolved: !log.is_resolved,
                              })
                            }
                            title={log.is_resolved ? 'Həll edilib (Açmaq üçün klikləyin)' : 'Həll olunmayıb (Həll edildi etmək üçün klikləyin)'}
                            className="hover:scale-110 transition-transform"
                          >
                            {log.is_resolved ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-muted-foreground hover:text-emerald-500" />
                            )}
                          </button>
                        </td>
                        <td className="p-3">{getSeverityBadge(log.severity)}</td>
                        <td className="p-3 max-w-xs font-mono font-medium text-foreground truncate" title={log.message}>
                          {log.message}
                        </td>
                        <td className="p-3">
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground">{log.component_name || 'Global'}</span>
                            <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[180px]" title={log.url_path}>
                              {log.url_path}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {log.profiles?.full_name || 'Anonim / Sistem'}
                        </td>
                        <td className="p-3 text-muted-foreground whitespace-nowrap">
                          {new Date(log.created_at).toLocaleString('az-AZ')}
                        </td>
                        <td className="p-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedError(log)}
                            className="h-7 text-xs px-2"
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" /> Detal
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* ── Tab 2: Audit Trail ── */}
        <TabsContent value="audit" className="space-y-4">
          {/* Audit Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-xl border border-border">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Açıqlama, istifadəçi və ya obyekt axtar..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                className="pl-8 h-9 text-xs"
              />
            </div>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Select value={auditAction} onValueChange={setAuditAction}>
                <SelectTrigger className="h-9 text-xs w-32">
                  <SelectValue placeholder="Əməliyyat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Bütün Əməliyyatlar</SelectItem>
                  <SelectItem value="CREATE">Yaratma</SelectItem>
                  <SelectItem value="UPDATE">Yeniləmə</SelectItem>
                  <SelectItem value="DELETE">Silinmə</SelectItem>
                  <SelectItem value="ROLE_CHANGE">Rol Dəyişimi</SelectItem>
                  <SelectItem value="PERMISSION_CHANGE">İcazə Dəyişimi</SelectItem>
                  <SelectItem value="AUTH">Giriş / Çıxış</SelectItem>
                </SelectContent>
              </Select>

              <Select value={auditEntity} onValueChange={setAuditEntity}>
                <SelectTrigger className="h-9 text-xs w-32">
                  <SelectValue placeholder="Obyekt" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Bütün Obyektlər</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="question">Sual</SelectItem>
                  <SelectItem value="user">İstifadəçi</SelectItem>
                  <SelectItem value="role">Rol</SelectItem>
                  <SelectItem value="permission">İcazə</SelectItem>
                  <SelectItem value="category">Kateqoriya</SelectItem>
                  <SelectItem value="ai_config">AI Konfiq</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Audit Table */}
          <Card className="border-border/60 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
                  <tr>
                    <th className="p-3">Hadisə</th>
                    <th className="p-3">Obyekt</th>
                    <th className="p-3">Açıqlama</th>
                    <th className="p-3">İstifadəçi</th>
                    <th className="p-3">Tarix</th>
                    <th className="p-3 text-right">Dəyişiklik</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {auditsLoading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        Audit qeydləri yüklənir...
                      </td>
                    </tr>
                  ) : auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        Heç bir audit qeydi tapılmadı.
                      </td>
                    </tr>
                  ) : (
                    auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                        <td className="p-3">{getActionBadge(log.action)}</td>
                        <td className="p-3 font-semibold text-foreground">
                          <span className="bg-muted px-2 py-0.5 rounded font-mono text-[11px]">
                            {log.entity_type} {log.entity_id ? `(#${log.entity_id.slice(0, 6)})` : ''}
                          </span>
                        </td>
                        <td className="p-3 text-foreground font-medium max-w-sm truncate" title={log.description}>
                          {log.description}
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {log.profiles?.full_name || 'Sistem / Anonim'}
                        </td>
                        <td className="p-3 text-muted-foreground whitespace-nowrap">
                          {new Date(log.created_at).toLocaleString('az-AZ')}
                        </td>
                        <td className="p-3 text-right">
                          {(log.old_values || log.new_values) ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedAudit(log)}
                              className="h-7 text-xs px-2"
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" /> Dəyişiklik
                            </Button>
                          ) : (
                            <span className="text-[10px] text-muted-foreground italic">Məlumat yoxdur</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Error Detail Dialog ────────────────────────────────── */}
      <Dialog open={!!selectedError} onOpenChange={(open) => !open && setSelectedError(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              {selectedError && getSeverityBadge(selectedError.severity)}
              <DialogTitle className="text-base font-mono break-all">{selectedError?.message}</DialogTitle>
            </div>
            <DialogDescription className="text-xs">
              Xəta ID: {selectedError?.id} • Qeydə alınıb: {selectedError && new Date(selectedError.created_at).toLocaleString('az-AZ')}
            </DialogDescription>
          </DialogHeader>

          {selectedError && (
            <div className="space-y-4 text-xs">
              {/* Meta information */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-muted/40 rounded-lg border">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Komponent:</span>
                  <span className="font-semibold text-foreground">{selectedError.component_name || 'Global'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">URL Marşrutu:</span>
                  <span className="font-mono text-foreground">{selectedError.url_path}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">İstifadəçi:</span>
                  <span className="text-foreground">{selectedError.profiles?.full_name || 'Anonim'}</span>
                </div>
                {selectedError.device_info && (
                  <>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Brauzer:</span>
                      <span className="text-foreground">{selectedError.device_info.browser} ({selectedError.device_info.os})</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Ekran Ölçüsü:</span>
                      <span className="text-foreground">{selectedError.device_info.screenWidth}x{selectedError.device_info.screenHeight}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Şəbəkə Vəziyyəti:</span>
                      <span className={selectedError.device_info.isOnline ? 'text-emerald-600' : 'text-rose-600 font-bold'}>
                        {selectedError.device_info.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Stack Trace */}
              {selectedError.stack_trace && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 font-semibold text-foreground">
                    <Terminal className="h-4 w-4 text-primary" />
                    <span>Stack Trace (Texniki Kod İzləməsi):</span>
                  </div>
                  <pre className="p-3 bg-slate-950 text-slate-100 dark:bg-black rounded-lg font-mono text-[11px] overflow-x-auto max-h-64 whitespace-pre-wrap leading-relaxed">
                    {selectedError.stack_trace}
                  </pre>
                </div>
              )}

              {/* Resolution Action */}
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-muted-foreground">
                  Status: {selectedError.is_resolved ? '✓ Həll edildi' : '⏳ Həll olunmayıb'}
                </span>
                <Button
                  variant={selectedError.is_resolved ? 'outline' : 'default'}
                  size="sm"
                  onClick={() => {
                    resolveMutation.mutate({
                      errorId: selectedError.id,
                      isResolved: !selectedError.is_resolved,
                    });
                    setSelectedError(null);
                  }}
                >
                  {selectedError.is_resolved ? 'Yenidən Aç' : '✓ Həll Edildi Olaraq Qeyd Et'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Audit Diff Dialog ──────────────────────────────────── */}
      <Dialog open={!!selectedAudit} onOpenChange={(open) => !open && setSelectedAudit(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              {selectedAudit && getActionBadge(selectedAudit.action)}
              <DialogTitle className="text-base">{selectedAudit?.description}</DialogTitle>
            </div>
            <DialogDescription className="text-xs">
              Obyekt: {selectedAudit?.entity_type} • Tarix: {selectedAudit && new Date(selectedAudit.created_at).toLocaleString('az-AZ')}
            </DialogDescription>
          </DialogHeader>

          {selectedAudit && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedAudit.old_values && (
                  <div className="space-y-1">
                    <span className="font-semibold text-rose-600 block">Köhnə Dəyərlər (Old):</span>
                    <pre className="p-3 bg-rose-500/10 border border-rose-200 dark:border-rose-900/40 rounded-lg font-mono text-[11px] overflow-x-auto max-h-56">
                      {JSON.stringify(selectedAudit.old_values, null, 2)}
                    </pre>
                  </div>
                )}
                {selectedAudit.new_values && (
                  <div className="space-y-1">
                    <span className="font-semibold text-emerald-600 block">Yeni Dəyərlər (New):</span>
                    <pre className="p-3 bg-emerald-500/10 border border-emerald-200 dark:border-emerald-900/40 rounded-lg font-mono text-[11px] overflow-x-auto max-h-56">
                      {JSON.stringify(selectedAudit.new_values, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
