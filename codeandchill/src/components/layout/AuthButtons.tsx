import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function AuthButtons() {
  return (
    <div className="flex items-center gap-4 md:gap-6">
      {/* Log In Button */}
      <Button
        variant="outline"
        size="md"
        className="min-w-[110px] rounded-lg font-semibold border border-cyan-500 text-cyan-400
                   hover:bg-cyan-500/10 hover:text-cyan-300 shadow-neon hover:shadow-neon
                   transition-all duration-300"
        asChild
      >
        <Link to="/login" aria-label="Log in to your account">
          Log In
        </Link>
      </Button>

      {/* Sign Up Button */}
      <Button
        size="md"
        className="min-w-[110px] rounded-lg font-semibold
                   bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500
                   text-white shadow-neon hover:shadow-neon-lg
                   hover:scale-[1.03] transition-all duration-300"
        asChild
      >
        <Link to="/signup" aria-label="Create a new account">
          Sign Up
        </Link>
      </Button>
    </div>
  );
}
