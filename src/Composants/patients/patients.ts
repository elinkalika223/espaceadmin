import { Component, OnInit } from '@angular/core';
import { DataService } from '../../service/dataservice';
import { ModalService } from '../../service/modalservice';
import { Patient } from '../../model/patientmodel';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patients',
  imports: [CommonModule, 
    FormsModule],
  templateUrl: './patients.html',
  styleUrl: './patients.css',
  standalone: true
})
export class Patients implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  searchTerm: string = '';
  statusFilter: string = '';
  regionFilter: string = '';

  constructor(
    private dataService: DataService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    // Maintenant getPatients() retourne un Observable
    this.dataService.getPatients().subscribe((patients: Patient[]) => {
      this.patients = patients;
      this.filteredPatients = [...patients];
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
        patient.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        patient.phone.includes(this.searchTerm);
      
      const matchesStatus = !this.statusFilter || patient.status === this.statusFilter;
      const matchesRegion = !this.regionFilter || patient.region === this.regionFilter;

      return matchesSearch && matchesStatus && matchesRegion;
    });
  }

  getStatusBadgeClass(status: string): string {
    const classes: { [key: string]: string } = {
      'pregnant': 'badge-success',
      'postpartum': 'badge-warning',
      'child_followup': 'badge-success'
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

  // Méthode pour éditer une patiente
  editPatient(patient: Patient) {
    console.log('Éditer la patiente:', patient);
    // Implémentez la logique d'édition ici
  }

  // Méthode pour supprimer une patiente
  deletePatient(patient: Patient) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${patient.firstName} ${patient.lastName} ?`)) {
      this.dataService.deletePatient(patient.id).subscribe(success => {
        if (success) {
          this.patients = this.patients.filter(p => p.id !== patient.id);
          this.filteredPatients = this.filteredPatients.filter(p => p.id !== patient.id);
        }
      });
    }
  }
}