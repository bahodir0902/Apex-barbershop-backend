import apiClient from '@/lib/api';
import type { 
  Appointment, 
  CreateAppointmentRequest, 
  ApiResponse, 
  PaginatedResponse,
  Feedback,
  CreateFeedbackRequest
} from '@/types';

export interface AppointmentFilters {
  status?: string;
  barber?: string;
  date_from?: string;
  date_to?: string;
  ordering?: string;
  page?: number;
}

export interface FeedbackFilters {
  barber_id?: string;
  rating_min?: number;
  ordering?: string;
  page?: number;
}

export const appointmentService = {
  // Appointments
  async getAppointments(filters?: AppointmentFilters): Promise<PaginatedResponse<Appointment>> {
    const response = await apiClient.get<PaginatedResponse<Appointment>>('/appointments/', {
      params: filters,
    });
    return response.data;
  },

  async getAppointment(id: string): Promise<Appointment> {
    const response = await apiClient.get<Appointment>(`/appointments/${id}/`);
    return response.data;
  },

  async getMyAppointments(status?: string): Promise<ApiResponse<Appointment[]>> {
    const response = await apiClient.get<ApiResponse<Appointment[]>>('/appointments/my_appointments/', {
      params: { status },
    });
    return response.data;
  },

  async createAppointment(data: CreateAppointmentRequest): Promise<Appointment> {
    const response = await apiClient.post<Appointment>('/appointments/', data);
    return response.data;
  },

  async cancelAppointment(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(`/appointments/${id}/`);
    return response.data;
  },

  async completeAppointment(id: string): Promise<ApiResponse<Appointment>> {
    const response = await apiClient.post<ApiResponse<Appointment>>(`/appointments/${id}/complete/`);
    return response.data;
  },

  // Feedbacks
  async getFeedbacks(filters?: FeedbackFilters): Promise<PaginatedResponse<Feedback>> {
    const response = await apiClient.get<PaginatedResponse<Feedback>>('/feedbacks/', {
      params: filters,
    });
    return response.data;
  },

  async getBarberFeedbacks(barberId: string): Promise<ApiResponse<Feedback[]> & { stats: { average_rating: number; total_reviews: number } }> {
    const response = await apiClient.get(`/feedbacks/barber_feedbacks/`, {
      params: { barber_id: barberId },
    });
    return response.data;
  },

  async createFeedback(data: CreateFeedbackRequest): Promise<Feedback> {
    const response = await apiClient.post<Feedback>('/feedbacks/', data);
    return response.data;
  },

  async deleteFeedback(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(`/feedbacks/${id}/`);
    return response.data;
  },

  async respondToFeedback(id: string, response: string): Promise<ApiResponse<Feedback>> {
    const res = await apiClient.post<ApiResponse<Feedback>>(`/feedbacks/${id}/respond/`, {
      response,
    });
    return res.data;
  },
};

export default appointmentService;
