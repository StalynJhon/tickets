export interface TransportCompany {
  idTransportCompany?: number;
  nameCompany: string;
  licenseNumber: string;
  contactEmail: string;
  contactPhone?: string;
  addressCompany?: string;
  websiteCompany?: string;
  ratingCompany?: number;
  statusCompany?: 'active' | 'suspended' | 'inactive';
  stateCompany?: boolean;
  createCompany?: string;
  updateCompany?: string;
  // Additional fields from query
  rutasActivas?: number;
  vehiculosActivos?: number;
  reservasTotales?: number;
  promedioRating?: number;
}
