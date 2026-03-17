import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Code2 } from 'lucide-react';

const CODE_LANGUAGES = [
    { value: 'python', label: 'Python' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'c', label: 'C' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'sql', label: 'SQL' },
    { value: 'html', label: 'HTML/CSS' },
    { value: 'bash', label: 'Bash/Shell' },
    { value: 'pseudocode', label: 'Psevdokod (Azərbaycanca)' },
    { value: 'other', label: 'Digər' },
] as const;

/**
 * Kod sualları üçün editor.
 * Dil seçimi, kod nümunəsi sahəsi və gözlənilən çıxış/cavab sahəsi.
 *
 * Dil `hint` sahəsinin önündə saxlanılır: "lang:python"
 * Kod nümunəsi: question_text ilə yanaşı `fill_blank_template` istifadə olunur
 * Gözlənilən cavab: correct_answer
 */
interface CodeQuestionEditorProps {
    codeLanguage: string;
    onLanguageChange: (lang: string) => void;
    codeSnippet: string;
    onCodeSnippetChange: (code: string) => void;
    correctAnswer: string;
    onCorrectAnswerChange: (answer: string) => void;
}

export function CodeQuestionEditor({
    codeLanguage,
    onLanguageChange,
    codeSnippet,
    onCodeSnippetChange,
    correctAnswer,
    onCorrectAnswerChange,
}: CodeQuestionEditorProps) {
    const languageLabel = CODE_LANGUAGES.find(l => l.value === codeLanguage)?.label ?? codeLanguage;

    return (
        <div className="space-y-4">
            {/* Dil seçimi */}
            <div className="space-y-2">
                <Label>Proqramlaşdırma Dili</Label>
                <Select value={codeLanguage || 'python'} onValueChange={onLanguageChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Dil seçin" />
                    </SelectTrigger>
                    <SelectContent>
                        {CODE_LANGUAGES.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                                {lang.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Kod nümunəsi */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="code-snippet">Kod Nümunəsi (isteğe bağlı)</Label>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded font-mono">
                        <Code2 className="h-3 w-3" />
                        {languageLabel}
                    </span>
                </div>
                <Textarea
                    id="code-snippet"
                    value={codeSnippet}
                    onChange={(e) => onCodeSnippetChange(e.target.value)}
                    placeholder={`# ${languageLabel} kodu bura yazın...\ndef example():\n    pass`}
                    rows={8}
                    className="font-mono text-sm leading-relaxed bg-neutral-950 dark:bg-neutral-950 text-green-400 dark:text-green-400 border-neutral-700 placeholder:text-neutral-600 resize-y"
                    spellCheck={false}
                />
                <p className="text-xs text-muted-foreground">
                    Tələbəyə göstəriləcək kod. Boş saxlasanız, sual mətni əsas olacaq.
                </p>
            </div>

            {/* Düzgün cavab / gözlənilən çıxış */}
            <div className="space-y-2">
                <Label htmlFor="code-answer">Düzgün Cavab / Gözlənilən Çıxış *</Label>
                <Input
                    id="code-answer"
                    value={correctAnswer}
                    onChange={(e) => onCorrectAnswerChange(e.target.value)}
                    placeholder="Məs: 42, True, [1, 2, 3], SyntaxError..."
                    className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                    Kodun çıxışı, qaytardığı dəyər, xəta tipi və ya seçilmiş cavab.
                </p>
            </div>
        </div>
    );
}
