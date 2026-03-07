import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock Supabase client
vi.mock("@/integrations/supabase/client", () => ({
    supabase: {
        auth: {
            signInWithPassword: vi.fn(),
            signUp: vi.fn(),
            signInWithOAuth: vi.fn(),
            resetPasswordForEmail: vi.fn(),
            onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
            getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
            signOut: vi.fn(),
        },
        from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn(),
            insert: vi.fn(),
            update: vi.fn(),
        })),
        rpc: vi.fn(),
    },
}));

// Mock window.location
Object.defineProperty(window, "location", {
    value: {
        origin: "http://localhost:3005",
        pathname: "/",
    },
    writable: true,
});
