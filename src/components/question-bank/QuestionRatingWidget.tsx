import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useSubmitRating } from '@/hooks/useQuestionRatings';

interface Props {
    questionBankId?: string;
    quizQuestionId?: string;
    onRatingsSubmit?: () => void;
}

export function QuestionRatingWidget({ questionBankId, quizQuestionId, onRatingsSubmit }: Props) {
    const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5 | 0>(0);
    const [issueType, setIssueType] = useState<string | null>(null);
    const [comment, setComment] = useState('');
    const { mutate: submitRating, isPending } = useSubmitRating();

    const handleRating = (value: number) => {
        setRating(value as 1 | 2 | 3 | 4 | 5);
        if (value === 5) setIssueType('great');
    };

    const handleSubmit = () => {
        if (rating === 0) return;
        submitRating({
            questionBankId,
            quizQuestionId,
            rating,
            issueType: issueType as 'confusing' | 'error' | 'too_easy' | 'too_hard' | 'great' | null,
            comment
        }, {
            onSuccess: () => {
                if (onRatingsSubmit) onRatingsSubmit();
            }
        });
    };

    return (
        <div className="p-4 border rounded-md bg-muted/20">
            <h4 className="font-semibold mb-2">Bu sual necə idi?</h4>
            <div className="flex space-x-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => handleRating(star)}
                        className={`transition-colors ${rating >= star ? 'text-yellow-500' : 'text-gray-300'
                            }`}
                    >
                        <Star className="w-6 h-6 fill-current" />
                    </button>
                ))}
            </div>

            {rating > 0 && rating < 5 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {['confusing', 'error', 'too_easy', 'too_hard'].map((type) => (
                        <Button
                            key={type}
                            variant={issueType === type ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setIssueType(type)}
                        >
                            {type === 'confusing' ? 'Başa düşülməz' :
                                type === 'error' ? 'Xətalıdır' :
                                    type === 'too_easy' ? 'Çox asan' : 'Çox çətin'}
                        </Button>
                    ))}
                </div>
            )}

            {rating > 0 && (
                <>
                    <Textarea
                        placeholder="Şərh (isteğe bağlı)..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="mb-4 text-sm"
                    />
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => { if (onRatingsSubmit) onRatingsSubmit(); }}>Keç</Button>
                        <Button onClick={handleSubmit} disabled={isPending}>Göndər</Button>
                    </div>
                </>
            )}
        </div>
    );
}
