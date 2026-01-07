import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'products/edit/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'products',
    renderMode: RenderMode.Server
  },
  {
    path: 'products/new',
    renderMode: RenderMode.Server
  },
  {
    path: 'transport',
    renderMode: RenderMode.Server
  },
  {
    path: 'transport/rutas',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
