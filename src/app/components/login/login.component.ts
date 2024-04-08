import { Component } from '@angular/core';
import { ServicioAPIService } from '../../service/servicio-api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../../models/cliente.model';
import { Router } from '@angular/router';




@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {


  cedula: string = '';
  password: string = '';
  bandera: boolean = false;

  nuevo_cliente: Cliente = new Cliente();
  passwordconfirm: string = '';


  constructor(private router: Router, private servicioAPI: ServicioAPIService) { }

  registrar() {
    this.bandera = !this.bandera;
  }

  onSubmit() {
    this.servicioAPI.login(this.cedula, this.password).subscribe(
      data => {
        console.log('Login successful');
        localStorage.setItem('cliente', JSON.stringify(data._id));
        this.router.navigate(['/home']); // redirige a la ruta /login
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

  nuevo() {
    if (this.nuevo_cliente.password != this.passwordconfirm) {
      console.log('Las contraseñas no coinciden');
    } else {
      this.servicioAPI.createCliente(this.nuevo_cliente).subscribe(
        response => {
          console.log(response);
          // Aquí puedes manejar la respuesta de tu API
          this.nuevo_cliente = new Cliente();
          this.passwordconfirm = '';

        },
        error => {
          console.error(error);
          // Aquí puedes manejar los errores
        }
      );
    }
  }

}
