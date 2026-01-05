export interface TransportRoute {
  idTransportRoute?: number;
  routeName: string;
  transportType: 'bus' | 'metro' | 'flight' | 'train' | 'taxi' | 'boat';
  origin: string;
  destination: string;
  distanceKm?: number;
  estimatedDuration?: number; // minutes
  routeCode?: string;
  waypoints?: string; // JSON string
  tollCosts?: number;
  statusRoute?: 'active' | 'suspended' | 'maintenance';
  stateRoute?: boolean;
  companyId: number;
  nameCompany?: string;
  createRoute?: string;
  updateRoute?: string;
  // Additional fields
  vehiculosAsignados?: number;
  horariosActivos?: number;
  metadata?: {
    coordenadas?: any;
    patronesTrafico?: any;
    impactoClima?: any;
  };
}
