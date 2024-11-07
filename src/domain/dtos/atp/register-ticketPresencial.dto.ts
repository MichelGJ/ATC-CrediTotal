
export class RegisterTicketPresencialDto {

    private constructor(
        public descripcion: string,
        public cedulaCliente: string,
        public id?: string
    ) { }

    static create(object: { [key: string]: any }): [string?, RegisterTicketPresencialDto?] {
        const {descripcion, cedulaCliente, fechaInicio, id } = object;

        if (!descripcion) return ['Missing descripcion'];
        if (!cedulaCliente) return ['Missing cedulaCliente'];

        return [undefined, new RegisterTicketPresencialDto(descripcion, cedulaCliente, id)];
    }

}