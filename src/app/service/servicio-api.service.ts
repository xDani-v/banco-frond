import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServicioAPIService {

  private url = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  login(cedula: string, password: string) {
    return this.http.post<any>(`${this.url}/clientes/login`, { cedula, password })
      .pipe(tap(data => {
        localStorage.setItem('cliente', JSON.stringify(data));
      }));
  }

  getCliente(id: any) {
    return this.http.get(`${this.url}/clientes/${id}`);
  }

  createCliente(cliente: any) {
    return this.http.post(`${this.url}/clientes/`, cliente);
  }

  getCuenta(cedula: string) {
    return this.http.post<any>(`${this.url}/cuenta/cc`, { cliente_id: cedula });
  }

  getMovimientos(cuenta: string) {
    return this.http.post<any>(`${this.url}/movimientos/c`, { id_cuenta: cuenta });
  }

  insertarMovimiento(movimientoData: any) {
    return this.http.post(`${this.url}/movimientos/im`, movimientoData);
  }

  createCuenta(cuenta: any) {
    return this.http.post(`${this.url}/cuenta/`, cuenta);
  }

  isAuth() {
    return !!localStorage.getItem('cliente');
  }

  updateCliente(cliente: any) {
    return this.http.put(`${this.url}/clientes/${cliente._id}`, cliente);
  }

}
