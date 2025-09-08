const API_BASE_URL = "http://localhost:8080/api";

export interface CourseRegistration {
  full_name: string;
  email: string;
  phone: string;
  course_name: string;
  notes: string;
}

export interface MemberRegistration {
  full_name: string;
  email: string;
  phone: string;
  notes: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  registrations: T[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

export interface ConsultationPaginatedResponse<T> {
  consultations: T[];
  pagination: {
    current_page: number;
    total_pages: number;
    total: number;
    per_page: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface CourseRegistrationWithId extends CourseRegistration {
  _id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemberRegistrationWithId extends MemberRegistration {
  _id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

// Auth API
export const authAPI = {
  login: async (
    credentials: LoginCredentials
  ): Promise<ApiResponse<AuthResponse>> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  getProfile: async (token: string): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  changePassword: async (
    token: string,
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return response.json();
  },
};

// Course Registration API
export const courseAPI = {
  register: async (
    data: CourseRegistration
  ): Promise<ApiResponse<CourseRegistrationWithId>> => {
    const response = await fetch(`${API_BASE_URL}/courses/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  getAll: async (
    token: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: string
  ): Promise<ApiResponse<PaginatedResponse<CourseRegistrationWithId>>> => {
    let url = `${API_BASE_URL}/courses?page=${page}&limit=${limit}`;
    if (search) url += `&course_name=${encodeURIComponent(search)}`;
    if (status && status !== "all") url += `&status=${status}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getById: async (
    token: string,
    id: string
  ): Promise<ApiResponse<CourseRegistrationWithId>> => {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  updateStatus: async (
    token: string,
    id: string,
    status: string,
    notes?: string
  ): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE_URL}/courses/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, notes }),
    });
    return response.json();
  },

  delete: async (token: string, id: string): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },
};

// Member Registration API
export const memberAPI = {
  register: async (
    data: MemberRegistration
  ): Promise<ApiResponse<MemberRegistrationWithId>> => {
    const response = await fetch(`${API_BASE_URL}/members/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  getAll: async (
    token: string,
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<ApiResponse<PaginatedResponse<MemberRegistrationWithId>>> => {
    let url = `${API_BASE_URL}/members?page=${page}&limit=${limit}`;
    if (status && status !== "all") url += `&status=${status}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getById: async (
    token: string,
    id: string
  ): Promise<ApiResponse<MemberRegistrationWithId>> => {
    const response = await fetch(`${API_BASE_URL}/members/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  updateStatus: async (
    token: string,
    id: string,
    status: string,
    notes?: string
  ): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE_URL}/members/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, notes }),
    });
    return response.json();
  },

  delete: async (token: string, id: string): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE_URL}/members/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },
};

// Utility function to handle API errors
export const handleApiError = (error: any): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "Có lỗi xảy ra, vui lòng thử lại";
};

// Consultation interfaces
export interface ConsultationRegistration {
  full_name: string;
  email: string;
  phone: string;
  consultation_type: string;
  preferred_date: string;
  preferred_time: string;
  consultation_method: string;
  current_status: string;
  goals: string;
  additional_notes?: string;
}

export interface ConsultationRegistrationWithId extends ConsultationRegistration {
  _id: string;
  consultation_type_display: string;
  status: string;
  status_display: string;
  follow_up_required: boolean;
  assigned_consultant?: string;
  consultation_date?: string;
  consultation_notes?: string;
  follow_up_date?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConsultationStats {
  total: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
  };
  status_distribution: Array<{ _id: string; count: number }>;
  type_distribution: Array<{ _id: string; count: number }>;
  method_distribution: Array<{ _id: string; count: number }>;
  recent_trend: Array<{ _id: string; count: number }>;
  period_days: number;
}

// Consultation API
export const consultationAPI = {
  register: async (
    data: ConsultationRegistration
  ): Promise<ApiResponse<ConsultationRegistrationWithId>> => {
    const response = await fetch(`${API_BASE_URL}/consultations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response.json();
  },

  getAll: async (
    token: string,
    page: number = 1,
    limit: number = 10,
    status?: string,
    consultation_type?: string,
    search?: string,
    date_from?: string,
    date_to?: string
  ): Promise<ApiResponse<ConsultationPaginatedResponse<ConsultationRegistrationWithId>>> => {
    let url = `${API_BASE_URL}/consultations?page=${page}&limit=${limit}`;
    if (status && status !== "all") url += `&status=${status}`;
    if (consultation_type && consultation_type !== "all") url += `&consultation_type=${consultation_type}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (date_from) url += `&date_from=${date_from}`;
    if (date_to) url += `&date_to=${date_to}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.json();
  },

  getById: async (
    token: string,
    id: string
  ): Promise<ApiResponse<ConsultationRegistrationWithId>> => {
    const response = await fetch(`${API_BASE_URL}/consultations/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.json();
  },

  updateStatus: async (
    token: string,
    id: string,
    status: string,
    consultation_notes?: string,
    follow_up_required?: boolean,
    follow_up_date?: string
  ): Promise<ApiResponse<ConsultationRegistrationWithId>> => {
    const response = await fetch(`${API_BASE_URL}/consultations/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status,
        consultation_notes,
        follow_up_required,
        follow_up_date,
      }),
    });

    return response.json();
  },

  update: async (
    token: string,
    id: string,
    data: Partial<ConsultationRegistration & {
      status: string;
      assigned_consultant: string;
      consultation_date: string;
      consultation_notes: string;
      follow_up_required: boolean;
      follow_up_date: string;
    }>
  ): Promise<ApiResponse<ConsultationRegistrationWithId>> => {
    const response = await fetch(`${API_BASE_URL}/consultations/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return response.json();
  },

  delete: async (
    token: string,
    id: string
  ): Promise<ApiResponse<void>> => {
    const response = await fetch(`${API_BASE_URL}/consultations/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.json();
  },

  getStats: async (
    token: string,
    period: number = 30
  ): Promise<ApiResponse<ConsultationStats>> => {
    const response = await fetch(`${API_BASE_URL}/consultations/stats?period=${period}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.json();
  },
};

// IELTS Test Interfaces
export interface IELTSOption {
  optionId: string;
  text: string;
}

export interface IELTSQuestion {
  questionNumber: number;
  questionType: 'multiple-choice' | 'fill-blank' | 'true-false' | 'matching' | 'short-answer' | 'essay' | 'speaking';
  questionText: string;
  options?: IELTSOption[];
  correctAnswer?: string;
  points: number;
  audioUrl?: string;
  imageUrl?: string;
}

export interface IELTSSection {
  sectionType: 'listening' | 'reading' | 'writing' | 'speaking';
  sectionNumber: number;
  title: string;
  description?: string;
  timeLimit: number;
  questions: IELTSQuestion[];
}

export interface IELTSTest {
  _id?: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  testType: 'full-test' | 'listening-only' | 'reading-only' | 'writing-only' | 'speaking-only';
  duration: number;
  questionCount?: number;
  maxScore?: number;
  passingScore: number;
  sections: IELTSSection[];
  isActive?: boolean;
  createdBy?: {
    _id: string;
    email: string;
    role: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface IELTSTestSubmission {
  _id?: string;
  testId: string | {
    _id: string;
    title: string;
    level: string;
    testType: string;
  };
  userId: string | {
    _id: string;
    email: string;
    role: string;
  };
  test?: {
    _id: string;
    title: string;
    level: string;
    passingScore: number;
  };
  answers: Array<{
    questionNumber: number;
    sectionType: string;
    answer: string;
    timeSpent: number;
  }>;
  startTime: string;
  endTime?: string;
  totalTimeSpent?: number;
  overallScore?: number;
  maxOverallScore?: number;
  overallPercentage?: number;
  overallBandScore?: number;
  sectionResults?: Array<{
    sectionType: string;
    score: number;
    maxScore: number;
    percentage: number;
    bandScore: number;
    correctAnswers: number;
    totalQuestions: number;
  }>;
  status: 'in-progress' | 'completed' | 'abandoned';
  attemptNumber: number;
  isPassed?: boolean;
  analysis?: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
}

export interface IELTSTestsResponse {
  tests: IELTSTest[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface IELTSSubmissionsResponse {
  submissions: IELTSTestSubmission[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface IELTSStatistics {
  overview: {
    totalTests: number;
    totalSubmissions: number;
    completedSubmissions: number;
    inProgressSubmissions: number;
  };
  avgScoresByLevel: Array<{
    _id: string;
    averageScore: number;
    count: number;
  }>;
  popularTests: Array<{
    testId: string;
    title: string;
    submissionCount: number;
    averageScore: number;
  }>;
}

// IELTS API
export const ieltsAPI = {
  // Student APIs
  getTests: async (
    token: string,
    params: {
      page?: number;
      limit?: number;
      level?: string;
      testType?: string;
      isActive?: boolean;
    } = {}
  ): Promise<ApiResponse<IELTSTestsResponse>> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    
    const response = await fetch(`${API_BASE_URL}/ielts/tests?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getTestDetails: async (
    token: string,
    testId: string
  ): Promise<ApiResponse<{ test: IELTSTest; hasOngoingSubmission: boolean; ongoingSubmissionId: string | null }>> => {
    const response = await fetch(`${API_BASE_URL}/ielts/tests/${testId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  startTest: async (
    token: string,
    testId: string
  ): Promise<ApiResponse<{ submissionId: string; startTime: string; attemptNumber: number }>> => {
    const response = await fetch(`${API_BASE_URL}/ielts/tests/${testId}/start`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  saveAnswer: async (
    token: string,
    submissionId: string,
    answer: {
      questionNumber: number;
      sectionType: string;
      answer: string;
      timeSpent: number;
    }
  ): Promise<ApiResponse<{ questionNumber: number; sectionType: string; savedAt: string }>> => {
    const response = await fetch(`${API_BASE_URL}/ielts/submissions/${submissionId}/answers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(answer),
    });
    return response.json();
  },

  submitTest: async (
    token: string,
    submissionId: string
  ): Promise<ApiResponse<IELTSTestSubmission>> => {
    const response = await fetch(`${API_BASE_URL}/ielts/submissions/${submissionId}/submit`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getSubmissionResults: async (
    token: string,
    submissionId: string
  ): Promise<ApiResponse<{ submission: IELTSTestSubmission; analysis: any; isPassed: boolean }>> => {
    const response = await fetch(`${API_BASE_URL}/ielts/submissions/${submissionId}/results`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getTestHistory: async (
    token: string,
    params: {
      page?: number;
      limit?: number;
      testId?: string;
    } = {}
  ): Promise<ApiResponse<IELTSSubmissionsResponse>> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    
    const response = await fetch(`${API_BASE_URL}/ielts/history?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Admin APIs
  admin: {
    getTests: async (
      token: string,
      params: {
        page?: number;
        limit?: number;
        level?: string;
        testType?: string;
        isActive?: boolean;
      } = {}
    ): Promise<ApiResponse<IELTSTestsResponse>> => {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
      
      const response = await fetch(`${API_BASE_URL}/ielts/tests?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.json();
    },

    createTest: async (
      token: string,
      test: Omit<IELTSTest, '_id' | 'createdBy' | 'createdAt' | 'updatedAt'>
    ): Promise<ApiResponse<IELTSTest>> => {
      const response = await fetch(`${API_BASE_URL}/ielts/admin/tests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(test),
      });
      return response.json();
    },

    updateTest: async (
      token: string,
      testId: string,
      test: Partial<IELTSTest>
    ): Promise<ApiResponse<IELTSTest>> => {
      const response = await fetch(`${API_BASE_URL}/ielts/admin/tests/${testId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(test),
      });
      return response.json();
    },

    deleteTest: async (
      token: string,
      testId: string
    ): Promise<ApiResponse<void>> => {
      const response = await fetch(`${API_BASE_URL}/ielts/admin/tests/${testId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.json();
    },

    getTestDetails: async (
      token: string,
      testId: string
    ): Promise<ApiResponse<{ test: IELTSTest; hasOngoingSubmission: boolean; ongoingSubmissionId: string | null }>> => {
      const response = await fetch(`${API_BASE_URL}/ielts/tests/${testId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.json();
    },

    getAllSubmissions: async (
      token: string,
      params: {
        page?: number;
        limit?: number;
        testId?: string;
        userId?: string;
        status?: string;
      } = {}
    ): Promise<ApiResponse<IELTSSubmissionsResponse>> => {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
      
      const response = await fetch(`${API_BASE_URL}/ielts/admin/submissions?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.json();
    },

    getStatistics: async (
      token: string
    ): Promise<ApiResponse<IELTSStatistics>> => {
      const response = await fetch(`${API_BASE_URL}/ielts/admin/statistics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.json();
    },
  },
};
