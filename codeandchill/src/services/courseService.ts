import { api } from "@/utils";
import { API_ENDPOINTS } from "@/constants";
import type { Course, GeneralCourse } from "@/types";

export const courseService = {
  // CS Courses (Free)
  getCourses: async (): Promise<Course[]> => {
    return api.get<Course[]>(API_ENDPOINTS.COURSES);
  },

  getCourseBySlug: async (slug: string): Promise<Course> => {
    return api.get<Course>(`${API_ENDPOINTS.COURSES}/${slug}`);
  },

  // General Courses (Paid/Free)
  getGeneralCourses: async (): Promise<GeneralCourse[]> => {
    return api.get<GeneralCourse[]>(API_ENDPOINTS.GENERAL_COURSES);
  },

  getGeneralCourseBySlug: async (slug: string): Promise<GeneralCourse> => {
    return api.get<GeneralCourse>(`${API_ENDPOINTS.GENERAL_COURSES}/${slug}`);
  },

  // Enrollment
  checkEnrollmentStatus: async (slug: string): Promise<{ isEnrolled: boolean }> => {
    return api.get<{ isEnrolled: boolean }>(`${API_ENDPOINTS.ENROLLMENT.STATUS}/${slug}`);
  },

  enrollInFreeCourse: async (courseId: string): Promise<{ message: string }> => {
    return api.post<{ message: string }>(API_ENDPOINTS.ENROLL_FREE, { courseId });
  },

  createPaymentOrder: async (courseSlug: string): Promise<any> => {
    return api.post<any>(API_ENDPOINTS.ENROLLMENT.CREATE_ORDER, { courseSlug });
  },

  verifyPayment: async (paymentData: any): Promise<{ success: boolean; message: string }> => {
    return api.post<{ success: boolean; message: string }>(
      API_ENDPOINTS.ENROLLMENT.VERIFY_PAYMENT,
      paymentData
    );
  },
};