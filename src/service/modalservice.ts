import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ModalData {
  type: 'view' | 'edit' | 'create';
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private patientModalState = new BehaviorSubject<boolean>(false);
  private professionalModalState = new BehaviorSubject<boolean>(false);
  private contentModalState = new BehaviorSubject<ModalData>({ type: 'create' });

  patientModalState$: Observable<boolean> = this.patientModalState.asObservable();
  professionalModalState$: Observable<boolean> = this.professionalModalState.asObservable();
  contentModalState$: Observable<ModalData> = this.contentModalState.asObservable();

  // Méthodes existantes pour patients et professionnels
  openPatientModal(): void {
    this.patientModalState.next(true);
  }

  closePatientModal(): void {
    this.patientModalState.next(false);
  }

  openProfessionalModal(): void {
    this.professionalModalState.next(true);
  }

  closeProfessionalModal(): void {
    this.professionalModalState.next(false);
  }

  // Nouvelles méthodes pour le contenu avec plus de contrôle
  openContentModal(): void {
    this.contentModalState.next({ type: 'create' });
  }

  openContentViewModal(content: any): void {
    this.contentModalState.next({ type: 'view', data: content });
  }

  openContentEditModal(content: any): void {
    this.contentModalState.next({ type: 'edit', data: content });
  }

  closeContentModal(): void {
    this.contentModalState.next({ type: 'create' });
  }
}