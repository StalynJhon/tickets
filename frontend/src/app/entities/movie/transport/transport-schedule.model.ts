export interface TransportSchedule {
  idTransportSchedule?: number;
  vehicleId: number;
  departureTime: Date | string;
  arrivalTime: Date | string;
  priceSchedule: number;
  availableSeats: number;
  statusSchedule?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'delayed';
  stateSchedule?: boolean;
  createSchedule?: string;
  updateSchedule?: string;
  // Additional fields
  vehicleCode?: string;
  routeName?: string;
  origin?: string;
  destination?: string;
  reservasActivas?: number;
}
