import { Button } from '@/components/ui/button';
import { History, Sparkles, Trash2 } from 'lucide-react';
import { GenerationSession } from '@/hooks/useAIAssistant';

interface AIHistoryTabProps {
  sessions: GenerationSession[];
  maxSessions: number;
  onLoad: (session: GenerationSession) => void;
  onDeleteSession: (id: string) => void;
  onClearAll: () => void;
}

export function AIHistoryTab({
  sessions,
  maxSessions,
  onLoad,
  onDeleteSession,
  onClearAll,
}: AIHistoryTabProps) {
  return (
    <div className="rounded-2xl bg-gradient-card border border-border/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
            <History className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">Tarixçə</h3>
            <p className="text-xs text-muted-foreground">Son {maxSessions} generasiya sessiyası</p>
          </div>
        </div>
        {sessions.length > 0 && (
          <Button variant="outline" size="sm" onClick={onClearAll}>
            <Trash2 className="h-4 w-4 mr-1" /> Hamısını Sil
          </Button>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Sparkles className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">Hələ heç bir generasiya yoxdur.</p>
          <p className="text-sm text-muted-foreground/70">
            Sual yaratdıqdan sonra burada görünəcək.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="rounded-xl border border-border/50 bg-background/50"
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <span className="text-sm font-bold text-primary">{session.questionCount}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">{session.topic}</p>
                    <p className="text-xs text-muted-foreground">
                      {session.subject} ·{' '}
                      {new Date(session.createdAt).toLocaleDateString('az-AZ', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <Button variant="outline" size="sm" onClick={() => onLoad(session)}>
                    Yüklə
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDeleteSession(session.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
