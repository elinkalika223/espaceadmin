import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Input() currentPage: string = 'dashboard';

  getPageTitle(): string {
    const titles: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'patients': 'Gestion des Patient(e)s',
      'professionals': 'Gestion des Professionnels',
      'content': 'Gestion du Contenu',
      'reports': 'Rapports et Statistiques'
    };
    return titles[this.currentPage] || 'Dashboard';
  }
}

