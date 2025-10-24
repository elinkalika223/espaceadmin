import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from '../Composants/menu/menu';
import { Profilbar } from '../Composants/profilbar/profilbar';
import { Dashboard } from '../page/dashboard/dashboard';
import { Cardaction } from '../Composants/cardaction/cardaction';
import { Utilisateurs } from '../page/utilisateurs/utilisateurs';
import { FormsModule } from '@angular/forms';
import { Modalajoutuser } from '../page/modalajoutuser/modalajoutuser';
import { Modalajoutprofessionnel } from '../page/modalajoutprofessionnel/modalajoutprofessionnel';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,FormsModule,Menu,Profilbar,Dashboard,Cardaction,Utilisateurs,Modalajoutuser,Modalajoutprofessionnel],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('keneyaAdmin');
}
