import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code } from "lucide-react";

interface AuthPageProps {
  login: () => void;
}

export function AuthPage({ login }: AuthPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  // Default tab from query ?tab=signup or login
  const params = new URLSearchParams(location.search);
  const defaultTab = params.get("tab") === "signup" ? "signup" : "login";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleAuth = async (type: "login" | "signup") => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:3001/api/auth/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Authentication failed");

      localStorage.setItem("token", data.token);
      login();
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4 bg-gradient-to-br from-lime-100 via-gray-100 to-cyan-100">
      <Tabs defaultValue={defaultTab} className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 text-2xl font-bold text-cyan-900">
            <Code className="h-7 w-7 text-cyan-700" />
            <span>Code and Chill</span>
          </div>
        </div>
        <TabsList className="grid w-full grid-cols-2 bg-white/80 rounded-xl shadow-sm mb-4">
          <TabsTrigger value="login" className="rounded-xl data-[state=active]:bg-cyan-100 data-[state=active]:text-cyan-900">
            Log In
          </TabsTrigger>
          <TabsTrigger value="signup" className="rounded-xl data-[state=active]:bg-cyan-100 data-[state=active]:text-cyan-900">
            Sign Up
          </TabsTrigger>
        </TabsList>

        {/* Login */}
        <TabsContent value="login">
          <Card className="bg-white/90 rounded-2xl shadow-lg border border-cyan-100">
            <CardHeader>
              <CardTitle className="text-cyan-900">Welcome Back</CardTitle>
              <CardDescription className="text-cyan-800/90">
                Enter your credentials to access your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-cyan-800">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required className="bg-white border border-cyan-200" onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-cyan-800">Password</Label>
                <Input id="password" type="password" required className="bg-white border border-cyan-200" onChange={handleChange} />
              </div>
              <Button onClick={() => handleAuth("login")} className="w-full bg-cyan-700 hover:bg-cyan-800 text-white" disabled={loading}>
                {loading ? "Logging In..." : "Log In"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sign Up */}
        <TabsContent value="signup">
          <Card className="bg-white/90 rounded-2xl shadow-lg border border-cyan-100">
            <CardHeader>
              <CardTitle className="text-cyan-900">Create an Account</CardTitle>
              <CardDescription className="text-cyan-800/90">
                Enter your details below to start your journey.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-cyan-800">Full Name</Label>
                <Input id="name" placeholder="Your Name" required className="bg-white border border-cyan-200" onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-cyan-800">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required className="bg-white border border-cyan-200" onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-cyan-800">Password</Label>
                <Input id="password" type="password" required className="bg-white border border-cyan-200" onChange={handleChange} />
              </div>
              <Button onClick={() => handleAuth("signup")} className="w-full bg-cyan-700 hover:bg-cyan-800 text-white" disabled={loading}>
                {loading ? "Signing Up..." : "Sign Up"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
