import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { AuthService } from '../../service/auth.service';

export interface Admin {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  role: string;
  actif: boolean;
  dateCreation?: string;
}

export interface AdminFormData {
  nom: string;
  prenom: string;
  telephone: string;
  motDePasse: string;
  confirmerMotDePasse: string;
}

@Component({
  selector: 'app-admins',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admins.html',
  styleUrl: './admins.css'
})
export class Admins implements OnInit {
  admins: Admin[] = [];
  filteredAdmins: Admin[] = [];
  searchTerm: string = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Modal state
  showAddModal = false;
  isEditing = false;
  editingAdmin: Admin | null = null;

  // Form data
  formData: AdminFormData = {
    nom: '',
    prenom: '',
    telephone: '',
    motDePasse: '',
    confirmerMotDePasse: ''
  };

  constructor(
    private apiService: ApiService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    // Vérifier que l'utilisateur est admin
    if (!this.authService.isAdmin()) {
      this.errorMessage = 'Accès non autorisé. Seuls les administrateurs peuvent accéder à cette page.';
      return;
    }
    this.loadAdmins();
  }

  loadAdmins() {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Récupérer tous les administrateurs via l'endpoint dédié
    this.apiService.get<any>('/utilisateurs/admins').subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.admins = response.data.map((user: any) => ({
            id: user.id,
            nom: user.nom,
            prenom: user.prenom,
            telephone: user.telephone,
            role: user.role,
            actif: user.actif !== undefined ? user.actif : true,
            dateCreation: user.dateCreation || user.date_creation
          }));
          this.filteredAdmins = [...this.admins];
        } else {
          this.admins = [];
          this.filteredAdmins = [];
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Erreur lors du chargement des administrateurs';
        console.error('Erreur:', error);
      }
    });
  }

  openAddModal() {
    this.isEditing = false;
    this.editingAdmin = null;
    this.resetForm();
    this.showAddModal = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  openEditModal(admin: Admin) {
    this.isEditing = true;
    this.editingAdmin = admin;
    this.formData = {
      nom: admin.nom,
      prenom: admin.prenom,
      telephone: admin.telephone,
      motDePasse: '',
      confirmerMotDePasse: ''
    };
    this.showAddModal = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeModal() {
    this.showAddModal = false;
    this.resetForm();
    this.errorMessage = '';
    this.successMessage = '';
  }

  resetForm() {
    this.formData = {
      nom: '',
      prenom: '',
      telephone: '',
      motDePasse: '',
      confirmerMotDePasse: ''
    };
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    // Validation
    if (!this.formData.nom || !this.formData.prenom || !this.formData.telephone) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    // Validation du téléphone
    const phoneRegex = /^[\+]?[0-9]{8,15}$/;
    if (!phoneRegex.test(this.formData.telephone)) {
      this.errorMessage = 'Format de téléphone invalide';
      return;
    }

    if (this.isEditing) {
      // Modification
      this.updateAdmin();
    } else {
      // Création
      if (!this.formData.motDePasse || !this.formData.confirmerMotDePasse) {
        this.errorMessage = 'Le mot de passe est obligatoire pour créer un administrateur';
        return;
      }

      if (this.formData.motDePasse !== this.formData.confirmerMotDePasse) {
        this.errorMessage = 'Les mots de passe ne correspondent pas';
        return;
      }

      if (this.formData.motDePasse.length < 6) {
        this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
        return;
      }

      this.createAdmin();
    }
  }

  createAdmin() {
    this.isLoading = true;

    const registerData = {
      nom: this.formData.nom,
      prenom: this.formData.prenom,
      telephone: this.formData.telephone,
      motDePasse: this.formData.motDePasse,
      role: 'ADMINISTRATEUR',
      langue: 'fr'
    };

    this.apiService.post<any>('/auth/register', registerData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.successMessage = 'Administrateur créé avec succès';
          this.closeModal();
          this.loadAdmins();
        } else {
          this.errorMessage = response.message || 'Erreur lors de la création';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Erreur lors de la création de l\'administrateur';
        console.error('Erreur:', error);
      }
    });
  }

  updateAdmin() {
    if (!this.editingAdmin) return;

    this.isLoading = true;

    const updateData: any = {
      nom: this.formData.nom,
      prenom: this.formData.prenom,
      telephone: this.formData.telephone
    };

    // Si un nouveau mot de passe est fourni
    if (this.formData.motDePasse) {
      if (this.formData.motDePasse !== this.formData.confirmerMotDePasse) {
        this.errorMessage = 'Les mots de passe ne correspondent pas';
        this.isLoading = false;
        return;
      }
      if (this.formData.motDePasse.length < 6) {
        this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
        this.isLoading = false;
        return;
      }
      updateData.motDePasse = this.formData.motDePasse;
    }

    this.apiService.put<any>(`/utilisateurs/${this.editingAdmin.id}`, updateData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.successMessage = 'Administrateur modifié avec succès';
          this.closeModal();
          this.loadAdmins();
        } else {
          this.errorMessage = response.message || 'Erreur lors de la modification';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Erreur lors de la modification de l\'administrateur';
        console.error('Erreur:', error);
      }
    });
  }

  deleteAdmin(admin: Admin) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'administrateur ${admin.prenom} ${admin.nom} ?`)) {
      return;
    }

    this.isLoading = true;
    this.apiService.delete<any>(`/utilisateurs/${admin.id}`).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.successMessage = 'Administrateur supprimé avec succès';
          this.loadAdmins();
        } else {
          this.errorMessage = response.message || 'Erreur lors de la suppression';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Erreur lors de la suppression de l\'administrateur';
        console.error('Erreur:', error);
      }
    });
  }

  onSearchChange() {
    this.filterAdmins();
  }

  filterAdmins() {
    if (!this.searchTerm) {
      this.filteredAdmins = [...this.admins];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredAdmins = this.admins.filter(admin =>
      admin.nom.toLowerCase().includes(term) ||
      admin.prenom.toLowerCase().includes(term) ||
      admin.telephone.includes(term)
    );
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  }
}

