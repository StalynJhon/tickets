export interface TransportVehicle {
  idTransportVehicle?: number;
  vehicleCode: string;
  transportType: 'bus' | 'metro' | 'flight' | 'train' | 'taxi' | 'boat';
  capacity: number;
  vehicleModel: string;
  licensePlate?: string;
  yearVehicle?: number;
  fuelType?: string;
  facilities?: string;
  safetyFeatures?: string;
  statusVehicle?: 'operational' | 'maintenance' | 'out_of_service';
  stateVehicle?: boolean;
  companyId: number;
  routeId?: number;
  createVehicle?: string;
  updateVehicle?: string;
  // Additional fields
  routeName?: string;
  origin?: string;
  destination?: string;
  horariosActivos?: number;
  reservasTotales?: number;
  caracteristicas?: any;
}
