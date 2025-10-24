import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cardaction } from '../../Composants/cardaction/cardaction';
import { Cardaction2 } from '../../Composants/cardaction2/cardaction2';

@Component({
  selector: 'app-contenu',
  standalone: true,
  imports: [CommonModule, FormsModule, Cardaction2],
  templateUrl: './contenu.html',
  styleUrls: ['./contenu.css']
})
export class Contenu {
  showCardAction = true; // true pour afficher CardAction sur cette page

  allSelected = false;

  contenus = [
    { titre: 'Suivi de grossesse', categorie: 'Santé', type: 'Article', datePublication: '12/10/2025', statut: 'Actif', selected: false },
    { titre: 'Conseils nutrition', categorie: 'Bien-être', type: 'Vidéo', datePublication: '10/10/2025', statut: 'Inactif', selected: false },
    { titre: 'Accouchement naturel', categorie: 'Santé', type: 'Podcast', datePublication: '02/10/2025', statut: 'Actif', selected: false }
  ];

  toggleAllSelection() {
    this.allSelected = !this.allSelected;
    this.contenus.forEach(item => item.selected = this.allSelected);
  }

  toggleSelection(contenu: any) {
    contenu.selected = !contenu.selected;
  }

  onBlock(contenu: any) {
    contenu.statut = contenu.statut === 'Actif' ? 'Inactif' : 'Actif';
  }

  onEdit(contenu: any) {
    alert(`Édition du contenu : ${contenu.titre}`);
  }

  onDelete(contenu: any) {
    this.contenus = this.contenus.filter(c => c !== contenu);
  }
}
