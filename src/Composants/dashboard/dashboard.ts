import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, AdminDashboardStats, DashboardStatsResponse } from '../../service/dashboard.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit{
  // Stats pour admin
  adminStats: AdminDashboardStats | null = null;
  // Stats pour médecin
  medecinStats: DashboardStatsResponse | null = null;
  
  isLoading = false;
  errorMessage: string | null = null;
  isAdmin = false;
  
  recentActivities: any[] = [];

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Vérifier le rôle de l'utilisateur
    const user = this.authService.getCurrentUser();
    this.isAdmin = user?.role === 'ADMINISTRATEUR';
    
    this.isLoading = true;
    this.errorMessage = null;
    
    if (this.isAdmin) {
      // Charger les stats admin
      this.dashboardService.getAdminStats().subscribe({
        next: (stats) => {
          this.adminStats = stats;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('❌ Erreur lors du chargement des stats admin:', error);
          this.errorMessage = 'Erreur lors du chargement des statistiques';
          this.isLoading = false;
        }
      });
    } else {
      // Charger les stats médecin
      this.dashboardService.getMedecinStats().subscribe({
        next: (stats) => {
          this.medecinStats = stats;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('❌ Erreur lors du chargement des stats médecin:', error);
          this.errorMessage = 'Erreur lors du chargement des statistiques';
          this.isLoading = false;
        }
      });
    }
    
    // Activités récentes (pour l'instant statiques, à améliorer avec un endpoint backend)
    this.recentActivities = [
      { date: '15/10/2025', activity: 'Nouvelle inscription patiente', user: 'Fatoumata K.', status: 'Complété' },
      { date: '14/10/2025', activity: 'Rappel CPN envoyé', user: 'Mariam D.', status: 'Envoyé' },
      { date: '14/10/2025', activity: 'Consultation prénatale manquée', user: 'Aïcha T.', status: 'En attente' },
      { date: '13/10/2025', activity: 'Vaccination effectuée', user: 'Bintou S.', status: 'Terminé' },
      { date: '12/10/2025', activity: 'Message envoyé à un professionnel', user: 'Dr. Diallo', status: 'Livré' }
    ];
  }
  
  // Getters pour les stats (compatibilité avec le template)
  get totalPatientes(): number {
    if (this.isAdmin && this.adminStats) {
      return this.adminStats.totalPatientes;
    } else if (this.medecinStats) {
      return this.medecinStats.totalPatientes;
    }
    return 0;
  }
  
  get totalProfessionnels(): number {
    if (this.isAdmin && this.adminStats) {
      return this.adminStats.totalProfessionnels;
    }
    return 0;
  }
  
  get cpnRespectRate(): number {
    if (this.isAdmin && this.adminStats) {
      return this.adminStats.cpnRespectRate || 0;
    }
    return 0;
  }
  
  get vaccinationRate(): number {
    if (this.isAdmin && this.adminStats) {
      return this.adminStats.vaccinationRate || 0;
    }
    return 0;
  }
  
  get totalRappelsEnvoyes(): number {
    if (this.isAdmin && this.adminStats) {
      return this.adminStats.totalRappelsEnvoyes || 0;
    }
    return 0;
  }

  getBadgeClass(status: string): string {
    const classes: { [key: string]: string } = {
      'Complété': 'badge-success',
      'Envoyé': 'badge-success',
      'Terminé': 'badge-success',
      'Livré': 'badge-success',
      'En attente': 'badge-warning'
    };
    return classes[status] || 'badge-success';
  }
}