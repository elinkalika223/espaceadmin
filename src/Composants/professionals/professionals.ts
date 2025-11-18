import { Component, OnInit } from '@angular/core';
import { Professional } from '../../model/professionnelmodel';
import { ModalService } from '../../service/modalservice';
import { DataService } from '../../service/dataservice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-professionals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './professionals.html',
  styleUrl: './professionals.css',
})
export class Professionals implements OnInit{
  professionals: Professional[] = [];
  filteredProfessionals: Professional[] = [];
  searchTerm: string = '';
  specialtyFilter: string = '';
  regionFilter: string = '';
  statusFilter: string = '';

  // Statistiques calculées
  gynecologistsCount: number = 0;
  pediatriciansCount: number = 0;
  midwivesCount: number = 0;
  nursesCount: number = 0;
  nutritionistsCount: number = 0;

  // Options pour les filtres
  specialties = [
    { value: '', label: 'Toutes les spécialités' },
    { value: 'gynecologist', label: 'Gynécologue' },
    { value: 'pediatrician', label: 'Pédiatre' },
    { value: 'midwife', label: 'Sage-femme' },
    { value: 'nurse', label: 'Infirmier(ère)' },
    { value: 'nutritionist', label: 'Nutritionniste' }
  ];

  regions = [
    { value: '', label: 'Toutes les régions' },
    { value: 'Bamako', label: 'Bamako' },
    { value: 'Kayes', label: 'Kayes' },
    { value: 'Koulikoro', label: 'Koulikoro' },
    { value: 'Sikasso', label: 'Sikasso' },
    { value: 'Ségou', label: 'Ségou' },
    { value: 'Mopti', label: 'Mopti' },
    { value: 'Tombouctou', label: 'Tombouctou' },
    { value: 'Gao', label: 'Gao' },
    { value: 'Kidal', label: 'Kidal' }
  ];

  statuses = [
    { value: '', label: 'Tous les statuts' },
    { value: 'active', label: 'Actif' },
    { value: 'inactive', label: 'Inactif' },
    { value: 'on_leave', label: 'En congé' }
  ];

  constructor(
    private dataService: DataService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.loadProfessionals();
  }

  loadProfessionals() {
    this.dataService.getProfessionals().subscribe({
      next: (professionals: Professional[]) => {
        this.professionals = professionals;
        this.filteredProfessionals = [...professionals];
        this.calculateStatistics(); // ← CALCULER LES STATS
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des professionnels:', error);
        alert('Erreur lors du chargement des professionnels');
      }
    });
  }

  // NOUVELLE MÉTHODE : Calculer les statistiques
  calculateStatistics() {
    this.gynecologistsCount = this.professionals.filter(p => p.specialty === 'gynecologist').length;
    this.pediatriciansCount = this.professionals.filter(p => p.specialty === 'pediatrician').length;
    this.midwivesCount = this.professionals.filter(p => p.specialty === 'midwife').length;
    this.nursesCount = this.professionals.filter(p => p.specialty === 'nurse').length;
    this.nutritionistsCount = this.professionals.filter(p => p.specialty === 'nutritionist').length;
  }

  openAddProfessionalModal() {
    this.modalService.openProfessionalModal();
  }

  onSearchChange() {
    this.filterProfessionals();
  }

  onFilterChange() {
    this.filterProfessionals();
  }

  filterProfessionals() {
    this.filteredProfessionals = this.professionals.filter(professional => {
      const matchesSearch = !this.searchTerm || 
        professional.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        professional.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        professional.phone.includes(this.searchTerm) ||
        (professional.email && professional.email.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesSpecialty = !this.specialtyFilter || professional.specialty === this.specialtyFilter;
      const matchesRegion = !this.regionFilter || professional.region === this.regionFilter;
      const matchesStatus = !this.statusFilter || professional.status === this.statusFilter;

      return matchesSearch && matchesSpecialty && matchesRegion && matchesStatus;
    });
  }

  getSpecialtyText(specialty: string): string {
    const specialtyMap: { [key: string]: string } = {
      'gynecologist': 'Gynécologue',
      'pediatrician': 'Pédiatre',
      'midwife': 'Sage-femme',
      'nurse': 'Infirmier(ère)',
      'nutritionist': 'Nutritionniste'
    };
    return specialtyMap[specialty] || specialty;
  }

  getSpecialtyBadgeClass(specialty: string): string {
    const classes: { [key: string]: string } = {
      'gynecologist': 'badge-primary',
      'pediatrician': 'badge-info',
      'midwife': 'badge-success',
      'nurse': 'badge-warning',
      'nutritionist': 'badge-secondary'
    };
    return classes[specialty] || 'badge-primary';
  }

  getStatusBadgeClass(status: string): string {
    const classes: { [key: string]: string } = {
      'active': 'badge-success',
      'inactive': 'badge-danger',
      'on_leave': 'badge-warning'
    };
    return classes[status] || 'badge-secondary';
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'active': 'Actif',
      'inactive': 'Inactif',
      'on_leave': 'En congé'
    };
    return statusMap[status] || status;
  }

  editProfessional(professional: Professional) {
    console.log('Éditer le professionnel:', professional);
    this.modalService.openProfessionalModal();
  }

  viewProfessional(professional: Professional) {
    console.log('Voir le professionnel:', professional);
    alert(`Détails de ${professional.firstName} ${professional.lastName}\nSpécialité: ${this.getSpecialtyText(professional.specialty)}\nRégion: ${professional.region}\nStatut: ${this.getStatusText(professional.status)}`);
  }

  deleteProfessional(professional: Professional) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${professional.firstName} ${professional.lastName} ?`)) {
      // Simulation de suppression locale
      this.professionals = this.professionals.filter(p => p.id !== professional.id);
      this.filteredProfessionals = this.filteredProfessionals.filter(p => p.id !== professional.id);
      this.calculateStatistics(); // ← METTRE À JOUR LES STATS
      alert('Professionnel supprimé avec succès');
    }
  }

  getTotalProfessionals(): number {
    return this.professionals.length;
  }

  getActiveProfessionals(): number {
    return this.professionals.filter(p => p.status === 'active').length;
  }
}