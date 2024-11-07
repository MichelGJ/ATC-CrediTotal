
export class UpdateTicketPresencialDto {

    private constructor(
        public resultado: string,
        public id?: string
    ) { }

    static create(object: { [key: string]: any }): [string?, UpdateTicketPresencialDto?] {
        const {resultado, id } = object;

        if (!resultado) return ['Missing resultado'];

        return [undefined, new UpdateTicketPresencialDto(resultado, id)];
    }

}