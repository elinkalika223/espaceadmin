import { Routes } from '@angular/router';
import { Dashboard } from '../Composants/dashboard/dashboard';
import { Patients } from '../Composants/patients/patients';
import { Professionals } from '../Composants/professionals/professionals';
import { Reports } from '../Composants/reports/reports';
import {  ContentC } from '../Composants/content/content';


export const routes: Routes = [
 { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'patients', component: Patients },
  { path: 'professionals', component: Professionals },
  { path: 'content', component: ContentC },
  { path: 'reports', component: Reports },
  ];
