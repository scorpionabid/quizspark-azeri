import { DocumentUploader, UploadedDocument } from "@/components/ai/DocumentUploader";
import { DocumentQuizGenerator } from "@/components/ai/DocumentQuizGenerator";
import { GeneratedQuestion } from "@/components/quiz/EditableQuestionCard";
import { AIParameters } from "@/components/ai/AIParametersPanel";

interface AIDocumentSectionProps {
    uploadedDocuments: UploadedDocument[];
    onDocumentProcessed: (doc: UploadedDocument) => void;
    onRemoveDocument: (id: string) => void;
    onToggleDocument: (id: string) => void;
    onQuestionsGenerated: (questions: GeneratedQuestion[]) => void;
    aiParameters: AIParameters;
}

export function AIDocumentSection({
    uploadedDocuments,
    onDocumentProcessed,
    onRemoveDocument,
    onToggleDocument,
    onQuestionsGenerated,
    aiParameters
}: AIDocumentSectionProps) {
    return (
        <div className="rounded-2xl bg-gradient-card border border-border/50 p-6">
            <div className="mb-6">
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                    Sənəddən Sual Yaradın
                </h3>
                <p className="text-sm text-muted-foreground">
                    PDF, DOCX və ya TXT sənədləri yükləyin. Mövcud sualları çıxarın və ya yeni suallar yaradın.
                </p>
            </div>

            <DocumentUploader
                onDocumentProcessed={onDocumentProcessed}
                uploadedDocuments={uploadedDocuments}
                onRemoveDocument={onRemoveDocument}
                onToggleDocument={onToggleDocument}
                maxDocuments={3}
            />

            {uploadedDocuments.length > 0 && (
                <div className="mt-6">
                    <DocumentQuizGenerator
                        documents={uploadedDocuments}
                        onQuestionsGenerated={onQuestionsGenerated}
                        model={aiParameters.model}
                        temperature={aiParameters.temperature}
                    />
                </div>
            )}
        </div>
    );
}
