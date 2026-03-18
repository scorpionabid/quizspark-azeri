import React from 'react';
import { Question } from '@/hooks/useQuestions';
import { QuestionVideoPlayer } from '../question-bank/QuestionVideoPlayer';
import { Question3DViewer } from '../question-bank/Question3DViewer';
import { MonitorPlay, Box, Music } from 'lucide-react';

interface MediaRendererProps {
  question: Question;
}

export const MediaRenderer: React.FC<MediaRendererProps> = ({ question }) => {
  return (
    <div className="space-y-4 mb-4">
      {(question.question_image_url ||
        (question.media_type === 'image' && question.media_url)) && (
        <img
          src={question.question_image_url || question.media_url!}
          alt="Sual şəkli"
          className="max-h-80 w-auto mx-auto rounded-2xl border-2 border-primary/10 shadow-lg object-contain bg-background/50"
        />
      )}

      {(question.question_type === 'video' || question.media_type === 'video') &&
        (question.video_url || question.media_url) && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/60 px-1">
              <MonitorPlay className="w-3 h-3" />
              <span>Video Material</span>
            </div>
            <QuestionVideoPlayer
              videoUrl={question.video_url || question.media_url!}
              startTime={question.video_start_time || undefined}
              endTime={question.video_end_time || undefined}
            />
          </div>
        )}

      {(question.question_type === 'model_3d' || question.model_3d_url) && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary/60 px-1">
            <Box className="w-3 h-3" />
            <span>3D Model</span>
          </div>
          <Question3DViewer modelUrl={question.model_3d_url || question.media_url!} />
        </div>
      )}

      {question.media_type === 'audio' && question.media_url && (
        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/60">
            <Music className="w-3 h-3" />
            <span>Səs Yazısı</span>
          </div>
          <audio src={question.media_url} controls className="w-full h-10" />
        </div>
      )}
    </div>
  );
};
