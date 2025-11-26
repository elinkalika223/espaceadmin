import { Component, OnInit } from '@angular/core';
import { PatienteService, PatienteListDto } from '../../service/patiente.service';
import { ModalService } from '../../service/modalservice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patients',
  imports: [CommonModule, FormsModule],
  templateUrl: './patients.html',
  styleUrl: './patients.css',
  standalone: true
})
export class Patients implements OnInit {
  patients: PatienteListDto[] = [];
  filteredPatients: PatienteListDto[] = [];
  searchTerm: string = '';
  statusFilter: string = '';
  regionFilter: string = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    private patienteService: PatienteService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.loadPatientes();
  }

  loadPatientes() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.patienteService.getAllPatientes().subscribe({
      next: (patientes: PatienteListDto[]) => {
        this.isLoading = false;
        this.patients = patientes || [];
        this.filteredPatients = [...this.patients];
        console.log(`✅ ${patientes.length} patiente(s) chargée(s)`);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('❌ Erreur lors du chargement des patientes:', error);
        
        // Messages d'erreur plus détaillés
        if (error.message && error.message.includes('No static resource')) {
          this.errorMessage = 'Erreur: Le backend n\'a pas été redémarré après les modifications. ' +
            'Veuillez redémarrer le backend Spring Boot et réessayer.';
        } else if (error.status === 403) {
          this.errorMessage = 'Accès refusé. Seuls les administrateurs peuvent accéder à cette ressource.';
        } else if (error.status === 401) {
          this.errorMessage = 'Session expirée. Veuillez vous reconnecter.';
        } else if (error.status === 500) {
          this.errorMessage = 'Erreur serveur. Vérifiez que le backend est démarré et que l\'endpoint /api/patientes est accessible.';
        } else {
          this.errorMessage = error.message || 'Erreur lors du chargement des patientes. ' +
            'Vérifiez que le backend est démarré et que vous êtes connecté en tant qu\'administrateur.';
        }
      }
    });
  }

  openAddPatientModal() {
    this.modalService.openPatientModal();
  }

  onSearchChange() {
    this.filterPatients();
  }

  onFilterChange() {
    this.filterPatients();
  }

  filterPatients() {
    this.filteredPatients = this.patients.filter(patient => {
      const matchesSearch = !this.searchTerm || 
        patient.prenom?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        patient.nom?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        patient.telephone?.includes(this.searchTerm);
      
      // Déterminer le statut basé sur les grossesses et enfants
      const patientStatus = this.getPatientStatus(patient);
      const matchesStatus = !this.statusFilter || patientStatus === this.statusFilter;
      
      // Pour la région, on utilise l'adresse (à adapter selon votre modèle)
      const matchesRegion = !this.regionFilter || 
        (patient.adresse && patient.adresse.toLowerCase().includes(this.regionFilter.toLowerCase()));

      return matchesSearch && matchesStatus && matchesRegion;
    });
  }

  /**
   * Détermine le statut d'une patiente basé sur ses grossesses et enfants
   */
  getPatientStatus(patient: PatienteListDto): string {
    // Vérifier s'il y a une grossesse en cours
    if (patient.grossesses && patient.grossesses.length > 0) {
      const grossesseEnCours = patient.grossesses.find(g => g.statut === 'EN_COURS');
      if (grossesseEnCours) {
        return 'pregnant';
      }
    }
    
    // Vérifier s'il y a des enfants
    if (patient.enfants && patient.enfants.length > 0) {
      // Si pas de grossesse en cours mais des enfants, c'est post-partum ou suivi enfant
      return 'postpartum';
    }
    
    return 'pregnant'; // Par défaut
  }

  getStatusBadgeClass(status: string): string {
    const classes: { [key: string]: string } = {
      'pregnant': 'badge-success',
      'postpartum': 'badge-warning',
      'child_followup': 'badge-info'
    };
    return classes[status] || 'badge-success';
  }

  getStatusText(status: string): string {
    const texts: { [key: string]: string } = {
      'pregnant': 'Enceinte',
      'postpartum': 'Post-partum',
      'child_followup': 'Suivi enfant'
    };
    return texts[status] || status;
  }

  /**
   * Récupère la DPA (Date Prévisionnelle d'Accouchement) depuis les grossesses
   */
  getDPA(patient: PatienteListDto): string {
    if (patient.grossesses && patient.grossesses.length > 0) {
      const grossesseEnCours = patient.grossesses.find(g => g.statut === 'EN_COURS');
      if (grossesseEnCours && grossesseEnCours.datePrevueAccouchement) {
        return this.formatDate(grossesseEnCours.datePrevueAccouchement);
      }
    }
    return 'N/A';
  }

  /**
   * Récupère la dernière CPN (Consultation Prénatale)
   * Note: Cette information n'est pas dans PatienteListDto, il faudrait utiliser PatienteDetailDto
   */
  getLastCPN(patient: PatienteListDto): string {
    // Pour l'instant, on retourne N/A car cette info n'est pas dans PatienteListDto
    // Il faudrait charger les détails complets pour avoir cette info
    return 'N/A';
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  }

  // Méthode pour voir les détails d'une patiente
  viewPatient(patient: PatienteListDto) {
    console.log('Voir les détails de la patiente:', patient);
    // TODO: Ouvrir une modal ou naviguer vers une page de détails
  }

  // Méthode pour éditer une patiente
  editPatient(patient: PatienteListDto) {
    console.log('Éditer la patiente:', patient);
    // TODO: Implémenter la logique d'édition
  }

  // Méthode pour supprimer une patiente
  deletePatient(patient: PatienteListDto) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${patient.prenom} ${patient.nom} ?`)) {
      // TODO: Implémenter la suppression via l'API
      // Pour l'instant, il n'y a pas d'endpoint DELETE dans le backend
      console.log('Suppression de la patiente:', patient.id);
      alert('Fonctionnalité de suppression à implémenter');
    }
  }
}