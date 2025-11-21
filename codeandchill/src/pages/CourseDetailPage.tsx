/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent} from "@/components/ui/card";
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
import { Clock, BarChart, PlayCircle, CheckCircle } from "lucide-react";
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
      <div className="container p-8">
        <Skeleton className="h-[80vh] w-full" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="text-center p-12 text-destructive">
        {error || "Could not load course details."}
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen text-foreground relative">
      {/* Consistent Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      <header className="py-16 bg-muted/20">
        <div className="container mx-auto max-w-7xl px-6">
          <h1 className="text-5xl font-extrabold tracking-tight">
            {course.title}
          </h1>
          <p className="mt-4 max-w-3xl text-xl text-muted-foreground">
            {course.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src={course.tutor.image} alt={course.tutor.name} />
                <AvatarFallback>{course.tutor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="font-semibold text-lg">{course.tutor.name}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2">
            <Card className="rounded-2xl shadow-xl p-8 bg-card">
              <h2 className="text-3xl font-extrabold mb-8">Course Content</h2>
              <Accordion type="single" collapsible className="w-full">
                {course.modules.map((module: any, index: number) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="font-semibold text-lg">
                      {module.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-3 pl-6 mt-3">
                        {module.lessons.map((lesson: any) => (
                          <li
                            key={lesson._id}
                            className="flex items-center gap-3 text-muted-foreground"
                          >
                            <PlayCircle className="h-5 w-5 text-primary" />{" "}
                            {lesson.title}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </div>
          <div className="lg:sticky top-28">
            <Card className="rounded-2xl shadow-2xl overflow-hidden bg-card">
              <div className="p-10 text-center">
                <h2 className="text-6xl font-extrabold text-primary">
                  ${course.cost}
                </h2>
              </div>
              <CardContent className="p-8 space-y-8">
                {isEnrolled ? (
                  <Button asChild size="lg" className="w-full font-bold">
                    <Link to={`/learn/${slug}`}>Go to Course</Link>
                  </Button>
                ) : (
                  <Button
                    onClick={handleEnrollment}
                    size="lg"
                    className="w-full font-bold"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Enroll Now"}
                  </Button>
                )}
                <div className="space-y-6 pt-8 border-t">
                  <p className="flex items-center gap-4 text-muted-foreground font-medium text-lg">
                    <Clock className="h-7 w-7 text-primary" /> 12.5 hours of
                    content
                  </p>
                  <p className="flex items-center gap-4 text-muted-foreground font-medium text-lg">
                    <BarChart className="h-7 w-7 text-primary" /> Advanced Level
                  </p>
                  <p className="flex items-center gap-4 text-muted-foreground font-medium text-lg">
                    <CheckCircle className="h-7 w-7 text-primary" /> Certificate
                    of Completion
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
