import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell } from "recharts";
import { Edit, Save, Award, Medal, Star, Target, Mail, MapPin, Briefcase } from "lucide-react";

interface ProfileData {
  name: string;
  email: string;
  location: string;
  occupation: string;
  bio: string;
  avatarUrl: string;
  joinDate: string;
}

const initialProfileData: ProfileData = {
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  location: "San Francisco, CA",
  occupation: "Full-Stack Developer",
  bio: "Passionate about problem-solving and building impactful software. Coffee enthusiast ☕.",
  avatarUrl: "https://github.com/shadcn.png",
  joinDate: "August 2024",
};

const activityData = [
  { day: "Mon", solved: 4 }, { day: "Tue", solved: 3 }, { day: "Wed", solved: 7 },
  { day: "Thu", solved: 5 }, { day: "Fri", solved: 8 }, { day: "Sat", solved: 12 },
  { day: "Sun", solved: 6 },
];

const problemData = [
  { level: "Easy", count: 75, fill: "#a3e635" },
  { level: "Medium", count: 42, fill: "#22d3ee" },
  { level: "Hard", count: 8, fill: "#0e7490" },
];

const certificates = [
  { course: "Advanced React Patterns" },
  { course: "Data Structures in Python" },
];

const skills = ["JavaScript", "React", "Node.js", "TailwindCSS", "Python", "GraphQL"];

export function ProfilePage() {
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData);

  const handleSave = () => {
    console.log("Profile saved:", profileData);
    setEditMode(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-lime-100 via-gray-100 to-cyan-100 text-cyan-900">
      <div className="container mx-auto max-w-7xl px-4 py-12 space-y-12">

        {/* Profile Header */}
        <Card className="rounded-2xl shadow-lg bg-white/60 backdrop-blur-md border border-cyan-200">
          <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
            <Avatar className="h-32 w-32 border-4 border-cyan-700 shadow-md">
              <AvatarImage src={profileData.avatarUrl} alt={profileData.name} />
              <AvatarFallback>{profileData.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left flex-grow space-y-2">
              {editMode ? (
                <>
                  <Input className="text-3xl font-bold h-12" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />
                  <Input className="h-10" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} />
                  <Input className="h-10" value={profileData.location} onChange={(e) => setProfileData({ ...profileData, location: e.target.value })} />
                  <Input className="h-10" value={profileData.occupation} onChange={(e) => setProfileData({ ...profileData, occupation: e.target.value })} />
                  <Textarea className="h-20" value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} />
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-bold">{profileData.name}</h1>
                  <p className="flex items-center gap-2 text-cyan-800"><Mail size={16} /> {profileData.email}</p>
                  <p className="flex items-center gap-2 text-cyan-800"><MapPin size={16} /> {profileData.location}</p>
                  <p className="flex items-center gap-2 text-cyan-800"><Briefcase size={16} /> {profileData.occupation}</p>
                  <p className="text-cyan-700/80">{profileData.bio}</p>
                </>
              )}
            </div>
            {editMode ? (
              <Button size="lg" className="font-semibold bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl" onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            ) : (
              <Button size="lg" variant="outline" className="font-semibold border-cyan-700 text-cyan-800 rounded-xl hover:bg-cyan-50" onClick={() => setEditMode(true)}>
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <Card className="lg:col-span-3 rounded-2xl shadow-lg bg-white/60 backdrop-blur-md border border-cyan-200">
            <CardHeader>
              <CardTitle className="text-cyan-900">Daily Activity</CardTitle>
              <CardDescription className="text-cyan-700">Problems solved in the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[250px] w-full">
                <BarChart accessibilityLayer data={activityData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="solved" fill="#06b6d4" radius={8} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 rounded-2xl shadow-lg bg-white/60 backdrop-blur-md border border-cyan-200">
            <CardHeader>
              <CardTitle className="text-cyan-900">Problem Difficulty Breakdown</CardTitle>
              <CardDescription className="text-cyan-700">Distribution of all solved problems</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <ChartContainer config={{}} className="h-[250px] w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie data={problemData} dataKey="count" nameKey="level" innerRadius={50}>
                    {problemData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Skills & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="rounded-2xl shadow-lg bg-white/60 backdrop-blur-md border border-cyan-200">
            <CardHeader><CardTitle className="text-cyan-900">Skills</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <Badge key={skill} variant="secondary" className="px-3 py-1 bg-cyan-50 text-cyan-800 border border-cyan-200">{skill}</Badge>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg bg-white/60 backdrop-blur-md border border-cyan-200">
            <CardHeader><CardTitle className="text-cyan-900">Achievements</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col items-center gap-2 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                <Star className="h-8 w-8 text-yellow-500" /><p className="text-xs text-cyan-900">5-Day Streak</p>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                <Award className="h-8 w-8 text-blue-500" /><p className="text-xs text-cyan-900">Python Pro</p>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                <Medal className="h-8 w-8 text-slate-500" /><p className="text-xs text-cyan-900">Top 10 Finisher</p>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                <Target className="h-8 w-8 text-green-500" /><p className="text-xs text-cyan-900">100 Problems Solved</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Certificates */}
        <Card className="rounded-2xl shadow-lg bg-white/60 backdrop-blur-md border border-cyan-200">
          <CardHeader><CardTitle className="text-cyan-900">Certificates</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {certificates.map(cert => (
              <div key={cert.course} className="flex items-center justify-between p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                <p className="font-semibold text-cyan-900">{cert.course}</p>
                <Button variant="outline" size="sm" className="border-cyan-700 text-cyan-800 rounded-lg hover:bg-cyan-100">View Certificate</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}