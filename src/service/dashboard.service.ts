import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

export interface DashboardStatsResponse {
  totalPatientes: number;
  suivisTermines: number;
  suivisEnCours: number;
  rappelsActifs: number;
  alertesActives: number;
}

export interface AdminDashboardStats {
  totalPatientes: number;
  totalProfessionnels: number;
  totalGrossessesEnCours: number;
  totalGrossessesTerminees: number;
  totalEnfants: number;
  cpnRespectRate?: number;
  vaccinationRate?: number;
  totalRappelsEnvoyes?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

/**
 * Service pour le dashboard
 */
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  /**
   * Récupère les statistiques du dashboard pour un médecin
   */
  getMedecinStats(): Observable<DashboardStatsResponse> {
    return this.apiService.get<ApiResponse<DashboardStatsResponse>>('/dashboard/medecin').pipe(
      map(response => response.data)
    );
  }

  /**
   * Récupère les statistiques du dashboard pour un administrateur
   */
  getAdminStats(): Observable<AdminDashboardStats> {
    return this.apiService.get<ApiResponse<AdminDashboardStats>>('/dashboard/admin').pipe(
      map(response => response.data)
    );
  }

  /**
   * Récupère les statistiques selon le rôle de l'utilisateur connecté
   */
  getStats(): Observable<DashboardStatsResponse | AdminDashboardStats> {
    const user = this.authService.getCurrentUser();
    if (user && user.role === 'ADMINISTRATEUR') {
      return this.getAdminStats();
    } else {
      return this.getMedecinStats();
    }
  }
}

