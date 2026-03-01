export type AppRole = 'admin' | 'teacher' | 'student';

export interface Profile {
    full_name: string | null;
    avatar_url: string | null;
}
