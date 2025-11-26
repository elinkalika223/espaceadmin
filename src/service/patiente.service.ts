import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface PatienteListDto {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  dateDeNaissance?: string;
  adresse?: string;
  grossesses?: GrossesseBrief[];
  enfants?: EnfantBrief[];
}

export interface GrossesseBrief {
  id: number;
  dateDebut: string;
  datePrevueAccouchement: string;
  statut: string;
}

export interface EnfantBrief {
  id: number;
  nom: string;
  prenom: string;
  dateDeNaissance: string;
  sexe: string;
}

export interface PatienteDetailDto {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  dateDeNaissance?: string;
  adresse?: string;
  age?: number;
  medecinAssigne?: any;
  grossesses?: any[];
  enfants?: any[];
  consultationsPrenatales?: any[];
  consultationsPostnatales?: any[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

/**
 * Service pour la gestion des patientes
 */
@Injectable({
  providedIn: 'root'
})
export class PatienteService {
  constructor(private apiService: ApiService) {}

  /**
   * Récupère toutes les patientes (accessible à tous les utilisateurs authentifiés)
   * Utilise le même endpoint que les professionnels pour la cohérence
   */
  getAllPatientes(): Observable<PatienteListDto[]> {
    return this.apiService.get<ApiResponse<PatienteListDto[]>>('/utilisateurs/patientes').pipe(
      map(response => response.data || [])
    );
  }

  /**
   * Récupère les détails d'une patiente
   */
  getPatienteById(id: number): Observable<PatienteDetailDto> {
    return this.apiService.get<ApiResponse<PatienteDetailDto>>(`/patientes/${id}`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Récupère les patientes avec grossesse en cours pour un médecin
   */
  getPatientesGrossesseEnCours(medecinId: number): Observable<PatienteListDto[]> {
    return this.apiService.get<ApiResponse<PatienteListDto[]>>(`/patientes/medecin/${medecinId}/grossesse-en-cours`).pipe(
      map(response => response.data || [])
    );
  }

  /**
   * Récupère les patientes avec grossesse terminée pour un médecin
   */
  getPatientesGrossesseTerminee(medecinId: number): Observable<PatienteListDto[]> {
    return this.apiService.get<ApiResponse<PatienteListDto[]>>(`/patientes/medecin/${medecinId}/grossesse-terminee`).pipe(
      map(response => response.data || [])
    );
  }

  /**
   * Récupère les patientes avec enfants pour un médecin
   */
  getPatientesAvecEnfants(medecinId: number): Observable<PatienteListDto[]> {
    return this.apiService.get<ApiResponse<PatienteListDto[]>>(`/patientes/medecin/${medecinId}/enfants`).pipe(
      map(response => response.data || [])
    );
  }
}

