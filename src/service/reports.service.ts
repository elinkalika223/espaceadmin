import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface MonthlyData {
  mois: string;
  nombre: number;
}

export interface WeeklyConsultationData {
  jour: string;
  cpn: number;
  cpon: number;
  urgences: number;
}

export interface PatienteReportDto {
  id: number;
  nom: string;
  prenom: string;
  age: number | null;
  dateInscription: string;
  statut: string;
  nombreConsultations: number;
  prochainRDV: string | null;
}

export interface ConsultationReportDto {
  date: string;
  patiente: string;
  medecin: string;
  type: string;
  statut: string;
}

export interface RepartitionCpnCponDto {
  cpnRealisees: number;
  cponRealisees: number;
  cpnManquees: number;
  cponManquees: number;
}

export interface TrimestreData {
  trimestre: string;
  cpnRealisees: number;
  cpnManquees: number;
}

export interface MonthlyDetailData {
  nom: string;
  cpnRealisees: number;
  cpnManquees: number;
  cponRealisees: number;
  cponManquees: number;
  tauxReussite: string;
}

export interface ReportsStatsDto {
  totalPatientes: number;
  totalConsultations: number;
  totalAccouchements: number;
  tauxSuivi: number;
  nouvellesPatientesCeMois: number;
  nouvellesConsultationsCeMois: number;
  nouveauxAccouchementsCetteSemaine: number;
  variationTauxSuivi: number;
  evolutionInscriptions: MonthlyData[];
  consultationsHebdomadaires: WeeklyConsultationData[];
  repartitionParStatut: { [key: string]: number };
  patientesRecentes: PatienteReportDto[];
  consultationsRecentes: ConsultationReportDto[];
  repartitionCpnCpon?: RepartitionCpnCponDto;
  cpnParTrimestre?: TrimestreData[];
  monthlyDetailData?: MonthlyDetailData[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

/**
 * Service pour les rapports et statistiques
 */
@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  constructor(private apiService: ApiService) {}

  /**
   * Récupère toutes les statistiques de rapports
   * @param period - Période: 'week', 'month', 'quarter', 'year' (défaut: 'month')
   * @param year - Année pour filtrer les données mensuelles (optionnel)
   */
  getReportsStats(period: string = 'month', year?: number): Observable<ReportsStatsDto> {
    let url = `/reports/stats?period=${period}`;
    if (year) {
      url += `&year=${year}`;
    }
    return this.apiService.get<ApiResponse<ReportsStatsDto>>(url).pipe(
      map(response => response.data)
    );
  }
}

