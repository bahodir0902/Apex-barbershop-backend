import apiClient from '@/lib/api';
import type { 
  Barbershop, 
  Barber, 
  Haircut, 
  ApiResponse, 
  PaginatedResponse,
  AvailableSlot,
  AvailableDaysResponse
} from '@/types';

export interface BarbershopFilters {
  search?: string;
  is_active?: boolean;
  ordering?: string;
  page?: number;
}

export interface BarberFilters {
  barbershop?: string;
  is_active?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
}

export interface HaircutFilters {
  barbershop?: string;
  is_active?: boolean;
  min_price?: number;
  max_price?: number;
  search?: string;
  ordering?: string;
  page?: number;
}

export const barbershopService = {
  // Barbershops
  async getBarbershops(filters?: BarbershopFilters): Promise<PaginatedResponse<Barbershop>> {
    const response = await apiClient.get<PaginatedResponse<Barbershop>>('/barbershops/', {
      params: filters,
    });
    return response.data;
  },

  async getBarbershop(id: string): Promise<Barbershop> {
    const response = await apiClient.get<Barbershop>(`/barbershops/${id}/`);
    return response.data;
  },

  async getBarbershopBarbers(id: string): Promise<ApiResponse<Barber[]>> {
    const response = await apiClient.get<ApiResponse<Barber[]>>(`/barbershops/${id}/barbers/`);
    return response.data;
  },

  async getBarbershopHaircuts(id: string): Promise<ApiResponse<Haircut[]>> {
    const response = await apiClient.get<ApiResponse<Haircut[]>>(`/barbershops/${id}/haircuts/`);
    return response.data;
  },

  // Barbers
  async getBarbers(filters?: BarberFilters): Promise<PaginatedResponse<Barber>> {
    const response = await apiClient.get<PaginatedResponse<Barber>>('/barbers/', {
      params: filters,
    });
    return response.data;
  },

  async getBarber(id: string): Promise<Barber> {
    const response = await apiClient.get<Barber>(`/barbers/${id}/`);
    return response.data;
  },

  async getBarberAvailableDays(barberId: string): Promise<ApiResponse<AvailableDaysResponse>> {
    const response = await apiClient.get<ApiResponse<AvailableDaysResponse>>(
      `/barbers/${barberId}/available_days/`
    );
    return response.data;
  },

  async getBarberAvailableSlots(barberId: string, date: string): Promise<ApiResponse<AvailableSlot>> {
    const response = await apiClient.get<ApiResponse<AvailableSlot>>(
      `/barbers/${barberId}/available_slots/`,
      { params: { date } }
    );
    return response.data;
  },

  // Haircuts
  async getHaircuts(filters?: HaircutFilters): Promise<PaginatedResponse<Haircut>> {
    const response = await apiClient.get<PaginatedResponse<Haircut>>('/haircuts/', {
      params: filters,
    });
    return response.data;
  },

  async getHaircut(id: string): Promise<Haircut> {
    const response = await apiClient.get<Haircut>(`/haircuts/${id}/`);
    return response.data;
  },

  async getHaircutBarbers(id: string): Promise<ApiResponse<Barber[]>> {
    const response = await apiClient.get<ApiResponse<Barber[]>>(`/haircuts/${id}/barbers/`);
    return response.data;
  },
};

export default barbershopService;
