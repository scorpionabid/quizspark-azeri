export type AppRole = 'admin' | 'teacher' | 'student';

export type ProfileStatus = 'active' | 'inactive' | 'pending';

export type SubscriptionTier = 'vip' | 'quest';

export interface Profile {
    full_name: string | null;
    avatar_url: string | null;
    status: ProfileStatus | null;
    isProfileComplete: boolean;
    subscription_tier: SubscriptionTier;
}
