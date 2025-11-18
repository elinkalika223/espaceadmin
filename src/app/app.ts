import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../Composants/sidebar/sidebar';
import { Header } from '../Composants/header/header';
import { Patients } from '../Composants/patients/patients';
import { Professionals } from '../Composants/professionals/professionals';
import { ContentC } from '../Composants/content/content';
import { Reports } from '../Composants/reports/reports';
import { PatientModal } from '../Composants/Modal/patient-modal/patient-modal';
import { ProModal } from '../Composants/Modal/pro-modal/pro-modal';
import { ContentModal } from '../Composants/Modal/content-modal/content-modal';
import { FormsModule } from '@angular/forms';
import { Dashboard } from '../Composants/dashboard/dashboard';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [RouterOutlet,FormsModule,CommonModule,Sidebar,
    Header,
    Dashboard,
    Patients,
    Professionals,
    ContentC,
    Reports,
    PatientModal,
    ProModal,
    ContentModal],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'KènèyaMuso - Administration';
}
