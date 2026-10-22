export interface PageMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/** Pagination block as returned by the API. */
export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: ApiMeta;
}

export interface ListResult<T> {
  items: T[];
  meta: PageMeta;
}

export type UserRole = 'ADMIN' | 'DOCTOR' | 'PATIENT' | 'USER';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  profile?: string;
  createdAt: string;
}

export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  patientCount: number;
  profile?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorFilterOptions {
  specializations: string[];
  hospitals: string[];
}

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface PatientDoctorSummary {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  profile?: string;
}

export interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: Gender;
  phone: string;
  email?: string;
  condition: string;
  notes?: string;
  profile?: string;
  doctor: PatientDoctorSummary;
  createdAt: string;
  updatedAt: string;
}

export interface PatientFilterOptions {
  conditions: string[];
}

/* ---- list query params ---- */
export interface ListParams {
  page: number;
  limit: number;
  search: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  from: string;
  to: string;
}

export interface DoctorListParams extends ListParams {
  specialization: string;
  hospital: string;
}

export interface PatientListParams extends ListParams {
  condition: string;
  gender: Gender | '';
  doctorId: string;
}

/* ---- dashboard ---- */
export interface DashboardOverview {
  totalDoctors: number;
  totalPatients: number;
  averagePatientsPerDoctor: number;
  newDoctorsLast30Days: number;
  newPatientsLast30Days: number;
  patientsToday: number;
}

export interface PatientsPerDoctorItem {
  doctorId: string;
  name: string;
  specialization: string;
  patientCount: number;
}

export type TimelineInterval = 'day' | 'month';

export interface TimelinePoint {
  date: string;
  doctors: number;
  patients: number;
}

export interface Timeline {
  from: string;
  to: string;
  interval: TimelineInterval;
  series: TimelinePoint[];
}

export interface TimelineParams {
  interval: TimelineInterval;
  from: string;
  to: string;
}

export interface DistributionItem {
  label: string;
  count: number;
}

export interface Distributions {
  patientsByCondition: DistributionItem[];
  patientsByGender: DistributionItem[];
  doctorsBySpecialization: DistributionItem[];
}
