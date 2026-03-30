import { useState, useEffect } from 'react';
import { Search, Share2, X, UserCheck, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  QuestionBankItem,
  TeacherProfile,
  useTeachersForSharing,
  useSharedByMe,
  useRevokeShare,
} from '@/hooks/useQuestionBank';

interface ShareQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questions: QuestionBankItem[];
  onShare: (recipientIds: string[], message?: string) => void;
  isSharing?: boolean;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function getInitials(name: string | null): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function ShareQuestionDialog({
  open,
  onOpenChange,
  questions,
  onShare,
  isSharing = false,
}: ShareQuestionDialogProps) {
  const [search, setSearch] = useState('');
  const [selectedTeachers, setSelectedTeachers] = useState<TeacherProfile[]>([]);
  const [message, setMessage] = useState('');

  const debouncedSearch = useDebounce(search, 300);
  const { data: teachers = [], isLoading: loadingTeachers } = useTeachersForSharing(debouncedSearch);

  // Show existing shares only for single question mode
  const singleQuestionId = questions.length === 1 ? questions[0].id : undefined;
  const { data: existingShares = [] } = useSharedByMe(singleQuestionId);
  const revokeShare = useRevokeShare();

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSearch('');
      setSelectedTeachers([]);
      setMessage('');
    }
  }, [open]);

  const toggleTeacher = (teacher: TeacherProfile) => {
    setSelectedTeachers((prev) =>
      prev.some((t) => t.user_id === teacher.user_id)
        ? prev.filter((t) => t.user_id !== teacher.user_id)
        : [...prev, teacher]
    );
  };

  const removeTeacher = (userId: string) => {
    setSelectedTeachers((prev) => prev.filter((t) => t.user_id !== userId));
  };

  const handleShare = () => {
    if (selectedTeachers.length === 0) return;
    onShare(
      selectedTeachers.map((t) => t.user_id),
      message.trim() || undefined
    );
  };

  // Filter out teachers already shared with (single question mode)
  const sharedWithIds = new Set(existingShares.map((s) => s.shared_with));
  const filteredTeachers = teachers.filter(
    (t) => !sharedWithIds.has(t.user_id)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            {questions.length === 1
              ? 'Sualı Paylaş'
              : `${questions.length} Sualı Paylaş`}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 flex-1 min-h-0">
          {/* Selected teachers chips */}
          {selectedTeachers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTeachers.map((t) => (
                <Badge
                  key={t.user_id}
                  variant="secondary"
                  className="flex items-center gap-1 pl-1 pr-2 py-1"
                >
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={t.avatar_url ?? undefined} />
                    <AvatarFallback className="text-[10px]">
                      {getInitials(t.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs">{t.full_name ?? t.email}</span>
                  <button
                    onClick={() => removeTeacher(t.user_id)}
                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Search teachers */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Müəllim axtar (ad və ya e-poçt)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Teacher list */}
          <ScrollArea className="flex-1 min-h-[180px] max-h-[220px] border rounded-md">
            {loadingTeachers ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Yüklənir...
              </div>
            ) : filteredTeachers.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                {search.length > 0 ? 'Nəticə tapılmadı' : 'Müəllim tapılmadı'}
              </div>
            ) : (
              <div className="p-1">
                {filteredTeachers.map((teacher) => {
                  const isSelected = selectedTeachers.some(
                    (t) => t.user_id === teacher.user_id
                  );
                  return (
                    <button
                      key={teacher.user_id}
                      onClick={() => toggleTeacher(teacher)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                        isSelected
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={teacher.avatar_url ?? undefined} />
                        <AvatarFallback className="text-xs">
                          {getInitials(teacher.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {teacher.full_name ?? 'Ad yoxdur'}
                        </p>
                        {teacher.email && (
                          <p className="text-xs text-muted-foreground truncate">
                            {teacher.email}
                          </p>
                        )}
                      </div>
                      {isSelected && (
                        <UserCheck className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          {/* Optional message */}
          <Textarea
            placeholder="İsteğe bağlı mesaj (məsələn: 'Bu mövzu üçün faydalı ola bilər')..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            className="resize-none"
          />

          {/* Existing shares (single question only) */}
          {singleQuestionId && existingShares.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Artıq paylaşılıb ({existingShares.length})
                </p>
                <div className="flex flex-col gap-1 max-h-[100px] overflow-y-auto">
                  {existingShares.map((share) => (
                    <div
                      key={share.id}
                      className="flex items-center justify-between text-xs px-2 py-1 rounded bg-muted/50"
                    >
                      <span className="truncate">
                        {(share.recipient as TeacherProfile | undefined)?.full_name ??
                          (share.recipient as TeacherProfile | undefined)?.email ??
                          share.shared_with}
                      </span>
                      <button
                        onClick={() => revokeShare.mutate(share.id)}
                        className="text-destructive hover:underline shrink-0 ml-2"
                        disabled={revokeShare.isPending}
                      >
                        Ləğv et
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Bağla
          </Button>
          <Button
            onClick={handleShare}
            disabled={selectedTeachers.length === 0 || isSharing}
          >
            {isSharing && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Paylaş ({selectedTeachers.length} müəllim)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
