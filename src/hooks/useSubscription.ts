import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionTier } from '@/types/auth';

export type SubscriptionFeature =
    | 'ai_assistant'
    | 'question_bank_write'
    | 'quiz_create_unlimited'
    | 'full_leaderboard'
    | 'vip_badge';

const QUEST_QUIZ_LIMIT = 3;

const VIP_FEATURES: SubscriptionFeature[] = [
    'ai_assistant',
    'question_bank_write',
    'quiz_create_unlimited',
    'full_leaderboard',
    'vip_badge',
];

export function useSubscription() {
    const { profile } = useAuth();

    const tier: SubscriptionTier = profile?.subscription_tier ?? 'quest';
    const isVip = tier === 'vip';

    const canAccess = (feature: SubscriptionFeature): boolean => {
        if (isVip) return true;
        // Quest users cannot access VIP-only features
        return !VIP_FEATURES.includes(feature);
    };

    return {
        tier,
        isVip,
        canAccess,
        questQuizLimit: QUEST_QUIZ_LIMIT,
    };
}
