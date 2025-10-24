import { Component } from '@angular/core';
import { Cardaction } from '../../Composants/cardaction/cardaction';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Modalajoutuser } from '../modalajoutuser/modalajoutuser';

@Component({
  selector: 'app-utilisateurs',
  imports: [Cardaction,FormsModule,CommonModule,Modalajoutuser],
  templateUrl: './utilisateurs.html',
  styleUrl: './utilisateurs.css',
})
export class Utilisateurs {
    showModal = false;

  ouvrirModal() {
    this.showModal = true;
  }

  fermerModal() {
    this.showModal = false;
  }
}
