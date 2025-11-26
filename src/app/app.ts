import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Sidebar } from '../Composants/sidebar/sidebar';
import { Header } from '../Composants/header/header';
import { PatientModal } from '../Composants/Modal/patient-modal/patient-modal';
import { ProModal } from '../Composants/Modal/pro-modal/pro-modal';
import { ContentModal } from '../Composants/Modal/content-modal/content-modal';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';




@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [
    RouterOutlet,
    CommonModule,
    Sidebar,
    Header,
    PatientModal,
    ProModal,
    ContentModal
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  title = 'KènèyaMuso - Administration';
  showSidebarAndHeader = true;

  constructor(private router: Router) {}

  ngOnInit() {
    // Vérifier la route initiale
    this.checkRoute(this.router.url);

    // Écouter les changements de route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.checkRoute(event.urlAfterRedirects || event.url);
      });
  }

  private checkRoute(url: string): void {
    // Masquer sidebar et header sur la page de login
    this.showSidebarAndHeader = !url.includes('/login');
  }
}
