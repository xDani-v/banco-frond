import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicioAPIService } from '../../service/servicio-api.service';
import { Router } from '@angular/router';
import { Movimiento } from '../../models/movimiento.model';
import { FormsModule } from '@angular/forms';
import { Cuenta } from '../../models/cuenta.model';
import { Cliente } from '../../models/cliente.model';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {


  actualizar_datos: boolean = false;

  usuario: any = {};
  usuario_acc: Cliente = new Cliente();
  cuentas: any[] = [];
  movimientos: any[] = [];
  mov_bandera: boolean = false;
  cuenta_seleccionada: string = '';
  cuenta_selec_saldo: number = 0;
  nuevo_movimiento: boolean = false;
  transaccion: Movimiento = new Movimiento();
  nueva_cuenta: boolean = false;

  ncuenta: Cuenta = new Cuenta();

  constructor(private router: Router, private servicioAPI: ServicioAPIService) { }

  cerrarSesion() {
    localStorage.removeItem('cliente');
    this.router.navigate(['/login']);
  }



  ngOnInit() {
    let cliente: any = localStorage.getItem('cliente');

    // Si hay datos de usuario en el localStorage, parsea los datos a un objeto JavaScript
    if (cliente) {
      cliente = cliente.replace(/"/g, '');

      this.servicioAPI.getCliente(cliente).subscribe(
        data => {
          this.usuario = data;
          this.getCuentas(this.usuario.cedula);
        }, error => {
          console.error('Error:', error);
        }
      );
    }
  }

  getCuentas(cedula: string) {
    this.servicioAPI.getCuenta(cedula).subscribe(
      data => {
        // Asegúrate de que data es un array
        if (Array.isArray(data)) {
          this.cuentas = data;
        } else {
          this.cuentas = [data];
        }
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

  verMovimientos(id: string) {
    this.mov_bandera = true;
    this.servicioAPI.getMovimientos(id).subscribe(
      data => {
        // Asegúrate de que data es un array
        if (Array.isArray(data)) {
          this.movimientos = data;
        } else {
          this.movimientos = [data];
        }

      },
      error => {
        if (error.status === 404) {
          // Si no se encuentran movimientos, vacía la tabla
          this.movimientos = [];
        } else { }
      }
    );
    this.cuenta_seleccionada = id;
    let cuenta = this.cuentas.find(cuenta => cuenta.id_cuenta == id);
    if (cuenta) {
      this.cuenta_selec_saldo = cuenta.saldo;
    } else {
      console.error('No se encontró la cuenta con id:', id);
    }

  }

  nueva_trans() {
    this.cuenta_selec_saldo = this.cuentas.find(cuenta => cuenta.id_cuenta == this.cuenta_seleccionada).saldo;

    this.nuevo_movimiento = true;
  }

  cancelarTransaccion() {
    this.nuevo_movimiento = false;
    this.transaccion = new Movimiento();
  }

  transaccionRealizada() {
    this.transaccion.id_cuenta = this.cuenta_seleccionada;
    this.transaccion.fecha = new Date().toISOString();


    if (this.transaccion.descripcion == '') {
      this.transaccion.descripcion = 'Sin descripción';
    }

    if (this.transaccion.tipo_movimiento == 'depósito') {
      this.transaccion.saldo = +this.cuenta_selec_saldo + +this.transaccion.monto;
    }
    if (this.transaccion.tipo_movimiento == 'retiro') {
      this.transaccion.descripcion = 'Retiro de efectivo';
      this.transaccion.saldo = +this.cuenta_selec_saldo - +this.transaccion.monto;
    }



    this.servicioAPI.insertarMovimiento(this.transaccion).subscribe(
      data => {
        this.verMovimientos(this.cuenta_seleccionada);
        this.getCuentas(this.usuario.cedula);
        this.nuevo_movimiento = false;
        this.transaccion = new Movimiento();
      });
  }

  abrir_cuenta() {
    this.nueva_cuenta = true;
  }

  cancelar_apertura() {
    this.nueva_cuenta = false;
    this.ncuenta = new Cuenta();
  }


  crearCuenta() {
    this.ncuenta.cliente_id = this.usuario.cedula;
    this.ncuenta.saldo = 0;
    this.ncuenta.fecha_apertura = new Date().toISOString();
    this.ncuenta.generarIdCuenta();
    this.servicioAPI.createCuenta(this.ncuenta).subscribe(
      data => {
        this.getCuentas(this.usuario.cedula);
        this.nueva_cuenta = false;
        this.ncuenta = new Cuenta();
      });

    this.getCuentas(this.usuario.cedula);

  }

  abrir_actualizar() {
    this.actualizar_datos = true;
    this.usuario_acc = this.usuario;

  }

  cerrar_actualizar() {
    this.actualizar_datos = false;
  }

  actualizar_datos_usuario() {
    this.servicioAPI.updateCliente(this.usuario_acc).subscribe(
      data => {
        this.actualizar_datos = false;
        this.usuario = this.usuario_acc;
        localStorage.setItem('cliente', this.usuario._id);
      });
  }
}

