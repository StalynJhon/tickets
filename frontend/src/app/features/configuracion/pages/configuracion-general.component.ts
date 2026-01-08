import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfiguracionService } from '../configuracion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-configuracion-general',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './configuracion-general.component.html',
  styleUrls: ['./configuracion-general.component.css']
})
export class ConfiguracionGeneralComponent implements OnInit {

  configData: any = {
    nombreComercial: '',
    logo: '',
    colores: {
      primario: '#007bff',
      secundario: '#6c757d',
      fondo: '#ffffff'
    },
    contacto: {
      email: '',
      telefono: '',
      direccion: ''
    },
    negocio: {
      moneda: 'USD',
      limiteTickets: 10,
      transporteHabilitado: true,
      productosHabilitados: true
    },
    textosLegales: {
      terminos: '',
      politica: '',
      mensajesCompra: ''
    },
    faqs: []
  };

  // Estados para secciones colapsables
  private expandedSections: Set<string> = new Set(['plataforma', 'legales', 'faq', 'negocio']);
  
  // Estados para búsqueda y filtrado
  filtroActual: string = 'todas';
  terminoBusqueda: string = '';
  seccionesFiltradas: string[] = ['plataforma', 'legales', 'faq', 'negocio'];

  constructor(private configuracionService: ConfiguracionService) {}

  ngOnInit(): void {
    this.cargarConfiguracion();
  }

  cargarConfiguracion() {
    // Cargar configuración general
    this.configuracionService.getConfiguracionGeneral().subscribe({
      next: (data: any) => {
        if (data) {
          this.configData.nombreComercial = data.nombreComercial || '';
          this.configData.logo = data.logo || '';
          this.configData.colores = { ...this.configData.colores, ...data.colores };
          this.configData.contacto = { ...this.configData.contacto, ...data.contacto };
        }
      },
      error: (err: any) => {
        console.error('Error al cargar configuración general:', err);
      }
    });

    // Cargar configuración de negocio
    this.configuracionService.getConfiguracionNegocio().subscribe({
      next: (data: any) => {
        if (data) {
          this.configData.negocio = { ...this.configData.negocio, ...data };
        }
      },
      error: (err: any) => {
        console.error('Error al cargar configuración de negocio:', err);
      }
    });

    // Cargar textos legales
    this.configuracionService.getTextosLegales().subscribe({
      next: (data: any) => {
        if (data) {
          this.configData.textosLegales = { ...this.configData.textosLegales, ...data };
        }
      },
      error: (err: any) => {
        console.error('Error al cargar textos legales:', err);
      }
    });

    // Cargar FAQs
    this.configuracionService.getAyudaFAQ().subscribe({
      next: (data: any) => {
        if (data && data.faqs) {
          this.configData.faqs = [...data.faqs];
        }
      },
      error: (err: any) => {
        console.error('Error al cargar FAQs:', err);
      }
    });
  }

  guardarConfiguracion() {
    // Guardar configuración general
    const configGeneral = {
      nombreComercial: this.configData.nombreComercial,
      logo: this.configData.logo,
      colores: this.configData.colores,
      contacto: this.configData.contacto
    };

    this.configuracionService.guardarConfiguracionGeneral(configGeneral).subscribe({
      next: () => {
        console.log('Configuración general guardada correctamente');
      },
      error: (err: any) => {
        console.error('Error al guardar configuración general:', err);
        Swal.fire('Error', 'No se pudo guardar la configuración general', 'error');
        return;
      }
    });

    // Guardar configuración de negocio
    this.configuracionService.guardarConfiguracionNegocio(this.configData.negocio).subscribe({
      next: () => {
        console.log('Configuración de negocio guardada correctamente');
      },
      error: (err) => {
        console.error('Error al guardar configuración de negocio:', err);
        Swal.fire('Error', 'No se pudo guardar la configuración de negocio', 'error');
        return;
      }
    });

    // Guardar textos legales
    console.log('Datos a enviar para textos legales:', this.configData.textosLegales);
    
    // Solo guardar si al menos un campo tiene contenido
    const textosLegales = this.configData.textosLegales;
    if (textosLegales.terminos || textosLegales.politica || textosLegales.mensajesCompra) {
      this.configuracionService.guardarTextosLegales(textosLegales).subscribe({
        next: () => {
          console.log('Textos legales guardados correctamente');
        },
        error: (err) => {
          console.error('Error al guardar textos legales:', err);
          Swal.fire('Error', 'No se pudieron guardar los textos legales', 'error');
          return;
        }
      });
    } else {
      console.log('No hay textos legales para guardar');
    }

    // Guardar FAQs
    // Garantizar que siempre tengamos un array válido
    let faqsParaEnviar = [];
    
    if (this.configData.faqs === null || this.configData.faqs === undefined) {
      faqsParaEnviar = [];
    } else if (Array.isArray(this.configData.faqs)) {
      // Filtrar FAQs con contenido real
      faqsParaEnviar = this.configData.faqs.filter((faq: any) => {
        try {
          const pregunta = faq?.pregunta || '';
          const respuesta = faq?.respuesta || '';
          const preguntaTrim = typeof pregunta === 'string' ? pregunta.trim() : '';
          const respuestaTrim = typeof respuesta === 'string' ? respuesta.trim() : '';
          
          return preguntaTrim.length > 0 || respuestaTrim.length > 0;
        } catch (error) {
          return false;
        }
      });
    } else {
      faqsParaEnviar = [];
    }
    
    // ENVIAR SIEMPRE UN ARRAY VÁLIDO AL BACKEND
    this.configuracionService.guardarAyudaFAQ({ faqs: faqsParaEnviar }).subscribe({
      next: () => {
        Swal.fire('Guardado', 'La configuración se ha guardado correctamente', 'success');
      },
      error: (err: any) => {
        Swal.fire('Error', 'No se pudieron guardar las preguntas frecuentes', 'error');
      }
    });
  }

