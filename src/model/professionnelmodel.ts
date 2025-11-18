export interface Professional {
  id: string;
  firstName: string;
  lastName: string;
  specialty: 'gynecologist' | 'pediatrician' | 'midwife' | 'nurse' | 'nutritionist'; // ← CORRIGER
  phone: string;
  email?: string; // ← AJOUTER
  region: string;
  address?: string;
  assignedPatients: number;
  status: 'active' | 'inactive' | 'on_leave';
  notes?: string;
  createdAt?: Date; // ← AJOUTER
  updatedAt?: Date; // ← AJOUTER
}

export interface ProfessionalStats {
  total: number;
  gynecologists: number;
  pediatricians: number;
  midwives: number;
  nurses: number;
  nutritionists: number;
}

export interface ProfessionalFilter {
  searchTerm?: string;
  specialty?: string;
  region?: string;
  status?: string;
}