import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Content } from '../../model/contentmodel';
import { DataService } from '../../service/dataservice';
import { ModalService } from '../../service/modalservice';

interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './content.html',
  styleUrls: ['./content.css']
})
export class ContentC implements OnInit {
  contents: Content[] = [];
  filteredContents: Content[] = [];
  
  // Filtres
  searchTerm: string = '';
  selectedType: string = 'all';
  selectedStatus: string = 'all';
  selectedLanguage: string = 'all';
  selectedCategory: string = 'all';
  categoryFilter: string = 'all';
  statusFilter: string = 'all';
  languageFilter: string = 'all';
  activeTab: string = 'all';

  // Options pour les filtres
  types: SelectOption[] = [
    { value: 'all', label: 'Tous les types' },
    { value: 'article', label: 'Articles' },
    { value: 'video', label: 'Vidéos' },
    { value: 'nutrition', label: 'Nutrition' },
    { value: 'tutorial', label: 'Tutoriels' }
  ];

  statuses: SelectOption[] = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'published', label: 'Publié' },
    { value: 'draft', label: 'Brouillon' },
    { value: 'archived', label: 'Archivé' }
  ];

  languages: SelectOption[] = [
    { value: 'all', label: 'Toutes les langues' },
    { value: 'french', label: 'Français' },
    { value: 'bambara', label: 'Bambara' },
    { value: 'soninke', label: 'Soninké' },
    { value: 'tamasheq', label: 'Tamasheq' }
  ];

  categories: SelectOption[] = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'Grossesse', label: 'Grossesse' },
    { value: 'Exercices prénatals', label: 'Exercices prénatals' },
    { value: 'Nutrition', label: 'Nutrition' },
    { value: 'Santé infantile', label: 'Santé infantile' }
  ];

  constructor(
    private dataService: DataService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.loadContents();
  }

  loadContents() {
    this.dataService.getContents().subscribe({
      next: (contents: Content[]) => {
        this.contents = contents;
        this.filteredContents = contents;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des contenus:', error);
      }
    });
  }

  // === MÉTHODES POUR LES STATISTIQUES ===
  getTotalContent(): number {
    return this.contents.length;
  }

  getTotalViews(): number {
    return this.contents.reduce((total: number, content: Content) => total + (content.views || 0), 0);
  }

  getPublishedContent(): number {
    return this.contents.filter((content: Content) => content.status === 'published').length;
  }

  getVideosCount(): number {
    return this.contents.filter((content: Content) => content.type === 'video').length;
  }

  getArticlesCount(): number {
    return this.contents.filter((content: Content) => content.type === 'article').length;
  }

  // === MÉTHODES POUR LES TABS ===
  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.filterContent();
  }

  // === MÉTHODES DE FILTRAGE ===
  filterContent(): void {
    this.filteredContents = this.contents.filter((content: Content) => {
      const matchesSearch = !this.searchTerm || 
        content.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        content.author.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesType = this.selectedType === 'all' || content.type === this.selectedType;
      const matchesStatus = this.selectedStatus === 'all' || content.status === this.selectedStatus;
      const matchesLanguage = this.selectedLanguage === 'all' || content.language === this.selectedLanguage;
      const matchesCategory = this.selectedCategory === 'all' || content.category === this.selectedCategory;
      
      // Filtre par tab active
      const matchesTab = this.activeTab === 'all' || 
        (this.activeTab === 'articles' && content.type === 'article') ||
        (this.activeTab === 'videos' && content.type === 'video') ||
        (this.activeTab === 'nutrition' && content.type === 'nutrition') ||
        (this.activeTab === 'tutorials' && content.type === 'tutorial');

      return matchesSearch && matchesType && matchesStatus && matchesLanguage && matchesCategory && matchesTab;
    });
  }

  onSearchChange(): void {
    this.filterContent();
  }

  onFilterChange(): void {
    this.filterContent();
  }

  filterByTag(tag: string): Content[] {
    return this.contents.filter((content: Content) => 
      content.tags && content.tags.includes(tag)
    );
  }

  // === MÉTHODES UTILITAIRES ===
  getTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'article': 'fas fa-newspaper',
      'video': 'fas fa-video',
      'nutrition': 'fas fa-apple-alt',
      'tutorial': 'fas fa-graduation-cap'
    };
    return icons[type] || 'fas fa-file';
  }

  getTypeBadgeClass(type: string): string {
    const classes: { [key: string]: string } = {
      'article': 'badge-primary',
      'video': 'badge-danger',
      'nutrition': 'badge-success',
      'tutorial': 'badge-warning'
    };
    return classes[type] || 'badge-secondary';
  }

  getTypeText(type: string): string {
    const texts: { [key: string]: string } = {
      'article': 'Article',
      'video': 'Vidéo',
      'nutrition': 'Nutrition',
      'tutorial': 'Tutoriel'
    };
    return texts[type] || 'Autre';
  }

  getLanguageText(language: string): string {
    const texts: { [key: string]: string } = {
      'french': 'Français',
      'bambara': 'Bambara',
      'soninke': 'Soninké',
      'tamasheq': 'Tamasheq'
    };
    return texts[language] || language;
  }

  getStatusBadgeClass(status: string): string {
    const classes: { [key: string]: string } = {
      'published': 'badge-success',
      'draft': 'badge-warning',
      'archived': 'badge-secondary'
    };
    return classes[status] || 'badge-info';
  }

  getStatusText(status: string): string {
    const texts: { [key: string]: string } = {
      'published': 'Publié',
      'draft': 'Brouillon',
      'archived': 'Archivé'
    };
    return texts[status] || status;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // === MÉTHODES D'ACTIONS ===
  openAddContentModal(): void {
    this.modalService.openContentModal();
    console.log('Ouvrir modal d\'ajout de contenu');
  }

  viewContent(content: Content): void {
    console.log('Visualiser le contenu:', content);
    // Implémentez la logique de visualisation
  }

  editContent(content: Content): void {
    console.log('Éditer le contenu:', content);
    // Implémentez la logique d'édition
  }

  publishContent(content: Content): void {
    if (confirm(`Voulez-vous publier "${content.title}" ?`)) {
      console.log('Publication du contenu:', content);
      // Implémentez la logique de publication
      // this.dataService.publishContent(content.id).subscribe(...);
    }
  }

  archiveContent(content: Content): void {
    if (confirm(`Voulez-vous archiver "${content.title}" ?`)) {
      console.log('Archivage du contenu:', content);
      // Implémentez la logique d'archivage
      // this.dataService.archiveContent(content.id).subscribe(...);
    }
  }

  deleteContent(content: Content): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${content.title}" ?`)) {
      this.dataService.deleteContent(content.id).subscribe({
        next: () => {
          this.loadContents();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      });
    }
  }
}