  // Métodos para secciones colapsables
  toggleSection(section: string): void {
    if (this.expandedSections.has(section)) {
      this.expandedSections.delete(section);
    } else {
      this.expandedSections.add(section);
    }
  }

  isSectionExpanded(section: string): boolean {
    return this.expandedSections.has(section);
  }

  getSectionIcon(section: string): string {
    return this.isSectionExpanded(section) ? 'icon-chevron-up' : 'icon-chevron-down';
  }

  // Métodos para búsqueda y filtrado
  aplicarFiltro(filtro: string): void {
    this.filtroActual = filtro;
    this.filtrarSecciones();
  }

  filtrarSecciones(): void {
    if (this.filtroActual === 'todas') {
      this.seccionesFiltradas = ['plataforma', 'legales', 'faq', 'negocio'];
    } else {
      this.seccionesFiltradas = [this.filtroActual];
    }
  }

  buscarConfiguracion(): void {
    if (this.terminoBusqueda.trim() === '') {
      this.filtrarSecciones();
      return;
    }

    // Filtrar secciones según el término de búsqueda
    const secciones = ['plataforma', 'legales', 'faq', 'negocio'];
    this.seccionesFiltradas = secciones.filter(seccion => {
      const titulo = this.getTituloSeccion(seccion).toLowerCase();
      return titulo.includes(this.terminoBusqueda.toLowerCase());
    });
  }

  getTituloSeccion(seccion: string): string {
    switch (seccion) {
      case 'plataforma':
        return 'Parámetros de la Plataforma';
      case 'legales':
        return 'Textos Legales';
      case 'negocio':
        return 'Configuración de Negocio';
      case 'faq':
        return 'Preguntas Frecuentes';
      default:
        return seccion;
    }
  }

  // Métodos para manejo de FAQs
  agregarFAQ(): void {
    if (!this.configData.faqs) {
      this.configData.faqs = [];
    }
    this.configData.faqs.push({
      pregunta: '',
      respuesta: ''
    });
  }

  eliminarFAQ(index: number): void {
    if (this.configData.faqs && index >= 0 && index < this.configData.faqs.length) {
      this.configData.faqs.splice(index, 1);
    }
  }

  moverFAQArriba(index: number): void {
    if (this.configData.faqs && index > 0 && index < this.configData.faqs.length) {
      const temp = this.configData.faqs[index];
      this.configData.faqs[index] = this.configData.faqs[index - 1];
      this.configData.faqs[index - 1] = temp;
    }
  }

  moverFAQAbajo(index: number): void {
    if (this.configData.faqs && index >= 0 && index < this.configData.faqs.length - 1) {
      const temp = this.configData.faqs[index];
      this.configData.faqs[index] = this.configData.faqs[index + 1];
      this.configData.faqs[index + 1] = temp;
    }
  }

  // Verificar si una sección debe mostrarse
  mostrarSeccion(seccion: string): boolean {
    // Si hay término de búsqueda, solo mostrar las secciones que coincidan
    if (this.terminoBusqueda.trim() !== '') {
      return this.seccionesFiltradas.includes(seccion);
    }
    
    // Si hay filtro activo, solo mostrar las secciones filtradas
    if (this.filtroActual !== 'todas') {
      return this.seccionesFiltradas.includes(seccion);
    }
    
    // Mostrar todas las secciones
    return true;
  }

}