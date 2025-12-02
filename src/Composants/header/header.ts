import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService, User } from '../../service/auth.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit, OnDestroy {
  @Input() currentPage: string = 'dashboard';
  currentUser: User | null = null;
  private routerSubscription?: Subscription;
  pageTitle: string = 'Dashboard';

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

    // Écouter les changements de route pour détecter automatiquement la page
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects || event.url;
        this.updateCurrentPageFromRoute(url);
      });

    // Définir la page initiale
    this.updateCurrentPageFromRoute(this.router.url);
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  updateCurrentPageFromRoute(url: string): void {
    if (url.includes('/dashboard')) {
      this.currentPage = 'dashboard';
    } else if (url.includes('/patients')) {
      this.currentPage = 'patients';
    } else if (url.includes('/professionals')) {
      this.currentPage = 'professionals';
    } else if (url.includes('/content')) {
      this.currentPage = 'content';
    } else if (url.includes('/reports')) {
      this.currentPage = 'reports';
    } else if (url.includes('/admins')) {
      this.currentPage = 'admins';
    } else {
      this.currentPage = 'dashboard';
    }
    // Mettre à jour le titre
    this.pageTitle = this.getPageTitle();
  }

  getPageTitle(): string {
    const titles: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'patients': 'Patient(e)s',
      'professionals': 'Professionnels',
      'content': 'Contenu',
      'reports': 'Rapports CPN/CPON',
      'admins': 'Administrateurs'
    };
    const title = titles[this.currentPage];
    return title || 'Dashboard';
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

