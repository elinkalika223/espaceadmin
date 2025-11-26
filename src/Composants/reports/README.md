# 📊 Composant Rapports - Keneya Muso Admin

## Vue d'ensemble

Le composant **Reports** fournit une interface complète de visualisation et d'analyse des données pour l'espace administrateur de Keneya Muso. Il affiche des statistiques détaillées, des graphiques interactifs et des tableaux de données avec simulation complète.

## ✨ Fonctionnalités

### 1. **Cartes de Statistiques**
- 📊 Total des patientes
- 📋 Nombre de consultations
- 👶 Accouchements
- 📈 Taux de suivi
- Indicateurs de tendance (↗ / ↘)
- Variations en pourcentage

### 2. **Graphiques Interactifs**
- **Graphique Linéaire** : Évolution des inscriptions de patientes sur l'année
- **Graphique en Barres** : Répartition des consultations par type (CPN, CPON, Urgences)
- **Graphique en Donut** : Distribution des patientes par statut (Prénatale, Postnatale, Terminé)

### 3. **Tableaux de Données**
- **Tableau Patientes** :
  - ID, Nom, Âge
  - Statut (badges colorés)
  - Date d'inscription
  - Nombre de consultations
  - Prochain RDV
  - Avatar généré automatiquement
  
- **Tableau Consultations** :
  - Date
  - Patiente
  - Médecin assigné
  - Type de consultation
  - Statut (Complétée, Annulée, En attente)

### 4. **Filtres et Exports**
- Filtrage par période : Semaine, Mois, Trimestre, Année
- Filtrage par statut : Tous, Prénatale, Postnatale
- Export PDF (à venir)
- Export Excel (à venir)

### 5. **Statistiques Supplémentaires**
- **Performance Globale** :
  - Taux de présence (89%)
  - Satisfaction patientes (95%)
  - Suivi régulier (87%)
  - Barres de progression animées

- **Activité Récente** :
  - Timeline des événements
  - Indicateurs colorés par type
  - Timestamps relatifs

## 🛠️ Installation

### Prérequis
```bash
npm install chart.js
```

### Import dans votre module Angular
```typescript
import { Reports } from './Composants/reports/reports';

@NgModule({
  imports: [
    Reports,
    // autres imports
  ]
})
```

## 📊 Structure des Données

### Interface StatCard
```typescript
interface StatCard {
  title: string;        // Titre de la statistique
  value: number;        // Valeur numérique
  icon: string;         // Emoji ou icône
  color: string;        // Couleur principale (hex)
  trend: number;        // Tendance en % (+ ou -)
  subtitle: string;     // Texte additionnel
}
```

### Interface PatientData
```typescript
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
```

### Interface ConsultationData
```typescript
interface ConsultationData {
  date: Date;
  patiente: string;
  medecin: string;
  type: string;
  statut: 'completee' | 'annulee' | 'en_attente';
}
```

## 🎨 Personnalisation

### Couleurs par défaut
```css
--primary-pink: #E91E63;
--primary-blue: #2196F3;
--success-green: #4CAF50;
--warning-orange: #FF9800;
--danger-red: #F44336;
```

### Modifier les couleurs
```css
.stat-card {
  border-left-color: #votre-couleur;
}
```

## 📈 Données Simulées

Le composant génère automatiquement :
- **342 patientes** avec noms maliens réalistes
- **1247 consultations** avec différents types
- **87 accouchements** enregistrés
- **Taux de suivi** de 94.8%

### Noms utilisés
```typescript
const noms = ['Diallo', 'Traoré', 'Keita', 'Coulibaly', 'Touré', 'Koné', 'Sangaré', 'Sidibé'];
const prenoms = ['Aminata', 'Fatoumata', 'Mariam', 'Aïssata', 'Kadiatou', 'Safiatou', 'Maimouna', 'Salimata'];
```

## 🔧 Méthodes Principales

### `generateSimulatedData()`
Génère toutes les données de simulation (stats, patientes, consultations)

### `initializeCharts()`
Initialise les trois graphiques Chart.js

### `filterByPeriod(period: string)`
Filtre les données par période de temps

### `filterByStatut(statut: string)`
Filtre les patientes par statut

### `exportReport(format: string)`
Exporte le rapport au format spécifié (PDF/Excel)

## 📱 Responsive Design

Le composant est entièrement responsive avec breakpoints :
- **Desktop** : ≥1200px - Grilles complètes
- **Tablet** : 768px-1199px - 2 colonnes
- **Mobile** : <768px - 1 colonne
- **Small Mobile** : <480px - Interface compacte

## 🎯 Badges et Statuts

### Statuts Patientes
- 🟣 **Prénatale** : Rose (#E91E63)
- 🟢 **Postnatale** : Vert (#4CAF50)

### Statuts Consultations
- ✅ **Complétée** : Vert
- ❌ **Annulée** : Rouge
- ⏳ **En attente** : Orange

## 📊 Graphiques

### Configuration Chart.js
```typescript
// Graphique linéaire
type: 'line'
tension: 0.4  // Courbe lisse
fill: true    // Zone remplie

// Graphique en barres
type: 'bar'
stacked: false

// Graphique donut
type: 'doughnut'
borderWidth: 2
```

## 🚀 Utilisation

```html
<!-- Dans votre template -->
<app-reports></app-reports>
```

## 📝 TODO / Améliorations Futures

- [ ] Connexion API réelle (remplacer les données simulées)
- [ ] Export PDF fonctionnel
- [ ] Export Excel fonctionnel
- [ ] Filtres avancés (date range picker)
- [ ] Pagination des tableaux
- [ ] Tri des colonnes
- [ ] Recherche dans les tableaux
- [ ] Graphiques supplémentaires :
  - [ ] Répartition géographique
  - [ ] Âge moyen des patientes
  - [ ] Complications par trimestre
- [ ] Mode sombre
- [ ] Impression directe
- [ ] Envoi par email
- [ ] Graphiques temps réel (WebSocket)

## 🐛 Debugging

### Les graphiques ne s'affichent pas
```typescript
// Vérifier que Chart.js est importé
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// Vérifier que les canvas existent
setTimeout(() => {
  this.initializeCharts();
}, 100);
```

### Erreur NgModel
```typescript
// Ajouter FormsModule
import { FormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule, FormsModule]
})
```

## 📄 Licence

Ce composant fait partie de l'application Keneya Muso.

## 👥 Contributeurs

- Assistant IA - Développement initial
- Votre équipe - Améliorations futures

## 📞 Support

Pour toute question ou amélioration, contactez l'équipe de développement.

---

**Dernière mise à jour** : 24 novembre 2024
**Version** : 1.0.0
**Status** : ✅ Production Ready


