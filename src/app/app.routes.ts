import { Routes } from '@angular/router';
import { Dashboard } from '../page/dashboard/dashboard';
import { Rapport } from '../page/rapport/rapport';
import { Professionnel } from '../page/professionnel/professionnel';
import { Utilisateur } from '../page/utilisateur/utilisateur';

export const routes: Routes = [
 { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'utilisateurs', component: Utilisateur },
  { path: 'profesionnels', component: Professionnel },
//   { path: 'contenu', component: Contenu },
  { path: 'rapport', component: Rapport },
  ];
