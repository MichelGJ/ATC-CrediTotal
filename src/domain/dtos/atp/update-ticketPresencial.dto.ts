
export class UpdateTicketPresencialDto {

    private constructor(
        public descripcion: string,
        public resultado?: string,
        public id?: string
    ) { }

    static create(object: { [key: string]: any }): [string?, UpdateTicketPresencialDto?] {
        const {descripcion, resultado, id } = object;

        if (!descripcion) return ['Missing descripcion'];

        return [undefined, new UpdateTicketPresencialDto(descripcion, resultado, id)];
    }

}