
export class RegisterTicketPresencialDto {

    private constructor(
        public cedulaCliente: string,
        public user: string,
        public id?: string
    ) { }

    static create(object: { [key: string]: any }): [string?, RegisterTicketPresencialDto?] {
        const {cedulaCliente, user, id } = object;

        
        if (!cedulaCliente) return ['Missing cedulaCliente'];
        if (!user) return ['Missing userId'];

        return [undefined, new RegisterTicketPresencialDto(cedulaCliente, user, id)];
    }
}