import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { PromocionesService } from '../promociones.service';

@Component({
  selector: 'app-promociones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './promociones.component.html',
  styleUrls: ['./promociones.component.css']
})
export class PromocionesComponent implements OnInit {

  promociones: any[] = [];
  mostrarModal = false;
  modoEdicion = false;
  idEditando: number | null = null;

  form: any = this.formInicial();

  constructor(private promocionesService: PromocionesService) {}

  ngOnInit(): void {
    this.cargarPromociones();
  }

  // ===== FORM INICIAL =====
  formInicial() {
    return {
      namePromotion: '',
      typePromotion: '',
      discountType: 'PORCENTAJE',
      discountValue: 0,
      promoCode: '',
      startDate: '',
      endDate: '',
      maxQuota: null,
      minPurchase: null
    };
  }

  // ===== CARGAR PROMOCIONES =====
  cargarPromociones() {
    this.promocionesService.getPromociones().subscribe({
      next: res => this.promociones = res,
      error: err => console.error(err)
    });
  }

  // ===== ABRIR CREAR =====
  abrirCrear() {
    this.modoEdicion = false;
    this.idEditando = null;
    this.form = this.formInicial();
    this.mostrarModal = true;
  }

  // ===== ABRIR EDITAR =====
  abrirModalEditar(promo: any) {
    this.modoEdicion = true;
    this.idEditando = promo.idPromotion;

    this.form = {
      namePromotion: promo.namePromotion,
      typePromotion: promo.typePromotion,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      promoCode: promo.promoCode,
      startDate: promo.startDate?.substring(0, 10),
      endDate: promo.endDate?.substring(0, 10),
      maxQuota: promo.maxQuota,
      minPurchase: promo.minPurchase
    };

    this.mostrarModal = true;
  }

  // ===== GUARDAR =====
  guardar() {

    // Campos obligatorios generales
    if (!this.form.namePromotion || !this.form.typePromotion || !this.form.startDate || !this.form.endDate) {
      Swal.fire('Campos requeridos', 'Completa todos los campos obligatorios', 'warning');
      return;
    }

    // Validar código SOLO si es tipo CODIGO
    if (
      this.form.typePromotion === 'CODIGO' &&
      (!this.form.promoCode || this.form.promoCode.trim() === '')
    ) {
      Swal.fire(
        'Código requerido',
        'Debes ingresar un código promocional',
        'warning'
      );
      return;
    }

    // Si es automática, limpiar código
    if (this.form.typePromotion === 'AUTOMATICA') {
      this.form.promoCode = null;
    }

    // ===== EDITAR =====
    if (this.modoEdicion && this.idEditando) {
      this.promocionesService.actualizarPromocion(this.idEditando, this.form).subscribe({
        next: () => {
          Swal.fire('Actualizado', 'Promoción actualizada correctamente', 'success');
          this.cerrarModal();
          this.cargarPromociones();
        },
        error: err => {
          console.error(err);
          Swal.fire('Error', 'No se pudo actualizar', 'error');
        }
      });
    }
    // ===== CREAR =====
    else {
      this.promocionesService.crearPromocion(this.form).subscribe({
        next: () => {
          Swal.fire('Creada', 'Promoción creada correctamente', 'success');
          this.cerrarModal();
          this.cargarPromociones();
        },
        error: err => {
          console.error(err);
          Swal.fire('Error', err.error?.message || 'Error al crear la promoción', 'error');
        }
      });
    }
  }

  // ===== ELIMINAR =====
  eliminarPromocion(id: number) {
    Swal.fire({
      title: '¿Eliminar promoción?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar'
    }).then(res => {
      if (res.isConfirmed) {
        this.promocionesService.eliminarPromocion(id).subscribe(() => {
          Swal.fire('Eliminada', 'Promoción eliminada', 'success');
          this.cargarPromociones();
        });
      }
    });
  }

  // ===== CERRAR MODAL =====
  cerrarModal() {
    this.mostrarModal = false;
    this.form = this.formInicial();
    this.modoEdicion = false;
    this.idEditando = null;
  }
}
