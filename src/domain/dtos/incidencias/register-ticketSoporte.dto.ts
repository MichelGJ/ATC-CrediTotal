
export class RegisterTicketSoporteDto {

    private constructor(
        public tipoIncidenciaId: string,
        public subTipoIncidenciaId: string,
        public descripcion: string,
        public cedulaCliente: string,
        public userId: string,
        public estatus: string,
        public id?: string
    ) { }

    static create(object: { [key: string]: any }): [string?, RegisterTicketSoporteDto?] {
        const { tipoIncidenciaId, subTipoIncidenciaId, descripcion, cedulaCliente, userId, estatus, id } = object;

        if (!tipoIncidenciaId) return ['Missing tipoIncidenciaId'];
        if (!subTipoIncidenciaId) return ['Missing subTipoIncidenciaId'];
        if (!descripcion) return ['Missing descripcion'];
        if (!cedulaCliente) return ['Missing cedulaCliente'];
        if (!userId) return ['Missing userId'];
        if (!estatus) return ['Missing estatus'];

        return [undefined, new RegisterTicketSoporteDto(tipoIncidenciaId,  subTipoIncidenciaId, descripcion, cedulaCliente, userId, estatus, id)];
    }

}