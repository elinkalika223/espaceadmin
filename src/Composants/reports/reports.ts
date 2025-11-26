import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface StatCard {
  title: string;
  value: number;
  icon: string;
  color: string;
  trend: number; // Pourcentage de changement
  subtitle: string;
}

interface PatientData {
  id: number;
  nom: string;
  prenom: string;
  age: number;
  dateInscription: Date;
  statut: 'prenatale' | 'postnatale';
  nombreConsultations: number;
  prochainRDV?: Date;
}

interface ConsultationData {
  date: Date;
  patiente: string;
  medecin: string;
  type: string;
  statut: 'completee' | 'annulee' | 'en_attente';
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports implements OnInit {
  // Statistiques principales
  statsCards: StatCard[] = [];
  
  // Données des patientes
  patientes: PatientData[] = [];
  
  // Consultations récentes
  consultations: ConsultationData[] = [];
  
  // Filtres
  selectedPeriod: string = 'month';
  selectedStatut: string = 'all';
  
  // Charts
  private patientsChart: any;
  private consultationsChart: any;
  private statusChart: any;

  ngOnInit(): void {
    this.generateSimulatedData();
    setTimeout(() => {
      this.initializeCharts();
    }, 100);
  }

  generateSimulatedData(): void {
    // Générer les cartes de statistiques
    this.statsCards = [
      {
        title: 'Total Patientes',
        value: 342,
        icon: '👥',
        color: '#E91E63',
        trend: 12.5,
        subtitle: '+43 ce mois'
      },
      {
        title: 'Consultations',
        value: 1247,
        icon: '📋',
        color: '#2196F3',
        trend: 8.3,
        subtitle: '+98 ce mois'
      },
      {
        title: 'Accouchements',
        value: 87,
        icon: '👶',
        color: '#4CAF50',
        trend: 5.2,
        subtitle: '+4 cette semaine'
      },
      {
        title: 'Taux Suivi',
        value: 94.8,
        icon: '📈',
        color: '#FF9800',
        trend: 2.1,
        subtitle: '+2.1% ce mois'
      }
    ];

    // Générer des patientes simulées
    const noms = ['Diallo', 'Traoré', 'Keita', 'Coulibaly', 'Touré', 'Koné', 'Sangaré', 'Sidibé'];
    const prenoms = ['Aminata', 'Fatoumata', 'Mariam', 'Aïssata', 'Kadiatou', 'Safiatou', 'Maimouna', 'Salimata'];
    
    for (let i = 1; i <= 50; i++) {
      const dateInscription = new Date();
      dateInscription.setDate(dateInscription.getDate() - Math.floor(Math.random() * 180));
      
      const prochainRDV = new Date();
      prochainRDV.setDate(prochainRDV.getDate() + Math.floor(Math.random() * 30));
      
      this.patientes.push({
        id: i,
        nom: noms[Math.floor(Math.random() * noms.length)],
        prenom: prenoms[Math.floor(Math.random() * prenoms.length)],
        age: 20 + Math.floor(Math.random() * 20),
        dateInscription: dateInscription,
        statut: Math.random() > 0.3 ? 'prenatale' : 'postnatale',
        nombreConsultations: Math.floor(Math.random() * 15) + 1,
        prochainRDV: Math.random() > 0.3 ? prochainRDV : undefined
      });
    }

    // Générer des consultations simulées
    const medecins = ['Dr. Simpara', 'Dr. Sanogo', 'Dr. Kouyaté'];
    const types = ['CPN', 'CPON', 'Urgence', 'Suivi', 'Vaccination'];
    
    for (let i = 0; i < 20; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      const patiente = this.patientes[Math.floor(Math.random() * this.patientes.length)];
      
      this.consultations.push({
        date: date,
        patiente: `${patiente.prenom} ${patiente.nom}`,
        medecin: medecins[Math.floor(Math.random() * medecins.length)],
        type: types[Math.floor(Math.random() * types.length)],
        statut: Math.random() > 0.1 ? 'completee' : (Math.random() > 0.5 ? 'en_attente' : 'annulee')
      });
    }

    // Trier les consultations par date (plus récente en premier)
    this.consultations.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  initializeCharts(): void {
    this.createPatientsChart();
    this.createConsultationsChart();
    this.createStatusChart();
  }

  createPatientsChart(): void {
    const ctx = document.getElementById('patientsChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.patientsChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
        datasets: [{
          label: 'Nouvelles Patientes',
          data: [25, 32, 28, 35, 42, 38, 45, 48, 43, 50, 47, 52],
          borderColor: '#E91E63',
          backgroundColor: 'rgba(233, 30, 99, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          title: {
            display: true,
            text: 'Évolution des Inscriptions (2024)'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  createConsultationsChart(): void {
    const ctx = document.getElementById('consultationsChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.consultationsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        datasets: [
          {
            label: 'CPN',
            data: [12, 15, 10, 18, 14, 8, 5],
            backgroundColor: '#2196F3'
          },
          {
            label: 'CPON',
            data: [8, 10, 7, 12, 9, 5, 3],
            backgroundColor: '#4CAF50'
          },
          {
            label: 'Urgences',
            data: [3, 2, 4, 1, 3, 2, 1],
            backgroundColor: '#FF5722'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          title: {
            display: true,
            text: 'Consultations par Type (Cette Semaine)'
          }
        },
        scales: {
          x: {
            stacked: false
          },
          y: {
            stacked: false,
            beginAtZero: true
          }
        }
      }
    });
  }

  createStatusChart(): void {
    const ctx = document.getElementById('statusChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.statusChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Prénatale', 'Postnatale', 'Suivi Terminé'],
        datasets: [{
          data: [234, 87, 21],
          backgroundColor: [
            '#E91E63',
            '#4CAF50',
            '#9E9E9E'
          ],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
          },
          title: {
            display: true,
            text: 'Répartition par Statut'
          }
        }
      }
    });
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'prenatale': return 'badge-prenatal';
      case 'postnatale': return 'badge-postnatal';
      default: return 'badge-default';
    }
  }

  getConsultationStatutClass(statut: string): string {
    switch (statut) {
      case 'completee': return 'badge-success';
      case 'annulee': return 'badge-danger';
      case 'en_attente': return 'badge-warning';
      default: return 'badge-default';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getTrendIcon(trend: number): string {
    return trend >= 0 ? '↗' : '↘';
  }

  getTrendClass(trend: number): string {
    return trend >= 0 ? 'trend-up' : 'trend-down';
  }

  exportReport(format: string): void {
    console.log(`Exporting report in ${format} format...`);
    alert(`Export en cours au format ${format.toUpperCase()}...\nCette fonctionnalité sera bientôt disponible !`);
  }

  filterByPeriod(period: string): void {
    this.selectedPeriod = period;
    console.log('Filtering by period:', period);
    // Ici, vous pouvez recharger les données selon la période
  }

  filterByStatut(statut: string): void {
    this.selectedStatut = statut;
    console.log('Filtering by statut:', statut);
    // Ici, vous pouvez filtrer les patientes selon le statut
  }

  ngOnDestroy(): void {
    // Nettoyer les charts
    if (this.patientsChart) this.patientsChart.destroy();
    if (this.consultationsChart) this.consultationsChart.destroy();
    if (this.statusChart) this.statusChart.destroy();
  }
}
