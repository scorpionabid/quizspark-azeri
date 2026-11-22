import React from "react";
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSubjects, getStoredCustomSubjects, saveStoredCustomSubject, removeStoredCustomSubject } from "@/hooks/useSubjects";
import { DEFAULT_SUBJECTS } from "@/lib/constants/subjects";

// Mock supabase
vi.mock("@/integrations/supabase/client", () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                not: vi.fn(() => Promise.resolve({ data: [{ subject: "Dövlət İdarəçiliyi" }], error: null }))
            }))
        }))
    }
}));

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    return ({ children }: { children: React.ReactNode }) => (
        React.createElement(QueryClientProvider, { client: queryClient }, children)
    );
};

describe("useSubjects hook & helpers", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it("should retrieve default subjects when storage is empty", () => {
        const stored = getStoredCustomSubjects();
        expect(stored).toEqual([]);
    });

    it("should persist and read custom subjects via helper functions", () => {
        saveStoredCustomSubject("Konstitusiya Hüququ");
        expect(getStoredCustomSubjects()).toContain("Konstitusiya Hüququ");

        // Duplication prevention
        saveStoredCustomSubject("konstitusiya hüququ");
        expect(getStoredCustomSubjects().length).toBe(1);

        removeStoredCustomSubject("Konstitusiya Hüququ");
        expect(getStoredCustomSubjects()).not.toContain("Konstitusiya Hüququ");
    });

    it("should render subjects list containing default subjects and allow adding new custom subject", async () => {
        const { result } = renderHook(() => useSubjects(), { wrapper: createWrapper() });

        // Initial check includes default subjects
        for (const defSub of DEFAULT_SUBJECTS) {
            expect(result.current.subjects).toContain(defSub);
        }

        // Add custom subject via hook
        act(() => {
            result.current.addCustomSubject("Vergi Qanunvericiliyi");
        });

        expect(result.current.subjects).toContain("Vergi Qanunvericiliyi");
        expect(result.current.customSubjects).toContain("Vergi Qanunvericiliyi");

        // Remove custom subject
        act(() => {
            result.current.removeCustomSubject("Vergi Qanunvericiliyi");
        });

        expect(result.current.customSubjects).not.toContain("Vergi Qanunvericiliyi");
    });
});
