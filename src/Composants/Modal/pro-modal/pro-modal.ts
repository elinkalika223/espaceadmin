import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../service/modalservice';
import { DataService } from '../../../service/dataservice';
import { Professional } from '../../../model/professionnelmodel';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ProfessionalFormData {
  firstName: string;
  lastName: string;
  specialty: string;
  phone: string;
  email: string;
  region: string;
  address: string;
  status: 'active' | 'inactive' | 'on_leave';
  notes: string;
}

@Component({
  selector: 'app-pro-modal',
  imports: [CommonModule,FormsModule],
  templateUrl: './pro-modal.html',
  styleUrl: './pro-modal.css',
})
export class ProModal implements OnInit {
  isOpen = false;
  isEditing = false;
  
  professional: ProfessionalFormData = {
    firstName: '',
    lastName: '',
    specialty: '',
    phone: '',
    email: '',
    region: '',
    address: '',
    status: 'active',
    notes: ''
  };

  specialties = [
    { value: 'gynecologist', label: 'Gynécologue' },
    { value: 'pediatrician', label: 'Pédiatre' },
    { value: 'midwife', label: 'Sage-femme' },
    { value: 'nurse', label: 'Infirmier(ère)' },
    { value: 'nutritionist', label: 'Nutritionniste' }
  ];

  regions = [
    'Bamako', 'Kayes', 'Koulikoro', 'Sikasso', 
    'Ségou', 'Mopti', 'Tombouctou', 'Gao', 'Kidal'
  ];

  statuses = [
    { value: 'active', label: 'Actif' },
    { value: 'inactive', label: 'Inactif' },
    { value: 'on_leave', label: 'En congé' }
  ];

  constructor(
    private modalService: ModalService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.modalService.professionalModalState$.subscribe((state: boolean) => {
      this.isOpen = state;
      if (!state) {
        this.resetForm();
      }
    });
  }

  closeModal() {
    this.modalService.closeProfessionalModal();
  }

  saveProfessional() {
    if (this.isFormValid()) {
      // Conversion sécurisée du type
      const professionalData: Omit<Professional, 'id' | 'assignedPatients'> = {
        ...this.professional,
        specialty: this.professional.specialty as Professional['specialty']
      };

      this.dataService.addProfessional(professionalData).subscribe({
        next: (newProfessional: Professional) => {
          console.log('Professionnel ajouté:', newProfessional);
          alert('Professionnel ajouté avec succès!');
          this.closeModal();
        },
        error: (error: any) => {
          console.error('Erreur lors de l\'ajout:', error);
          alert('Erreur lors de l\'ajout du professionnel');
        }
      });
    } else {
      alert('Veuillez remplir tous les champs obligatoires');
    }
  }

  isFormValid(): boolean {
    return !!(
      this.professional.firstName &&
      this.professional.lastName &&
      this.professional.specialty &&
      this.professional.phone &&
      this.professional.region &&
      this.professional.status
    );
  }

  resetForm() {
    this.professional = {
      firstName: '',
      lastName: '',
      specialty: '',
      phone: '',
      email: '',
      region: '',
      address: '',
      status: 'active',
      notes: ''
    };
    this.isEditing = false;
  }

  getModalTitle(): string {
    return this.isEditing ? 'Modifier le professionnel' : 'Ajouter un professionnel';
  }

  onModalClick(event: MouseEvent) {
    event.stopPropagation();
  }
}