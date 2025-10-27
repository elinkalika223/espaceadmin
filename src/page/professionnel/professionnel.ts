import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Modalpro } from '../../Modal/modalpro/modalpro';

@Component({
  selector: 'app-professionnel',
  imports: [CommonModule, FormsModule, Modalpro],
  templateUrl: './professionnel.html',
  styleUrls: ['./professionnel.css'],
})
export class Professionnel {
  searchText = '';
  selectedType = '';
  selectedAge = '';
  allSelected = false;
  isModalOpen = false;

  professionnels = [
    { nom: 'Dr. Fatoumata Diawara', specialite: 'Gynécologue', adresse: 'Bamako', contact: '74309564', dateCreation: '20-10-2025', actif: true },
    { nom: 'Awa Koné', specialite: 'Sage femme', adresse: 'Bamako', contact: '90110465', dateCreation: '20-10-2025', actif: true },
  ];

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  ajouterProfessionnel(pro: any) {
    pro.actif = true;
    this.professionnels.push(pro);
    this.closeModal();
  }

  supprimer(pro: any) {
    this.professionnels = this.professionnels.filter(p => p !== pro);
  }

  modifier(pro: any) {
    alert(`Modifier ${pro.nom}`); // Remplace par ton modal de modification si tu veux
  }

  toggleActif(pro: any) {
    pro.actif = !pro.actif;
  }
}
