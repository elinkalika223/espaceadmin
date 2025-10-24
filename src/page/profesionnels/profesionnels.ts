import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modalajoutprofessionnel } from '../modalajoutprofessionnel/modalajoutprofessionnel';
import { Cardaction1 } from '../../Composants/cardaction1/cardaction1';

interface TableRow {
  checked: boolean;
  nom: string;
  specialite: string;
  adresse: string;
  contact: string;
  dateCreation: string;
  statut: 'Actif' | 'Inactif';
}

@Component({
  selector: 'app-profesionnels',
  standalone: true,
  imports: [CommonModule, FormsModule, Cardaction1, Modalajoutprofessionnel],
  templateUrl: './profesionnels.html',
  styleUrls: ['./profesionnels.css'],
})
export class Profesionnels {
  showModal = false;

  ouvrirModal() {
    this.showModal = true;
  }

  fermerModal() {
    this.showModal = false;
  }

  tableData: TableRow[] = [
    { checked: false, nom: 'Dr. Fatoumata Diawara', specialite: 'Gynécologue', adresse: 'Bamako, Quartier A', contact: '74309564', dateCreation: '20-10-2025', statut: 'Actif' },
    { checked: false, nom: 'Awa Koné', specialite: 'Sage femme', adresse: 'Bamako, Quartier B', contact: '90110465', dateCreation: '18-10-2025', statut: 'Actif' },
    { checked: false, nom: 'Dr. Bakary Diallo', specialite: 'Pédiatre', adresse: 'Bamako, Quartier C', contact: '74309565', dateCreation: '15-10-2025', statut: 'Inactif' },
  ];

  ouvrirModal() { this.showModal = true; }
  fermerModal() { this.showModal = false; }
  toggleAllRows() { this.tableData.forEach(row => row.checked = this.allSelected); }
}
