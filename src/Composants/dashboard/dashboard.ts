import { Component, OnInit } from '@angular/core';
import { PatientStats } from '../../model/patientmodel';
import { DataService } from '../../service/dataservice';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit{
  stats: PatientStats = { 
    total: 0, 
    pregnant: 0, 
    postpartum: 0, 
    childFollowup: 0, 
    cpnRespectRate: 0, // ← MAINTENANT VALIDE
    vaccinationRate: 0  // ← MAINTENANT VALIDE
  };
  
  recentActivities: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getPatientStats().subscribe((stats: PatientStats) => {
      this.stats = stats;
    });
    
    this.recentActivities = [
      { date: '15/10/2025', activity: 'Nouvelle inscription patiente', user: 'Fatoumata K.', status: 'Complété' },
      { date: '14/10/2025', activity: 'Rappel CPN envoyé', user: 'Mariam D.', status: 'Envoyé' },
      { date: '14/10/2025', activity: 'Consultation prénatale manquée', user: 'Aïcha T.', status: 'En attente' },
      { date: '13/10/2025', activity: 'Vaccination effectuée', user: 'Bintou S.', status: 'Terminé' },
      { date: '12/10/2025', activity: 'Message envoyé à un professionnel', user: 'Dr. Diallo', status: 'Livré' }
    ];
  }

  getBadgeClass(status: string): string {
    const classes: { [key: string]: string } = {
      'Complété': 'badge-success',
      'Envoyé': 'badge-success',
      'Terminé': 'badge-success',
      'Livré': 'badge-success',
      'En attente': 'badge-warning'
    };
    return classes[status] || 'badge-success';
  }
}