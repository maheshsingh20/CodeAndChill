import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Pie,
  PieChart,
  Cell,
} from "recharts";
import {
  Edit,
  Save,
  Mail,
  MapPin,
  Briefcase,
  Phone,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Calendar,
  Trophy,
  Target,
  Flame,
  BookOpen,
  Settings,
  Bell,
  Shield,
  Plus,
  X
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/contexts/UserContext";
import { ActivityService } from "@/services/activityService";
import { ActivityBreakdown } from "@/components/activity/ActivityBreakdown";
import { RealTimeActivity } from "@/components/activity/RealTimeActivity";
import { DailyActivityChart } from "@/components/activity/DailyActivityChart";
import { SolvedProblems } from "@/components/profile/SolvedProblems";

// --- TypeScript Interfaces for Fetched Data ---
interface ProfileData {
  _id: string;
  name: string;
  email: string;
  location: string;
  occupation: string;
  bio: string;
  phone?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  skills: string[];
  joinDate: string;
  profilePicture?: string;
  totalProblemsAttempted: number;
  totalProblemsSolved: number;
  totalQuizzesTaken: number;
  totalCoursesCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  preferences: {
    theme: 'light' | 'dark';
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      achievements: boolean;
    };
  };
}

interface ActivityData {
  date: string;
  day: string;
  timeSpent: number; // in minutes
  sessions: number;
  activities: number;
}

interface ProblemStats {
  level: string;
  count: number;
}

interface Certificate {
  course: string;
  completedAt?: string;
  certificateId?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

interface UserStats {
  totalProblemsAttempted: number;
  totalProblemsSolved: number;
  totalQuizzesTaken: number;
  totalCoursesCompleted: number;
  currentStreak: number;
  longestStreak: number;
  joinDate: string;
  lastActiveDate: string;
}

export function ProfilePage() {
  const { user, loading, updateUser, updatePreferences, uploadProfilePicture } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [problemStats, setProblemStats] = useState<ProblemStats[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [newSkill, setNewSkill] = useState("");
  const [editedUser, setEditedUser] = useState<ProfileData | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (user) {
      setEditedUser(user);
    }
  }, [user]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user || !token) return;
      
