import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modalajoutprofessionnel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modalajoutprofessionnel.html',
  styleUrls: ['./modalajoutprofessionnel.css'],
})
export class Modalajoutprofessionnel {
  @Output() close = new EventEmitter<void>();

  // Champs du formulaire
  nom = '';
  specialite = '';
  adresse = '';
  contact = '';
  motDePasse = '';

  // Image
  imageProfil: File | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;

  onFileSelected(event: any) {
    const file = event.target.files?.[0] ?? null;
    if (file) {
      this.imageProfil = file;
      const reader = new FileReader();
      reader.onload = () => this.imagePreviewUrl = reader.result;
      reader.readAsDataURL(file);
    }
  }

  creerUtilisateur() {
    console.log('Création professionnel:', {
      nom: this.nom,
      specialite: this.specialite,
      adresse: this.adresse,
      contact: this.contact,
      motDePasse: this.motDePasse,
      imageProfil: this.imageProfil
    });
    this.fermerModal();
  }

  fermerModal() {
    this.close.emit();
    // Reset
    this.nom = '';
    this.specialite = '';
    this.adresse = '';
    this.contact = '';
    this.motDePasse = '';
    this.imageProfil = null;
    this.imagePreviewUrl = null;
  }
}
