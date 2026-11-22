import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNotifications, type Notification } from "@/hooks/useNotifications";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { ReactNode } from "react";

const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    user_id: "user-123",
    title: "Yeni mesaj",
    description: "Sizə yeni dəstək mesajı gəldi.",
    type: "info",
    read: false,
    link: "/support",
    created_at: "2026-11-19T12:00:00Z",
  },
  {
    id: "notif-2",
    user_id: "user-123",
    title: "Yeni quiz",
    description: "Quiz əlavə edildi.",
    type: "quiz",
    read: false,
    link: "/quizzes",
    created_at: "2026-11-19T11:00:00Z",
  },
];

const mockUser = { id: "user-123" };
const mockToast = vi.fn();

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: mockUser,
  }),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => Promise.resolve({ data: mockNotifications, error: null })),
          })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() =>
          Object.assign(Promise.resolve({ error: null }), {
            eq: vi.fn(() => Promise.resolve({ error: null })),
          })
        ),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
    })),
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
    })),
    removeChannel: vi.fn(),
  },
}));

describe("useNotifications hook", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("should load notifications and mark single notification as read without error", async () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    await waitFor(() => {
      expect(result.current.notifications).toHaveLength(2);
    });
    expect(result.current.unreadCount).toBe(2);

    await act(async () => {
      await result.current.markAsRead("notif-1");
    });

    await waitFor(() => {
      expect(result.current.notifications.find((n) => n.id === "notif-1")?.read).toBe(true);
      expect(result.current.unreadCount).toBe(1);
    });
  });

  it("should mark all notifications as read and delete notification without error", async () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    await waitFor(() => {
      expect(result.current.notifications).toHaveLength(2);
    });

    await act(async () => {
      await result.current.markAllAsRead();
    });

    await waitFor(() => {
      expect(result.current.unreadCount).toBe(0);
    });

    await act(async () => {
      await result.current.deleteNotification("notif-2");
    });

    await waitFor(() => {
      expect(result.current.notifications).toHaveLength(1);
      expect(result.current.notifications[0].id).toBe("notif-1");
    });
  });
});
