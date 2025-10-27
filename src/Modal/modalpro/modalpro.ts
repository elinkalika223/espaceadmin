import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-ajoutpro', // identique à ton HTML
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modalpro.html',
  styleUrls: ['./modalpro.css'],
})
export class Modalpro {
  @Output() close = new EventEmitter<void>();
  @Output() ajout = new EventEmitter<any>();

  pro = {
    nom: '',
    specialite: '',
    adresse: '',
    contact: '',
    imageProfil: '', // ✅ nouveau champ image
    dateCreation: new Date().toLocaleDateString(),
  };

  // ✅ méthode pour gérer l’upload d’image
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.pro.imageProfil = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  ajouter() {
    this.ajout.emit(this.pro);
  }
}
