export interface TransportRoute {
  idTransportRoute?: number;
  routeName: string;
  origin: string;
  destination: string;
  transportType: string;
  companyId?: number;
  distanceKm?: number;
  estimatedDuration?: number;
  routeCode?: string;
  tollCosts?: number;
  statusRoute?: string;

  // Campos usados por la UI
  nameCompany?: string;
  vehiculosAsignados?: number;
}
