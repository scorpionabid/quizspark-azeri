import { useState, useRef } from "react";
import {
  Upload,
  FileText,
  X,
  Loader2,
  CheckCircle,
  FileType2,
  FileSpreadsheet,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export interface UploadedDocument {
  id: string;
  fileName: string;
  content: string;
  fullContent: string;
  fileSize?: number;
  fileType?: string;
  active?: boolean;
}

interface DocumentUploaderProps {
  onDocumentProcessed: (document: UploadedDocument) => void;
  uploadedDocuments: UploadedDocument[];
  onRemoveDocument: (id: string) => void;
  onToggleDocument?: (id: string) => void;
  maxDocuments?: number;
}

type UploadStage = "idle" | "uploading" | "processing" | "done";

const FILE_ICONS: Record<string, typeof FileText> = {
  "application/pdf": FileType2,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": FileSpreadsheet,
  "text/plain": FileText,
};

function getFileIcon(type: string) {
  const Icon = FILE_ICONS[type] || FileText;
  return <Icon className="h-4 w-4" />;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const STAGE_LABELS: Record<UploadStage, string> = {
  idle: "",
  uploading: "Yüklənir...",
  processing: "Emal edilir...",
  done: "Hazır!",
};

const STAGE_PROGRESS: Record<UploadStage, number> = {
  idle: 0,
  uploading: 30,
  processing: 70,
  done: 100,
};

export function DocumentUploader({
  onDocumentProcessed,
  uploadedDocuments,
  onRemoveDocument,
  onToggleDocument,
  maxDocuments = 3,
}: DocumentUploaderProps) {
  const [uploadStage, setUploadStage] = useState<UploadStage>("idle");
  const [dragActive, setDragActive] = useState(false);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const isUploading = uploadStage === "uploading" || uploadStage === "processing";
  const canUploadMore = uploadedDocuments.length < maxDocuments;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    if (!canUploadMore) {
      toast({
        title: "Limit",
        description: `Maksimum ${maxDocuments} sənəd yükləyə bilərsiniz.`,
        variant: "destructive",
      });
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    const allowedExtensions = [".pdf", ".docx", ".txt"];
    const fileExt = "." + file.name.split(".").pop()?.toLowerCase();

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExt)) {
      toast({
        title: "Xəta",
        description: "Yalnız PDF, DOCX və TXT faylları dəstəklənir.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Xəta",
        description: "Fayl ölçüsü 10MB-dan böyük olmamalıdır.",
        variant: "destructive",
      });
      return;
    }

    setUploadStage("uploading");

    try {
      const formData = new FormData();
      formData.append("file", file);

      // simulate stage transition
      setTimeout(() => setUploadStage("processing"), 800);

      // Get current session token for authentication
      const { data: { session } } = await (await import("@/integrations/supabase/client")).supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("Sənəd yükləmək üçün daxil olmalısınız");
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-document`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Sənəd emal edilə bilmədi");
      }

      setUploadStage("done");

      const doc: UploadedDocument = {
        ...data.document,
        fileSize: file.size,
        fileType: file.type || fileExt,
        active: true,
      };

      onDocumentProcessed(doc);

      toast({
        title: "Uğurlu",
        description: `"${file.name}" sənədi uğurla yükləndi və emal edildi.`,
      });

      // reset after brief delay
      setTimeout(() => setUploadStage("idle"), 1500);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Xəta",
        description: error instanceof Error ? error.message : "Sənəd yüklənə bilmədi",
        variant: "destructive",
      });
      setUploadStage("idle");
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {canUploadMore && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          } ${isUploading ? "pointer-events-none opacity-60" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm font-medium">{STAGE_LABELS[uploadStage]}</p>
              <Progress value={STAGE_PROGRESS[uploadStage]} className="w-48 h-2" />
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className={uploadStage === "uploading" ? "text-primary font-medium" : ""}>
                  Yüklənir
                </span>
                <span>→</span>
                <span className={uploadStage === "processing" ? "text-primary font-medium" : ""}>
                  Emal
                </span>
                <span>→</span>
                <span className="text-muted-foreground">
                  Hazır
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  Sənədi buraya sürükləyin və ya{" "}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-primary hover:underline"
                  >
                    seçin
                  </button>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, DOCX, TXT (maks. 10MB) · {uploadedDocuments.length}/{maxDocuments} sənəd
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Uploaded Documents List */}
      {uploadedDocuments.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            Yüklənmiş sənədlər
            <span className="text-xs text-muted-foreground">
              ({uploadedDocuments.length}/{maxDocuments})
            </span>
          </h4>
          {uploadedDocuments.map((doc) => (
            <Card key={doc.id} className="bg-muted/50">
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    {/* Active toggle */}
                    {onToggleDocument && (
                      <Checkbox
                        checked={doc.active !== false}
                        onCheckedChange={() => onToggleDocument(doc.id)}
                        className="mt-1"
                      />
                    )}
                    <div className="flex-shrink-0 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-success" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {doc.fileType && getFileIcon(doc.fileType)}
                        <span className="text-sm font-medium truncate">{doc.fileName}</span>
                        {doc.fileSize && (
                          <span className="text-xs text-muted-foreground">
                            ({formatFileSize(doc.fileSize)})
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {doc.content}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() =>
                        setExpandedDoc(expandedDoc === doc.id ? null : doc.id)
                      }
                      title={expandedDoc === doc.id ? "Gizlət" : "Tam mətni göstər"}
                    >
                      {expandedDoc === doc.id ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onRemoveDocument(doc.id)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Full Content Preview */}
                {expandedDoc === doc.id && doc.fullContent && (
                  <div className="mt-3 border-t border-border/50 pt-3">
                    <Label className="text-xs font-medium mb-1 block">Sənəd məzmunu:</Label>
                    <ScrollArea className="h-48 rounded-md border bg-background p-3">
                      <pre className="text-xs whitespace-pre-wrap font-sans text-foreground">
                        {doc.fullContent}
                      </pre>
                    </ScrollArea>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Re-export Label to avoid missing import in preview area
function Label({ className, children, ...props }: React.HTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={className} {...props}>
      {children}
    </label>
  );
}
