import { Component, OnInit } from '@angular/core';
import { ProfessionalService, ProfessionnelSante } from '../../service/professional.service';
import { ModalService } from '../../service/modalservice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Professional {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  phone: string;
  email?: string;
  region: string;
  address?: string;
  assignedPatients: number;
  status: 'active' | 'inactive' | 'on_leave';
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

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
  isLoading = false;
  errorMessage = '';

  // Statistiques calculées
  gynecologistsCount: number = 0;
  pediatriciansCount: number = 0;
  midwivesCount: number = 0;
  nursesCount: number = 0;
  nutritionistsCount: number = 0;
  generalistsCount: number = 0;

  // Options pour les filtres
  specialties = [
    { value: '', label: 'Toutes les spécialités' },
    { value: 'GYNECOLOGUE', label: 'Gynécologue' },
    { value: 'PEDIATRE', label: 'Pédiatre' },
    { value: 'GENERALISTE', label: 'Généraliste' }
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
    private professionalService: ProfessionalService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.loadProfessionals();
  }

  loadProfessionals() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.professionalService.getAllProfessionals().subscribe({
      next: (professionnels: ProfessionnelSante[]) => {
        this.isLoading = false;
        // Mapper les données backend vers le modèle frontend
        this.professionals = professionnels.map(p => this.mapToProfessional(p));
        this.filteredProfessionals = [...this.professionals];
        this.calculateStatistics();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Erreur lors du chargement des professionnels';
        console.error('Erreur lors du chargement des professionnels:', error);
      }
    });
  }

  /**
   * Mappe ProfessionnelSante (backend) vers Professional (frontend)
   */
  private mapToProfessional(prof: ProfessionnelSante): Professional {
    return {
      id: prof.id.toString(),
      firstName: prof.prenom,
      lastName: prof.nom,
      specialty: this.mapSpecialty(prof.specialite),
      phone: prof.telephone,
      email: undefined, // Le backend n'a pas d'email dans Utilisateur
      region: '', // Le backend n'a pas de région dans Utilisateur
      address: undefined,
      assignedPatients: prof.patientes?.length || 0,
      status: prof.actif ? 'active' : 'inactive',
      createdAt: prof.dateCreation ? new Date(prof.dateCreation) : undefined,
      updatedAt: prof.dateModification ? new Date(prof.dateModification) : undefined
    };
  }

  /**
   * Mappe la spécialité backend vers frontend
   */
  private mapSpecialty(specialite: string): string {
    const mapping: { [key: string]: string } = {
      'GYNECOLOGUE': 'GYNECOLOGUE',
      'PEDIATRE': 'PEDIATRE',
      'GENERALISTE': 'GENERALISTE'
    };
    return mapping[specialite] || specialite;
  }

  // Calculer les statistiques
  calculateStatistics() {
    this.gynecologistsCount = this.professionals.filter(p => p.specialty === 'GYNECOLOGUE').length;
    this.pediatriciansCount = this.professionals.filter(p => p.specialty === 'PEDIATRE').length;
    this.generalistsCount = this.professionals.filter(p => p.specialty === 'GENERALISTE').length;
    // Les autres spécialités ne sont pas dans le backend
    this.midwivesCount = 0;
    this.nursesCount = 0;
    this.nutritionistsCount = 0;
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
      // Pour la région, on ne filtre pas car le backend n'a pas ce champ
      const matchesRegion = !this.regionFilter || true; // Toujours vrai pour l'instant
      const matchesStatus = !this.statusFilter || professional.status === this.statusFilter;

      return matchesSearch && matchesSpecialty && matchesRegion && matchesStatus;
    });
  }

  getSpecialtyText(specialty: string): string {
    const specialtyMap: { [key: string]: string } = {
      'GYNECOLOGUE': 'Gynécologue',
      'PEDIATRE': 'Pédiatre',
      'GENERALISTE': 'Généraliste'
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
      // TODO: Implémenter la suppression via l'API quand l'endpoint sera disponible
      // Pour l'instant, l'endpoint DELETE n'existe pas dans le backend
      alert('Fonctionnalité de suppression à implémenter. L\'endpoint DELETE n\'est pas encore disponible dans le backend.');
      console.log('Suppression du professionnel:', professional.id);
    }
  }

  getTotalProfessionals(): number {
    return this.professionals.length;
  }

  getActiveProfessionals(): number {
    return this.professionals.filter(p => p.status === 'active').length;
  }
}