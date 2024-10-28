


export class RegisterSubTipoIncidenciaDto {

    private constructor(
        public name: string,
        public tipoIncidenciaId: string,
        public id?: string
    ) { }

    static create(object: { [key: string]: any }): [string?, RegisterSubTipoIncidenciaDto?] {
        const { name, tipoIncidenciaId, id } = object;

        if (!name) return ['Missing name'];

        if (!tipoIncidenciaId) return ['Missing tipoIncidenciaId'];

        return [undefined, new RegisterSubTipoIncidenciaDto(name, tipoIncidenciaId, id)];
    }

}