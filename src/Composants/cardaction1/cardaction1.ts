import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-cardaction1',
  imports: [],
  templateUrl: './cardaction1.html',
  styleUrl: './cardaction1.css',
})
export class Cardaction1 {
  @Output() clickNouvelUtilisateur = new EventEmitter<void>();

  ouvrir() {
    this.clickNouvelUtilisateur.emit();
  }
}
