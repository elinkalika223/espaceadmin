import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { ReportsService, ReportsStatsDto } from '../../service/reports.service';

Chart.register(...registerables);

interface KpiData {
  totalPatientes: number;
  totalConsultations: number;
  totalAccouchements: number;
  tauxSuivi: number;
}

interface MonthlyData {
  nom: string;
  cpnRealisees: number;
  cpnManquees: number;
  cponRealisees: number;
  cponManquees: number;
  tauxReussite: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports implements OnInit, OnDestroy {
  // KPIs
  kpiData: KpiData = {
    totalPatientes: 450,
    totalConsultations: 120,
    totalAccouchements: 20,
    tauxSuivi: 70
  };

  // Données mensuelles
  monthlyData: MonthlyData[] = [];

  // Sélecteur d'année
  selectedYear: number = new Date().getFullYear();
  availableYears: number[] = [];

  // Charts
  private repartitionChart: any;
  private trimestreChart: any;

  // Loading state
  isLoading: boolean = true;
  error: string | null = null;

  // Store real data
  private reportsData: ReportsStatsDto | null = null;

  constructor(private reportsService: ReportsService) {
    // Générer les années disponibles (3 dernières années + année actuelle)
    const currentYear = new Date().getFullYear();
    for (let i = 0; i <= 3; i++) {
      this.availableYears.push(currentYear - i);
    }
    this.availableYears.reverse();
  }

  ngOnInit(): void {
    this.loadRealData();
  }

  loadRealData(): void {
    this.isLoading = true;
    this.error = null;

    this.reportsService.getReportsStats('year', this.selectedYear).subscribe({
      next: (data: ReportsStatsDto) => {
        console.log('📊 Données reçues du backend pour l\'année', this.selectedYear, ':', data);
        this.reportsData = data;
        this.mapDataToComponent(data);
        this.isLoading = false;
        setTimeout(() => {
          this.initializeCharts();
        }, 100);
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des données:', err);
        this.error = 'Erreur lors du chargement des données. Veuillez réessayer.';
        this.isLoading = false;
        // En cas d'erreur, utiliser les données simulées comme fallback
        this.generateSimulatedData();
        setTimeout(() => {
          this.initializeCharts();
        }, 100);
      }
    });
  }

  mapDataToComponent(data: ReportsStatsDto): void {
    // Mapper les KPIs
    this.kpiData = {
      totalPatientes: data.totalPatientes || 0,
      totalConsultations: data.totalConsultations || 0,
      totalAccouchements: data.totalAccouchements || 0,
      tauxSuivi: Math.round(data.tauxSuivi || 0)
    };

    // Utiliser les données mensuelles du backend
    if (data.monthlyDetailData && data.monthlyDetailData.length > 0) {
      console.log('📊 Données mensuelles reçues du backend:', data.monthlyDetailData);
      this.monthlyData = data.monthlyDetailData.map(month => ({
        nom: month.nom,
        cpnRealisees: month.cpnRealisees || 0,
        cpnManquees: month.cpnManquees || 0,
        cponRealisees: month.cponRealisees || 0,
        cponManquees: month.cponManquees || 0,
        tauxReussite: month.tauxReussite || '0,0'
      }));
      console.log('✅ Données mensuelles mappées:', this.monthlyData);
    } else {
      console.warn('⚠️ Aucune donnée mensuelle trouvée, utilisation des données par défaut');
      // Fallback si les données ne sont pas disponibles
      this.generateMonthlyData();
    }
  }

  generateMonthlyData(): void {
    const months = [
      'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'
    ];

    // Données par défaut si le backend ne fournit pas de données
    this.monthlyData = months.map(month => ({
      nom: month,
      cpnRealisees: 0,
      cpnManquees: 0,
      cponRealisees: 0,
      cponManquees: 0,
      tauxReussite: '0,0'
    }));
  }

  generateSimulatedData(): void {
    // Utiliser les données de l'image comme données par défaut
    this.kpiData = {
      totalPatientes: 450,
      totalConsultations: 120,
      totalAccouchements: 20,
      tauxSuivi: 70
    };

    this.generateMonthlyData();
  }

  initializeCharts(): void {
    this.createRepartitionChart();
    this.createTrimestreChart();
  }

  createRepartitionChart(): void {
    const ctx = document.getElementById('repartitionChart') as HTMLCanvasElement;
    if (!ctx || !this.reportsData) return;

    // Détruire le graphique existant s'il existe
    if (this.repartitionChart) {
      this.repartitionChart.destroy();
    }

    // Utiliser les données réelles du backend
    const repartition = this.reportsData.repartitionCpnCpon;
    const data = [
      repartition?.cpnRealisees || 0,
      repartition?.cponRealisees || 0,
      repartition?.cpnManquees || 0,
      repartition?.cponManquees || 0
    ];

    this.repartitionChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['CPN Réalisées', 'CPON Réalisées', 'CPN Manquées', 'CPON Manquées'],
        datasets: [{
          data: data,
          backgroundColor: [
            '#90EE90', // Light green
            '#87CEEB', // Light blue
            '#9370DB', // Purple
            '#FF6B6B'  // Light red
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false // On utilise notre propre légende
          },
          tooltip: {
            enabled: true
          }
        },
        cutout: '60%'
      }
    });
  }

  createTrimestreChart(): void {
    const ctx = document.getElementById('trimestreChart') as HTMLCanvasElement;
    if (!ctx || !this.reportsData) return;

    // Détruire le graphique existant s'il existe
    if (this.trimestreChart) {
      this.trimestreChart.destroy();
    }

    // Utiliser les données réelles du backend
    const trimestreData = this.reportsData.cpnParTrimestre;
    let cpnRealisees = [0, 0, 0];
    let cpnManquees = [0, 0, 0];
    let labels = ['1er Trimestre', '2ème Trimestre', '3ème Trimestre'];

    if (trimestreData && trimestreData.length > 0) {
      trimestreData.forEach((trim, index) => {
        if (index < 3) {
          cpnRealisees[index] = trim.cpnRealisees || 0;
          cpnManquees[index] = trim.cpnManquees || 0;
          if (trim.trimestre) {
            labels[index] = trim.trimestre;
          }
        }
      });
    }

    // Calculer le max pour l'axe Y
    const maxValue = Math.max(
      ...cpnRealisees,
      ...cpnManquees,
      100 // Minimum pour avoir une échelle visible
    );
    const yMax = Math.ceil(maxValue / 100) * 100; // Arrondir à la centaine supérieure

    this.trimestreChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'CPN Réalisées',
            data: cpnRealisees,
            backgroundColor: '#90EE90',
            borderColor: '#90EE90',
            borderWidth: 0
          },
          {
            label: 'CPN Manquées',
            data: cpnManquees,
            backgroundColor: '#FF6B6B',
            borderColor: '#FF6B6B',
            borderWidth: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false // On utilise notre propre légende
          },
          tooltip: {
            enabled: true
          }
        },
        scales: {
          x: {
            stacked: false,
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            max: yMax > 0 ? yMax : 500,
            ticks: {
              stepSize: yMax > 0 ? Math.max(50, Math.floor(yMax / 5)) : 100,
              callback: function(value) {
                return value.toString();
              }
            },
            grid: {
              color: '#f0f0f0'
            }
          }
        }
      }
    });
  }

  filterByYear(year: any): void {
    this.selectedYear = typeof year === 'string' ? parseInt(year, 10) : year;
    console.log('Filtering by year:', this.selectedYear);
    // Recharger les données pour l'année sélectionnée
    this.loadRealData();
  }

  exportReport(format: string): void {
    console.log(`Exporting report in ${format} format...`);
    alert(`Export en cours au format ${format.toUpperCase()}...\nCette fonctionnalité sera bientôt disponible !`);
  }

  ngOnDestroy(): void {
    // Nettoyer les charts
    if (this.repartitionChart) this.repartitionChart.destroy();
    if (this.trimestreChart) this.trimestreChart.destroy();
  }
}
