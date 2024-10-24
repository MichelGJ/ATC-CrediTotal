


export class RegisterSubTipoIncidenciaDto {

    private constructor(
        public name: string,
        public id?: string
    ) { }

    static create(object: { [key: string]: any }): [string?, RegisterSubTipoIncidenciaDto?] {
        const { name, id } = object;

        if (!name) return ['Missing name'];

        return [undefined, new RegisterSubTipoIncidenciaDto(name, id)];
    }

}