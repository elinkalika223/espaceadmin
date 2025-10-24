import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modalajoutuser',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modalajoutuser.html',
  styleUrls: ['./modalajoutuser.css']
})
export class Modalajoutuser {
  @Output() close = new EventEmitter<void>();

  // Champs du formulaire
  nom = '';
  prenom = '';
  email = '';
  motDePasse = '';

  // Image de profil
  imageProfil: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  // Gestion du fichier uploadé
  onFileSelected(event: any) {
    const file = event.target.files?.[0] ?? null;
    if (file) {
      this.imageProfil = file;

      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result;

      // ✅ Appel sécurisé, file n'est jamais null ici
      reader.readAsDataURL(file);

      console.log('Image sélectionnée:', file.name);
    }
  }

  creerUtilisateur() {
    console.log('Nouvel utilisateur créé:', this.nom, this.prenom, this.email, this.motDePasse, this.imageProfil);

    // Ici tu peux appeler ton service pour enregistrer l'utilisateur

    this.fermerModal();
  }

  fermerModal() {
    this.close.emit();
    // Réinitialisation du formulaire
    this.nom = '';
    this.prenom = '';
    this.email = '';
    this.motDePasse = '';
    this.imageProfil = null;
    this.imagePreview = null;
  }
}
