export class Cuenta {
    id_cuenta: string = "";
    tipo_cuenta: string = "";
    saldo: number = 0;
    fecha_apertura: string = "";
    cliente_id: string = "";

    generarIdCuenta() {
        let id = '';
        for (let i = 0; i < 10; i++) {
            id += Math.floor(Math.random() * 10);
        }
        this.id_cuenta = id;
    }
}
