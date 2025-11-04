export interface ConsentFlags {
  analytics: boolean;
  sharing: boolean;
  export: boolean;
}

export type UserRole = 'user' | 'coach' | 'health_professional' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  dob?: string; // ISO date YYYY-MM-DD
  age: number;
  sex?: 'M' | 'F' | 'O';
  weight?: number; // kg
  height?: number; // cm
  role?: UserRole;
  createdAt?: string; // ISO timestamp
  updatedAt?: string; // ISO timestamp
  //consent?: ConsentFlags;
}