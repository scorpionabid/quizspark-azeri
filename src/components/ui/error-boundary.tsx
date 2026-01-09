import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl bg-card/50 p-8 text-center">
          <AlertTriangle className="mb-4 h-16 w-16 text-destructive" />
          <h3 className="mb-2 text-xl font-semibold text-foreground">Xəta baş verdi</h3>
          <p className="mb-4 max-w-md text-muted-foreground">
            {this.state.error?.message || "Gözlənilməz xəta baş verdi. Zəhmət olmasa yenidən cəhd edin."}
          </p>
          <Button onClick={this.handleRetry} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Yenidən cəhd et
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
