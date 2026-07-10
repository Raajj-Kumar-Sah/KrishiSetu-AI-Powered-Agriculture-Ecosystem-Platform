import { Component } from "react";
import { Button } from "@/components/ui/button";

export class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-background p-6">
          <div className="max-w-md rounded-xl border bg-white p-6 text-center shadow-soft">
            <h1 className="text-xl font-bold">Something went wrong</h1>
            <p className="mt-2 text-sm text-muted-foreground">Refresh the page or return to the dashboard.</p>
            <Button className="mt-5" onClick={() => window.location.assign("/")}>Reload app</Button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
