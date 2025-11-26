import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface LoginRequest {
  telephone: string;
  motDePasse: string;
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  telephone: string;
  motDePasse: string;
  role: 'PATIENTE' | 'MEDECIN' | 'ADMINISTRATEUR';
  langue?: string;
}

export interface JwtAuthResponse {
  token: string;
  type: string;
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  role: string;
  dateDeNaissance?: string; // Pour les patientes
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

export interface AuthResponse extends ApiResponse<JwtAuthResponse> {}

export interface User {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  role: string;
}

/**
 * Service d'authentification
 * Gère la connexion, déconnexion et le stockage du token JWT
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  /**
   * Connexion
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.apiService.post<ApiResponse<JwtAuthResponse>>('/auth/login', credentials).pipe(
      tap(response => {
        if (response.success && response.data && response.data.token) {
          this.setToken(response.data.token);
          this.setUser(response.data);
        }
      }),
      catchError(error => {
        console.error('Erreur de connexion:', error);
        // Extraire le message d'erreur du backend
        if (error.error && error.error.message) {
          throw new Error(error.error.message);
        }
        throw error;
      })
    );
  }

  /**
   * Inscription
   */
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.apiService.post<ApiResponse<JwtAuthResponse>>('/auth/register', data).pipe(
      tap(response => {
        if (response.success && response.data && response.data.token) {
          this.setToken(response.data.token);
          this.setUser(response.data);
        }
      }),
      catchError(error => {
        console.error('Erreur d\'inscription:', error);
        // Extraire le message d'erreur du backend
        if (error.error && error.error.message) {
          throw new Error(error.error.message);
        }
        throw error;
      })
    );
  }

  /**
   * Déconnexion
   */
  logout(): void {
    // Appeler l'endpoint de déconnexion si nécessaire
    this.apiService.post('/auth/logout', {}).subscribe({
      next: () => {
        this.clearAuth();
        this.router.navigate(['/login']);
      },
      error: () => {
        // Même en cas d'erreur, on déconnecte localement
        this.clearAuth();
        this.router.navigate(['/login']);
      }
    });
  }

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   */
  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === role;
  }

  /**
   * Vérifie si l'utilisateur est administrateur
   */
  isAdmin(): boolean {
    return this.hasRole('ADMINISTRATEUR');
  }

  /**
   * Récupère le token JWT
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Récupère l'utilisateur actuel
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Stocke le token JWT
   */
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Stocke les informations utilisateur
   */
  private setUser(userData: JwtAuthResponse): void {
    const user: User = {
      id: userData.id,
      nom: userData.nom,
      prenom: userData.prenom,
      telephone: userData.telephone,
      role: userData.role.toString() // Convertir l'enum en string
    };
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  /**
   * Récupère l'utilisateur stocké
   */
  private getStoredUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Nettoie les données d'authentification
   */
  private clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }
}

