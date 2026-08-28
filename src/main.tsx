import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { loggerService } from "./services/loggerService";

// Global uncaught error listener
window.addEventListener("error", (event) => {
  if (event.error) {
    void loggerService.logError({
      message: event.message || "Global brauzer xətası",
      error: event.error,
      stackTrace: event.error?.stack,
      urlPath: window.location.pathname,
      severity: "error",
      errorType: "runtime_error",
    });
  }
});

// Global unhandled promise rejection listener
window.addEventListener("unhandledrejection", (event) => {
  const reason = event.reason;
  const message =
    reason instanceof Error
      ? reason.message
      : typeof reason === "string"
      ? reason
      : "Unhandled Promise Rejection";

  void loggerService.logError({
    message: `[Async Rejection] ${message}`,
    error: reason instanceof Error ? reason : undefined,
    stackTrace: reason instanceof Error ? reason.stack : undefined,
    urlPath: window.location.pathname,
    severity: "warning",
    errorType: "unhandled_rejection",
  });
});

createRoot(document.getElementById("root")!).render(<App />);
