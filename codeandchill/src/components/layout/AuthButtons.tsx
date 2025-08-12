import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function AuthButtons() {
  return (
    <div className="flex items-center gap-4 md:gap-6">
      <Button
        variant="outline"
        size="md"
        className="min-w-[110px] rounded-lg font-semibold border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground transition-colors duration-300"
        asChild
      >
        <Link to="/login" aria-label="Log in to your account">
          Log In
        </Link>
      </Button>
      <Button
        size="md"
        className="min-w-[110px] rounded-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300"
        asChild
      >
        <Link to="/signup" aria-label="Create a new account">
          Sign Up
        </Link>
      </Button>
    </div>
  );
}
