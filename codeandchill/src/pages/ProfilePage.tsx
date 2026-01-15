import React, { useState, useEffect } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
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
  X,
  User,
  ArrowRight
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { ActivityService } from "@/services/activityService";
import { ActivityBreakdown } from "@/components/activity/ActivityBreakdown";
import { RealTimeActivity } from "@/components/activity/RealTimeActivity";
import { DailyActivityChart } from "@/components/activity/DailyActivityChart";
import { SolvedProblems } from "@/components/profile/SolvedProblems";

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
  timeSpent: number;
  sessions: number;
  activities: number;
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
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [newSkill, setNewSkill] = useState("");
  const [editedUser, setEditedUser] = useState<ProfileData | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
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
        const dashboardResponse = await fetch(
          "http://localhost:3001/api/user/profile-dashboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!dashboardResponse.ok) throw new Error("Failed to fetch profile dashboard.");
        const dashboardData = await dashboardResponse.json();

        const realActivityData = await ActivityService.getDailyActivity(7);

        setActivityData(realActivityData.dailyActivity || []);
        setUserStats(dashboardData.stats);
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
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && editedUser) {
      setEditedUser({
        ...editedUser,
        skills: [...editedUser.skills, newSkill.trim()]
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (editedUser) {
      setEditedUser({
        ...editedUser,
        skills: editedUser.skills.filter(skill => skill !== skillToRemove)
      });
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      await uploadProfilePicture(file);
    } catch (error) {
      console.error("Error uploading photo:", error);
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="w-full min-h-screen bg-black">
        <div className="container mx-auto max-w-7xl px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center justify-center gap-4">
            <User className="text-blue-400" size={48} />
            My Profile
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Manage your account settings and track your learning progress
          </p>
        </header>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { key: 'overview', label: 'Overview', icon: User },
            { key: 'activity', label: 'Activity', icon: Target },
            { key: 'achievements', label: 'Achievements', icon: Trophy },
            { key: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === tab.key
                  ? 'bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 border border-gray-500 text-white'
                  : 'bg-gradient-to-r from-gray-900 via-black to-gray-800 border border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <main>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-6 hover:border-gray-600 transition-all duration-300 shadow-lg">
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <Avatar className="w-24 h-24 border-4 border-gray-600">
                        <AvatarImage src={user.profilePicture} alt={user.name} />
                        <AvatarFallback className="bg-gray-800 text-gray-300 text-2xl">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {editMode && (
                        <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition-colors">
                          <Edit size={14} />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                            disabled={uploadingPhoto}
                          />
                        </label>
                      )}
                    </div>

                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-2">
                      {user.name}
                    </h2>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-center gap-2 text-gray-400">
                        <Mail size={14} />
                        <span>{user.email}</span>
                      </div>
                      {user.location && (
                        <div className="flex items-center justify-center gap-2 text-gray-400">
                          <MapPin size={14} />
                          <span>{user.location}</span>
                        </div>
                      )}
                      {user.occupation && (
                        <div className="flex items-center justify-center gap-2 text-gray-400">
                          <Briefcase size={14} />
                          <span>{user.occupation}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-6">
                      <button
                        onClick={() => setEditMode(!editMode)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-md transition-all duration-300 flex items-center gap-2 mx-auto"
                      >
                        {editMode ? <Save size={14} /> : <Edit size={14} />}
                        {editMode ? 'Save Changes' : 'Edit Profile'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-6 hover:border-gray-600 transition-all duration-300 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-black/30 backdrop-blur-sm border border-gray-600 rounded-md">
                      <Target className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                        Problems Solved
                      </h3>
                      <p className="text-2xl font-bold text-green-400">
                        {user.totalProblemsSolved || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-6 hover:border-gray-600 transition-all duration-300 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-black/30 backdrop-blur-sm border border-gray-600 rounded-md">
                      <Flame className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                        Current Streak
                      </h3>
                      <p className="text-2xl font-bold text-orange-400">
                        {user.currentStreak || 0} days
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-6 hover:border-gray-600 transition-all duration-300 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-black/30 backdrop-blur-sm border border-gray-600 rounded-md">
                      <BookOpen className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                        Courses Completed
                      </h3>
                      <p className="text-2xl font-bold text-blue-400">
                        {user.totalCoursesCompleted || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-6 hover:border-gray-600 transition-all duration-300 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-black/30 backdrop-blur-sm border border-gray-600 rounded-md">
                      <Trophy className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                        Quizzes Taken
                      </h3>
                      <p className="text-2xl font-bold text-yellow-400">
                        {user.totalQuizzesTaken || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="lg:col-span-3">
                <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-6 hover:border-gray-600 transition-all duration-300 shadow-lg">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-4">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.skills?.map((skill, index) => (
                      <div key={index} className="px-3 py-1 bg-black/30 backdrop-blur-sm border border-gray-600 rounded-md text-sm flex items-center gap-2">
                        <span className="bg-gradient-to-r from-gray-300 via-white to-gray-300 bg-clip-text text-transparent">
                          {skill}
                        </span>
                        {editMode && (
                          <button
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                    {editMode && (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Add skill..."
                          className="px-3 py-1 bg-gradient-to-r from-gray-900 via-black to-gray-800 border border-gray-600 rounded-md text-white text-sm focus:border-gray-500 focus:outline-none"
                          onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                        />
                        <button
                          onClick={handleAddSkill}
                          className="p-1 text-green-400 hover:text-green-300 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-6">
                <h3 className="text-xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-4">
                  Activity Overview
                </h3>
                <ActivityBreakdown />
              </div>

              <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-6">
                <h3 className="text-xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-4">
                  Daily Activity
                </h3>
                <DailyActivityChart />
              </div>

              <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-6">
                <h3 className="text-xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-4">
                  Solved Problems
                </h3>
                <SolvedProblems />
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-12 max-w-md mx-auto">
                <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-2">
                  Achievements Coming Soon
                </h2>
                <p className="text-gray-400">
                  Your achievements and badges will be displayed here.
                </p>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-12 max-w-md mx-auto">
                <Settings className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-2">
                  Settings Coming Soon
                </h2>
                <p className="text-gray-400">
                  Account settings and preferences will be available here.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}