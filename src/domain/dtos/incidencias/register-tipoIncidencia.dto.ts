


export class RegisterTipoIncidenciaDto {

    private constructor(
        public name: string,
        public id?: string
    ) { }

    static create(object: { [key: string]: any }): [string?, RegisterTipoIncidenciaDto?] {
        const { name, id } = object;

        if (!name) return ['Missing name'];

        return [undefined, new RegisterTipoIncidenciaDto(name, id)];

    }

}