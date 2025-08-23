import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart.tsx";
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
  Award,
  Medal,
  Star,
  Target,
  Mail,
  MapPin,
  Briefcase,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton.tsx";

// --- TypeScript Interfaces for Fetched Data ---
interface ProfileData {
  name: string;
  email: string;
  location: string;
  occupation: string;
  bio: string;
  avatarUrl: string; // This will remain static for now
}
interface ActivityData {
  day: string;
  solved: number;
}
interface ProblemStats {
  level: string;
  count: number;
}
interface Certificate {
  course: string;
}

export function ProfilePage() {
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [problemStats, setProblemStats] = useState<ProblemStats[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchProfileDashboard = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "http://localhost:3001/api/user/profile-dashboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch profile dashboard.");
        const data = await response.json();

        setProfileData({
          ...data.user,
          avatarUrl: "https://github.com/shadcn.png",
        });
        setActivityData(data.activity);
        setProblemStats(data.problemStats);
        setCertificates(data.certificates);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileDashboard();
  }, [token]);

  const handleSave = async () => {
    if (!profileData) return;
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) throw new Error("Failed to save profile.");
      const data = await response.json();
      setProfileData({ ...data, avatarUrl: profileData.avatarUrl });
      setEditMode(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !profileData) {
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
    <div className="min-h-screen w-full bg-muted/40">
      <div className="container mx-auto max-w-7xl px-4 py-12 space-y-12">
        <Card className="rounded-2xl shadow-lg bg-card">
          <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
            <Avatar className="h-32 w-32 border-4 border-primary">
              <AvatarImage src={profileData.avatarUrl} alt={profileData.name} />
              <AvatarFallback>
                {profileData.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left flex-grow space-y-2">
              {editMode ? (
                <>
                  <Input
                    className="text-3xl font-bold h-12"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                  />
                  <Input
                    className="h-10"
                    value={profileData.occupation}
                    placeholder="Your Occupation"
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        occupation: e.target.value,
                      })
                    }
                  />
                  <Input
                    className="h-10"
                    value={profileData.location}
                    placeholder="Your Location"
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        location: e.target.value,
                      })
                    }
                  />
                  <Textarea
                    className="h-20"
                    value={profileData.bio}
                    placeholder="A short bio"
                    onChange={(e) =>
                      setProfileData({ ...profileData, bio: e.target.value })
                    }
                  />
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-bold">{profileData.name}</h1>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Mail size={16} /> {profileData.email}
                  </p>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase size={16} /> {profileData.occupation}
                  </p>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <MapPin size={16} /> {profileData.location}
                  </p>
                  <p className="text-foreground/80">{profileData.bio}</p>
                </>
              )}
            </div>
            {editMode ? (
              <Button
                size="lg"
                className="font-semibold"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </>
                )}
              </Button>
            ) : (
              <Button
                size="lg"
                variant="outline"
                className="font-semibold"
                onClick={() => setEditMode(true)}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <Card className="lg:col-span-3 rounded-2xl shadow-lg bg-card">
            <CardHeader>
              <CardTitle>Daily Activity</CardTitle>
              <CardDescription>
                Problems solved in the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[250px] w-full">
                <BarChart data={activityData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="day" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="solved" fill="hsl(var(--primary))" radius={8} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2 rounded-2xl shadow-lg bg-card">
            <CardHeader>
              <CardTitle>Problem Difficulty Breakdown</CardTitle>
              <CardDescription>
                Distribution of all solved problems
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <ChartContainer config={{}} className="h-[250px] w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={problemStats}
                    dataKey="count"
                    nameKey="level"
                    innerRadius={50}
                  >
                    {problemStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={pieChartColors[index % pieChartColors.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-2xl shadow-lg bg-card">
          <CardHeader>
            <CardTitle>Certificates</CardTitle>
            <CardDescription>
              Courses you have successfully completed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {certificates.map((cert) => (
              <div
                key={cert.course}
                className="flex items-center justify-between p-4 bg-muted rounded-lg"
              >
                <p className="font-semibold">{cert.course}</p>
                <Button variant="secondary" size="sm">
                  View Certificate
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
