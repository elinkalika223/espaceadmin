import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  activeItem: string = 'dashboard';
  isMobileMenuOpen: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit() {
    // Vérifier si l'utilisateur est admin
    this.isAdmin = this.authService.isAdmin();

    // Version sans filter RxJS - plus simple
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects || event.url;
        this.setActiveItemFromRoute(url);
      }
    });

    this.setActiveItemFromRoute(this.router.url);
  }

  setActiveItemFromRoute(url: string): void {
    if (url.includes('/dashboard')) {
      this.activeItem = 'dashboard';
    } else if (url.includes('/patients')) {
      this.activeItem = 'patients';
    } else if (url.includes('/professionals')) {
      this.activeItem = 'professionals';
    } else if (url.includes('/content')) {
      this.activeItem = 'content';
    } else if (url.includes('/reports')) {
      this.activeItem = 'reports';
    } else if (url.includes('/admins')) {
      this.activeItem = 'admins';
    } else {
      this.activeItem = 'dashboard';
    }
  }

  setActiveItem(item: string): void {
    this.activeItem = item;
    if (window.innerWidth <= 480) {
      this.isMobileMenuOpen = false;
    }
  }

  logout(): void {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      console.log('Déconnexion...');
      this.router.navigate(['/login']);
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}