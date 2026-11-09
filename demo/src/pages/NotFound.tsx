import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="surface-panel max-w-md p-8 text-center">
        <div className="text-5xl font-extrabold text-primary">404</div>
        <h1 className="mt-3 text-xl font-bold">Η σελίδα δεν βρέθηκε</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Η διαδρομή «{location.pathname}» δεν υπάρχει σε αυτή την επίδειξη.
        </p>
        <Button asChild variant="hero" className="mt-5">
          <Link to="/">Επιστροφή στην επίδειξη</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
