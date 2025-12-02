import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Content } from '../model/contentmodel';

export interface Conseil {
  id: number;
  titre: string;
  contenu?: string;
  lienMedia?: string;
  categorie: string; // NUTRITION, HYGIENE, ALLAITEMENT, PREVENTION, SANTE_GENERALE
  cible: string; // Femme enceinte, Jeune mère, etc.
  actif: boolean;
  createurId?: number;
  createurNom?: string;
  dateCreation?: string;
  dateModification?: string;
}

export interface ConseilRequest {
  titre: string;
  contenu?: string;
  lienMedia?: string;
  categorie: string;
  cible: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

/**
 * Service pour la gestion des conseils éducatifs (contenus)
 */
@Injectable({
  providedIn: 'root'
})
export class ConseilService {
  constructor(private apiService: ApiService) {}

  /**
   * Récupère tous les conseils (pour admin - actifs et inactifs)
   */
  getAllConseils(): Observable<Conseil[]> {
    return this.apiService.get<ApiResponse<Conseil[]>>('/conseils?all=true').pipe(
      map(response => response.data || [])
    );
  }

  /**
   * Récupère tous les conseils actifs
   */
  getConseilsActifs(): Observable<Conseil[]> {
    return this.apiService.get<ApiResponse<Conseil[]>>('/conseils').pipe(
      map(response => response.data || [])
    );
  }

  /**
   * Récupère les conseils avec filtres
   */
  getConseilsFiltres(params?: {
    type?: string;
    categorie?: string;
    cible?: string;
  }): Observable<Conseil[]> {
    let url = '/conseils?';
    if (params?.type) url += `type=${params.type}&`;
    if (params?.categorie) url += `categorie=${params.categorie}&`;
    if (params?.cible) url += `cible=${params.cible}&`;
    
    return this.apiService.get<ApiResponse<Conseil[]>>(url.replace(/[&?]$/, '')).pipe(
      map(response => response.data || [])
    );
  }

  /**
   * Récupère un conseil par ID
   */
  getConseilById(id: number): Observable<Conseil> {
    return this.apiService.get<ApiResponse<Conseil>>(`/conseils/id/${id}`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Crée un nouveau conseil
   */
  createConseil(request: ConseilRequest): Observable<Conseil> {
    return this.apiService.post<ApiResponse<Conseil>>('/conseils', request).pipe(
      map(response => response.data)
    );
  }

  /**
   * Met à jour un conseil
   */
  updateConseil(id: number, request: ConseilRequest): Observable<Conseil> {
    return this.apiService.put<ApiResponse<Conseil>>(`/conseils/id/${id}`, request).pipe(
      map(response => response.data)
    );
  }

  /**
   * Supprime un conseil
   */
  deleteConseil(id: number): Observable<void> {
    return this.apiService.delete<ApiResponse<void>>(`/conseils/id/${id}`).pipe(
      map(() => undefined)
    );
  }

  /**
   * Upload une vidéo
   */
  uploadVideo(file: File): Observable<{ fileName: string; fileUrl: string; originalFileName: string }> {
    return this.apiService.uploadFile<ApiResponse<{ fileName: string; fileUrl: string; originalFileName: string }>>(
      '/conseils/upload/video',
      file
    ).pipe(
      map(response => response.data)
    );
  }

  /**
   * Convertit un Conseil (backend) en Content (frontend)
   */
  conseilToContent(conseil: Conseil): Content {
    // Déterminer le type basé sur le lienMedia
    let type: 'article' | 'video' | 'nutrition' | 'tutorial' = 'article';
    if (conseil.lienMedia) {
      const lien = conseil.lienMedia.toLowerCase();
      if (lien.includes('youtube') || lien.includes('youtu.be') || 
          lien.endsWith('.mp4') || lien.endsWith('.avi') || lien.endsWith('.mkv')) {
        type = 'video';
      } else if (lien.endsWith('.mp3') || lien.endsWith('.wav') || lien.endsWith('.m4a')) {
        type = 'article'; // Les audios sont traités comme articles pour l'instant
      }
    }

    // Mapper la catégorie
    const categoryMap: { [key: string]: string } = {
      'NUTRITION': 'Nutrition',
      'HYGIENE': 'Santé infantile',
      'ALLAITEMENT': 'Grossesse',
      'PREVENTION': 'Santé infantile',
      'SANTE_GENERALE': 'Grossesse'
    };

    // Déterminer la langue (par défaut français, peut être amélioré)
    const language: 'french' | 'bambara' | 'soninke' | 'tamasheq' = 'french';

    return {
      id: conseil.id.toString(),
      title: conseil.titre,
      type: type,
      category: categoryMap[conseil.categorie] || conseil.categorie,
      author: conseil.createurNom || 'Système',
      content: conseil.contenu || '',
      publishDate: conseil.dateCreation || new Date().toISOString(),
      views: 0, // Le backend n'a pas de compteur de vues pour l'instant
      status: conseil.actif ? 'published' : 'archived',
      language: language,
      targetAudience: conseil.cible,
      videoUrl: type === 'video' ? conseil.lienMedia : undefined,
      thumbnailUrl: type === 'video' ? undefined : undefined,
      createdAt: conseil.dateCreation ? new Date(conseil.dateCreation) : new Date(),
      updatedAt: conseil.dateModification ? new Date(conseil.dateModification) : new Date()
    };
  }

  /**
   * Convertit un Content (frontend) en ConseilRequest (backend)
   */
  contentToConseilRequest(content: Partial<Content>): ConseilRequest {
    // Mapper la catégorie inverse
    const categoryMap: { [key: string]: string } = {
      'Nutrition': 'NUTRITION',
      'Santé infantile': 'SANTE_GENERALE',
      'Grossesse': 'SANTE_GENERALE',
      'Exercices prénatals': 'SANTE_GENERALE'
    };

    return {
      titre: content.title || '',
      contenu: content.content || '',
      lienMedia: content.videoUrl || content.thumbnailUrl || '',
      categorie: categoryMap[content.category || ''] || 'SANTE_GENERALE',
      cible: content.targetAudience || 'Femme enceinte'
    };
  }
}

