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
  const [confirmPassword, setConfirmPassword] = useState("");

  // Validation states
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  // Validation functions
  const validateName = (value: string): string => {
    if (!value.trim()) return "Name is required";
    if (value.trim().length < 2) return "Name must be at least 2 characters";
    if (value.trim().length > 50) return "Name must be less than 50 characters";
    if (!/^[a-zA-Z\s]+$/.test(value)) return "Name can only contain letters and spaces";
    return "";
  };

  const validateEmail = (value: string): string => {
    if (!value.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (value: string): string => {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    if (value.length > 128) return "Password must be less than 128 characters";
    if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter";
    if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
    if (!/[0-9]/.test(value)) return "Password must contain at least one number";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return "Password must contain at least one special character";
    return "";
  };

  const validateConfirmPassword = (value: string, passwordValue: string): string => {
    if (!value) return "Please confirm your password";
    if (value !== passwordValue) return "Passwords do not match";
    return "";
  };

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    if (strength <= 2) return { strength: 1, label: "Weak", color: "bg-red-500" };
    if (strength <= 3) return { strength: 2, label: "Fair", color: "bg-orange-500" };
    if (strength <= 4) return { strength: 3, label: "Good", color: "bg-yellow-500" };
    return { strength: 4, label: "Strong", color: "bg-green-500" };
  };

  // Handle field changes with validation
  const handleNameChange = (value: string) => {
    setName(value);
    if (touched.name) {
      setNameError(validateName(value));
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (touched.email) {
      setEmailError(validateEmail(value));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (touched.password) {
      setPasswordError(validatePassword(value));
    }
    if (touched.confirmPassword && confirmPassword) {
      setConfirmPasswordError(validateConfirmPassword(confirmPassword, value));
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (touched.confirmPassword) {
      setConfirmPasswordError(validateConfirmPassword(value, password));
    }
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched({ ...touched, [field]: true });
    
    switch (field) {
      case 'name':
        setNameError(validateName(name));
        break;
      case 'email':
        setEmailError(validateEmail(email));
        break;
      case 'password':
        setPasswordError(validatePassword(password));
        break;
      case 'confirmPassword':
        setConfirmPasswordError(validateConfirmPassword(confirmPassword, password));
        break;
    }
  };

  const handleAuth = async (type: "login" | "signup") => {
    // Validate all fields before submission
    if (type === "signup") {
      const nameErr = validateName(name);
      const emailErr = validateEmail(email);
      const passwordErr = validatePassword(password);
      const confirmPasswordErr = validateConfirmPassword(confirmPassword, password);

      setNameError(nameErr);
      setEmailError(emailErr);
      setPasswordError(passwordErr);
      setConfirmPasswordError(confirmPasswordErr);
      setTouched({ name: true, email: true, password: true, confirmPassword: true });

      if (nameErr || emailErr || passwordErr || confirmPasswordErr) {
        setError("Please fix all validation errors before submitting");
        return;
      }
    } else {
      const emailErr = validateEmail(email);
      const passwordErr = password ? "" : "Password is required";

      setEmailError(emailErr);
      setPasswordError(passwordErr);
      setTouched({ ...touched, email: true, password: true });

      if (emailErr || passwordErr) {
        setError("Please fix all validation errors before submitting");
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      // Perform cleanup before login to avoid token conflicts
      await performFreshLogin();

      const API_URL = import.meta.env.VITE_API_URL || '/api';
      const endpoint =
        type === "login"
          ? `${API_URL}/auth/login`
          : `${API_URL}/auth/signup`;
      const payload =
        type === "login" ? { email, password } : { name, email, password };

      console.log('Auth Request:', { endpoint, payload });

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log('Auth Response:', response.status, response.statusText);

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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      {/* Matching Homepage Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <Code className="h-14 w-14 text-purple-400" />
                <div className="absolute inset-0 blur-xl bg-purple-500/30 -z-10" />
              </div>
              <span className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Code & Chill
              </span>
            </div>
            <p className="text-slate-400 text-lg font-medium">
              Your Professional Learning Platform
            </p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-14 bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-1">
              <TabsTrigger 
                value="login" 
                className="text-base font-semibold rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300"
              >
                Log In
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className="text-base font-semibold rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-0">
              <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden">
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-indigo-500/10 rounded-2xl blur-xl -z-10" />
                
                <div className="p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-slate-400">
                      Enter your credentials to continue learning
                    </p>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="email-login" className="text-sm font-semibold text-slate-300">Email Address</Label>
                      <Input
                        id="email-login"
                        type="email"
                        value={email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        onBlur={() => handleBlur('email')}
                        className={`h-12 bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 transition-all ${emailError && touched.email ? 'border-red-500 focus:border-red-500' : ''}`}
                        placeholder="your.email@example.com"
                        required
                      />
                      {emailError && touched.email && (
                        <p className="text-sm text-red-400 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                          <span className="text-red-500">✕</span> {emailError}
                        </p>
                      )}
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="password-login" className="text-sm font-semibold text-slate-300">Password</Label>
                      <Input
                        id="password-login"
                        type="password"
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        onBlur={() => handleBlur('password')}
                        className={`h-12 bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 transition-all ${passwordError && touched.password ? 'border-red-500 focus:border-red-500' : ''}`}
                        placeholder="Enter your password"
                        required
                      />
                      {passwordError && touched.password && (
                        <p className="text-sm text-red-400 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                          <span className="text-red-500">✕</span> {passwordError}
                        </p>
                      )}
                    </div>
                    {error && (
                      <div className="p-4 rounded-xl bg-red-900/30 border border-red-500/30 backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
                        <p className="text-sm text-red-300 font-medium">{error}</p>
                      </div>
                    )}
                    <Button
                      onClick={() => handleAuth("login")}
                      disabled={loading || (touched.email && !!emailError) || (touched.password && !!passwordError)}
                      className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Logging In...
                        </span>
                      ) : "Log In"}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="mt-0">
              <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden relative">
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-indigo-500/10 rounded-2xl blur-xl -z-10" />
                
                <div className="p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                    <p className="text-slate-400">
                      Start your learning journey today
                    </p>
                  </div>
                  <div className="space-y-5">
                    <div className="space-y-3">
                      <Label htmlFor="name-signup" className="text-sm font-semibold text-slate-300">Full Name</Label>
                      <Input
                        id="name-signup"
                        value={name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        onBlur={() => handleBlur('name')}
                        className={`h-12 bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 transition-all ${nameError && touched.name ? 'border-red-500 focus:border-red-500' : ''}`}
                        placeholder="John Doe"
                        required
                      />
                      {nameError && touched.name && (
                        <p className="text-sm text-red-400 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                          <span className="text-red-500">✕</span> {nameError}
                        </p>
                      )}
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="email-signup" className="text-sm font-semibold text-slate-300">Email Address</Label>
                      <Input
                        id="email-signup"
                        type="email"
                        value={email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        onBlur={() => handleBlur('email')}
                        className={`h-12 bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 transition-all ${emailError && touched.email ? 'border-red-500 focus:border-red-500' : ''}`}
                        placeholder="your.email@example.com"
                        required
                      />
                      {emailError && touched.email && (
                        <p className="text-sm text-red-400 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                          <span className="text-red-500">✕</span> {emailError}
                        </p>
                      )}
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="password-signup" className="text-sm font-semibold text-slate-300">Password</Label>
                      <Input
                        id="password-signup"
                        type="password"
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        onBlur={() => handleBlur('password')}
                        className={`h-12 bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 transition-all ${passwordError && touched.password ? 'border-red-500 focus:border-red-500' : ''}`}
                        placeholder="Create a strong password"
                        required
                      />
                      {passwordError && touched.password && (
                        <p className="text-sm text-red-400 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                          <span className="text-red-500">✕</span> {passwordError}
                        </p>
                      )}
                      {password && !passwordError && (
                        <div className="space-y-2 p-3 bg-gray-900/30 rounded-lg border border-gray-700/50">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400 font-medium">Password Strength:</span>
                            <span className={`font-bold ${
                              getPasswordStrength(password).strength === 1 ? 'text-red-400' :
                              getPasswordStrength(password).strength === 2 ? 'text-orange-400' :
                              getPasswordStrength(password).strength === 3 ? 'text-yellow-400' :
                              'text-green-400'
                            }`}>
                              {getPasswordStrength(password).label}
                            </span>
                          </div>
                          <div className="flex gap-1.5 h-2">
                            {[1, 2, 3, 4].map((level) => (
                              <div
                                key={level}
                                className={`flex-1 rounded-full transition-all duration-300 ${
                                  level <= getPasswordStrength(password).strength
                                    ? getPasswordStrength(password).color
                                    : 'bg-gray-700'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="confirm-password-signup" className="text-sm font-semibold text-slate-300">Confirm Password</Label>
                      <Input
                        id="confirm-password-signup"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                        onBlur={() => handleBlur('confirmPassword')}
                        className={`h-12 bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 transition-all ${confirmPasswordError && touched.confirmPassword ? 'border-red-500 focus:border-red-500' : confirmPassword && !confirmPasswordError && touched.confirmPassword ? 'border-green-500' : ''}`}
                        placeholder="Confirm your password"
                        required
                      />
                      {confirmPasswordError && touched.confirmPassword && (
                        <p className="text-sm text-red-400 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                          <span className="text-red-500">✕</span> {confirmPasswordError}
                        </p>
                      )}
                      {confirmPassword && !confirmPasswordError && touched.confirmPassword && (
                        <p className="text-sm text-green-400 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                          <span className="text-green-500">✓</span> Passwords match perfectly
                        </p>
                      )}
                    </div>
                    {error && (
                      <div className="p-4 rounded-xl bg-red-900/30 border border-red-500/30 backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
                        <p className="text-sm text-red-300 font-medium">{error}</p>
                      </div>
                    )}
                    <Button
                      onClick={() => handleAuth("signup")}
                      disabled={loading || !!nameError || !!emailError || !!passwordError || !!confirmPasswordError}
                      className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Creating Account...
                        </span>
                      ) : "Create Account"}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}