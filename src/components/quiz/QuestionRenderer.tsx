import React from 'react';
import { Question } from '@/hooks/useQuestions';
import { Textarea } from '@/components/ui/textarea';

// Renderers
import { MediaRenderer } from './renderers/MediaRenderer';
import { MultipleChoiceRenderer } from './renderers/MultipleChoiceRenderer';
import { MultipleSelectRenderer } from './renderers/MultipleSelectRenderer';
import { TrueFalseRenderer } from './renderers/TrueFalseRenderer';
import { NumericalRenderer } from './renderers/NumericalRenderer';
import { ShortAnswerRenderer } from './renderers/ShortAnswerRenderer';
import { EssayRenderer } from './renderers/EssayRenderer';
import { FillBlankRenderer } from './renderers/FillBlankRenderer';
import { CodeRenderer } from './renderers/CodeRenderer';
import { OrderingRenderer } from './renderers/OrderingRenderer';
import { MatchingRenderer } from './renderers/MatchingRenderer';
import { HotspotRenderer } from './renderers/HotspotRenderer';
import { FeedbackRenderer } from './renderers/FeedbackRenderer';

interface Props {
  question: Question;
  value: string;
  onChange: (val: string) => void;
  showFeedback?: boolean;
  disabled?: boolean;
  feedbackEnabled?: boolean; // quiz.show_feedback flag — false olduqda FeedbackRenderer gizlənir
}

export function QuestionRenderer({
  question,
  value,
  onChange,
  showFeedback,
  disabled,
  feedbackEnabled = true,
}: Props) {
  
  const renderContent = () => {
    const commonProps = {
      question,
      value,
      onChange,
      disabled: disabled || showFeedback,
      showFeedback,
    };

    switch (question.question_type) {
      case 'multiple_choice':
        return <MultipleChoiceRenderer {...commonProps} />;
      
      case 'multiple_select':
        return <MultipleSelectRenderer {...commonProps} />;

      case 'true_false':
        return <TrueFalseRenderer {...commonProps} />;

      case 'numerical':
        return <NumericalRenderer {...commonProps} />;

      case 'short_answer':
        return <ShortAnswerRenderer {...commonProps} />;

      case 'essay':
        return <EssayRenderer {...commonProps} />;

      case 'fill_blank':
        return <FillBlankRenderer {...commonProps} />;

      case 'code':
        return <CodeRenderer {...commonProps} />;

      case 'ordering':
        return <OrderingRenderer {...commonProps} />;

      case 'matching':
        return <MatchingRenderer {...commonProps} />;

      case 'hotspot':
        return <HotspotRenderer {...commonProps} />;

      case 'video':
      case 'model_3d':
        return (
          <ShortAnswerRenderer 
            {...commonProps} 
            placeholder={question.question_type === 'model_3d' ? "3D əsasında cavabınız..." : "Sizin cavabınız..."}
          />
        );

      default:
        return (
          <Textarea
            className="min-h-[120px] rounded-xl border-2 border-primary/5 focus:border-primary"
            disabled={disabled || showFeedback}
            placeholder="Cavabınız..."
            value={value}
            onChange={e => onChange(e.target.value)}
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      <MediaRenderer question={question} />
      {renderContent()}
      {showFeedback && feedbackEnabled && <FeedbackRenderer question={question} value={value} />}
    </div>
  );
}
