import { Routes } from '@angular/router';
import { Dashboard } from '../page/dashboard/dashboard';
import { Utilisateurs } from '../page/utilisateurs/utilisateurs';
import { Profesionnels } from '../page/profesionnels/profesionnels';
import { Contenu } from '../page/contenu/contenu';
import { Rapport } from '../page/rapport/rapport';

export const routes: Routes = [
 { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'utilisateurs', component: Utilisateurs },
  { path: 'profesionnels', component: Profesionnels },
  { path: 'contenu', component: Contenu },
  { path: 'rapport', component: Rapport },
  ];
