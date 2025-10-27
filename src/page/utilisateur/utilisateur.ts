import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-utilisateur',
  imports: [CommonModule, FormsModule],
  templateUrl: './utilisateur.html',
  styleUrl: './utilisateur.css',
})
export class Utilisateur {
searchText = '';
  selectedRole = '';
  allSelected = false;
  isModalOpen = false;

  users = [
    { nom: 'Fatoumata', prenom: 'Diawara', telephone: '74309564', role: 'Admin', actif: true },
    { nom: 'Awa', prenom: 'Koné', telephone: '90110465', role: 'User', actif: false },
  ];

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  ajouterUser(user: any) {
    user.actif = true;
    this.users.push(user);
    this.closeModal();
  }

  supprimer(user: any) {
    this.users = this.users.filter(u => u !== user);
  }

  modifier(user: any) {
    alert(`Modifier ${user.nom} ${user.prenom}`); // tu peux ouvrir un modal de modification
  }

  toggleActif(user: any) {
    user.actif = !user.actif;
  }
}