      setDashboardLoading(true);
      try {
        // Fetch profile dashboard data
        const dashboardResponse = await fetch(
          "http://localhost:3001/api/user/profile-dashboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!dashboardResponse.ok) throw new Error("Failed to fetch profile dashboard.");
        const dashboardData = await dashboardResponse.json();

        // Fetch real activity data
        const realActivityData = await ActivityService.getDailyActivity(7);
        
        // Fetch achievements
        const achievementsResponse = await fetch(
          "http://localhost:3001/api/user/achievements",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const achievementsData = achievementsResponse.ok 
          ? await achievementsResponse.json() 
          : { achievements: [] };

        // Use real activity data instead of mock data
        setActivityData(realActivityData.dailyActivity || []);
        setProblemStats(dashboardData.problemStats);
        setCertificates(dashboardData.certificates);
        setUserStats(dashboardData.stats);
        setAchievements(achievementsData.achievements);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setDashboardLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user, token]);

  const handleSave = async () => {
    if (!editedUser) return;
    
    try {
      await updateUser(editedUser);
      setEditMode(false);
      setPreviewImage(null);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    try {
      setUploadingPhoto(true);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      await uploadProfilePicture(file);
      
      // Clear preview after successful upload
      setPreviewImage(null);
      
      alert('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload profile picture. Please try again.');
      setPreviewImage(null);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePreferencesUpdate = async (newPreferences: any) => {
    try {
      await updatePreferences(newPreferences);
    } catch (error) {
      console.error("Error updating preferences:", error);
      alert("Failed to update preferences. Please try again.");
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && editedUser && !editedUser.skills.includes(newSkill.trim())) {
      setEditedUser({
        ...editedUser,
        skills: [...editedUser.skills, newSkill.trim()]
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    if (editedUser) {
      setEditedUser({
        ...editedUser,
        skills: editedUser.skills.filter(skill => skill !== skillToRemove)
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading || !user || !editedUser) {
    return (
      <div className="container p-8">
        <Skeleton className="h-[80vh] w-full" />
      </div>
    );
  }

  const pieChartColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
  ];

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white">
      <div className="container mx-auto max-w-7xl px-4 py-8 space-y-8">
        {/* Profile Header */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <Avatar className="h-32 w-32 border-4 border-purple-500">
                    <AvatarImage 
                      src={previewImage || user.profilePicture || "https://github.com/shadcn.png"} 
                      alt={user.name}
                      key={previewImage || user.profilePicture || 'default'}
                    />
                    <AvatarFallback className="bg-purple-600 text-white text-2xl">
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {editMode && (
                    <label 
                      htmlFor="profile-photo-upload" 
                      className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Edit className="w-8 h-8 text-white" />
                      <input
                        id="profile-photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        disabled={uploadingPhoto}
                      />
                    </label>
                  )}
                  {uploadingPhoto && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                {editMode && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('profile-photo-upload')?.click()}
                    disabled={uploadingPhoto}
                    className="bg-purple-600/20 border-purple-500 text-purple-300 hover:bg-purple-600/40"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {uploadingPhoto ? 'Uploading...' : 'Change Photo'}
                  </Button>
                )}
                <Badge variant="secondary" className="bg-purple-600 text-white">
                  Member since {formatDate(user.joinDate)}
                </Badge>
              </div>

              <div className="flex-1 space-y-4">
                {editMode ? (
                  <div className="space-y-4">
                    <Input
                      className="text-2xl font-bold bg-gray-700 border-gray-600 text-white"
                      value={editedUser.name}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, name: e.target.value })
                      }
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        className="bg-gray-700 border-gray-600 text-white"
                        value={editedUser.email}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser, email: e.target.value })
                        }
                        placeholder="Email"
                      />
                      <Input
                        className="bg-gray-700 border-gray-600 text-white"
                        value={editedUser.occupation}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser, occupation: e.target.value })
                        }
                        placeholder="Occupation"
                      />
                      <Input
                        className="bg-gray-700 border-gray-600 text-white"
                        value={editedUser.location}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser, location: e.target.value })
                        }
                        placeholder="Location"
                      />
                      <Input
                        className="bg-gray-700 border-gray-600 text-white"
                        value={editedUser.phone || ""}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser, phone: e.target.value })
                        }
                        placeholder="Phone"
                      />
                    </div>
                    <Textarea
                      className="bg-gray-700 border-gray-600 text-white"
                      value={editedUser.bio}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, bio: e.target.value })
                      }
                      placeholder="Bio"
                      rows={3}
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-purple-400" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase size={16} className="text-purple-400" />
                        <span>{user.occupation}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-purple-400" />
                        <span>{user.location}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-purple-400" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-400 mt-4">{user.bio}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-4 pt-4">
                  {editMode ? (
                    <div className="flex gap-2">
                      <Button onClick={handleSave} disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                        <Save className="mr-2 h-4 w-4" />
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setEditMode(false)}
                        className="border-gray-600 text-gray-300"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => setEditMode(true)}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-1 lg:w-48">
                <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">{user.totalProblemsSolved}</div>
                  <div className="text-sm text-gray-400">Problems Solved</div>
                </div>
                <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">{user.currentStreak}</div>
                  <div className="text-sm text-gray-400">Current Streak</div>
                </div>
                <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">{user.totalCoursesCompleted}</div>
                  <div className="text-sm text-gray-400">Courses Done</div>
                </div>
                <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">{user.totalQuizzesTaken}</div>
                  <div className="text-sm text-gray-400">Quizzes Taken</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-gray-800 border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
              <Target className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="problems" className="data-[state=active]:bg-purple-600">
              <Trophy className="w-4 h-4 mr-2" />
              Problems
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-purple-600">
              <Flame className="w-4 h-4 mr-2" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-600">
              <Trophy className="w-4 h-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="certificates" className="data-[state=active]:bg-purple-600">
              <BookOpen className="w-4 h-4 mr-2" />
              Certificates
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Skills Section */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Skills</CardTitle>
                <CardDescription className="text-gray-400">
                  Your technical skills and expertise
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(editMode ? editedUser.skills : user.skills).map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="bg-purple-600/20 text-purple-300 border-purple-500/30"
                    >
                      {skill}
                      {editMode && (
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-2 text-red-400 hover:text-red-300"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                {editMode && (
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                      className="bg-gray-700 border-gray-600 text-white"
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    />
                    <Button onClick={addSkill} size="sm" className="bg-purple-600 hover:bg-purple-700">
                      <Plus size={16} />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Social Links</CardTitle>
                <CardDescription className="text-gray-400">
                  Connect with others through your social profiles
                </CardDescription>
              </CardHeader>
              <CardContent>
                {editMode ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Globe className="text-blue-400" size={16} />
                      <Input
                        value={editedUser.website || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, website: e.target.value })}
                        placeholder="Website URL"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Github className="text-gray-400" size={16} />
                      <Input
                        value={editedUser.github || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, github: e.target.value })}
                        placeholder="GitHub username"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Linkedin className="text-blue-600" size={16} />
                      <Input
                        value={editedUser.linkedin || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, linkedin: e.target.value })}
                        placeholder="LinkedIn profile"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Twitter className="text-blue-400" size={16} />
                      <Input
                        value={editedUser.twitter || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, twitter: e.target.value })}
                        placeholder="Twitter handle"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.website && (
                      <a href={user.website} target="_blank" rel="noopener noreferrer" 
                         className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                        <Globe size={16} />
                        <span>Website</span>
                      </a>
                    )}
                    {user.github && (
                      <a href={`https://github.com/${user.github}`} target="_blank" rel="noopener noreferrer"
                         className="flex items-center gap-2 text-gray-400 hover:text-gray-300">
                        <Github size={16} />
                        <span>GitHub</span>
                      </a>
                    )}
                    {user.linkedin && (
                      <a href={user.linkedin} target="_blank" rel="noopener noreferrer"
                         className="flex items-center gap-2 text-blue-600 hover:text-blue-500">
                        <Linkedin size={16} />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {user.twitter && (
                      <a href={`https://twitter.com/${user.twitter}`} target="_blank" rel="noopener noreferrer"
                         className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                        <Twitter size={16} />
                        <span>Twitter</span>
                      </a>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="problems" className="space-y-6">
            <SolvedProblems />
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            {/* Real-time Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <DailyActivityChart />
              </div>
              <div className="space-y-4">
                <RealTimeActivity />
                <ActivityBreakdown />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Achievements</CardTitle>
                <CardDescription className="text-gray-400">
                  Your coding milestones and accomplishments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border ${
                        achievement.unlocked
                          ? 'bg-gradient-to-r from-yellow-900/30 to-yellow-800/20 border-yellow-600'
                          : 'bg-gray-700/50 border-gray-600'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className={`font-semibold ${
                            achievement.unlocked ? 'text-yellow-300' : 'text-gray-300'
                          }`}>
                            {achievement.title}
                          </h4>
                          <p className="text-sm text-gray-400 mt-1">
                            {achievement.description}
                          </p>
                          {!achievement.unlocked && achievement.progress !== undefined && (
                            <div className="mt-2">
                              <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Progress</span>
                                <span>{achievement.progress}/{achievement.maxProgress}</span>
                              </div>
                              <div className="w-full bg-gray-600 rounded-full h-2">
                                <div
                                  className="bg-purple-600 h-2 rounded-full"
                                  style={{
                                    width: `${((achievement.progress || 0) / (achievement.maxProgress || 1)) * 100}%`
                                  }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificates" className="space-y-6">
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Certificates</CardTitle>
                <CardDescription className="text-gray-400">
                  Courses you have successfully completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                {certificates.length > 0 ? (
                  <div className="space-y-4">
                    {certificates.map((cert, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600"
                      >
                        <div>
                          <p className="font-semibold text-white">{cert.course}</p>
                          {cert.completedAt && (
                            <p className="text-sm text-gray-400">
                              Completed on {formatDate(cert.completedAt)}
                            </p>
                          )}
                        </div>
                        <Button variant="secondary" size="sm" className="bg-purple-600 hover:bg-purple-700">
                          View Certificate
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-400">No certificates yet. Complete a course to earn your first certificate!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Preferences</CardTitle>
                <CardDescription className="text-gray-400">
                  Customize your learning experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Email Notifications</Label>
                      <p className="text-sm text-gray-400">Receive updates via email</p>
                    </div>
                    <Switch
                      checked={user.preferences?.notifications?.email ?? true}
                      onCheckedChange={(checked) =>
                        handlePreferencesUpdate({
                          ...user.preferences,
                          notifications: {
                            ...user.preferences?.notifications,
                            email: checked
                          }
                        })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Push Notifications</Label>
                      <p className="text-sm text-gray-400">Receive browser notifications</p>
                    </div>
                    <Switch
                      checked={user.preferences?.notifications?.push ?? true}
                      onCheckedChange={(checked) =>
                        handlePreferencesUpdate({
                          ...user.preferences,
                          notifications: {
                            ...user.preferences?.notifications,
                            push: checked
                          }
                        })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Achievement Notifications</Label>
                      <p className="text-sm text-gray-400">Get notified when you unlock achievements</p>
                    </div>
                    <Switch
                      checked={user.preferences?.notifications?.achievements ?? true}
                      onCheckedChange={(checked) =>
                        handlePreferencesUpdate({
                          ...user.preferences,
                          notifications: {
                            ...user.preferences?.notifications,
                            achievements: checked
                          }
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Account Security
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your account security settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
