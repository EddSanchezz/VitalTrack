export interface User {
  id: number;
  nombre: string;
  email: string;
  cedula?: string | null;
  consentimiento_privacidad?: boolean;
  fecha_nacimiento?: string | null; // YYYY-MM-DD
  fecha_registro?: string; // ISO timestamp
}
