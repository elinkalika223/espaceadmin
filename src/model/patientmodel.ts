export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  region: string;
  status: 'pregnant' | 'postpartum' | 'child_followup';
  dpa?: string;
  lastCPN?: string;
  notes?: string;
  createdAt?: Date; // ← AJOUTER
  updatedAt?: Date; // ← AJOUTER
}

export interface PatientStats {
  total: number;
  pregnant: number;
  postpartum: number;
  childFollowup: number;
  cpnRespectRate: number; // ← AJOUTER
  vaccinationRate: number; // ← AJOUTER
}

export interface PatientFilter {
  searchTerm?: string;
  status?: string;
  region?: string;
  startDate?: string;
  endDate?: string;
}