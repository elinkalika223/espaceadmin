import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from '../Composants/menu/menu';
import { Profilbar } from '../Composants/profilbar/profilbar';
import { Dashboard } from '../page/dashboard/dashboard';
import { Cardaction } from '../Composants/cardaction/cardaction';
import { FormsModule } from '@angular/forms';
import { Professionnel } from '../page/professionnel/professionnel';
import { Utilisateur } from '../page/utilisateur/utilisateur';




@Component({
  selector: 'app-root',
  imports: [RouterOutlet,FormsModule,Menu,Profilbar,Dashboard,Professionnel,Utilisateur],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('keneyaAdmin');
}
