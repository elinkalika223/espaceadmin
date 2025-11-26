import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../service/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  @Input() currentPage: string = 'dashboard';
  currentUser: User | null = null;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Récupérer l'utilisateur actuel
    this.currentUser = this.authService.getCurrentUser();
    
    // S'abonner aux changements de l'utilisateur
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  getPageTitle(): string {
    const titles: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'patients': 'Gestion des Patient(e)s',
      'professionals': 'Gestion des Professionnels',
      'content': 'Gestion du Contenu',
      'reports': 'Rapports et Statistiques',
      'admins': 'Gestion des Administrateurs'
    };
    return titles[this.currentPage] || 'Dashboard';
  }

  getUserDisplayName(): string {
    if (this.currentUser) {
      return `${this.currentUser.prenom} ${this.currentUser.nom}`;
    }
    return 'Admin KènèyaMuso';
  }

  getUserInitials(): string {
    if (this.currentUser) {
      const firstInitial = this.currentUser.prenom?.charAt(0).toUpperCase() || '';
      const lastInitial = this.currentUser.nom?.charAt(0).toUpperCase() || '';
      return `${firstInitial}${lastInitial}`;
    }
    return 'AK';
  }

  getRoleLabel(role: string): string {
    const roleLabels: { [key: string]: string } = {
      'ADMINISTRATEUR': 'Administrateur',
      'MEDECIN': 'Médecin',
      'PATIENTE': 'Patiente'
    };
    return roleLabels[role] || role;
  }

  logout(): void {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      this.authService.logout();
    }
  }
}

