import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Patient, PatientStats } from '../model/patientmodel';
import { Professional } from '../model/professionnelmodel';
import { Content } from '../model/contentmodel'; // Importez depuis le modèle

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private patientsSubject = new BehaviorSubject<Patient[]>([]);
  public patients$ = this.patientsSubject.asObservable();

  constructor() { }

  // === PATIENTS ===
  getPatients(): Observable<Patient[]> {
    const patients: Patient[] = [
      {
        id: 'PT001',
        firstName: 'Fatoumata',
        lastName: 'Keita',
        phone: '76 12 34 56',
        region: 'Bamako',
        status: 'pregnant',
        dpa: '2026-02-15',
        lastCPN: '2025-10-10',
        createdAt: new Date('2025-01-15')
      },
      // ... autres patients
    ];

    return of(patients).pipe(
      tap(patients => {
        console.log('Patients chargés avec succès');
        this.patientsSubject.next(patients);
      }),
      catchError(error => {
        console.error('Erreur lors du chargement des patients:', error);
        return of([]);
      })
    );
  }

  getPatientStats(): Observable<PatientStats> {
    const stats: PatientStats = {
      total: 1254,
      pregnant: 650,
      postpartum: 350,
      childFollowup: 254,
      cpnRespectRate: 78,
      vaccinationRate: 72
    };
    
    return of(stats);
  }

  // === PROFESSIONNELS ===
  getProfessionals(): Observable<Professional[]> {
    const professionals: Professional[] = [
      {
        id: 'DR001',
        firstName: 'Amadou',
        lastName: 'Diallo',
        specialty: 'gynecologist',
        phone: '76 54 32 10',
        region: 'Bamako',
        assignedPatients: 42,
        status: 'active',
        email: 'amadou.diallo@health.ml',
        createdAt: new Date('2024-01-10')
      },
      // ... autres professionnels
    ];
    
    return of(professionals);
  }

  // === CONTENU ===
  getContents(): Observable<Content[]> { // Renommé en getContents() pour correspondre
    const content: Content[] = [
      {
        id: 'ART001',
        title: 'L\'importance des consultations prénatales',
        type: 'article',
        category: 'Grossesse',
        author: 'Dr. Diallo',
        content: 'Les consultations prénatales (CPN) sont essentielles pour suivre la santé de la mère et du bébé...',
        publishDate: '2025-09-10',
        views: 1254,
        status: 'published',
        language: 'french',
        tags: ['CPN', 'grossesse', 'santé'],
        createdAt: new Date('2025-09-01')
      },
      {
        id: 'VID001',
        title: 'Exercices pour femmes enceintes',
        type: 'video',
        category: 'Exercices prénatals',
        author: 'Coach Santé',
        content: 'Vidéo démontrant des exercices adaptés aux femmes enceintes...',
        publishDate: '2025-09-15',
        views: 543,
        status: 'published',
        language: 'french',
        duration: '12:45',
        videoUrl: 'https://example.com/video1',
        thumbnailUrl: 'https://example.com/thumb1.jpg',
        createdAt: new Date('2025-09-10')
      }
    ];
    
    return of(content);
  }

  // Ajoutez la méthode deleteContent manquante
  deleteContent(contentId: string): Observable<boolean> {
    console.log('Suppression du contenu:', contentId);
    // Implémentez la logique de suppression ici
    return of(true);
  }

  // === CRUD OPERATIONS ===
  addPatient(patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Observable<Patient> {
    const newPatient: Patient = {
      ...patientData,
      id: 'PT' + Date.now(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const currentPatients = this.patientsSubject.value;
    const updatedPatients = [...currentPatients, newPatient];
    
    this.patientsSubject.next(updatedPatients);
    return of(newPatient);
  }

  updatePatient(updatedPatient: Patient): Observable<Patient> {
    const currentPatients = this.patientsSubject.value;
    const updatedPatients = currentPatients.map(patient =>
      patient.id === updatedPatient.id 
        ? { ...updatedPatient, updatedAt: new Date() }
        : patient
    );
    
    this.patientsSubject.next(updatedPatients);
    return of(updatedPatient);
  }

  deletePatient(patientId: string): Observable<boolean> {
    const currentPatients = this.patientsSubject.value;
    const updatedPatients = currentPatients.filter(patient => patient.id !== patientId);
    
    this.patientsSubject.next(updatedPatients);
    return of(true);
  }

  // Recherche avec debounce
  searchPatients(searchTerm: string): Observable<Patient[]> {
    return this.patients$.pipe(
      map(patients => {
        if (!searchTerm) return patients;
        return patients.filter(patient =>
          patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.phone.includes(searchTerm)
        );
      })
    );
  }

  // Méthodes pour les professionnels
  deleteProfessional(professionalId: string): Observable<boolean> {
    console.log('Suppression du professionnel:', professionalId);
    return of(true);
  }

  addProfessional(professionalData: Omit<Professional, 'id' | 'assignedPatients'>): Observable<Professional> {
    const newProfessional: Professional = {
      ...professionalData,
      id: 'PRO' + Date.now(),
      assignedPatients: 0
    };
    return of(newProfessional);
  }

  updateProfessional(updatedProfessional: Professional): Observable<Professional> {
    return of(updatedProfessional);
  }
  
}