import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import { Code } from "lucide-react";

interface AuthPageProps {
  login: (token: string) => void;
}

export function AuthPage({ login }: AuthPageProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async (type: "login" | "signup") => {
    setLoading(true);
    setError(null);

    const endpoint =
      type === "login"
        ? "http://localhost:3001/api/auth/login"
        : "http://localhost:3001/api/auth/signup";

    const payload =
      type === "login" ? { email, password } : { name, email, password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "An unknown error occurred.");
      }

      login(data.token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 bg-gradient-to-br from-gray-900 via-gray-950 to-black">
      <Tabs defaultValue="login" className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
            <Code className="h-7 w-7" />
            <span>Code & Chill</span>
          </div>
        </div>

        <TabsList className="grid w-full grid-cols-2 border-b border-gray-800">
          <TabsTrigger
            className="text-gray-300 hover:text-cyan-400 data-[state=active]:text-cyan-400"
            value="login"
          >
            Log In
          </TabsTrigger>
          <TabsTrigger
            className="text-gray-300 hover:text-cyan-400 data-[state=active]:text-cyan-400"
            value="signup"
          >
            Sign Up
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Card className="bg-gray-900/80 border border-gray-700 shadow-neon rounded-2xl">
            <CardHeader>
              <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-gray-300">
                Enter your credentials to access your account.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-login" className="text-gray-200">
                  Email
                </Label>
                <Input
                  id="email-login"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-800 text-gray-100 border-gray-700 focus:border-cyan-400 focus:ring-cyan-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-login" className="text-gray-200">
                  Password
                </Label>
                <Input
                  id="password-login"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-800 text-gray-100 border-gray-700 focus:border-cyan-400 focus:ring-cyan-400"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 font-semibold">{error}</p>
              )}

              <Button
                onClick={() => handleAuth("login")}
                disabled={loading}
                className="w-full bg-cyan-700 hover:bg-cyan-600 text-white font-bold shadow-neon transition-all duration-300"
              >
                {loading ? "Logging In..." : "Log In"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signup">
          <Card className="bg-gray-900/80 border border-gray-700 shadow-neon rounded-2xl">
            <CardHeader>
              <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                Create an Account
              </CardTitle>
              <CardDescription className="text-gray-300">
                Enter your details to start your learning journey.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-200">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-gray-800 text-gray-100 border-gray-700 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-signup" className="text-gray-200">
                  Email
                </Label>
                <Input
                  id="email-signup"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-800 text-gray-100 border-gray-700 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-signup" className="text-gray-200">
                  Password
                </Label>
                <Input
                  id="password-signup"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-800 text-gray-100 border-gray-700 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 font-semibold">{error}</p>
              )}

              <Button
                onClick={() => handleAuth("signup")}
                disabled={loading}
                className="w-full bg-purple-700 hover:bg-purple-600 text-white font-bold shadow-neon transition-all duration-300"
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
