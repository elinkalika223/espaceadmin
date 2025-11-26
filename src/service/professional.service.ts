import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface ProfessionnelSante {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  role: string;
  actif: boolean;
  specialite: string; // GYNECOLOGUE, PEDIATRE, GENERALISTE
  identifiantProfessionnel: string;
  langue?: string;
  dateCreation?: string;
  dateModification?: string;
  patientes?: any[]; // Liste des patientes assignées
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

/**
 * Service pour la gestion des professionnels de santé
 */
@Injectable({
  providedIn: 'root'
})
export class ProfessionalService {
  constructor(private apiService: ApiService) {}

  /**
   * Récupère tous les professionnels de santé
   */
  getAllProfessionals(): Observable<ProfessionnelSante[]> {
    return this.apiService.get<ApiResponse<ProfessionnelSante[]>>('/utilisateurs/professionnels').pipe(
      map(response => response.data || [])
    );
  }

  /**
   * Récupère tous les médecins
   */
  getAllMedecins(): Observable<ProfessionnelSante[]> {
    return this.apiService.get<ApiResponse<ProfessionnelSante[]>>('/utilisateurs/medecins').pipe(
      map(response => response.data || [])
    );
  }

  /**
   * Récupère un professionnel par ID
   */
  getProfessionalById(id: number): Observable<ProfessionnelSante> {
    return this.apiService.get<ApiResponse<ProfessionnelSante>>(`/utilisateurs/professionnels/${id}`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Met à jour un professionnel
   */
  updateProfessional(id: number, updates: Partial<ProfessionnelSante>): Observable<ProfessionnelSante> {
    return this.apiService.put<ApiResponse<ProfessionnelSante>>(`/utilisateurs/${id}`, updates).pipe(
      map(response => response.data)
    );
  }

  /**
   * Supprime un professionnel
   * Note: L'endpoint DELETE n'existe pas encore dans le backend
   */
  deleteProfessional(id: number): Observable<boolean> {
    // TODO: Implémenter quand l'endpoint sera disponible
    // return this.apiService.delete<ApiResponse<any>>(`/utilisateurs/${id}`).pipe(
    //   map(response => response.success)
    // );
    throw new Error('Endpoint DELETE non disponible');
  }
}

