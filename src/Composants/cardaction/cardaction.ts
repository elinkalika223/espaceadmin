import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-cardaction',
  templateUrl: './cardaction.html',
  styleUrls: ['./cardaction.css'], // correction : styleUrls au pluriel
})
export class Cardaction {
   @Output() clickNouvelUtilisateur = new EventEmitter<void>();

  ouvrir() {
    this.clickNouvelUtilisateur.emit();
  }
}
