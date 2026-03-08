import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { az } from "date-fns/locale";
import { MessageCircle, Reply, Edit2, Trash2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useComments, Comment } from "@/hooks/useComments";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface QuizCommentsProps {
  quizId: string;
}

export function QuizComments({ quizId }: QuizCommentsProps) {
  const { user } = useAuth();
  const { comments, isLoading, addComment, updateComment, deleteComment, isAdding } = useComments(quizId);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [replyContent, setReplyContent] = useState("");

  const canComment = !!user && user.role !== 'guest';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !canComment) return;
    addComment({ content: newComment.trim() });
    setNewComment("");
  };

  const handleReply = (parentId: string) => {
    if (!replyContent.trim() || !canComment) return;
    addComment({ content: replyContent.trim(), parentId });
    setReplyContent("");
    setReplyingTo(null);
  };

  const handleUpdate = (commentId: string) => {
    if (!editContent.trim()) return;
    updateComment({ commentId, content: editContent.trim() });
    setEditingComment(null);
    setEditContent("");
  };

  const startEdit = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-muted-foreground" />
          <span className="text-muted-foreground">Şərhlər yüklənir...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Şərhlər ({comments.length})</h3>
      </div>

      {/* New Comment Form */}
      {canComment ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Şərhinizi yazın..."
            className="min-h-[80px] resize-none"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={!newComment.trim() || isAdding} size="sm">
              <Send className="mr-2 h-4 w-4" />
              Göndər
            </Button>
          </div>
        </form>
      ) : (
        <p className="text-sm text-muted-foreground">
          Şərh yazmaq üçün daxil olun
        </p>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Hələ heç bir şərh yoxdur. İlk şərhi siz yazın!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={user?.id}
              canComment={canComment}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              handleReply={handleReply}
              editingComment={editingComment}
              editContent={editContent}
              setEditContent={setEditContent}
              startEdit={startEdit}
              handleUpdate={handleUpdate}
              setEditingComment={setEditingComment}
              deleteComment={deleteComment}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
  canComment: boolean;
  replyingTo: string | null;
  setReplyingTo: (id: string | null) => void;
  replyContent: string;
  setReplyContent: (content: string) => void;
  handleReply: (parentId: string) => void;
  editingComment: string | null;
  editContent: string;
  setEditContent: (content: string) => void;
  startEdit: (comment: Comment) => void;
  handleUpdate: (commentId: string) => void;
  setEditingComment: (id: string | null) => void;
  deleteComment: (id: string) => void;
  depth?: number;
}

function CommentItem({
  comment,
  currentUserId,
  canComment,
  replyingTo,
  setReplyingTo,
  replyContent,
  setReplyContent,
  handleReply,
  editingComment,
  editContent,
  setEditContent,
  startEdit,
  handleUpdate,
  setEditingComment,
  deleteComment,
  depth = 0,
}: CommentItemProps) {
  const isOwner = currentUserId === comment.user_id;
  const isEditing = editingComment === comment.id;
  const isReplying = replyingTo === comment.id;

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className={cn("space-y-3", depth > 0 && "ml-8 border-l-2 border-border/50 pl-4")}>
      <div className="rounded-2xl bg-muted/50 p-4 border border-border/50 shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8 ring-2 ring-background">
            <AvatarImage src={comment.profile?.avatar_url || undefined} />
            <AvatarFallback className="text-xs font-bold font-display bg-primary/20 text-primary">
              {getInitials(comment.profile?.full_name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-foreground">
                {comment.profile?.full_name || "İstifadəçi"}
              </span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-background/40 px-2 py-0.5 rounded-full border border-border/10">
                {formatDistanceToNow(new Date(comment.created_at), {
                  addSuffix: true,
                  locale: az
                })}
              </span>
            </div>

            {isEditing ? (
              <div className="mt-3 space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[80px] resize-none bg-background/50"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleUpdate(comment.id)}>
                    Yadda saxla
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingComment(null)}>
                    Ləğv et
                  </Button>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </p>
            )}

            {/* Actions */}
            {!isEditing && (
              <div className="mt-2 flex items-center gap-2">
                {canComment && depth < 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setReplyingTo(isReplying ? null : comment.id)}
                  >
                    <Reply className="mr-1 h-3 w-3" />
                    Cavab
                  </Button>
                )}
                {isOwner && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => startEdit(comment)}
                    >
                      <Edit2 className="mr-1 h-3 w-3" />
                      Redaktə
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-destructive hover:text-destructive"
                      onClick={() => deleteComment(comment.id)}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Sil
                    </Button>
                  </>
                )}
              </div>
            )}

            {/* Reply Form */}
            {isReplying && (
              <div className="mt-3 space-y-2">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Cavabınızı yazın..."
                  className="min-h-[60px] resize-none"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleReply(comment.id)}>
                    <Send className="mr-1 h-3 w-3" />
                    Göndər
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setReplyingTo(null)}>
                    Ləğv et
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              canComment={canComment}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              handleReply={handleReply}
              editingComment={editingComment}
              editContent={editContent}
              setEditContent={setEditContent}
              startEdit={startEdit}
              handleUpdate={handleUpdate}
              setEditingComment={setEditingComment}
              deleteComment={deleteComment}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
