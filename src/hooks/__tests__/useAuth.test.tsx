import { renderHook, act } from "@testing-library/react";
import { useAuth, AuthProvider } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { ReactNode } from "react";

// Helper to provide AuthProvider context
const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider>{children} </AuthProvider>
);

describe("useAuth hook", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should initialize with loading state", () => {
        const { result } = renderHook(() => useAuth(), { wrapper });
        expect(result.current.isLoading).toBe(true);
    });

    it("should sign in successfully", async () => {
        const mockSignIn = vi.mocked(supabase.auth.signInWithPassword);
        mockSignIn.mockResolvedValueOnce({ data: { user: {} as never, session: {} as never }, error: null });

        const { result } = renderHook(() => useAuth(), { wrapper });

        await act(async () => {
            const { error } = await result.current.signIn("test@example.com", "password123");
            expect(error).toBeNull();
        });

        expect(mockSignIn).toHaveBeenCalledWith({
            email: "test@example.com",
            password: "password123",
        });
    });

    it("should handle sign in error", async () => {
        const mockSignIn = vi.mocked(supabase.auth.signInWithPassword);
        mockSignIn.mockResolvedValueOnce({ data: { user: null, session: null }, error: new Error("Invalid credentials") as never });

        const { result } = renderHook(() => useAuth(), { wrapper });

        await act(async () => {
            const { error } = await result.current.signIn("test@example.com", "wrong");
            expect(error?.message).toBe("Invalid credentials");
        });
    });

    it("should sign up with metadata", async () => {
        const mockSignUp = vi.mocked(supabase.auth.signUp);
        mockSignUp.mockResolvedValueOnce({ data: { user: {} as never, session: null }, error: null });

        const { result } = renderHook(() => useAuth(), { wrapper });

        await act(async () => {
            const { error } = await result.current.signUp(
                "new@example.com",
                "password123",
                "Test User",
                "+994501234567",
                "student"
            );
            expect(error).toBeNull();
        });

        expect(mockSignUp).toHaveBeenCalledWith({
            email: "new@example.com",
            password: "password123",
            options: expect.objectContaining({
                data: {
                    full_name: "Test User",
                    phone: "+994501234567",
                    role: "student",
                },
            }),
        });
    });

    it("should select OAuth role", async () => {
        const mockRpc = vi.mocked(supabase.rpc);
        mockRpc.mockResolvedValueOnce({ data: null, error: null, count: null, status: 200, statusText: "OK" });

        const { result } = renderHook(() => useAuth(), { wrapper });

        await act(async () => {
            const { error } = await result.current.selectOAuthRole("teacher", "+994509998877");
            expect(error).toBeNull();
        });

        expect(mockRpc).toHaveBeenCalledWith("select_oauth_role", {
            p_role: "teacher",
            p_phone: "+994509998877",
        });
    });
});
