
export class RegisterTicketPresencialDto {

    private constructor(
        public cedulaCliente: string,
        public userId: string,
        public id?: string
    ) { }

    static create(object: { [key: string]: any }): [string?, RegisterTicketPresencialDto?] {
        const {cedulaCliente, userId, id } = object;

        
        if (!cedulaCliente) return ['Missing cedulaCliente'];
        if (!userId) return ['Missing userId'];

        return [undefined, new RegisterTicketPresencialDto(cedulaCliente, userId, id)];
    }
}