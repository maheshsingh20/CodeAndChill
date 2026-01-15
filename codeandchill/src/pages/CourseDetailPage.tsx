/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Clock, BarChart, PlayCircle, CheckCircle, BookOpen, Users, Star, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!slug) return;

    const fetchCourseDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const [courseRes, statusRes] = await Promise.all([
          fetch(`http://localhost:3001/api/general-courses/${slug}`),
          fetch(`http://localhost:3001/api/enrollment/status/${slug}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!courseRes.ok) throw new Error("Course not found.");

        const courseData = await courseRes.json();
        const statusData = await statusRes.json();

        setCourse(courseData);
        setIsEnrolled(statusData.isEnrolled);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [slug, token]);

  const handleEnrollment = async () => {
    setLoading(true);
    try {
      if (course.cost === 0) {
        await fetch(`http://localhost:3001/api/enrollment/free`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ courseId: course._id }),
        });
        navigate(`/learn/${slug}`);
      } else {
        const orderResponse = await fetch(
          "http://localhost:3001/api/enrollment/create-order",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ courseId: course._id }),
          }
        );
        const orderData = await orderResponse.json();

        const options = {
          key: orderData.key,
          amount: orderData.amount,
          currency: "INR",
          name: "Code & Chill",
          description: `Enrollment for ${course.title}`,
          order_id: orderData.orderId,
          handler: async function (response: any) {
            const verificationResponse = await fetch(
              "http://localhost:3001/api/enrollment/verify-payment",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ...response, courseId: course._id }),
              }
            );
            const verificationData = await verificationResponse.json();
            if (verificationData.success) {
              navigate("/payment/success");
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          },
          prefill: {
            name: "Test User",
            email: "test.user@example.com",
            contact: "9999999999",
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (e) {
      console.error("Enrollment process failed:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-black">
        <div className="container mx-auto max-w-7xl px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md" />
              <Skeleton className="h-96 bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md" />
            </div>
            <Skeleton className="h-80 bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="w-full min-h-screen bg-black">
        <div className="container mx-auto max-w-7xl px-4 py-16">
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-12 max-w-md mx-auto">
              <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-2">
                Course Not Found
              </h2>
              <p className="text-gray-400 mb-6">
                {error || "Could not load course details."}
              </p>
              <Link to="/courses">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                  Browse Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-green-500/3 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border-b border-gray-700">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-4 mb-6">
            <BookOpen className="text-purple-400" size={48} />
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
              {course.title}
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl leading-relaxed mb-8">
            {course.description}
          </p>

          {/* Instructor Info */}
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 ring-4 ring-purple-500/30">
              <AvatarImage src={course.tutor.image} alt={course.tutor.name} />
              <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white text-xl font-bold">
                {course.tutor.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm text-gray-400">Instructor</div>
              <div className="text-lg font-semibold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                {course.tutor.name}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 hover:border-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-black/60">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                  Course Content
                </h2>

                <Accordion type="single" collapsible className="w-full space-y-4">
                  {course.modules.map((module: any, index: number) => (
                    <div key={index} className="bg-black/30 backdrop-blur-sm border border-gray-600 rounded-md overflow-hidden">
                      <AccordionItem value={`item-${index}`} className="border-none">
                        <AccordionTrigger className="px-6 py-4 hover:bg-gray-700/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                              {index + 1}
                            </div>
                            <span className="font-semibold text-lg bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                              {module.title}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                          <ul className="space-y-3 mt-4">
                            {module.lessons.map((lesson: any, lessonIndex: number) => (
                              <li
                                key={lesson._id}
                                className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg hover:bg-gray-700/30 transition-colors"
                              >
                                <PlayCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                                <span className="text-gray-300 flex-1">{lesson.title}</span>
                                <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
                                  {lessonIndex + 1}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </div>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-6">
            <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 hover:border-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-black/60">
              <CardContent className="p-0">
                {/* Price Section */}
                <div className="p-8 text-center border-b border-gray-700">
                  <div className="text-5xl font-bold mb-2">
                    {course.cost === 0 ? (
                      <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        FREE
                      </span>
                    ) : (
                      <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        ${course.cost}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-400">One-time payment</div>
                </div>

                {/* Enrollment Button */}
                <div className="p-6">
                  {isEnrolled ? (
                    <Link to={`/learn/${slug}`}>
                      <Button size="lg" className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Continue Learning
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      onClick={handleEnrollment}
                      size="lg"
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold"
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Enroll Now"}
                    </Button>
                  )}
                </div>

                {/* Course Features */}
                <div className="p-6 pt-0 space-y-4">
                  <div className="text-sm font-medium text-gray-300 mb-4">This course includes:</div>

                  <div className="flex items-center gap-3 text-gray-400">
                    <Clock className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <span>12.5 hours of content</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-400">
                    <BookOpen className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>{course.modules.length} modules</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-400">
                    <BarChart className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span>Advanced Level</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-400">
                    <Award className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <span>Certificate of Completion</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-400">
                    <Users className="w-5 h-5 text-orange-400 flex-shrink-0" />
                    <span>Lifetime access</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-400">
                    <Star className="w-5 h-5 text-pink-400 flex-shrink-0" />
                    <span>Expert instruction</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
