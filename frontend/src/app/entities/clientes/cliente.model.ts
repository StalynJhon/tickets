export interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  documento: string;
  estado: 'ACTIVO' | 'BLOQUEADO';
  activo: boolean;
}
