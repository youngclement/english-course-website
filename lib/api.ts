const API_BASE_URL = "https://bhv-be-production.up.railway.app/api";

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
