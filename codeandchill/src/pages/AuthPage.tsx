/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Code } from "lucide-react";
import { performFreshLogin } from "@/utils/cleanup";
import { TokenManager } from "@/utils/tokenManager";

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

    try {
      // Perform cleanup before login to avoid token conflicts
      await performFreshLogin();

      const endpoint =
        type === "login"
          ? "http://localhost:3001/api/auth/login"
          : "http://localhost:3001/api/auth/signup";
      const payload =
        type === "login" ? { email, password } : { name, email, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      // Use TokenManager for consistent token storage
      TokenManager.setToken(data.token);
      console.log('Token stored successfully');
      TokenManager.debugTokenStatus();
      
      login(data.token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 gradient-bg" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(139,92,246,0.1),transparent_70%)]" />
      </div>

      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Code className="h-12 w-12 text-blue-400" />
              <span className="heading-primary text-4xl">Code & Chill</span>
            </div>
            <p className="text-slate-400 text-lg">Professional Learning Platform</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="tabs-list grid w-full grid-cols-2 mb-8 h-14">
              <TabsTrigger value="login" className="tabs-trigger text-base font-medium">
                Log In
              </TabsTrigger>
              <TabsTrigger value="signup" className="tabs-trigger text-base font-medium">
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="tabs-content">
              <div className="glass-card">
                <div className="card-header text-center">
                  <h2 className="heading-secondary text-2xl mb-2">Welcome Back</h2>
                  <p className="text-slate-400">
                    Enter your credentials to access your account.
                  </p>
                </div>
                <div className="card-content space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="email-login" className="label">Email</Label>
                    <Input
                      id="email-login"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input h-12"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="password-login" className="label">Password</Label>
                    <Input
                      id="password-login"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input h-12"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  {error && (
                    <div className="p-4 rounded-xl bg-red-900/20 border border-red-700/30">
                      <p className="text-sm text-red-400 font-medium">{error}</p>
                    </div>
                  )}
                  <Button
                    onClick={() => handleAuth("login")}
                    disabled={loading}
                    className="btn btn-default w-full h-12 text-base font-semibold"
                  >
                    {loading ? "Logging In..." : "Log In"}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="tabs-content">
              <div className="glass-card">
                <div className="card-header text-center">
                  <h2 className="heading-secondary text-2xl mb-2">Create an Account</h2>
                  <p className="text-slate-400">
                    Enter your details to start your learning journey.
                  </p>
                </div>
                <div className="card-content space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="name-signup" className="label">Full Name</Label>
                    <Input
                      id="name-signup"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input h-12"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="email-signup" className="label">Email</Label>
                    <Input
                      id="email-signup"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input h-12"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="password-signup" className="label">Password</Label>
                    <Input
                      id="password-signup"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input h-12"
                      placeholder="Create a strong password"
                      required
                    />
                  </div>
                  {error && (
                    <div className="p-4 rounded-xl bg-red-900/20 border border-red-700/30">
                      <p className="text-sm text-red-400 font-medium">{error}</p>
                    </div>
                  )}
                  <Button
                    onClick={() => handleAuth("signup")}
                    disabled={loading}
                    className="btn btn-default w-full h-12 text-base font-semibold"
                  >
                    {loading ? "Signing Up..." : "Sign Up"}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}