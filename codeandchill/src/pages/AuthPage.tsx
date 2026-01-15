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
import { Code, Github } from "lucide-react";
import { performFreshLogin } from "@/utils/cleanup";
import { TokenManager } from "@/utils/tokenManager";
import { API_BASE_URL } from "@/constants";

interface AuthPageProps {
  login: (token: string) => void;
}

// Google Icon Component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

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

      const endpoint =
        type === "login"
          ? `${API_BASE_URL}/auth/login`
          : `${API_BASE_URL}/auth/signup`;
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
    <div className="min-h-screen bg-black overflow-hidden">
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
            <p className="bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 bg-clip-text text-transparent text-lg font-medium">
              Your Professional Learning Platform
            </p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-14 bg-gradient-to-br from-gray-900 via-black to-gray-800 backdrop-blur-xl border border-gray-700 rounded-xl p-1">
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
              <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 backdrop-blur-xl border border-gray-700 hover:border-gray-600 rounded-md shadow-2xl overflow-hidden transition-all duration-300">
                <div className="p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-2">Welcome Back</h2>
                    <p className="bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 bg-clip-text text-transparent">
                      Enter your credentials to continue learning
                    </p>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="email-login" className="text-sm font-semibold bg-gradient-to-r from-slate-300 via-slate-200 to-slate-300 bg-clip-text text-transparent">Email Address</Label>
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
                      <Label htmlFor="password-login" className="text-sm font-semibold bg-gradient-to-r from-slate-300 via-slate-200 to-slate-300 bg-clip-text text-transparent">Password</Label>
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

                    {/* OAuth Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-600" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-gray-800 px-2 text-gray-400">Or continue with</span>
                      </div>
                    </div>

                    {/* OAuth Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={() => window.location.href = `${API_BASE_URL}/auth/github`}
                        disabled={loading}
                        variant="outline"
                        className="h-12 bg-gray-900/50 border-gray-600 text-white hover:bg-gray-800 hover:border-gray-500 transition-all duration-300"
                      >
                        <Github className="w-5 h-5 mr-2" />
                        GitHub
                      </Button>
                      <Button
                        onClick={() => window.location.href = `${API_BASE_URL}/auth/google`}
                        disabled={loading}
                        variant="outline"
                        className="h-12 bg-gray-900/50 border-gray-600 text-white hover:bg-gray-800 hover:border-gray-500 transition-all duration-300"
                      >
                        <GoogleIcon />
                        <span className="ml-2">Google</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="mt-0">
              <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 backdrop-blur-xl border border-gray-700 hover:border-gray-600 rounded-md shadow-2xl overflow-hidden relative transition-all duration-300">
                <div className="p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-2">Create Account</h2>
                    <p className="bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 bg-clip-text text-transparent">
                      Start your learning journey today
                    </p>
                  </div>
                  <div className="space-y-5">
                    <div className="space-y-3">
                      <Label htmlFor="name-signup" className="text-sm font-semibold bg-gradient-to-r from-slate-300 via-slate-200 to-slate-300 bg-clip-text text-transparent">Full Name</Label>
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
                      <Label htmlFor="email-signup" className="text-sm font-semibold bg-gradient-to-r from-slate-300 via-slate-200 to-slate-300 bg-clip-text text-transparent">Email Address</Label>
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
                      <Label htmlFor="password-signup" className="text-sm font-semibold bg-gradient-to-r from-slate-300 via-slate-200 to-slate-300 bg-clip-text text-transparent">Password</Label>
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
                            <span className="bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 bg-clip-text text-transparent font-medium">Password Strength:</span>
                            <span className={`font-bold ${getPasswordStrength(password).strength === 1 ? 'text-red-400' :
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
                                className={`flex-1 rounded-full transition-all duration-300 ${level <= getPasswordStrength(password).strength
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
                      <Label htmlFor="confirm-password-signup" className="text-sm font-semibold bg-gradient-to-r from-slate-300 via-slate-200 to-slate-300 bg-clip-text text-transparent">Confirm Password</Label>
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

                    {/* OAuth Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-600" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-gray-800 px-2 text-gray-400">Or continue with</span>
                      </div>
                    </div>

                    {/* OAuth Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={() => window.location.href = `${API_BASE_URL}/auth/github`}
                        disabled={loading}
                        variant="outline"
                        className="h-12 bg-gray-900/50 border-gray-600 text-white hover:bg-gray-800 hover:border-gray-500 transition-all duration-300"
                      >
                        <Github className="w-5 h-5 mr-2" />
                        GitHub
                      </Button>
                      <Button
                        onClick={() => window.location.href = `${API_BASE_URL}/auth/google`}
                        disabled={loading}
                        variant="outline"
                        className="h-12 bg-gray-900/50 border-gray-600 text-white hover:bg-gray-800 hover:border-gray-500 transition-all duration-300"
                      >
                        <GoogleIcon />
                        <span className="ml-2">Google</span>
                      </Button>
                    </div>
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