// Matches backend 'usuario' table
export interface User {
  id?: number;
  cedula?: string;
  nombre: string;
  email: string;
  fecha_registro?: string; // ISO datetime
  fecha_nacimiento?: string; // ISO date
  consentimiento_privacidad?: boolean;
}
