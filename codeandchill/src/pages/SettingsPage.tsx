import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User, Lock, Bell, Palette, Upload, CheckCircle, AlertCircle,
  Github, Linkedin, Twitter, Globe
} from "lucide-react";
import { API_BASE_URL } from "@/constants";
import { useUser } from "@/contexts/UserContext";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  location?: string;
  occupation?: string;
  bio?: string;
  phone?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  skills?: string[];
  profilePicture?: string;
  preferences?: {
    theme: 'light' | 'dark';
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      achievements: boolean;
    };
  };
}

export function SettingsPage() {
  const { user: contextUser, updateUser: updateContextUser, updatePreferences: updateContextPreferences, uploadProfilePicture: uploadContextProfilePicture, refreshUser } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (contextUser) {
      setProfile(contextUser as any);
      setLoading(false);
    } else {
      fetchProfile();
    }
  }, [contextUser]);

  // Sync profile with context user whenever it changes
  useEffect(() => {
    if (contextUser && !loading) {
      setProfile(contextUser as any);
    }
  }, [contextUser?.profilePicture, contextUser?.name, contextUser?.email]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch profile.");
      const data = await response.json();
      setProfile(data.user);
    } catch (error: any) {
      showMessage(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    try {
      // Update via context which will sync across all components
      await updateContextUser(profile);
      showMessage("Profile updated successfully!", "success");

      // Refresh to ensure all data is in sync
      await refreshUser();
    } catch (error: any) {
      showMessage(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showMessage("New passwords do not match!", "error");
      return;
    }

    if (newPassword.length < 6) {
      showMessage("Password must be at least 6 characters long!", "error");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/user/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to change password.");
      }

      showMessage("Password changed successfully!", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      showMessage(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showMessage("File size must be less than 5MB", "error");
      return;
    }

    setUploadingImage(true);
    try {
      // Upload via context which will refresh user data automatically
      await uploadContextProfilePicture(file);

      // Force refresh to ensure profile picture updates everywhere
      await refreshUser();

      showMessage("Profile picture updated successfully!", "success");
    } catch (error: any) {
      showMessage(error.message, "error");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdatePreferences = async () => {
    if (!profile?.preferences) return;

    setSaving(true);
    try {
      // Update via context which will sync across all components
      await updateContextPreferences(profile.preferences);
      showMessage("Preferences updated successfully!", "success");
    } catch (error: any) {
      showMessage(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-black p-8">
        <div className="container mx-auto max-w-5xl">
          <Skeleton className="h-[600px] w-full" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen w-full bg-black p-8">
        <div className="container mx-auto max-w-5xl text-center">
          <AlertCircle className="mx-auto text-red-400 mb-4" size={48} />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">Failed to load profile</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black p-8">
      <div className="container mx-auto max-w-5xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-2">Settings</h1>
          <p className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent text-lg">
            Manage your account settings and preferences
          </p>
        </header>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === "success"
              ? "bg-green-900/30 border border-green-500/50 text-green-300"
              : "bg-red-900/30 border border-red-500/50 text-red-300"
              }`}
          >
            {message.type === "success" ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
            <TabsTrigger value="profile" className="data-[state=active]:bg-purple-600">
              <User size={16} className="mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-purple-600">
              <Lock size={16} className="mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-purple-600">
              <Palette size={16} className="mr-2" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-purple-600">
              <Bell size={16} className="mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6">
            <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 backdrop-blur-sm border border-gray-700 hover:border-gray-600 rounded-md shadow-lg hover:shadow-xl hover:shadow-black/60 transition-all duration-300">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">Profile Information</CardTitle>
                <CardDescription className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                  Update your personal information and social links
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={profile.profilePicture ? `${API_BASE_URL}${profile.profilePicture}` : undefined}
                      />
                      <AvatarFallback className="bg-purple-600 text-white text-2xl">
                        {profile.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Label htmlFor="profile-picture" className="cursor-pointer">
                        <div className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                          <Upload size={16} />
                          {uploadingImage ? "Uploading..." : "Upload Photo"}
                        </div>
                      </Label>
                      <Input
                        id="profile-picture"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePictureUpload}
                        disabled={uploadingImage}
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        JPG, PNG or GIF. Max size 5MB
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-clip-text text-transparent">Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-clip-text text-transparent">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location" className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-clip-text text-transparent">Location</Label>
                      <Input
                        id="location"
                        value={profile.location || ""}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        placeholder="City, Country"
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="occupation" className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-clip-text text-transparent">Occupation</Label>
                      <Input
                        id="occupation"
                        value={profile.occupation || ""}
                        onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                        placeholder="Software Developer"
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-clip-text text-transparent">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio || ""}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">Social Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="website" className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-clip-text text-transparent flex items-center gap-2">
                          <Globe size={16} />
                          Website
                        </Label>
                        <Input
                          id="website"
                          value={profile.website || ""}
                          onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                          placeholder="https://yourwebsite.com"
                          className="bg-gray-900 border-gray-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="github" className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-clip-text text-transparent flex items-center gap-2">
                          <Github size={16} />
                          GitHub
                        </Label>
                        <Input
                          id="github"
                          value={profile.github || ""}
                          onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                          placeholder="github.com/username"
                          className="bg-gray-900 border-gray-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin" className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-clip-text text-transparent flex items-center gap-2">
                          <Linkedin size={16} />
                          LinkedIn
                        </Label>
                        <Input
                          id="linkedin"
                          value={profile.linkedin || ""}
                          onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                          placeholder="linkedin.com/in/username"
                          className="bg-gray-900 border-gray-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="twitter" className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-clip-text text-transparent flex items-center gap-2">
                          <Twitter size={16} />
                          Twitter
                        </Label>
                        <Input
                          id="twitter"
                          value={profile.twitter || ""}
                          onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                          placeholder="twitter.com/username"
                          className="bg-gray-900 border-gray-700 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="mt-6">
            <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 backdrop-blur-sm border border-gray-700 hover:border-gray-600 rounded-md shadow-lg hover:shadow-xl hover:shadow-black/60 transition-all duration-300">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">Change Password</CardTitle>
                <CardDescription className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password" className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-clip-text text-transparent">
                      Current Password
                    </Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-clip-text text-transparent">
                      New Password
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-clip-text text-transparent">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {saving ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="mt-6">
            <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 backdrop-blur-sm border border-gray-700 hover:border-gray-600 rounded-md shadow-lg hover:shadow-xl hover:shadow-black/60 transition-all duration-300">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">Appearance & Language</CardTitle>
                <CardDescription className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                  Customize your experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-clip-text text-transparent">Theme</Label>
                      <p className="text-sm text-gray-500">Choose your preferred theme</p>
                    </div>
                    <select
                      value={profile.preferences?.theme || 'dark'}
                      onChange={(e) => setProfile({
                        ...profile,
                        preferences: {
                          ...profile.preferences!,
                          theme: e.target.value as 'light' | 'dark'
                        }
                      })}
                      className="bg-gray-900 border-gray-700 text-white rounded-lg px-4 py-2"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-clip-text text-transparent">Language</Label>
                      <p className="text-sm text-gray-500">Select your language</p>
                    </div>
                    <select
                      value={profile.preferences?.language || 'en'}
                      onChange={(e) => setProfile({
                        ...profile,
                        preferences: {
                          ...profile.preferences!,
                          language: e.target.value
                        }
                      })}
                      className="bg-gray-900 border-gray-700 text-white rounded-lg px-4 py-2"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                </div>

                <Button
                  onClick={handleUpdatePreferences}
                  disabled={saving}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {saving ? "Saving..." : "Save Preferences"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="mt-6">
            <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 backdrop-blur-sm border border-gray-700 hover:border-gray-600 rounded-md shadow-lg hover:shadow-xl hover:shadow-black/60 transition-all duration-300">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">Notification Settings</CardTitle>
                <CardDescription className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-clip-text text-transparent">Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive updates via email</p>
                    </div>
                    <Switch
                      checked={profile.preferences?.notifications?.email ?? true}
                      onCheckedChange={(checked) => setProfile({
                        ...profile,
                        preferences: {
                          ...profile.preferences!,
                          notifications: {
                            ...profile.preferences!.notifications,
                            email: checked
                          }
                        }
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-clip-text text-transparent">Push Notifications</Label>
                      <p className="text-sm text-gray-500">Receive push notifications</p>
                    </div>
                    <Switch
                      checked={profile.preferences?.notifications?.push ?? true}
                      onCheckedChange={(checked) => setProfile({
                        ...profile,
                        preferences: {
                          ...profile.preferences!,
                          notifications: {
                            ...profile.preferences!.notifications,
                            push: checked
                          }
                        }
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-clip-text text-transparent">Achievement Notifications</Label>
                      <p className="text-sm text-gray-500">Get notified about achievements</p>
                    </div>
                    <Switch
                      checked={profile.preferences?.notifications?.achievements ?? true}
                      onCheckedChange={(checked) => setProfile({
                        ...profile,
                        preferences: {
                          ...profile.preferences!,
                          notifications: {
                            ...profile.preferences!.notifications,
                            achievements: checked
                          }
                        }
                      })}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleUpdatePreferences}
                  disabled={saving}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {saving ? "Saving..." : "Save Notification Settings"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
