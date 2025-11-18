import { Component } from '@angular/core';
import { ModalService } from '../../../service/modalservice';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-modal.html',
  styleUrl: './patient-modal.css',
  standalone: true
})
export class PatientModal {
  isOpen = false;
  patient = {
    firstName: '',
    lastName: '',
    phone: '',
    region: '',
    status: '',
    dpa: '',
    notes: ''
  };

  regions = [
    'Bamako', 'Kayes', 'Koulikoro', 'Sikasso', 
    'Ségou', 'Mopti', 'Tombouctou', 'Gao', 'Kidal'
  ];

  statuses = [
    { value: 'pregnant', label: 'Enceinte' },
    { value: 'postpartum', label: 'Post-partum' },
    { value: 'child_followup', label: 'Suivi enfant' }
  ];

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    // Maintenant state est un boolean simple
    this.modalService.patientModalState$.subscribe((state: boolean) => {
      this.isOpen = state;
      if (!state) {
        this.resetForm();
      }
    });
  }

  closeModal() {
    this.modalService.closePatientModal();
  }

  savePatient() {
    console.log('Patient à sauvegarder:', this.patient);
    alert('Patiente ajoutée avec succès!');
    this.closeModal();
  }

  resetForm() {
    this.patient = {
      firstName: '',
      lastName: '',
      phone: '',
      region: '',
      status: '',
      dpa: '',
      notes: ''
    };
  }
}