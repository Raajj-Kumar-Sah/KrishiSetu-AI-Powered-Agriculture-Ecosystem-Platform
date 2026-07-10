import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase text-primary">404</p>
        <h1 className="mt-2 text-4xl font-extrabold">Page not found</h1>
        <p className="mt-3 text-muted-foreground">The route you opened is not part of the KrishiSetu frontend.</p>
        <Button asChild className="mt-6"><Link to="/">Return home</Link></Button>
      </div>
    </main>
  );
}
